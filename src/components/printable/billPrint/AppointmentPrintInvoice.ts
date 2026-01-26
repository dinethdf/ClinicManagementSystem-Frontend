'use client';

type InvoiceData = {
  invoiceId: number;
  dateIssued: string;
  status: string;
  patientNo: string;
  patientName: string;
  patientAddress: string;
  patientDob: string;
  patientContactNo: string;
  appointmentId: number;
  doctorName: string;
  doctorSpecialization: string;
  appointmentNote: string;
  items: Array<{ description: string; typeName: string; unitPrice: number; quantity: number; totalAmount: number; }>;
  subtotal: number;
  totalDiscount: number;
  finalAmount: number;
};

export function appointmentPrintInvoice(invoiceData: InvoiceData, qrCodeUrl: string, onComplete?: () => void) {
  const consultationFee = invoiceData.items.find(item => item.typeName === 'APPOINTMENT')?.totalAmount || 0;
  const totalDiscount = Math.abs(invoiceData.totalDiscount);
  
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUrl)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice - ${invoiceData.invoiceId}</title>
      <style>
        /* --- RESET --- */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Arial', sans-serif; font-size: 12px; line-height: 1.2; color: #000; overflow: hidden; }

        /* --- SCREEN VIEW (Preview) --- */
        @media screen {
          html, body { height: 100%; width: 100%; background-color: #525659; }
          body { display: flex; justify-content: center; align-items: flex-start; padding-top: 40px; }
          #invoice-view {
            width: 80mm; min-height: 150mm; background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 3mm 4mm;
          }
          /* Hide Animation initially */
          #success-animation { display: none; }
        }
        
        /* --- PRINT VIEW --- */
        @media print {
          @page { size: 80mm auto; margin: 0mm; }
          html, body { width: 80mm; height: auto; background: none; }
          #invoice-view { width: 80mm; padding: 3mm 4mm; box-shadow: none; margin: 0; }
          #success-animation { display: none !important; } /* Never print the animation */
        }

        /* --- ANIMATION STYLES (Pure CSS) --- */
        #success-animation {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: #525659; /* Match background */
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 999;
        }

        .printer-container { position: relative; width: 100px; height: 100px; margin-bottom: 20px; }
        
        .printer-body {
          position: absolute; bottom: 0; left: 10px; width: 80px; height: 40px;
          background: #e0e0e0; border-radius: 8px; z-index: 2;
          border-bottom: 4px solid #bdbdbd;
        }
        .printer-body::after {
          content: ''; position: absolute; top: 10px; left: 10px; width: 60px; height: 4px;
          background: #9e9e9e; border-radius: 2px;
        }

        .paper-sheet {
          position: absolute; left: 25px; width: 50px; background: white;
          border: 1px solid #ddd; z-index: 1;
          animation: printPaper 2s ease-in-out infinite;
        }

        .check-circle {
          width: 50px; height: 50px; background: #4CAF50; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-top: 20px; opacity: 0; transform: scale(0.5);
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          animation-delay: 0.5s;
        }
        .check-icon {
          width: 25px; height: 15px; border-left: 4px solid white;
          border-bottom: 4px solid white; transform: rotate(-45deg); margin-top: -5px;
        }

        .success-text { color: white; font-size: 18px; font-weight: bold; margin-top: 10px; opacity: 0; animation: fadeIn 0.5s forwards 0.8s; }

        @keyframes printPaper {
          0% { top: 20px; height: 0px; }
          50% { top: -20px; height: 60px; }
          100% { top: 20px; height: 0px; }
        }
        @keyframes popIn { to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { to { opacity: 1; } }

        /* --- INVOICE STYLES --- */
        .page-container { display: flex; flex-direction: column; }
        .bill-header { text-align: center; margin-bottom: 2mm; padding-bottom: 2mm; border-bottom: 2px dashed #000; }
        .clinic-name { font-size: 16px; font-weight: 900; margin-bottom: 1mm; text-transform: uppercase; }
        .clinic-info { font-size: 10px; }
        .invoice-details { text-align: center; margin-bottom: 2mm; font-size: 11px; }
        .status-badge { display: inline-block; border: 1px solid #000; padding: 0px 4px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-left: 2mm; }
        .section-header { font-weight: bold; border-bottom: 1px solid #000; margin-top: 2mm; margin-bottom: 1mm; font-size: 12px; text-transform: uppercase; }
        .info-row { display: flex; margin-bottom: 1mm; }
        .info-value { font-size: 11px; flex: 1; }
        .items-table { width: 100%; margin-top: 3mm; border-collapse: collapse; }
        .items-table th { text-align: left; border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 1mm 0; font-size: 12px; }
        .items-table td { padding: 2mm 0; border-bottom: 1px dotted #ccc; font-size: 12px; }
        .amount-col { text-align: right; }
        .totals-section { margin-top: 2mm; padding-top: 2mm; border-top: 2px dashed #000; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 1mm; font-size: 12px; }
        .final-total { font-weight: bold; font-size: 16px; margin-top: 2mm; border-top: 2px solid #000; border-bottom: 4px double #000; padding: 2mm 0; }
        .footer-section { margin-top: 5mm; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .qr-code { width: 25mm; height: 25mm; margin-bottom: 1mm; }
        .qr-text { font-size: 10px; margin-bottom: 2mm; }
        .thank-you { font-weight: bold; font-size: 12px; margin-top: 2mm; }
        .flex-row { display: flex; gap: 2mm; }
        .col { flex: 1; }
      </style>
    </head>
    <body>

      <div id="success-animation" style="display: none;">
         <div class="printer-container">
            <div class="paper-sheet"></div>
            <div class="printer-body"></div>
         </div>
      </div>

      <div id="invoice-view" class="page-container">
        <div class="bill-header">
          <div class="clinic-name">YOUR CLINIC NAME</div>
          <div class="clinic-info">123 Medical Street, Colombo<br>Tel: 011-2345678</div>
        </div>

        <div class="invoice-details">
          <strong>INVOICE #${invoiceData.invoiceId}</strong><br>${invoiceData.dateIssued}
          <span class="status-badge">${invoiceData.status}</span>
        </div>

        <div class="flex-row">
            <div class="col">
                <div class="section-header">Patient</div>
                <div class="info-row"><span class="info-value" style="font-weight:bold">${invoiceData.patientName}</span></div>
                <div class="info-row"><span class="info-value">Tel: ${invoiceData.patientContactNo}</span></div>
            </div>
            <div class="col">
                <div class="section-header">Doctor</div>
                <div class="info-row"><span class="info-value">${invoiceData.doctorName}</span></div>
                <div class="info-row"><span class="info-value" style="font-size:10px">${invoiceData.doctorSpecialization}</span></div>
            </div>
        </div>

        <table class="items-table">
            <thead><tr><th>Description</th><th class="amount-col">Amt</th></tr></thead>
            <tbody>
                <tr><td>Consultation Fee</td><td class="amount-col">${consultationFee.toFixed(2)}</td></tr>
                ${totalDiscount > 0 ? `<tr><td>Discount</td><td class="amount-col">-${totalDiscount.toFixed(2)}</td></tr>` : ''}
            </tbody>
        </table>

        <div class="totals-section">
            <div class="total-row"><span>Subtotal</span><span>${invoiceData.subtotal.toFixed(2)}</span></div>
            <div class="total-row final-total"><span>TOTAL</span><span>Rs. ${invoiceData.finalAmount.toFixed(2)}</span></div>
        </div>

        <div class="footer-section">
            <img src="${qrCodeImage}" class="qr-code" alt="QR" />
            <div class="qr-text">Ref: #${invoiceData.invoiceId}</div>
            <div class="thank-you">*** THANK YOU ***</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
             window.print();
          }, 500);
        };
        
        // --- THIS RUNS AFTER PRINT DIALOG CLOSES ---
        window.onafterprint = function() {
          // 1. Hide the Invoice
          document.getElementById('invoice-view').style.display = 'none';
          
          // 2. Show the Animation Layer
          document.getElementById('success-animation').style.display = 'flex';

          // 3. Wait 2.5 Seconds, then close tab
          setTimeout(() => {
             window.close();
          }, 1800);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Still fire the main window callback if needed
    const timer = setInterval(() => {
        if (printWindow.closed) {
            clearInterval(timer);
            if (onComplete) onComplete(); 
        }
    }, 500);
  } else {
    alert('Please allow popups to print');
  }
}