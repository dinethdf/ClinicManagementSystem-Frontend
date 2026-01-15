'use client'

import React, { useRef, forwardRef } from 'react'
import { useReactToPrint } from 'react-to-print'

// --- 1. CONFIGURATION ---
// "Half of A4" width is approx 105mm. Standard Thermal is 80mm.
// You can change this value to '105mm' if you literally mean half A4.
const PRINT_WIDTH = '80mm'; 

// --- 2. DATA TYPES ---
interface ReceiptData {
  id: string
  patientName: string
  doctorName: string
  date: string
  amount: number
}

// --- 3. THE RECEIPT COMPONENT ---
const ThermalReceipt = forwardRef<HTMLDivElement, { data: ReceiptData }>((props, ref) => {
  const { data } = props

  return (
    // We set the width dynamically here
    <div ref={ref} className="p-4 bg-white text-black font-mono text-xs leading-tight mx-auto" style={{ width: PRINT_WIDTH }}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-black uppercase tracking-wider mb-1">CITYCARE MEDICAL</h1>
          <p>410 Medical Plaza, Suite 210</p>
          <p>Pelmadulla, Sri Lanka</p>
          <p>(045) 227-1144</p>
        </div>

        <div className="border-b-2 border-dashed border-gray-800 my-2"></div>

        {/* Date & Ref */}
        <div className="mb-2">
            <p className="font-bold">{data.date}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-y-1 mb-2">
          <div className='col-span-2'>
            <span className="font-bold">REF #: </span> {data.id}
          </div>
          <div className='col-span-2'>
            <span className="font-bold">PATIENT: </span> {data.patientName}
          </div>
          <div className="col-span-2 mt-1">
            <span className="font-bold">PHYSICIAN: </span> <br/>
            {data.doctorName}
          </div>


          <div className="col-span-2 mt-1">
            <span className="font-bold">PHYSICIAN: </span> <br/>
            {data.doctorName}
          </div>                              
        </div>

        <div className="border-b-2 border-dashed border-gray-800 my-2"></div>

        {/* Line Items */}
        <div className="flex justify-between font-bold mb-1">
          <span>DESCRIPTION</span>
          <span>AMT</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Consultation Fee</span>
          <span>{data.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Booking Charge</span>
          <span>250.00</span>
        </div>

                {/* Line Items */}
        <div className="flex justify-between font-bold mb-1">
          <span>DESCRIPTION</span>
          <span>AMT</span>
        </div>

        <div className="flex justify-between mb-1">
          <span>Booking Charge</span>
          <span>250.00</span>
        </div>

                {/* Line Items */}
        <div className="flex justify-between font-bold mb-1">
          <span>DESCRIPTION</span>
          <span>AMT</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Consultation Fee</span>
          <span>{data.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Booking Charge</span>
          <span>250.00</span>
        </div>

                {/* Line Items */}
        <div className="flex justify-between font-bold mb-1">
          <span>DESCRIPTION</span>
          <span>AMT</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Consultation Fee</span>
          <span>{data.amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>Booking Charge</span>
          <span>250.00</span>
        </div>

        <div className="border-t-2 border-dashed border-gray-800 my-2 pt-2"></div>

        {/* Total */}
        <div className="flex justify-between font-bold text-lg">
          <span>TOTAL:</span>
          <span>{(data.amount + 250).toFixed(2)} LKR</span>
        </div>

        {/* QR Code Placeholder (Using img for simplicity in this example) */}
        <div className="flex flex-col items-center justify-center mt-6">
           {/* Note: In production, stick to qrcode.react for better quality */}
           <div className="w-24 h-24 bg-gray-200 flex items-center justify-center text-[8px] text-gray-500">
             QR CODE HERE
           </div>
           <p className="text-[10px] text-center mt-2">Scan to Verify</p>
           <p className="font-bold mt-1">#{data.id}</p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-[10px]">
          <p>PLEASE KEEP THIS RECEIPT</p>
          <p>*** THANK YOU ***</p>
        </div>
    </div>
  )
})
ThermalReceipt.displayName = 'ThermalReceipt'


// --- 4. THE MAIN PAGE COMPONENT ---
const PrintTestPage = () => {
  const componentRef = useRef<HTMLDivElement>(null)

  const sampleData: ReceiptData = {
    id: "APT-9988",
    patientName: "Dineth H.",
    doctorName: "Dr. Sarah Miles",
    date: "2025-10-14 11:55",
    amount: 1500.00
  }

  // --- CRITICAL CONFIGURATION ---
  // This CSS tells the browser to use a specific width and 'auto' height.
  const pageStyle = `
    @page {
      size: ${PRINT_WIDTH} auto;
      margin: 0mm;
    }
    
    @media print {
      body {
        -webkit-print-color-adjust: exact;
      }
      /* Ensure the receipt content takes full width of the 'page' */
      html, body {
        width: 100%;
        height: max-content;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Receipt-${sampleData.id}`,
    // INJECT THE CSS HERE
    pageStyle: pageStyle,
  })

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Print Test</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Prints with <strong>Width: {PRINT_WIDTH}</strong> and <strong>Auto Height</strong>.
        </p>

        <button 
          onClick={() => handlePrint()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Receipt
        </button>
      </div>

      <div style={{ display: 'none' }}>
        <ThermalReceipt ref={componentRef} data={sampleData} />
      </div>

    </div>
  )
}

export default PrintTestPage