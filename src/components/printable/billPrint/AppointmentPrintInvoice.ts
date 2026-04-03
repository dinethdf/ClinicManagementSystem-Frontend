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

  // Fallback defaults
  const clinicName = clinicData?.name || "YOUR CLINIC NAME";
  const clinicAddress = clinicData?.address || "123 Medical Street";
  const clinicCity = clinicData?.city || "Colombo 07";
  const fullAddress = clinicCity ? `${clinicAddress}, ${clinicCity}` : clinicAddress;
  const clinicTel = clinicData?.landNo || clinicData?.mobileNo || "+94 11 234 5678";
  const clinicEmail = clinicData?.email || "";

  // Main Item
  const mainItem = invoiceData.items.find(item => item.typeName === 'APPOINTMENT');
  const consultationFee = mainItem?.totalAmount || 0;
  const description = mainItem?.description || 'Consultation Fee';
  const totalDiscount = Math.abs(invoiceData.totalDiscount);
  
  // Format Date & Time
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

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

  // Financial Calculations
  const finalAmount = invoiceData.finalAmount || 0;
  const amountPaid = invoiceData.amountPaid || 0;
  const balanceDue = Math.max(0, finalAmount - amountPaid);
  
  const hasPayment = amountPaid > 0;
  const isPartial = invoiceData.status.code === 'PARTIAL' || (amountPaid > 0 && amountPaid < finalAmount);

  // Generate QR Code (Only used in the full bill)
  const qrCodeUrl = generateQueueTrackingUrl(invoiceData.scheduleId, invoiceData.queuePosition, Number(invoiceData.patientId));
  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`;
  const statusColor = invoiceData.status.colorCode || '#4CAF50';

  let htmlContent = '';

// --- TEMPLATE 1: SMALL PARTIAL PAYMENT RECEIPT ---
  if (isPartial) {
    htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Receipt #${invoiceData.invoiceId}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Arial', sans-serif; color: #000; }
          body { font-size: 12px; line-height: 1.4; width: 80mm; background: #fff; }
          @media print { 
            @page { size: 80mm auto; margin: 0mm; } 
            html, body { width: 80mm; } 
          }
          .container { padding: 4mm; }
          .header { text-align: center; border-bottom: 1px dashed #000; padding-bottom: 2mm; margin-bottom: 3mm; }
          .clinic-name { font-size: 14px; font-weight: bold; text-transform: uppercase; }
          .title { font-size: 13px; font-weight: bold; margin-top: 1mm; }
          
          .info-row { display: flex; justify-content: space-between; margin-bottom: 1mm; font-size: 11px; }
          .divider { border-bottom: 1px dashed #ccc; margin: 3mm 0; }
          
          /* NEW: Minimal Appointment Box */
          .appt-box { border: 1px dashed #666; padding: 2mm; margin: 2mm 0; background: #f9f9f9; border-radius: 3px; }
          .queue-text { font-size: 14px; font-weight: bold; }
          
          .money-row { display: flex; justify-content: space-between; margin-bottom: 2mm; font-size: 12px; }
          .money-row.bold { font-weight: bold; font-size: 13px; }
          .money-row.balance { 
            font-weight: bold; font-size: 15px; 
            border-top: 1px solid #000; border-bottom: 2px double #000; 
            padding: 2mm 0; margin-top: 1mm; 
          }
          
          .footer { text-align: center; font-size: 10px; margin-top: 4mm; border-top: 1px dashed #000; padding-top: 2mm; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="clinic-name">${clinicName}</div>
            <div class="title">PARTIAL PAYMENT RECEIPT</div>
          </div>
          
          <div class="info-row"><span>Receipt #:</span> <span>${String(invoiceData.invoiceId).padStart(6, '0')}</span></div>
          <div class="info-row"><span>Paid On:</span> <span>${paidDate || formatDateTime(new Date().toISOString())}</span></div>
          <div class="info-row"><span>Patient:</span> <span>${invoiceData.patientName}</span></div>
          <div class="info-row"><span>Method:</span> <span>${invoiceData.paymentMethod || 'Cash'}</span></div>
          
          <div class="appt-box">
            <div class="info-row"><span>Doctor:</span> <span style="font-weight:bold;">${invoiceData.doctorName}</span></div>
            <div class="info-row"><span>Appt Date:</span> <span>${appointmentDate} | ${appointmentTime}</span></div>
            <div class="info-row"><span>Queue No:</span> <span class="queue-text">#${invoiceData.queuePosition}</span></div>
          </div>
          
          <div class="divider"></div>
          
          <div class="money-row">
            <span>Total Bill Amount:</span>
            <span>Rs. ${finalAmount.toFixed(2)}</span>
          </div>
          <div class="money-row bold">
            <span>Amount Paid:</span>
            <span>Rs. ${amountPaid.toFixed(2)}</span>
          </div>
          
          <div class="money-row balance">
            <span>REMAINING BALANCE:</span>
            <span>Rs. ${balanceDue.toFixed(2)}</span>
          </div>
          
          <div class="footer">
            Please clear the balance on your next visit.<br>
            Thank you!
          </div>
        </div>
        <script>
          window.onload = function() { setTimeout(() => { window.print(); }, 500); };
          window.onafterprint = function() { setTimeout(() => { window.close(); }, 500); };
        </script>
      </body>
      </html>
    `;
  }
  // --- TEMPLATE 2: FULL STANDARD INVOICE ---
 // --- TEMPLATE 2: FULL STANDARD INVOICE (Enhanced Original UI) ---
  else {
    htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Invoice #${invoiceData.invoiceId}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 11px;
            line-height: 1.4;
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
          
          /* Clinic Header */
          .bill-header {
            text-align: center;
            margin-bottom: 2mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #000;
          }
          .clinic-name {
            font-size: 13px;
            font-weight: 800;
            margin-bottom: 0.5mm;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .clinic-info {
            font-size: 8px;
            line-height: 1.3;
            color: #333;
          }
          
          /* Invoice Header Box */
          .invoice-header {
            text-align: center;
            margin-bottom: 2.5mm;
            padding: 1.5mm;
            background: #f4f4f4;
            border: 1px solid #000;
            border-radius: 2px;
          }
          .invoice-title {
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
          }
          .invoice-number {
            font-size: 8.5px;
            margin-top: 1mm;
          }

          /* Two Column Layout */
          .two-column-section {
            display: flex;
            gap: 2mm;
            margin-bottom: 2.5mm;
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
            letter-spacing: 0.5px;
          }
          .info-row {
            display: flex;
            margin-bottom: 0.8mm;
            font-size: 8.5px;
          }
          .info-label {
            font-weight: bold;
            min-width: 25px;
            color: #444;
          }
          .info-value {
            flex: 1;
            word-wrap: break-word;
          }
          
          /* Appointment Info Banner */
          .appointment-info {
            margin-bottom: 2.5mm;
            padding: 1.5mm 2mm;
            background: #fff;
            border: 1px dashed #666;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 3px;
          }
          .appointment-info .date-time-block {
             display: flex;
             flex-direction: column;
             gap: 0.5mm;
          }
          .appointment-info .info-row {
            font-size: 9px;
            font-weight: bold;
            margin: 0;
          }

          /* Queue Display */
          .queue-display {
            text-align: center;
            padding: 1.5mm;
            background: #2196F3;
            color: white;
            border-radius: 4px;
            min-width: 50px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
          }
          .queue-label {
            font-size: 7px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .queue-number {
            font-size: 16px;
            font-weight: 900;
            line-height: 1;
            margin-top: 1px;
          }
          
          /* Items Table */
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
            border-bottom: 1px dashed #ddd;
            font-size: 9.5px;
          }
          
          /* Totals */
          .total-final {
            display: flex;
            justify-content: space-between;
            font-weight: 900;
            font-size: 13px;
            border-top: 2px solid #000;
            border-bottom: 3px double #000;
            padding: 2.5mm 1mm;
            margin-top: 1mm;
            background: #f5f5f5;
          }

          /* Payment Block */
          .payment-info {
            margin: 3mm 0;
            padding: 2mm;
            background: #f4fbf5;
            border: 1px solid #4CAF50;
            border-radius: 4px;
          }
          .payment-title {
            font-weight: bold;
            margin-bottom: 1mm;
            font-size: 9px;
            text-align: center;
            border-bottom: 1px solid #c8e6c9;
            padding-bottom: 1mm;
            color: #2E7D32;
            letter-spacing: 0.5px;
          }
          .payment-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5mm 2mm;
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
            text-transform: uppercase;
          }
          .payment-value {
            font-size: 9px;
            margin-top: 0.5mm;
            font-weight: bold;
          }
          
          /* QR Code */
          .qr-section {
            text-align: center;
            margin: 2mm 0;
            padding: 1.5mm;
            border: 1px dashed #2196F3;
            background: #f0f8ff;
            border-radius: 4px;
          }
          .qr-code {
            width: 75px;
            height: 75px;
            border: 2px solid #fff;
            padding: 1mm;
            margin: 1mm auto;
            background: #fff;
          }
          .qr-title {
            font-weight: bold;
            font-size: 9px;
            margin-bottom: 1mm;
            color: #1976D2;
            letter-spacing: 0.5px;
          }
          
          /* Footer */
          .footer {
            text-align: center;
            margin-top: 3mm;
            padding-top: 2mm;
            border-top: 1px dashed #999;
            font-size: 8px;
            line-height: 1.4;
          }
          
          .status-badge {
            display: inline-block;
            padding: 2px 6px;
            background: ${statusColor};
            color: white;
            border-radius: 3px;
            font-size: 8.5px;
            font-weight: bold;
            vertical-align: middle;
            text-transform: uppercase;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          
          <div class="bill-header">
            <div class="clinic-name">${clinicName}</div>
            <div class="clinic-info">
              ${fullAddress}<br>
              Tel: ${clinicTel}${clinicEmail ? ` | ${clinicEmail}` : ''}
            </div>
          </div>

          <div class="invoice-header">
            <div class="invoice-title">MEDICAL INVOICE</div>
            <div class="invoice-number">
              #${String(invoiceData.invoiceId).padStart(6, '0')} | ${invoiceDate} | 
              <span class="status-badge">${invoiceData.status.displayName}</span>
            </div>
          </div>

          <div class="appointment-info">
            <div class="date-time-block">
              <div class="info-row">
                <span class="info-label" style="min-width: 25px;">Date:</span>
                <span>${appointmentDate} ${appointmentTime}</span>
              </div>
            </div>
            <div class="queue-display">
              <div class="queue-label">Queue</div>
              <div class="queue-number">#${invoiceData.queuePosition}</div>
            </div>
          </div>

          <div class="two-column-section">
            <div class="column">
              <div class="section-title">PATIENT</div>
              <div class="info-row">
                <span class="info-value" style="font-weight:bold; font-size: 9.5px;">${invoiceData.patientName}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Tel:</span>
                <span class="info-value">${invoiceData.patientContactNo}</span>
              </div>
            </div>

            <div class="column">
              <div class="section-title">DOCTOR</div>
              <div class="info-row">
                <span class="info-value" style="font-weight:bold; font-size: 9.5px;">${invoiceData.doctorName}</span>
              </div>
              <div class="info-row">
                <span class="info-value">${invoiceData.doctorSpecialization}</span>
              </div>
            </div>
          </div>

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
              <span style="color: #d32f2f; font-weight: bold;">- Rs. ${totalDiscount.toFixed(2)}</span>
            </div>
            ` : ''}
            
            <div class="total-final">
              <span>TOTAL BILL:</span>
              <span>Rs. ${finalAmount.toFixed(2)}</span>
            </div>
          </div>

          ${hasPayment ? `
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

          <div class="qr-section">
            <div class="qr-title">SCAN TO TRACK QUEUE</div>
            <img src="${qrCodeImage}" alt="QR Code" class="qr-code">
          </div>

          <div class="footer">
            <div style="font-weight: bold; font-size: 9px; margin-bottom: 2px;">Thank you for your visit!</div>
            <div>Wishing you good health.</div>
          </div>
          
        </div>

        <script>
          window.onload = function() { setTimeout(() => { window.print(); }, 500); };
          window.onafterprint = function() { setTimeout(() => { window.close(); }, 500); };
        </script>
      </body>
      </html>
    `;
  }

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