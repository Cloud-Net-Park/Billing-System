
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;
}

export interface BillingData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerEmail: string;
  billNumber: string;
  billDate: string;
  dueDate: string;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes: string;
  whatsappNumber: string;
  logoUrl: string;
}

interface BillingContextType {
  billingData: BillingData;
  setBillingData: React.Dispatch<React.SetStateAction<BillingData>>;
  updateLineItem: (id: string, field: string, value: string | number) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  calculateTotals: () => void;
  sendToWhatsapp: () => void;
}

const defaultBillingData: BillingData = {
  businessName: 'Cloud Net Park',
  businessAddress: '',
  businessPhone: '',
  businessEmail: '',
  customerName: '',
  customerAddress: '',
  customerPhone: '',
  customerEmail: '',
  billNumber: '',
  billDate: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  items: [
    {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
      amount: 0
    }
  ],
  subtotal: 0,
  tax: 0,
  total: 0,
  notes: '',
  whatsappNumber: '',
  logoUrl: ''
};

export const BillingContext = createContext<BillingContextType>({
  billingData: defaultBillingData,
  setBillingData: () => {},
  updateLineItem: () => {},
  addLineItem: () => {},
  removeLineItem: () => {},
  calculateTotals: () => {},
  sendToWhatsapp: () => {}
});

export const useBillingContext = () => useContext(BillingContext);

export const BillingProvider = ({ children }: { children: ReactNode }) => {
  const [billingData, setBillingData] = useState<BillingData>(defaultBillingData);

  const updateLineItem = (id: string, field: string, value: string | number) => {
    setBillingData(prev => {
      const updatedItems = prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          
          if (field === 'quantity' || field === 'price') {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.price);
          }
          
          return updatedItem;
        }
        return item;
      });
      
      return { ...prev, items: updatedItems };
    });
  };

  const addLineItem = () => {
    const newItem: LineItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      price: 0,
      amount: 0
    };
    
    setBillingData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeLineItem = (id: string) => {
    setBillingData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  const calculateTotals = () => {
    setBillingData(prev => {
      const subtotal = prev.items.reduce((sum, item) => sum + item.amount, 0);
      const tax = subtotal * 0.18;
      const total = subtotal + tax;
      
      return {
        ...prev,
        subtotal,
        tax,
        total
      };
    });
  };

  const sendToWhatsapp = () => {
    if (!billingData.whatsappNumber) return;
    
    const message = `
*INVOICE FROM ${billingData.businessName || 'Cloud Net Park'}*
Invoice #: ${billingData.billNumber}
Date: ${billingData.billDate}

*To:* ${billingData.customerName}
*Amount Due:* ₹${billingData.total.toFixed(2)}
*Due Date:* ${billingData.dueDate}

*Items:*
${billingData.items.map(item => 
  `- ${item.description}: ${item.quantity} x ₹${item.price.toFixed(2)} = ₹${item.amount.toFixed(2)}`
).join('\n')}

*Subtotal:* ₹${billingData.subtotal.toFixed(2)}
*Tax:* ₹${billingData.tax.toFixed(2)}
*Total:* ₹${billingData.total.toFixed(2)}

${billingData.notes ? `*Notes:* ${billingData.notes}` : ''}
    `;
    
    let formattedNumber = billingData.whatsappNumber.trim();
    formattedNumber = formattedNumber.replace(/\D/g, '');
    if (formattedNumber.startsWith('+')) {
      formattedNumber = formattedNumber.substring(1);
    }
    
    const whatsappUrl = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <BillingContext.Provider
      value={{
        billingData,
        setBillingData,
        updateLineItem,
        addLineItem,
        removeLineItem,
        calculateTotals,
        sendToWhatsapp
      }}
    >
      {children}
    </BillingContext.Provider>
  );
};
