cd

```
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MygovGuiAngularModule } from '@gui/mygov-angular';
import { CardDetailsService } from '../../services/card-details.service';
import { MakeAPaymentService } from '../../services/make-a-payment.service';
import jsPDF from 'jspdf';
import 'svg2pdf.js';

@Component({
  selector: 'cspy-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  imports: [CommonModule, MygovGuiAngularModule],
  standalone: true,
})
export class PaymentSuccessComponent implements OnInit {
  surcharge: string | null = '';
  receiptId: string | null = '';
  paymentAmount: string | null = '';
  submittedTime: string = this.formatDateTime();
  loadPaymentDetails = true;
  saveCard = false;
  token = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cardDetailsService: CardDetailsService,
    private makeAPaymentService: MakeAPaymentService
  ) {}

  async ngOnInit(): Promise<void> {
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.remove();
    }
    const paymentId = localStorage.getItem('paymentId') || 'sdfsdf';

    this.receiptId = paymentId;

    if (paymentId) {
      await this.getPaymentDetails(paymentId);
    }
  }

  private formatDateTime(): string {
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Australia/Sydney',
    };

    const date = new Date();
    const datePart = new Intl.DateTimeFormat('en-AU', dateOptions).format(date);
    const timePart = new Intl.DateTimeFormat('en-AU', timeOptions).format(date);
    return `${datePart} at ${timePart} AEDT`;
  }

  private async getPaymentDetails(paymentId: string) {
    await this.cardDetailsService
      .getPayment(paymentId)
      .then(async (payDetails) => {
        this.loadPaymentDetails = false;
        if (payDetails.status === 'REJECTED') {
          this.token =
            payDetails.paymentOutput?.cardPaymentMethodSpecificOutput?.token;

          try {
            await this.cardDetailsService
              .deleteToken(this.token)
              .then((response) => {
                if (response) {
                  console.log('card has been deleted successfully');
                }
              });
          } catch (err) {
            console.error('card deletion has been failed: ', err);
          } finally {
            this.router.navigate(
              ['../payment-unsuccessful', { status: 'REJECTED' }],
              {
                relativeTo: this.route,
              }
            );
          }
        } else {
          this.paymentAmount = parseFloat(
            (payDetails.paymentOutput?.amountOfMoney?.amount / 100).toString()
          ).toFixed(2);
          this.surcharge = parseFloat(
            (
              payDetails.paymentOutput?.surchargeSpecificOutput?.surchargeAmount
                .amount / 100
            ).toString()
          ).toFixed(2);

          if (localStorage.getItem('saveCard')) {
            this.saveCard = JSON.parse(
              localStorage.getItem('saveCard') ?? 'false'
            );
            localStorage.clear();
          } else {
            this.saveCard = this.makeAPaymentService.getSaveCard();
          }
        }
      });
  }

  saveReceipt() {
    this.generateAndOpenReceipt();
  }

  generateAndOpenReceipt() {
    if (!this.receiptId) {
      console.error('No receipt data available to generate PDF.');
      return;
    }

    const svgData = `<svg width="1240" height="68" viewBox="0 0 1240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1240" height="68" fill="black"/>
<path d="M31.3083 29.8943C30.6539 29.4018 29.8457 29.1565 29.0272 29.202C28.2481 29.2195..."/>
<path d="M132.704 47.9999L134.291 40.4799H134.39C134.547 40.9368 134.821 41.3451 135.184..."/>
</svg>`;

    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgData, 'image/svg+xml');
    const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(40);
      (doc as any)
        .svg(svgElement, {
          x: 0,
          y: -29,
          width: 210,
          // height: 90,
        })
        .then(() => {
          doc.setFontSize(10);
          doc.text(
            'Your payment has been successful. This payment may take some time to update in your account.',
            20,
            50
          );
          doc.text('Child Support account.', 20, 56);
          doc.setLineWidth(0.1);
          doc.line(20, 66, 190, 66);

          let yPosition = 70;

          yPosition += 10;
          doc.text(`Payment Amount: $${this.paymentAmount}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Card surcharge: $${this.surcharge}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Receipt ID: ${this.receiptId}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Submitted: ${this.submittedTime}`, 20, yPosition);
          yPosition += 8;
          yPosition += 10;

          // Add SVG footer
          const footerSvgData = `<svg width="1240" height="68" viewBox="0 0 1240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1240" height="68" fill="#333"/>
<path d="M31.3083 29.8943C30.6539 29.4018 29.8457 29.1565 29.0272 29.202C28.2481 29.2195..."/>
<path d="M132.704 47.9999L134.291 40.4799H134.39C134.547 40.9368 134.821 41.3451 135.184..."/>
</svg>`;
          
          const footerParser = new DOMParser();
          const footerSvgDoc = footerParser.parseFromString(footerSvgData, 'image/svg+xml');
          const footerSvgElement = footerSvgDoc.documentElement as unknown as SVGSVGElement;
          
          (doc as any).svg(footerSvgElement, {
            x: 0,
            y: 267, // Position at bottom of A4 page
            width: 210,
          }).then(() => {
            doc.output('dataurlnewwindow');
          });
        });
    } catch (e) {
      console.error('Error generating PDF', e);
    }
  }
}

```
