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
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUrl)}`;

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
            /* Tell printer the paper is 80mm wide, but length is auto */
            size: 80mm auto; 
            margin: 0mm; 
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
          font-size: 12px;
          line-height: 1.2;
          color: #000;
          background: #fff;
          /* SAFE ZONE CONFIGURATION */
          width: 80mm; /* Physical Paper Width */
          padding-left: 4mm;  /* Safety Margin Left */
          padding-right: 4mm; /* Safety Margin Right */
        }
        
        .page-container {
          /* Content is only 72mm wide (80 - 4 - 4) to avoid edge shading */
          width: 100%;
          padding-top: 3mm;
          padding-bottom: 5mm;
          display: flex;
          flex-direction: column;
        }
        
        /* --- HEADER --- */
        .bill-header {
          text-align: center;
          margin-bottom: 2mm;
          padding-bottom: 2mm;
          border-bottom: 2px dashed #000;
        }
        
        .clinic-name {
          font-size: 16px;
          font-weight: 900;
          margin-bottom: 1mm;
          text-transform: uppercase;
        }
        
        .clinic-info {
          font-size: 10px;
        }
        
        /* --- INVOICE INFO --- */
        .invoice-details {
          text-align: center;
          margin-bottom: 2mm;
          font-size: 11px;
        }

        .status-badge {
          display: inline-block;
          border: 1px solid #000;
          padding: 0px 4px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: bold;
          margin-left: 2mm;
        }

        /* --- SECTIONS --- */
        .section-header {
          font-weight: bold;
          border-bottom: 1px solid #000;
          margin-top: 2mm;
          margin-bottom: 1mm;
          font-size: 12px;
          text-transform: uppercase;
        }

        .info-row {
          display: flex;
          margin-bottom: 1mm;
        }
        
        .info-value {
          font-size: 11px;
          flex: 1;
        }
        
        /* --- ITEMS TABLE --- */
        .items-table {
          width: 100%;
          margin-top: 3mm;
          border-collapse: collapse;
        }
        
        .items-table th {
          text-align: left;
          border-top: 2px dashed #000;
          border-bottom: 2px dashed #000;
          padding: 1mm 0;
          font-size: 12px;
        }
        
        .items-table td {
          padding: 2mm 0;
          border-bottom: 1px dotted #ccc;
          font-size: 12px;
        }
        
        .amount-col {
          text-align: right;
        }

        /* --- TOTALS --- */
        .totals-section {
          margin-top: 2mm;
          padding-top: 2mm;
          border-top: 2px dashed #000;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          font-size: 12px;
        }
        
        .final-total {
          font-weight: bold;
          font-size: 16px;
          margin-top: 2mm;
          border-top: 2px solid #000;
          border-bottom: 4px double #000;
          padding: 2mm 0;
        }

        /* --- QR CODE & FOOTER --- */
        .footer-section {
          margin-top: 5mm;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .qr-code {
          /* EXACTLY 2.5cm */
          width: 25mm; 
          height: 25mm;
          margin-bottom: 1mm;
        }
        
        .qr-text {
          font-size: 10px;
          margin-bottom: 2mm;
        }
        
        .thank-you {
          font-weight: bold;
          font-size: 12px;
          margin-top: 2mm;
        }
        
        .flex-row {
          display: flex;
          gap: 2mm;
        }
        .col {
          flex: 1;
        }

      </style>
    </head>
    <body>
      <div class="page-container">
        
        <div class="bill-header">
          <div class="clinic-name">YOUR CLINIC NAME</div>
          <div class="clinic-info">
            123 Medical Street, Colombo<br>
            Tel: 011-2345678
          </div>
        </div>

        <div class="invoice-details">
          <strong>INVOICE #${invoiceData.invoiceId}</strong><br>
          ${invoiceData.dateIssued}
          <span class="status-badge">${invoiceData.status}</span>
        </div>

        <div class="flex-row">
            <div class="col">
                <div class="section-header">Patient</div>
                <div class="info-row">
                    <span class="info-value" style="font-weight:bold">${invoiceData.patientName}</span>
                </div>
                <div class="info-row">
                    <span class="info-value">Tel: ${invoiceData.patientContactNo}</span>
                </div>
            </div>
            <div class="col">
                <div class="section-header">Doctor</div>
                <div class="info-row">
                    <span class="info-value">${invoiceData.doctorName}</span>
                </div>
                <div class="info-row">
                    <span class="info-value" style="font-size:10px">${invoiceData.doctorSpecialization}</span>
                </div>
            </div>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th class="amount-col">Amt</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Consultation Fee</td>
                    <td class="amount-col">${consultationFee.toFixed(2)}</td>
                </tr>
                ${totalDiscount > 0 ? `
                <tr>
                    <td>Discount</td>
                    <td class="amount-col" style="color:black">-${totalDiscount.toFixed(2)}</td>
                </tr>
                ` : ''}
            </tbody>
        </table>

        <div class="totals-section">
            <div class="total-row">
                <span>Subtotal</span>
                <span>${invoiceData.subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row final-total">
                <span>TOTAL</span>
                <span>Rs. ${invoiceData.finalAmount.toFixed(2)}</span>
            </div>
        </div>

        <div class="footer-section">
            <img src="${qrCodeImage}" class="qr-code" alt="QR" />
            <div class="qr-text">Ref: #${invoiceData.invoiceId}</div>
            
            <div class="thank-you">*** THANK YOU ***</div>
        </div>

      </div>

      <script>
        window.onload = function() {
          window.print();
        };
        window.onafterprint = function() {
          window.close();
        };
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