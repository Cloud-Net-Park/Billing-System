import React from 'react';
import { useBillingContext } from '@/context/BillingContext';
import { format } from 'date-fns';
import { ImageOff } from 'lucide-react';
import { numberToWords } from '@/lib/numberToWords';

const BillingPreview: React.FC = () => {
  const { billingData } = useBillingContext();
  const companyName = "Cloud Net Park";

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch {
      return dateString;
    }
  };

  return (
    <div className="w-full lg:w-1/2 p-4 animate-fade-in">
      <div className="billing-template bg-white">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-start gap-3">
            {/* Using your custom image from the public folder */}
            <img 
              src="/CNP.jpg"  // Reference image in the public folder
              alt="Business Logo"
              className="w-16 h-16 object-contain rounded-md shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const div = document.createElement('div');
                  div.className = 'w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center shadow-inner';
                  div.innerHTML = '<svg class="w-10 h-10 text-gray-400" viewBox="0 0 24 24"><path fill="currentColor" d="M20 5H4V19H20V5ZM4 3C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H20C21.1 21 22 20.1 22 19V5C22 3.9 21.1 3 20 3H4ZM17.2 15L14.2 11L11.5 14.5L9.8 12.3L6.8 16H17.2Z"></path></svg>';
                  parent.prepend(div);
                }
              }}
            />
            <div>
              <h1 className="text-2xl font-bold text-billing-primary mb-1">{companyName}</h1>
              <p className="text-sm whitespace-pre-line">{billingData.businessAddress || 'Your Business Address'}</p>
              <p className="text-sm">{billingData.businessPhone || 'Phone'}</p>
              <p className="text-sm">{billingData.businessEmail || 'Email'}</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-billing-secondary bg-billing-light inline-block px-4 py-1 rounded-md">INVOICE</h2>
            <p className="text-sm mt-1"><span className="font-medium">Invoice #:</span> {billingData.billNumber || 'INV-001'}</p>
            <p className="text-sm"><span className="font-medium">Date:</span> {formatDate(billingData.billDate)}</p>
            <p className="text-sm"><span className="font-medium">Due Date:</span> {formatDate(billingData.dueDate)}</p>
          </div>
        </div>

        <hr className="my-6 border-gray-200" />

        <div className="grid grid-cols-2 gap-8">
          <div className="bill-section bg-billing-light rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-semibold uppercase text-billing-secondary mb-2">Bill To</h3>
            <p className="font-medium">{billingData.customerName || 'Customer Name'}</p>
            <p className="text-sm whitespace-pre-line mt-1">{billingData.customerAddress || 'Customer Address'}</p>
            <p className="text-sm mt-1">{billingData.customerPhone || 'Phone'}</p>
            <p className="text-sm">{billingData.customerEmail || 'Email'}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="bill-section mt-6">
          <table className="w-full text-sm border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-billing-light">
              <tr className="border-b border-gray-300">
                <th className="py-3 px-4 text-left text-billing-secondary font-semibold">S.No</th>
                <th className="py-3 px-4 text-left text-billing-secondary font-semibold">Item</th>
                <th className="py-3 px-4 text-center text-billing-secondary font-semibold">Quantity</th>
                <th className="py-3 px-4 text-right text-billing-secondary font-semibold">Price</th>
                <th className="py-3 px-4 text-right text-billing-secondary font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {billingData.items.map((item, index) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{item.description || 'Item Description'}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">₹{item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-medium">₹{item.amount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mt-6">
          <div className="w-1/2 md:w-1/3 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between border-b border-gray-200 py-2">
              <span className="font-medium">Subtotal:</span>
              <span>₹{billingData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 py-2">
              <span className="font-medium">Tax (18%):</span>
              <span>₹{billingData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-billing-secondary">
              <span>Total:</span>
              <span>₹{billingData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Amount in words */}
        <div className="mt-6 bg-billing-light p-4 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-billing-secondary">Amount in words:</p>
          <p className="text-sm mt-1 font-medium">Rupees {numberToWords(Math.floor(billingData.total))} Only</p>
        </div>

        {/* Notes */}
        {billingData.notes && (
          <div className="bill-section mt-6 bg-gray-50 rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-sm font-semibold text-billing-secondary mb-2">Notes</h3>
            <p className="text-sm">{billingData.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 bg-billing-light py-6 px-4 rounded-lg border border-gray-100">
          <p className="text-sm text-billing-secondary font-medium">Thank you for your business!</p>
          <p className="text-xs text-gray-500 mt-2">Invoice generated by {companyName}</p>
        </div>
      </div>
    </div>
  );
};

export default BillingPreview;
// Note: The above code is a simplified version of the original code.