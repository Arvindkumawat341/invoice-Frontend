import React from 'react';

interface pdfTemplateProps {
  state: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    state:string;
    contact: string;
    description: string;
    firmname: string;
    cinNo: string;
    gstNo: string;
    panNo: string;
    item: {
      itemName: string;
      description: string;
      price: string;
      quantity: string;
      amount: string;
      discount: string;
    }[];
    total: string;
    invoiceNumber: string;
  };
  
}

const PdfTemplate: React.FC<pdfTemplateProps> = ({ state }) => {
  
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 font-sans text-sm">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Sunil Sharma</h1>
          <p className="text-gray-600">(Advocate)</p>
          <p className="text-gray-600 mt-2">Rajasthan High Court</p>
          <p className="text-gray-600">7 JHA 29, Jawahar Nagar, Jaipur (Raj)</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Mobile: 98280-56366, 98285-56366</p>
          <p className="text-gray-600">Email: adv.SharmaSunil@gmail.com</p>
          <p className="text-gray-600">PAN: ACZPS7376Q</p>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
          <p className="text-gray-600">MR./MRS./MS: {state.name}</p>
          <p className="text-gray-600">M/S: {state.firmname || "N/A"}</p>
          <p className="text-gray-600">
            Address: {state.address}, {state.city},{state.state}, {state.postalCode}, {state.country}, 
          </p>
          <p className="text-gray-600">Contact: {state.contact}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Invoice #: {state.invoiceNumber}</p>
          <p className="text-gray-600">Date: {formattedDate}</p>
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <p className="text-gray-600 mb-4">
          The list below details the services or products provided. You can edit the description, quantity, and unit price for each item. The totals will update automatically.
        </p>

        {/* Table Header */}
        <div className="grid grid-cols-6 gap-4 bg-gray-50 p-3 font-semibold border-b">
          <div>No.</div>
          <div className="col-span-2">DESCRIPTION</div>
          <div className="text-center">QTY</div>
          <div className="text-center">DISC%</div>
          <div className="text-right">AMOUNT</div>
        </div>

        {/* Items Rows */}
        {state.item.map((i, index) => (
          <div key={index} className="grid grid-cols-6 gap-4 p-3 border-b border-gray-200 min-h-[40px]">
            <div className="text-gray-400">{index + 1}</div>
            <div className="col-span-2">{i.itemName}</div>
            <div className="text-center">{i.quantity}</div>
            <div className="text-center">{i.discount}</div>
            <div className="text-center">{i.amount}</div>
          </div>
        ))}
      </div>

      {/* Totals Section */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="text-center font-semibold text-lg mb-4">Invoice Total</div>
          <div className="flex justify-between py-2 border-b">
            <span>Total</span>
            <span>{state.total}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Tax Amount</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between py-3 font-bold text-lg border-t-2 border-gray-800">
            <span>Total</span>
            <span>{state.total}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end">
        <div>
          <h4 className="font-semibold mb-2">Banking Details:</h4>
          <p className="text-gray-600">State Bank of India</p>
          <p className="text-gray-600">Acc: 537500000289</p>
          <p className="text-gray-600">IFSC: SBIN0020671</p>
        </div>
        <div className="text-right">
          <p className="font-semibold">Authorized Signature</p>
          <div className="mt-8 border-b border-gray-400 w-48"></div>
          <p className="text-gray-600 mt-2">Sunil Sharma (Advocate)</p>
        </div>
      </div>
    </div>
  );
};

export default PdfTemplate;
