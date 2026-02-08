'use client';

import { getClinicStorageDetails } from "@/utils/common"; // Adjust path if needed
import { generateQueueTrackingUrl } from "@/utils/qrcode";

// 1. Type Definition
type InvoiceData = {
  patientId?: number;
  invoiceId: number;
  dateIssued: string;
  datePaidDate?: string;
  status: string;
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
  
  items: Array<{ description: string; typeName: string; unitPrice: number; quantity: number; totalAmount: number; }>;
  subtotal: number;
  totalDiscount: number;
  finalAmount: number;
  paymentMethod?: string;
  amountPaid?: number;
  transactionId?: string;
};

export function appointmentPrintInvoice(invoiceData: InvoiceData, onComplete?: () => void) {
  
  // --- 1. Get Clinic Details from Storage ---
  const clinicData = getClinicStorageDetails();

  // Fallback defaults if storage is empty
  const clinicName = clinicData?.name || "YOUR CLINIC NAME";
  
  // Construct Address (Address + City)
  const clinicAddressPart = clinicData?.address || "123 Medical Street";
  const clinicCityPart = clinicData?.city ? `, ${clinicData.city}` : "";
  const fullClinicAddress = `${clinicAddressPart}${clinicCityPart}`;
  
  // Use Landline, fallback to Mobile
  const clinicTel = clinicData?.landNo || clinicData?.mobileNo || "011-2345678";


  // --- 2. Data Processing ---
  
  // Find the Main Item (Appointment/Consultation)
  const mainItem = invoiceData.items.find(item => item.typeName === 'APPOINTMENT');
  const consultationFee = mainItem?.totalAmount || 0;
  const description = mainItem?.description || 'Consultation Fee';
  
  const totalDiscount = Math.abs(invoiceData.totalDiscount);
  
  // Format Date Helper
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('en-GB', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
    });
  };

  const apptDateFormatted = new Date(invoiceData.appointmentDate).toLocaleDateString('en-GB');
  // Format Time (e.g., 05:15:00 -> 05:15 PM)
  const apptTimeFormatted = new Date(`1970-01-01T${invoiceData.appointmentTime}`).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
  });

  const qrCodeUrl = generateQueueTrackingUrl(invoiceData.scheduleId, invoiceData.queuePosition, Number(invoiceData.patientId));

  const qrCodeImage = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUrl)}`;

  // --- HTML Content ---
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Invoice #${invoiceData.invoiceId}</title>
      <style>
        /* --- RESET --- */
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { 
            font-family: 'Arial', sans-serif; 
            font-size: 12px; 
            line-height: 1.2; 
            color: #000; 
            overflow: hidden; 
            background-color: #525659; 
        }
        
        body {
          font-family: 'Arial', sans-serif;
          /* Increased base font from 9px to 11px */
          font-size: 11px;
          line-height: 1.3;
          color: #000;
          width: 105mm;
          min-height: 148mm; /* Changed to min-height to allow content to flow if needed */
          margin: 0;
          padding: 0;
          background: #fff;
        }
        
        .page-container {
          width: 105mm;
          min-height: 148mm;
          padding: 3mm; /* Reduced padding slightly to give more room for text */
          display: flex;
          flex-direction: column;
        }
        
        /* --- PRINT VIEW --- */
        @media print {
          @page { size: 80mm auto; margin: 0mm; }
          html, body { width: 80mm; height: auto; background: none; }
          #invoice-view { width: 80mm; padding: 3mm 4mm; box-shadow: none; margin: 0; }
          #success-animation { display: none !important; }
        }

        /* --- ANIMATION STYLES --- */
        #success-animation {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: #525659; 
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          z-index: 999;
        }
        
        .clinic-name {
          /* Increased from 11px to 14px */
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 1mm;
          text-transform: uppercase;
        }
        
        .clinic-info {
          /* Increased from 7px to 9px */
          font-size: 9px;
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
          /* Increased from 10px to 12px */
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 0.5px;
        }
        
        .invoice-number {
          /* Increased from 7px to 10px */
          font-size: 10px;
          margin-top: 1mm;
        }
        .success-text { color: white; font-size: 18px; font-weight: bold; margin-top: 10px; opacity: 0; animation: fadeIn 0.5s forwards 0.8s; }

        .two-column-section {
          display: flex;
          gap: 2mm;
          margin-bottom: 2mm;
        }
        @keyframes popIn { to { opacity: 1; transform: scale(1); } }
        @keyframes fadeIn { to { opacity: 1; } }

        .column {
          flex: 1;
        }
        
        .section {
          /* Base size is body size (11px) */
          font-size: 11px;
        }
        
        .section-title {
          font-weight: bold;
          border-bottom: 1px solid #000;
          padding-bottom: 0.5mm;
          margin-bottom: 1mm;
          /* Increased from 9px to 11px */
          font-size: 11px;
          background-color: #eee; /* Added background for clarity */
          padding-left: 2px;
        }
        
        .info-row {
          display: flex;
          margin-bottom: 1mm; /* Increased spacing slightly */
        }
        
        .info-label {
          font-weight: bold;
          min-width: 55px; /* Widened to fit larger text */
          /* Increased from 7.5px to 10px */
          font-size: 10px;
        }
        
        .info-value {
          /* Increased from 7.5px to 10px */
          font-size: 10px;
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
          /* Increased from 8px to 11px */
          font-size: 11px;
          background: #f5f5f5;
        }
        
        .item-row {
          display: flex;
          justify-content: space-between;
          padding: 1.5mm 1mm;
          border-bottom: 1px solid #ddd;
          /* Increased from 8px to 11px */
          font-size: 11px;
        }
        
        .qr-section {
          text-align: center;
          margin: 2mm 0;
          padding: 1mm;
          border: 1px dashed #999;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .qr-info-container {
            text-align: left;
        }

        .qr-title {
          font-weight: bold;
          font-size: 10px;
        }
        
        .qr-code {
          width: 50px; /* Made slightly smaller to save vertical space */
          height: 50px;
          border: 1px solid #333;
          padding: 1mm;
        }
        .queue-label { font-size: 9px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .queue-number { font-size: 16px; font-weight: 900; line-height: 1; margin: 1mm 0; }
        .appt-time { font-size: 11px; font-weight: bold; border-top: 1px dotted #ccc; padding-top: 1mm; margin-top: 1mm; }

        .flex-row { display: flex; gap: 2mm; margin-bottom: 2mm; }
        .col { flex: 1; }
        
        .qr-label {
          font-size: 9px;
          margin-top: 1mm;
          font-weight: bold;
        }
        
        .items-table { width: 100%; margin-top: 2mm; border-collapse: collapse; font-size: 11px; }
        .items-table th { text-align: left; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 1mm 0; }
        .items-table td { padding: 1.5mm 0; border-bottom: 1px dotted #ccc; }
        .amount-col { text-align: right; }
        
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1mm;
          /* Increased from 9px to 11px */
          font-size: 11px;
          padding: 0 1mm;
        }
        
        .total-final {
          font-weight: bold;
          /* Increased from 11px to 14px */
          font-size: 14px;
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
          /* Increased from 6px to 9px */
          font-size: 9px;
          line-height: 1.4;
        }
        
        .status-badge {
          display: inline-block;
          padding: 1px 4px;
          background: #4CAF50;
          color: white;
          border-radius: 2px;
          /* Increased from 7px to 9px */
          font-size: 9px;
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
            <div class="col">
                <div class="section-header">Doctor</div>
                <div class="info-row"><span class="info-value">${invoiceData.doctorName}</span></div>
                <div class="info-row" style="font-size:10px;">${invoiceData.doctorSpecialization}</div>
            </div>
        </div>

          <div class="qr-section">
            <img src="${qrCodeImage}" alt="QR Code" class="qr-code">
            <div class="qr-info-container">
                 <div class="qr-title">Scan to Verify</div>
                 <div class="qr-label">Ref: #${invoiceData.invoiceId}</div>
            </div>
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

          <div class="footer">
            <div style="font-weight: bold;">Thank you for your visit!</div>
            <div>No signature required</div>
          </div>
        </div>
      </div>

      <script>
        window.onload = function() {
          setTimeout(() => {
             window.print();
          }, 500);
        };
        
        window.onafterprint = function() {
          document.getElementById('invoice-view').style.display = 'none';
          document.getElementById('success-animation').style.display = 'flex';

          setTimeout(() => {
             window.close();
          }, 1600);
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