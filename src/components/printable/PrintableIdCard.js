import React, { useRef } from 'react';

const PrintableIdCard = ({ patientData }) => {
  // Use user data or fallbacks
  const name = patientData?.name || "John Doe";
  const id = patientData?.id || "PAT-2025-001";
  const role = "Patient"; // or Doctor

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container">
      {/* 1. Controls (Visible only on screen) */}
      <div className="controls">
        <h1>ID Card Preview</h1>
        <button onClick={handlePrint} className="print-btn">
          Print ID Card
        </button>
        <p className="hint">Note: When printing, ensure "Paper Size" is set to A4.</p>
      </div>

      {/* 2. The ID Card Container */}
      <div className="print-area">
        <div className="id-card">
          <div className="card-header">
            <h3>HOSPITAL NAME</h3>
          </div>
          
          <div className="card-body">
            {/* Placeholder for Photo */}
            <div className="photo-placeholder">
              <span>Photo</span>
            </div>
            
            <div className="details">
              <h2>{name}</h2>
              <span className="badge">{role}</span>
              <p className="id-number">ID: {id}</p>
              
              <div className="qr-code-mock">
                {/* Mock QR Code area */}
                ||| || ||| ||
              </div>
            </div>
          </div>
          
          <div className="card-footer">
            <p>Authorized Signature</p>
          </div>
        </div>
      </div>

      {/* 3. CSS Styles */}
      <style jsx>{`
        /* --- SCREEN STYLES (Normal Webpage View) --- */
        .container {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background-color: #f4f4f9;
          min-height: 100vh;
        }

        .controls {
          margin-bottom: 20px;
          text-align: center;
        }

        .print-btn {
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
          font-weight: bold;
        }

        .hint {
          font-size: 0.8rem;
          color: #666;
          margin-top: 5px;
        }

        /* The Card appearance on Screen */
        .id-card {
          width: 350px; /* Normal preview width */
          height: 500px; /* Normal preview height */
          background: white;
          border-radius: 10px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
          border: 1px solid #ddd;
          display: flex;
          flex-direction: column;
        }

        /* --- CARD INTERNAL STYLES --- */
        .card-header {
          background: #0070f3;
          color: white;
          padding: 15px;
          text-align: center;
        }
        
        .card-body {
          flex: 1;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .photo-placeholder {
          width: 120px;
          height: 120px;
          background-color: #e0e0e0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 15px;
          border: 3px solid white;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .badge {
          background: #eef2ff;
          color: #0070f3;
          padding: 4px 12px;
          border-radius: 15px;
          font-size: 0.9rem;
          font-weight: bold;
          margin: 5px 0;
          display: inline-block;
        }

        .qr-code-mock {
          margin-top: auto;
          font-family: monospace;
          letter-spacing: 2px;
          color: #333;
        }

        .card-footer {
          border-top: 1px dashed #ccc;
          padding: 10px;
          text-align: center;
          font-size: 0.8rem;
          color: #555;
        }

        /* --- PRINT CONFIGURATION (The Magic Part) --- */
        @media print {
          /* 1. Page Setup */
          @page {
            size: A4;
            margin: 0; /* Important: removes browser headers/footers */
          }

          /* 2. Hide Web Elements */
          .controls, header, footer, nav {
            display: none !important;
          }

          .container {
            background: white;
            padding: 0;
            margin: 0;
            height: 100vh; /* Full page height */
            width: 100vw;
            display: flex;     /* Use Flexbox */
            align-items: center; /* Vertical Center */
            justify-content: center; /* Horizontal Center */
          }

          .print-area {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          /* 3. Card Sizing for "Half A4" (A5) */
          .id-card {
            /* A5 Dimensions */
            width: 148mm; 
            height: 210mm;
            
            /* Remove screen specific styles */
            box-shadow: none;
            border: 1px solid #000; /* Solid border for cutting */
            border-radius: 0; /* Optional: remove radius for easier cutting */
          }
          
          /* Adjust internal font sizes for the larger print */
          .card-header h3 { font-size: 24pt; }
          .details h2 { font-size: 32pt; }
          .badge { font-size: 14pt; padding: 8px 20px; }
          .id-number { font-size: 16pt; }
          .photo-placeholder { width: 40mm; height: 40mm; }
        }
      `}</style>
    </div>
  );
};

export default PrintableIdCard;