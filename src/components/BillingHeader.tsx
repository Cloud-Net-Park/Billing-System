import React from 'react';
import { Phone } from 'lucide-react';

const BillingHeader: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-billing-primary to-billing-secondary text-white p-4 md:p-6 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/10 p-2.5 rounded-full backdrop-blur-sm">
              <img
                src="/CNP.jpg" // Reference image from the public folder
                alt="CNP Logo"
                className="h-7 w-7 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Bill</h1>
              <p className="text-xs text-white/90">by Cloud Net Park</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20 shadow-inner">
            <Phone size={18} />
            <span className="text-sm font-medium hidden sm:inline">Billing Generator</span>
            <span className="text-sm font-medium sm:hidden">WhatsApp</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingHeader;
