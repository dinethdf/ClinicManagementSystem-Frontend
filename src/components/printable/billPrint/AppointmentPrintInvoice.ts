'use client';

import { getClinicStorageDetails } from "@/utils/common"; // Adjust path if needed
import { generateQueueTrackingUrl } from "@/utils/qrcode";

// 1. Type Definition
type InvoiceData = {
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

  const qrCodeUrl = generateQueueTrackingUrl(invoiceData.scheduleId, invoiceData.queuePosition)

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

        /* --- PREVIEW VIEW (Screen) --- */
        @media screen {
          html, body { height: 100%; width: 100%; }
          body { display: flex; justify-content: center; align-items: flex-start; padding-top: 40px; }
          #invoice-view {
            width: 80mm; min-height: 150mm; background: white;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5); padding: 3mm 4mm;
            display: flex; flex-direction: column;
          }
          #success-animation { display: none; }
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

        /* --- RECEIPT STYLES --- */
        .bill-header { text-align: center; margin-bottom: 2mm; padding-bottom: 2mm; border-bottom: 2px dashed #000; }
        .clinic-name { font-size: 16px; font-weight: 900; margin-bottom: 1mm; text-transform: uppercase; }
        .clinic-info { font-size: 10px; }
        
        .invoice-meta { text-align: center; margin-bottom: 2mm; font-size: 10px; }
        .invoice-id { font-size: 12px; font-weight: bold; }
        .status-badge { display: inline-block; border: 1px solid #000; padding: 0px 4px; border-radius: 4px; font-size: 10px; font-weight: bold; margin-left: 2mm; }

        .queue-box { 
            border: 1px solid #000; 
            padding: 1.5mm; 
            margin-bottom: 2mm; 
            text-align: center; 
            border-radius: 4px;
            background-color: #f9f9f9;
        }
        .queue-label { font-size: 9px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.5px; }
        .queue-number { font-size: 16px; font-weight: 900; line-height: 1; margin: 1mm 0; }
        .appt-time { font-size: 11px; font-weight: bold; border-top: 1px dotted #ccc; padding-top: 1mm; margin-top: 1mm; }

        .flex-row { display: flex; gap: 2mm; margin-bottom: 2mm; }
        .col { flex: 1; }
        
        .section-header { font-weight: bold; border-bottom: 1px solid #000; margin-bottom: 1mm; font-size: 11px; text-transform: uppercase; }
        .info-row { display: flex; margin-bottom: 1mm; font-size: 11px; }
        .info-value { font-weight: bold; }
        
        .items-table { width: 100%; margin-top: 2mm; border-collapse: collapse; font-size: 11px; }
        .items-table th { text-align: left; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 1mm 0; }
        .items-table td { padding: 1.5mm 0; border-bottom: 1px dotted #ccc; }
        .amount-col { text-align: right; }
        
        .totals-section { margin-top: 2mm; padding-top: 2mm; border-top: 2px dashed #000; }
        .total-row { display: flex; justify-content: space-between; margin-bottom: 1mm; font-size: 12px; }
        .final-total { font-weight: bold; font-size: 16px; margin-top: 2mm; border-top: 2px solid #000; border-bottom: 4px double #000; padding: 2mm 0; }
        
        .payment-info { font-size: 10px; text-align: center; margin-top: 1mm; color: #333; }

        .footer-section { margin-top: 2mm; text-align: center; display: flex; flex-direction: column; align-items: center; }
        .qr-code { width: 25mm; height: 25mm; margin-bottom: 1mm; }
        .thank-you { font-weight: bold; font-size: 12px; margin-top: 2mm; }
      </style>
    </head>
    <body>

      <div id="success-animation">
         <div class="printer-container">
            <div class="paper-sheet"></div>
            <div class="printer-body"></div>
         </div>
      </div>

      <div id="invoice-view">
        <div class="bill-header">
          <div class="clinic-name">${clinicName}</div>
          <div class="clinic-info">
             ${fullClinicAddress}<br>
             ${clinicTel ? `Tel: ${clinicTel}` : ''}
          </div>
        </div>

        <div class="invoice-meta">
          <div class="invoice-id">INVOICE #${invoiceData.invoiceId}</div>
          <div>${formatDate(invoiceData.dateIssued)}</div>
          <div style="font-weight:bold; margin-top:2px;">${invoiceData.status}</div>
        </div>

        <div class="queue-box">
            <div class="queue-label">Queue No</div>
            <div class="queue-number">${String(invoiceData.queuePosition).padStart(2, '0')}</div>
            <div class="appt-time">
                ${apptDateFormatted} @ ${apptTimeFormatted}
            </div>
        </div>

        <div class="flex-row">
            <div class="col">
                <div class="section-header">Patient</div>
                <div class="info-row"><span class="info-value">${invoiceData.patientName}</span></div>
                <div class="info-row" style="font-size:10px;">${invoiceData.patientContactNo}</div>
            </div>
            <div class="col">
                <div class="section-header">Doctor</div>
                <div class="info-row"><span class="info-value">${invoiceData.doctorName}</span></div>
                <div class="info-row" style="font-size:10px;">${invoiceData.doctorSpecialization}</div>
            </div>
        </div>

        <table class="items-table">
            <thead><tr><th>Item</th><th class="amount-col">Amount</th></tr></thead>
            <tbody>
                <tr>
                    <td>${description}</td>
                    <td class="amount-col">${consultationFee.toFixed(2)}</td>
                </tr>
            </tbody>
        </table>

        <div class="totals-section">
            <div class="total-row"><span>Subtotal</span><span>${invoiceData.subtotal.toFixed(2)}</span></div>
            ${totalDiscount > 0 ? `<div class="total-row"><span>Discount</span><span>-${totalDiscount.toFixed(2)}</span></div>` : ''}
            <div class="total-row final-total"><span>TOTAL</span><span>Rs. ${invoiceData.finalAmount.toFixed(2)}</span></div>
        </div>

        ${invoiceData.paymentMethod ? `
        <div class="payment-info">
             Paid by: <strong>${invoiceData.paymentMethod}</strong>
        </div>
        ` : ''}

        <div class="footer-section">
            <img src="${qrCodeImage}" class="qr-code" alt="QR" />
            <div class="thank-you">*** THANK YOU ***</div>
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