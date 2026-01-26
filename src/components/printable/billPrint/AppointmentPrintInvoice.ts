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
  items: Array<{
    description: string;
    typeName: string;
    unitPrice: number;
    quantity: number;
    totalAmount: number;
  }>;
  subtotal: number;
  totalDiscount: number;
  finalAmount: number;
};

export function appointmentPrintInvoice(invoiceData: InvoiceData, qrCodeUrl: string) {
  // Calculate totals
  const consultationFee = invoiceData.items.find(item => item.typeName === 'APPOINTMENT')?.totalAmount || 0;
  const totalDiscount = Math.abs(invoiceData.totalDiscount);
  
  // Generate QR code URL (High resolution, resized via CSS)
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Invoice - ${invoiceData.invoiceId}</title>
      <style>
        @media print {
          @page {
            size: A6 portrait; /* 105mm x 148mm */
            margin: 0;
          }
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          /* Base font 11.5px - legible but compact */
          font-size: 11.5px; 
          /* Tighter line height to save vertical space */
          line-height: 1.15; 
          color: #000;
          width: 105mm;
          height: 148mm; /* Fixed height for A6 */
          margin: 0;
          padding: 0;
          background: #fff;
          overflow: hidden; /* Prevent spillover */
        }
        
        .page-container {
          width: 105mm;
          height: 148mm;
          padding: 2mm; /* Reduced padding from 3mm to 2mm */
          display: flex;
          flex-direction: column;
        }
        
        .main-container {
          flex: 1;
          border: 2px solid #000;
          padding: 1.5mm;
          display: flex;
          flex-direction: column;
        }
        
        /* --- HEADER --- */
        .bill-header {
          text-align: center;
          margin-bottom: 1mm;
          padding-bottom: 1mm;
          border-bottom: 2px solid #000;
        }
        
        .clinic-name {
          font-size: 15px; /* Large */
          font-weight: 900;
          margin-bottom: 0.5mm;
          text-transform: uppercase;
        }
        
        .clinic-info {
          font-size: 9px;
          line-height: 1.1;
        }
        
        .invoice-header {
          text-align: center;
          margin-bottom: 1mm;
          padding: 1mm;
          background: #f0f0f0;
          border: 1px solid #000;
        }
        
        .invoice-title {
          font-size: 12px;
          font-weight: bold;
        }
        
        .invoice-number {
          font-size: 10px;
          margin-top: 0.5mm;
        }

        /* --- COLUMNS --- */
        .two-column-section {
          display: flex;
          gap: 1mm;
          margin-bottom: 1mm;
        }

        .column {
          flex: 1;
        }
        
        .section {
          font-size: 11.5px;
        }
        
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #000;
          margin-bottom: 0.5mm;
          font-size: 11.5px;
          background-color: #eee;
          padding-left: 2px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 0.5mm; /* Very tight spacing */
        }
        
        .info-label {
          font-weight: bold;
          min-width: 50px;
          font-size: 11px;
        }
        
        .info-value {
          font-size: 11px;
          flex: 1;
        }
        
        /* --- ITEMS --- */
        .items-section {
          margin: 1mm 0;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          padding: 1mm;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          font-weight: bold;
          font-size: 12px;
          background: #f5f5f5;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 1mm;
          border-bottom: 1px solid #ddd;
          font-size: 12px;
        }
        
        /* --- TOTALS --- */
        .totals {
          margin-top: 1mm;
          border-top: 2px solid #000;
          padding-top: 1mm;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5mm;
          font-size: 12px;
          padding: 0 1mm;
        }
        
        .total-final {
          font-weight: bold;
          font-size: 15px; /* Large Total */
          border-top: 2px solid #000;
          border-bottom: 3px double #000;
          padding: 1.5mm 1mm;
          margin-top: 0.5mm;
          background: #f5f5f5;
        }
        
        /* --- QR CODE & FOOTER --- */
        /* Flex push to bottom */
        .bottom-wrapper {
            margin-top: auto;
            border-top: 1px dashed #999;
            padding-top: 1mm;
            text-align: center;
        }

        .qr-code {
          width: 80px; /* 80px is optimal for A6 (approx 2cm) */
          height: 80px;
          margin-bottom: 0.5mm;
        }
        
        .qr-label {
          font-size: 10px;
          font-weight: bold;
        }

        .footer {
          text-align: center;
          margin-top: 1mm;
          font-size: 10px;
          font-weight: bold;
        }
        
        .status-badge {
          display: inline-block;
          padding: 0px 3px;
          background: #4CAF50;
          color: white;
          border-radius: 2px;
          font-size: 9px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        <div class="main-container">
          <div class="bill-header">
            <div class="clinic-name">YOUR CLINIC NAME</div>
            <div class="clinic-info">
              123 Medical Street, Colombo 07<br>
              Tel: +94 11 234 5678
            </div>
          </div>

          <div class="invoice-header">
            <div class="invoice-title">MEDICAL INVOICE</div>
            <div class="invoice-number">
              #${String(invoiceData.invoiceId).padStart(6, '0')} | ${invoiceData.dateIssued} | 
              <span class="status-badge">${invoiceData.status}</span>
            </div>
          </div>

          <div class="two-column-section">
            <div class="column">
              <div class="section">
                <div class="section-title">PATIENT INFO</div>
                <div class="info-row">
                  <span class="info-label">No:</span>
                  <span class="info-value">${invoiceData.patientNo}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value" style="font-weight:bold;">${invoiceData.patientName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Tel:</span>
                  <span class="info-value">${invoiceData.patientContactNo}</span>
                </div>
              </div>
            </div>

            <div class="column">
              <div class="section">
                <div class="section-title">DOCTOR INFO</div>
                <div class="info-row">
                  <span class="info-label">Dr:</span>
                  <span class="info-value">${invoiceData.doctorName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Spec:</span>
                  <span class="info-value">${invoiceData.doctorSpecialization}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="items-section">
            <div class="item-header">
              <span>Description</span>
              <span>Amount</span>
            </div>
            <div class="item-row">
              <span>Consultation Fee</span>
              <span>Rs. ${consultationFee.toFixed(2)}</span>
            </div>
            ${totalDiscount > 0 ? `
            <div class="item-row">
              <span>Discount Applied</span>
              <span style="color: #d32f2f;">- Rs. ${totalDiscount.toFixed(2)}</span>
            </div>
            ` : ''}
          </div>

          <div class="totals">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>Rs. ${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            ${totalDiscount > 0 ? `
            <div class="total-row">
              <span>Discount:</span>
              <span>- Rs. ${totalDiscount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="total-row total-final">
              <span>TOTAL:</span>
              <span>Rs. ${invoiceData.finalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div class="bottom-wrapper">
             <img src="${qrCodeImage}" alt="QR Code" class="qr-code">
             <div class="qr-label">Scan to Verify | Ref: #${invoiceData.invoiceId}</div>
             <div class="footer">Thank you for your visit!</div>
          </div>

        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
        };
        
        window.onafterprint = function() {
          window.close();
        };
        
        setTimeout(function() {
          if (!window.matchMedia('print').matches) {
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        }, 100);
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the invoice');
    return;
  }
  
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}