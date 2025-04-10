import React, { useEffect } from 'react';
import { useBillingContext } from '@/context/BillingContext';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, Calculator, Send, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const BillingForm: React.FC = () => {
  const {
    billingData,
    setBillingData,
    updateLineItem,
    addLineItem,
    removeLineItem,
    calculateTotals,
    sendToWhatsapp
  } = useBillingContext();

  const { toast } = useToast();

  useEffect(() => {
    calculateTotals();
  }, [billingData.items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBillingData(prev => ({ ...prev, [name]: value }));
  };

  const isValidWhatsAppNumber = (number: string) => {
    const cleaned = number.replace(/\D/g, '');
    return cleaned.length >= 10;
  };

  const handleSendToWhatsapp = () => {
    if (!billingData.whatsappNumber) {
      toast({
        title: "Missing WhatsApp Number",
        description: "Please enter the customer's WhatsApp number",
        variant: "destructive"
      });
      return;
    }

    if (!isValidWhatsAppNumber(billingData.whatsappNumber)) {
      toast({
        title: "Invalid WhatsApp Number",
        description: "Please enter a valid WhatsApp number with country code",
        variant: "destructive"
      });
      return;
    }

    if (!billingData.customerName || !billingData.billNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in customer name and bill number",
        variant: "destructive"
      });
      return;
    }

    if (billingData.items.length === 0 || billingData.items.some(item => !item.description)) {
      toast({
        title: "Invalid Items",
        description: "Please add at least one item with a description",
        variant: "destructive"
      });
      return;
    }

    sendToWhatsapp();

    toast({
      title: "WhatsApp Opening",
      description: `Sending invoice to +${billingData.whatsappNumber.replace(/\D/g, '')}`
    });
  };

  return (
    <div className="w-full lg:w-1/2 p-4 space-y-6 animate-fade-in">
      {/* Business and Customer Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-billing-dark">Business Details</h2>
          <div>
            <label className="text-sm font-medium">Business Name</label>
            <Input name="businessName" value={billingData.businessName} onChange={handleInputChange} placeholder="Your Business Name" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Business Address</label>
            <Textarea name="businessAddress" value={billingData.businessAddress} onChange={handleInputChange} placeholder="Your Business Address" className="mt-1 resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input name="businessPhone" value={billingData.businessPhone} onChange={handleInputChange} placeholder="Business Phone" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input name="businessEmail" value={billingData.businessEmail} onChange={handleInputChange} placeholder="Business Email" className="mt-1" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Invoice Details</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Bill Number</label>
                <Input name="billNumber" value={billingData.billNumber} onChange={handleInputChange} placeholder="INV-001" className="mt-1" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Bill Date</label>
                <Input type="date" name="billDate" value={billingData.billDate} onChange={handleInputChange} className="mt-1" />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Due Date</label>
              <Input type="date" name="dueDate" value={billingData.dueDate} onChange={handleInputChange} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-billing-dark">Customer Details</h2>
          <div>
            <label className="text-sm font-medium">Customer Name</label>
            <Input name="customerName" value={billingData.customerName} onChange={handleInputChange} placeholder="Customer Name" className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Customer Address</label>
            <Textarea name="customerAddress" value={billingData.customerAddress} onChange={handleInputChange} placeholder="Customer Address" className="mt-1 resize-none" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input name="customerPhone" value={billingData.customerPhone} onChange={handleInputChange} placeholder="Customer Phone" className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input name="customerEmail" value={billingData.customerEmail} onChange={handleInputChange} placeholder="Customer Email" className="mt-1" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">WhatsApp Number</label>
            <div className="relative">
              <Input name="whatsappNumber" value={billingData.whatsappNumber} onChange={handleInputChange} placeholder="WhatsApp Number with Country Code" className="mt-1 pl-8" />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">+</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <AlertCircle size={12} className="text-amber-500" />
              Enter number with country code (e.g., 919876543210 for India)
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-billing-dark">Items</h2>
          <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={addLineItem}>
            <Plus size={16} /> Add Item
          </Button>
        </div>

        <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
          {billingData.items.map((item, index) => (
            <div key={item.id} className="grid grid-cols-13 gap-2 items-center border-b pb-2">
              <div className="col-span-1 text-center font-medium">{index + 1}</div>

              <div className="col-span-5">
                <Input value={item.description} onChange={(e) => updateLineItem(item.id, 'description', e.target.value)} placeholder="Item Description" />
              </div>

              <div className="col-span-2">
                <Input type="number" value={item.quantity} onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} placeholder="Qty" min="1" />
              </div>

              <div className="col-span-2">
                <Input type="number" value={item.price} onChange={(e) => updateLineItem(item.id, 'price', parseFloat(e.target.value) || 0)} placeholder="Price" min="0" />
              </div>

              <div className="col-span-2">
                <Input value={item.amount.toFixed(2)} readOnly className="bg-muted" />
              </div>

              <div className="col-span-1 flex justify-end">
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeLineItem(item.id)}>
                  <Trash2 size={16} className="text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="flex justify-end space-x-4 text-sm mt-3">
          <div className="space-y-2">
            <div className="flex justify-between gap-4">
              <span>Subtotal:</span>
              <span>₹{billingData.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Tax (18%):</span>
              <span>₹{billingData.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between gap-4 font-semibold">
              <span>Total:</span>
              <span>₹{billingData.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Send Invoice Button */}
      <div className="flex justify-end mt-6">
        <Button className="flex items-center gap-2" onClick={handleSendToWhatsapp}>
          <Send size={16} /> Send Invoice via WhatsApp
        </Button>
      </div>
    </div>
  );
};

export default BillingForm;
