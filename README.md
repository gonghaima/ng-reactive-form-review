cd

```
generateAndOpenReceipt() {
    if (!this.receiptId) {
      console.error('No receipt data available to generate PDF.');
      return;
    }

    // Combined SVG with header and footer
    const svgCombinedData = `<svg width="1240" height="297" viewBox="0 0 1240 297" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1240" height="68" y="0" fill="black"/>
  <path d="M132.704 47.9999L134.291 40.4799H134.39C134.547 40.9368 134.821 41.3451 135.184 41.3451 135.184 41.6643C135.53 41.9514 135.895 42.2158 136.275 42.45"/>
  <rect width="1240" height="68" y="229" fill="black"/>
  <text x="620" y="270" text-anchor="middle" fill="white" font-size="24">Thank you for your payment</text>
</svg>`;

    const parser = new DOMParser();
    const svgCombinedDoc = parser.parseFromString(svgCombinedData, 'image/svg+xml');
    const svgCombinedElement = svgCombinedDoc.documentElement as unknown as SVGSVGElement;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(40);
      // Render combined SVG at the top
      (doc as any)
        .svg(svgCombinedElement, {
          x: 0,
          y: 0,
          width: 210,
          height: 297,
        })
        .then(() => {
          // Overlay the text in the middle area
          doc.setFontSize(10);
          doc.text(
            'Your payment has been successful. This payment may take some time to update in your account.',
            20,
            80,
          );
          doc.text('Child Support account.', 20, 86);
          doc.setLineWidth(0.1);
          doc.line(20, 96, 190, 96);

          let yPosition = 110;
          doc.text(`Payment Amount: $${this.paymentAmount}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Card surcharge: $${this.surcharge}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Receipt ID: ${this.receiptId}`, 20, yPosition);
          yPosition += 8;
          doc.text(`Submitted: ${this.submittedTime}`, 20, yPosition);
          yPosition += 8;
          yPosition += 10;
          doc.setLineWidth(0.1);
          doc.line(20, 155, 190, 155);

          doc.setFontSize(16);
          const pdfBlob = doc.output('blob');

          const url = window.URL.createObjectURL(pdfBlob);

          const newWindow = window.open(url, '_blank');

          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === 'undefined'
          ) {
            console.warn(
              'Popup blocked by browser. Falling back to direct download.'
            );
            const link = document.createElement('a');
            link.href = url;
            link.download = `Receipt_${this.receiptId}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }

          setTimeout(() => window.URL.revokeObjectURL(url), 100);
        });
    } catch (e) {
      console.error('Error generating PDF', e);
    }
  }
```
