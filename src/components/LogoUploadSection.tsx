import React, { useState, useEffect } from 'react';
import { useBillingContext } from '@/context/BillingContext';
import { Input } from '@/components/ui/input';
import { Image, AlertCircle, Check } from 'lucide-react';

const LogoUploadSection: React.FC = () => {
  const { billingData, setBillingData } = useBillingContext();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Set default logo on first render if not already set
  useEffect(() => {
    if (!billingData.logoUrl) {
      setBillingData(prev => ({
        ...prev,
        logoUrl: '/CNP.jpg', // Local image in public folder
      }));
    }
  }, [billingData.logoUrl, setBillingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBillingData(prev => ({
      ...prev,
      logoUrl: e.target.value,
    }));
    setIsValid(null);
  };

  const validateImage = (url: string) => {
    if (!url) {
      setIsValid(null);
      return;
    }

    const img = document.createElement('img');
    img.onload = () => setIsValid(true);
    img.onerror = () => setIsValid(false);
    img.src = url;
  };

  const handleBlur = () => {
    validateImage(billingData.logoUrl);
  };

  return (
    <div className="grid gap-2 mb-6">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="logoUrl" className="text-sm font-medium flex items-center gap-1.5">
          <Image size={16} className="text-billing-primary" />
          Business Logo URL
        </label>
        <div className="relative">
          <Input
            id="logoUrl"
            name="logoUrl"
            placeholder="https://example.com/your-logo.png"
            value={billingData.logoUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`h-9 pr-10 ${
              isValid === true ? 'border-green-500' : 
              isValid === false ? 'border-red-500' : ''
            }`}
          />
          {isValid === true && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {isValid === false && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          Enter a direct URL to your logo image (PNG, JPG, SVG). For local images, use `/CNP.jpg`.
        </p>
      </div>

      {billingData.logoUrl && (
        <div className="mt-2 p-3 border rounded-md bg-billing-light flex items-center justify-between shadow-sm transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md overflow-hidden bg-white flex items-center justify-center border shadow-sm">
              <img 
                src={billingData.logoUrl} 
                alt="Logo preview" 
                className="max-h-full max-w-full object-contain" 
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const element = e.currentTarget.parentElement;
                  if (element) {
                    element.innerHTML = '<div class="text-xs text-red-500 flex items-center justify-center h-full">Invalid image</div>';
                  }
                }}
              />
            </div>
            <div>
              <div className="text-xs font-medium text-billing-secondary">Logo preview</div>
              <div className="text-xs text-gray-500">Will appear on your invoice</div>
            </div>
          </div>
          <button 
            type="button" 
            className="text-xs bg-white text-red-500 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded border border-red-200 transition-colors"
            onClick={() => {
              setBillingData(prev => ({ ...prev, logoUrl: '' }));
              setIsValid(null);
            }}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoUploadSection;
