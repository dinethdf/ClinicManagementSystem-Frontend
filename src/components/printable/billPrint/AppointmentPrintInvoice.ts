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
          font-size: 9px;
          line-height: 1.2;
          color: #000;
          width: 105mm;
          height: 148mm;
          margin: 0;
          padding: 0;
          background: #fff;
        }
        
        .page-container {
          width: 105mm;
          height: 148mm;
          padding: 4mm;
          display: flex;
          flex-direction: column;
        }
        
        .main-container {
          flex: 1;
          border: 2px solid #000;
          padding: 3mm;
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
          font-size: 11px;
          font-weight: bold;
          margin-bottom: 1mm;
        }
        
        .clinic-info {
          font-size: 7px;
          line-height: 1.3;
        }
        
        .invoice-header {
          text-align: center;
          margin-bottom: 2mm;
          padding: 2mm;
          background: #f0f0f0;
          border: 1px solid #000;
        }
        
        .invoice-title {
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }
        
        .invoice-number {
          font-size: 7px;
          margin-top: 1mm;
        }

        .two-column-section {
          display: flex;
          gap: 3mm;
          margin-bottom: 2mm;
        }

        .column {
          flex: 1;
        }
        
        .section {
          font-size: 8px;
        }
        
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 0.5mm;
          margin-bottom: 1mm;
          font-size: 9px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 0.8mm;
        }
        
        .info-label {
          font-weight: bold;
          min-width: 40px;
          font-size: 7.5px;
        }
        
        .info-value {
          font-size: 7.5px;
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
          font-size: 8px;
          background: #f5f5f5;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 1.5mm 1mm;
          border-bottom: 1px solid #ddd;
          font-size: 8px;
        }
        
        .qr-section {
          text-align: center;
          margin: 2mm 0;
          padding: 2mm;
          border: 1px dashed #999;
        }
        
        .qr-title {
          font-weight: bold;
          font-size: 8px;
          margin-bottom: 2mm;
        }
        
        .qr-code {
          width: 70px;
          height: 70px;
          margin: 0 auto;
          border: 1px solid #333;
          padding: 1mm;
        }
        
        .qr-label {
          font-size: 6px;
          margin-top: 1mm;
          font-weight: bold;
        }
        
        .totals {
          margin-top: auto;
          border-top: 2px solid #000;
          padding-top: 2mm;
        }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          font-size: 9px;
          padding: 0 1mm;
        }
        
        .total-final {
          font-weight: bold;
          font-size: 11px;
          border-top: 2px solid #000;
          border-bottom: 3px double #000;
          padding: 2mm 1mm;
          margin-top: 1mm;
          background: #f5f5f5;
        }
        
        .footer {
          text-align: center;
          margin-top: 2mm;
          padding-top: 2mm;
          border-top: 1px dashed #999;
          font-size: 6px;
          line-height: 1.4;
        }
        
        .status-badge {
          display: inline-block;
          padding: 1px 4px;
          background: #4CAF50;
          color: white;
          border-radius: 2px;
          font-size: 7px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        <div class="main-container">
          <!-- Clinic Header -->
          <div class="bill-header">
            <div class="clinic-name">YOUR CLINIC NAME</div>
            <div class="clinic-info">
              123 Medical Street, Colombo 07<br>
              Tel: +94 11 234 5678 | Reg No: MC2024001
            </div>
          </div>

          <!-- Invoice Title -->
          <div class="invoice-header">
            <div class="invoice-title">MEDICAL INVOICE</div>
            <div class="invoice-number">
              #${String(invoiceData.invoiceId).padStart(6, '0')} | ${invoiceData.dateIssued} | 
              <span class="status-badge">${invoiceData.status}</span>
            </div>
          </div>

          <!-- Two Column Section: Patient Details and Consultation -->
          <div class="two-column-section">
            <!-- Left Column: Patient Details -->
            <div class="column">
              <div class="section">
                <div class="section-title">PATIENT DETAILS</div>
                <div class="info-row">
                  <span class="info-label">Patient No:</span>
                  <span class="info-value">${invoiceData.patientNo}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${invoiceData.patientName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Contact:</span>
                  <span class="info-value">${invoiceData.patientContactNo}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">DOB:</span>
                  <span class="info-value">${invoiceData.patientDob}</span>
                </div>
              </div>
            </div>

            <!-- Right Column: Consultation Details -->
            <div class="column">
              <div class="section">
                <div class="section-title">CONSULTATION</div>
                <div class="info-row">
                  <span class="info-label">Doctor:</span>
                  <span class="info-value">${invoiceData.doctorName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Specialty:</span>
                  <span class="info-value">${invoiceData.doctorSpecialization}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Items -->
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

          <!-- QR Code Section -->
          <div class="qr-section">
            <div class="qr-title">Scan for Details</div>
            <img src="${qrCodeImage}" alt="QR Code" class="qr-code">
            <div class="qr-label">Invoice #${invoiceData.invoiceId}</div>
          </div>

          <!-- Totals -->
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

          <!-- Footer -->
          <div class="footer">
            <div style="font-weight: bold;">Thank you for choosing our services!</div>
            <div>Computer-generated invoice - No signature required</div>
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