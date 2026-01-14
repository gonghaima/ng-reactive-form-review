der

```
generateAndOpenReceipt() {
    if (!this.receiptId) {
      console.error('No receipt data available to generate PDF.');
      return;
    }

    // SVG header
    const svgHeaderData = `<svg width="1240" height="68" viewBox="0 0 1240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1240" height="68" fill="black"/>
<path d="M132.704 47.9999L134.291 40.4799H134.39C134.547 40.9368 134.821 41.3451 135.184 41.3451 135.184 41.6643C135.53 41.9514 135.895 42.2158 136.275 42.45"/>
</svg>`;

    // SVG footer
    const svgFooterData = `<svg width="1240" height="68" viewBox="0 0 1240 68" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="1240" height="68" fill="#333333"/>
<path d="M1107.3 20.0001L1105.71 27.5201H1105.61C1105.45 27.0632 1105.18 26.6549 1104.82 26.6549 1104.82 26.3357C1104.47 26.0486 1104.11 25.7842 1103.73 25.55"/>
</svg>`;

    const parser = new DOMParser();
    const svgHeaderDoc = parser.parseFromString(svgHeaderData, 'image/svg+xml');
    const svgHeaderElement = 
      svgHeaderDoc.documentElement as unknown as SVGSVGElement;
    
    const svgFooterDoc = parser.parseFromString(svgFooterData, 'image/svg+xml');
    const svgFooterElement = 
      svgFooterDoc.documentElement as unknown as SVGSVGElement;

    try {
      const doc = new jsPDF('p', 'mm', 'a4');
      doc.setFontSize(40);
      
      // Render header SVG at the top
      (doc as any)
        .svg(svgHeaderElement, {
          x: 0,
          y: -29,
          width: 210,
        })
        .then(() => {
          doc.setFontSize(10);
          doc.text(
            'Your payment has been successful. This payment may take some time to update in your account.',
            20,
            50,
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
          doc.setLineWidth(0.1);
          doc.line(20, 115, 190, 115);

          // Render footer SVG at the bottom
          (doc as any).svg(svgFooterElement, {
            x: 0,
            y: 267,
            width: 210,
          });

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
  }```
