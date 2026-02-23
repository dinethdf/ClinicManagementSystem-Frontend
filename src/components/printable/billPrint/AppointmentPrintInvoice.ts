'use client';

import { getClinicStorageDetails } from "@/utils/common";
import { generateQueueTrackingUrl } from "@/utils/qrcode";

type InvoiceData = {
  patientId?: number;
  invoiceId: number;
  dateIssued: string;
  datePaidDate?: string;
  status: {
    code: string;
    displayName: string;
    colorCode: string;
  };
  patientNo: string;
  patientName: string;
  patientAddress: string;
  patientDob: string;
  patientContactNo: string;
  appointmentId: number;
  appointmentNumber?: string | number | null;
  doctorName: string;
  doctorSpecialization: string;
  appointmentNote: string;
  appointmentDate: string;
  appointmentTime: string;
  queuePosition: number;
  scheduleId: number;
  
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
  paymentMethod?: string;
  amountPaid?: number;
  transactionId?: string;
};

export function appointmentPrintInvoice(invoiceData: InvoiceData, onComplete?: () => void) {
  
  // Get Clinic Details from Storage
  const clinicData = getClinicStorageDetails();

  // Fallback defaults if storage is empty
  const clinicName = clinicData?.name || "YOUR CLINIC NAME";
  const clinicAddress = clinicData?.address || "123 Medical Street";
  const clinicCity = clinicData?.city || "Colombo 07";
  const fullAddress = clinicCity ? `${clinicAddress}, ${clinicCity}` : clinicAddress;
  const clinicTel = clinicData?.landNo || clinicData?.mobileNo || "+94 11 234 5678";
  const clinicEmail = clinicData?.email || "";

  // Find the Main Item (Appointment/Consultation)
  const mainItem = invoiceData.items.find(item => item.typeName === 'APPOINTMENT');
  const consultationFee = mainItem?.totalAmount || 0;
  const description = mainItem?.description || 'Consultation Fee';
  
  const totalDiscount = Math.abs(invoiceData.totalDiscount);
  
  // Format Date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format Time (e.g., 11:00:00 -> 11:00 AM)
  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const invoiceDate = formatDate(invoiceData.dateIssued);
  const paidDate = invoiceData.datePaidDate ? formatDateTime(invoiceData.datePaidDate) : '';
  const appointmentDate = formatDate(invoiceData.appointmentDate);
  const appointmentTime = formatTime(invoiceData.appointmentTime);

  // Generate QR Code
  const qrCodeUrl = generateQueueTrackingUrl(
    invoiceData.scheduleId, 
    invoiceData.queuePosition, 
    Number(invoiceData.patientId)
  );
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;

  // Status Badge Color
  const statusColor = invoiceData.status.colorCode || '#4CAF50';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${invoiceData.invoiceId}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        
        body {
          font-family: 'Arial', sans-serif;
          font-size: 11px;
          line-height: 1.3;
          color: #000;
          width: 80mm;
          margin: 0;
          padding: 0;
          background: #fff;
        }
        
        @media print {
          @page { size: 80mm auto; margin: 0mm; }
          html, body { width: 80mm; height: auto; background: none; }
          .page-container { box-shadow: none; }
        }
        
        .page-container {
          width: 80mm;
          padding: 3mm;
        }
        
        .bill-header {
          text-align: center;
          margin-bottom: 2mm;
          padding-bottom: 2mm;
          border-bottom: 2px solid #000;
        }
        
        .clinic-name {
          font-size: 13px;
          font-weight: bold;
          margin-bottom: 0.5mm;
          text-transform: uppercase;
        }
        
        .clinic-info {
          font-size: 8px;
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
          font-size: 11px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }
        
        .invoice-number {
          font-size: 8px;
          margin-top: 0.5mm;
        }

        .two-column-section {
          display: flex;
          gap: 2mm;
          margin-bottom: 2mm;
        }

        .column {
          flex: 1;
        }
        
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 0.5mm;
          margin-bottom: 1mm;
          font-size: 9px;
          background-color: #eee;
          padding-left: 1.5mm;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 0.8mm;
          font-size: 8.5px;
        }
        
        .info-label {
          font-weight: bold;
          min-width: 30px;
        }
        
        .info-value {
          flex: 1;
          word-wrap: break-word;
        }
        
        .appointment-info {
          margin-bottom: 2mm;
          padding: 1.5mm;
          background: #f9f9f9;
          border: 1px dashed #999;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .appointment-info .info-row {
          font-size: 9px;
          font-weight: bold;
        }

        .queue-display {
          text-align: center;
          padding: 1mm;
          background: #2196F3;
          color: white;
          border-radius: 3px;
          min-width: 50px;
        }

        .queue-label {
          font-size: 7px;
        }

        .queue-number {
          font-size: 16px;
          font-weight: bold;
          line-height: 1;
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
          font-size: 9px;
          background: #f5f5f5;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 1.5mm 1mm;
          border-bottom: 1px solid #ddd;
          font-size: 9.5px;
        }
        
        .total-final {
          display: flex;
          justify-content: space-between;
          font-weight: bold;
          font-size: 13px;
          border-top: 2px solid #000;
          border-bottom: 3px double #000;
          padding: 2mm 1mm;
          margin-top: 1mm;
          background: #f5f5f5;
        }

        .payment-info {
          margin: 2mm 0;
          padding: 1.5mm 2mm;
          background: #e8f5e9;
          border: 1px solid #4CAF50;
          border-radius: 3px;
        }

        .payment-title {
          font-weight: bold;
          margin-bottom: 1mm;
          font-size: 9px;
          text-align: center;
          border-bottom: 1px solid #4CAF50;
          padding-bottom: 1mm;
        }

        .payment-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1mm 2mm;
          font-size: 8.5px;
        }

        .payment-item {
          display: flex;
          flex-direction: column;
        }

        .payment-label {
          font-weight: bold;
          font-size: 7.5px;
          color: #2E7D32;
        }

        .payment-value {
          font-size: 9px;
          margin-top: 0.5mm;
        }
        
        .qr-section {
          text-align: center;
          margin: 1mm 0;
          padding: 1mm;
          border: 2px dashed #2196F3;
          border-radius: 4px;
        }
        
        .qr-code {
          width: 70px;
          height: 70px;
          border: 2px solid #333;
          padding: 1mm;
          margin: 1mm auto;
        }

        .qr-title {
          font-weight: bold;
          font-size: 9px;
          margin-bottom: 1mm;
          color: #2196F3;
        }
        
        .qr-label {
          font-size: 7.5px;
          margin-top: 1mm;
          color: #666;
        }
        
        .footer {
          text-align: center;
          margin-top: 2mm;
          padding-top: 1mm;
          border-top: 1px dashed #999;
          font-size: 7.5px;
          line-height: 1.4;
        }
        
        .status-badge {
          display: inline-block;
          padding: 1px 5px;
          background: ${statusColor};
          color: white;
          border-radius: 3px;
          font-size: 8px;
          font-weight: bold;
          vertical-align: middle;
        }
      </style>
    </head>
    <body>
      <div class="page-container">
        <!-- Clinic Header -->
        <div class="bill-header">
          <div class="clinic-name">${clinicName}</div>
          <div class="clinic-info">
            ${fullAddress}<br>
            Tel: ${clinicTel}${clinicEmail ? ` | ${clinicEmail}` : ''}
          </div>
        </div>

    <!-- Invoice Header -->
        <div class="invoice-header">
          <div class="invoice-title">MEDICAL INVOICE</div>
          <div class="invoice-number">
            #${String(invoiceData.invoiceId).padStart(6, '0')} | ${invoiceDate} | 
            <span class="status-badge">${invoiceData.status.displayName}</span>
          </div>
          
          <!-- Appointment Details Inside Header -->
          <div style="margin-top: 2mm; padding-top: 2mm; border-top: 1px dashed #999; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 8.5px; margin-bottom: 0.5mm;">
                <span style="font-weight: bold;">Date:</span>
                <span>${appointmentDate} ${appointmentTime}</span>
              </div>
              ${invoiceData.appointmentNote ? `
              <div style="font-size: 8px; font-style: italic;">
                <span style="font-weight: bold;">Note:</span>
                <span>${invoiceData.appointmentNote}</span>
              </div>
              ` : ''}
            </div>
            <div class="queue-display">
              <div class="queue-label">Queue</div>
              <div class="queue-number">#${invoiceData.queuePosition}</div>
            </div>
          </div>
        </div>

        <!-- Two Column: Patient & Doctor Info -->
        <div class="two-column-section">
          <div class="column">
            <div class="section-title">PATIENT</div>
            <div class="info-row">
              <span class="info-label">Name:</span>
              <span class="info-value" style="font-weight:bold;">${invoiceData.patientName}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tel:</span>
              <span class="info-value">${invoiceData.patientContactNo}</span>
            </div>
          </div>

          <div class="column">
            <div class="section-title">DOCTOR</div>
            <div class="info-row">
              <span class="info-value" style="font-weight:bold;">${invoiceData.doctorName}</span>
            </div>
            <div class="info-row">
              <span class="info-value">${invoiceData.doctorSpecialization}</span>
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
            <span>${description}</span>
            <span>Rs. ${consultationFee.toFixed(2)}</span>
          </div>
          ${totalDiscount > 0 ? `
          <div class="item-row">
            <span>Discount Applied</span>
            <span style="color: #d32f2f;">- Rs. ${totalDiscount.toFixed(2)}</span>
          </div>
          ` : ''}
          
          <!-- Total Only -->
          <div class="total-final">
            <span>TOTAL:</span>
            <span>Rs. ${invoiceData.finalAmount.toFixed(2)}</span>
          </div>
        </div>

        <!-- Payment Info (if paid) - Grid Layout -->
        ${invoiceData.status.code === 'PAID' ? `
        <div class="payment-info">
          <div class="payment-title">PAYMENT DETAILS</div>
          <div class="payment-grid">
            <div class="payment-item">
              <span class="payment-label">Method</span>
              <span class="payment-value">${invoiceData.paymentMethod || 'N/A'}</span>
            </div>
            <div class="payment-item">
              <span class="payment-label">Paid On</span>
              <span class="payment-value">${paidDate}</span>
            </div>            


          </div>
        </div>
        ` : ''}

        <!-- QR Code -->
        <div class="qr-section">
          <div class="qr-title">SCAN TO TRACK QUEUE</div>
          <img src="${qrCodeImage}" alt="QR Code" class="qr-code">
        </div>

        <!-- Footer -->
        <div class="footer">
          <div style="font-weight: bold;">Thank you for your visit!</div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
            window.print();
          }, 500);
        };
        
        window.onafterprint = function() {
          setTimeout(() => {
            window.close();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();

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
