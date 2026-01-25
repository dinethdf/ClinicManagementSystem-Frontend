'use client'

import React, { useRef } from 'react';

export default function PrintBillComponent() {
  const printRef = useRef(null);

  // Sample bill data - you can replace this with your actual data
  const billData = {
    invoiceNo: 'INV-2024-001',
    date: new Date().toLocaleDateString(),
    customerName: 'John Doe',
    customerAddress: '123 Main Street, City, State 12345',
    items: [
      { name: 'Product A', quantity: 2, price: 50.00 },
      { name: 'Product B', quantity: 1, price: 75.00 },
      { name: 'Service C', quantity: 3, price: 30.00 },
    ]
  };

  const subtotal = billData.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handlePrint = () => {
    console.log('Print button clicked!'); // Debug log
    
    // Create complete HTML page as string
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Bill - ${billData.invoiceNo}</title>
        <style>
          @media print {
            @page {
              size: 80mm auto;
              margin: 5mm;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Courier New', monospace;
            font-size: 12px;
            line-height: 1.4;
            color: #000;
            max-width: 80mm;
            margin: 0 auto;
            padding: 10px;
            background: #fff;
          }
          
          .bill-header {
            text-align: center;
            margin-bottom: 15px;
            border-bottom: 2px dashed #000;
            padding-bottom: 10px;
          }
          
          .bill-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          
          .bill-info {
            margin-bottom: 15px;
            font-size: 11px;
          }
          
          .bill-info div {
            margin-bottom: 3px;
          }
          
          .items-table {
            width: 100%;
            margin-bottom: 15px;
            border-collapse: collapse;
          }
          
          .items-table th {
            border-bottom: 1px solid #000;
            padding: 5px 0;
            text-align: left;
            font-weight: bold;
          }
          
          .items-table td {
            padding: 5px 0;
            border-bottom: 1px dashed #ccc;
          }
          
          .text-right {
            text-align: right;
          }
          
          .totals {
            margin-top: 15px;
            border-top: 2px solid #000;
            padding-top: 10px;
          }
          
          .totals-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          
          .total-line {
            font-weight: bold;
            font-size: 14px;
            border-top: 2px solid #000;
            padding-top: 8px;
            margin-top: 8px;
          }
          
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px dashed #000;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="bill-header">
          <div class="bill-title">YOUR STORE NAME</div>
          <div style="font-size: 10px;">123 Business Street, City, State 12345</div>
          <div style="font-size: 10px;">Tel: (123) 456-7890</div>
        </div>

        <div class="bill-info">
          <div><strong>Invoice:</strong> ${billData.invoiceNo}</div>
          <div><strong>Date:</strong> ${billData.date}</div>
          <div><strong>Customer:</strong> ${billData.customerName}</div>
          <div style="font-size: 10px;">${billData.customerAddress}</div>
        </div>

        <table class="items-table">
          <thead>
            <tr>
              <th>Item</th>
              <th class="text-right">Qty</th>
              <th class="text-right">Price</th>
              <th class="text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            ${billData.items.map(item => `
              <tr>
                <td>${item.name}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.price.toFixed(2)}</td>
                <td class="text-right">${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div class="totals-row">
            <span>Tax (10%):</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div class="totals-row total-line">
            <span>TOTAL:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="footer">
          <div>Thank you for your business!</div>
          <div>Visit us again</div>
        </div>

        <script>
          // Auto print when page loads
          window.onload = function() {
            window.print();
          };
          
          // Auto close after printing (industry standard)
          window.onafterprint = function() {
            window.close();
          };
          
          // Fallback: close if user cancels print (for some browsers)
          setTimeout(function() {
            if (!window.matchMedia('print').matches) {
              // User likely cancelled, close after 1 second
              setTimeout(function() {
                window.close();
              }, 1000);
            }
          }, 100);
        </script>
      </body>
      </html>
    `;

    // Open new window with the HTML content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to print the bill');
      return;
    }
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Bill Preview</h1>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🖨️ Print Bill
            </button>
          </div>

          {/* Print Preview */}
          <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
            <div ref={printRef}>
              <div className="bill-header">
                <div className="bill-title">YOUR STORE NAME</div>
                <div style={{ fontSize: '10px' }}>123 Business Street, City, State 12345</div>
                <div style={{ fontSize: '10px' }}>Tel: (123) 456-7890</div>
              </div>

              <div className="bill-info">
                <div><strong>Invoice:</strong> {billData.invoiceNo}</div>
                <div><strong>Date:</strong> {billData.date}</div>
                <div><strong>Customer:</strong> {billData.customerName}</div>
                <div style={{ fontSize: '10px' }}>{billData.customerAddress}</div>
              </div>

              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {billData.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">${item.price.toFixed(2)}</td>
                      <td className="text-right">${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="totals">
                <div>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div>
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="total-line">
                  <span>TOTAL:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="footer">
                <div>Thank you for your business!</div>
                <div>Visit us again</div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">How to use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Click "Print Bill" to open the print dialog</li>
            <li>• The bill is formatted for small width (80mm thermal printer)</li>
            <li>• Height adjusts automatically based on content</li>
            <li>• Customize billData object with your actual data</li>
            <li>• Modify CSS in handlePrint function to change styling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}