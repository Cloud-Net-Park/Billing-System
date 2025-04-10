
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BillingProvider } from '@/context/BillingContext';
import BillingHeader from '@/components/BillingHeader';
import BillingForm from '@/components/BillingForm';
import BillingPreview from '@/components/BillingPreview';
import { FileEdit, FileText } from 'lucide-react';

const Index = () => {
  return (
    <BillingProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <BillingHeader />
        
        <main className="flex-1 container mx-auto py-6 px-4">
          <div className="md:hidden mb-6">
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="w-full bg-white shadow-sm">
                <TabsTrigger value="edit" className="flex items-center gap-2 w-full data-[state=active]:bg-billing-light">
                  <FileEdit size={16} />
                  Edit Bill
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2 w-full data-[state=active]:bg-billing-light">
                  <FileText size={16} />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="edit" className="mt-4">
                <BillingForm />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <BillingPreview />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="hidden md:flex flex-wrap -mx-4">
            <BillingForm />
            <BillingPreview />
          </div>
        </main>
        
        <footer className="bg-white py-4 border-t">
          <div className="container mx-auto text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cloud Net Park - WhatsApp Billing Generator
          </div>
        </footer>
      </div>
    </BillingProvider>
  );
};

export default Index;
