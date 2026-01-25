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
  
  // Generate QR code URL
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
            size: A6 portrait;
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
          /* Increased base font to 12px for better readability */
          font-size: 12px;
          line-height: 1.3;
          color: #000;
          width: 105mm;
          min-height: 148mm;
          margin: 0;
          padding: 0;
          background: #fff;
        }
        
        .page-container {
          width: 105mm;
          min-height: 148mm;
          padding: 3mm;
          display: flex;
          flex-direction: column;
        }
        
        .main-container {
          flex: 1;
          border: 2px solid #000;
          padding: 2mm; /* Reduced padding slightly to fit bigger fonts */
          display: flex;
          flex-direction: column;
        }
        
        .bill-header {
          text-align: center;
          margin-bottom: 2mm;
          padding-bottom: 2mm;
          border-bottom: 2px solid #000;
        }
        
        .clinic-name {
          /* Increased to 16px */
          font-size: 16px;
          font-weight: 900;
          margin-bottom: 1mm;
          text-transform: uppercase;
        }
        
        .clinic-info {
          /* Increased to 10px */
          font-size: 10px;
          line-height: 1.3;
        }
        
        .invoice-header {
          text-align: center;
          margin-bottom: 2mm;
          padding: 1.5mm;
          background: #f0f0f0;
          border: 1px solid #000;
        }
        
        .invoice-title {
          /* Increased to 13px */
          font-size: 13px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }
        
        .invoice-number {
          /* Increased to 11px */
          font-size: 11px;
          margin-top: 1mm;
        }

        .two-column-section {
          display: flex;
          gap: 2mm;
          margin-bottom: 2mm;
        }

        .column {
          flex: 1;
        }
        
        .section {
          font-size: 12px;
        }
        
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 0.5mm;
          margin-bottom: 1mm;
          /* Increased to 12px */
          font-size: 12px;
          background-color: #eee;
          padding-left: 2px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 1mm;
        }
        
        .info-label {
          font-weight: bold;
          min-width: 60px; /* Widened for larger text */
          /* Increased to 11px */
          font-size: 11px;
        }
        
        .info-value {
          /* Increased to 11px */
          font-size: 11px;
          flex: 1;
        }
        
        .items-section {
          margin: 2mm 0;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          padding: 1.5mm 1mm;
          border-top: 2px solid #000;
          border-bottom: 2px solid #000;
          font-weight: bold;
          /* Increased to 12px */
          font-size: 12px;
          background: #f5f5f5;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 2mm 1mm; /* Increased padding slightly */
          border-bottom: 1px solid #ddd;
          /* Increased to 12px */
          font-size: 12px;
        }
        
        .totals {
          margin-top: 2mm; /* Reduced space before totals */
          border-top: 2px solid #000;
          padding-top: 2mm;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          /* Increased to 12px */
          font-size: 12px;
          padding: 0 1mm;
        }
        
        .total-final {
          font-weight: bold;
          /* Increased to 16px */
          font-size: 16px;
          border-top: 2px solid #000;
          border-bottom: 3px double #000;
          padding: 2mm 1mm;
          margin-top: 1mm;
          background: #f5f5f5;
        }
        
        /* QR Code Layout */
        .qr-section {
          margin-top: auto; /* Pushes to bottom */
          text-align: center;
          padding-top: 4mm;
          padding-bottom: 2mm;
          border-top: 1px dashed #999; /* Separator from totals */
        }
        
        .qr-code {
          width: 60px;
          height: 60px;
          margin-bottom: 1mm;
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
          padding: 1px 4px;
          background: #4CAF50;
          color: white;
          border-radius: 2px;
          font-size: 10px;
          font-weight: bold;
          vertical-align: middle;
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

          <div class="qr-section">
            <img src="${qrCodeImage}" alt="QR Code" class="qr-code">
            <div class="qr-label">Scan to Verify | Ref: #${invoiceData.invoiceId}</div>
          </div>

          <div class="footer">
            Thank you for your visit!
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