import React from "react";

interface Item {
    itemName: string;
    itemDescription: string;
    quantity: string;
    price: string;
    discount: string;
    amount: string;
}

interface StatusModalProps {
    isOpen: boolean;
    onClose: () => void;
    invoiceId: string;
    totalAmount: string;
    items: Item[];
}

const StatusModal: React.FC<StatusModalProps> = ({ isOpen, onClose, invoiceId, items, totalAmount }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">Invoice #{invoiceId}</h2>
                <p className="text-sm text-gray-600 mb-4">
                    This invoice is currently <strong className="text-red-500">Unpaid</strong>. See item details below.
                </p>

                <table className="w-full text-xs mb-4">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="py-1">Item</th>
                            <th className="py-1">Qty</th>
                            <th className="py-1">Price</th>
                            <th className="py-1">Disc.</th>
                            <th className="py-1">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, idx) => (
                            <tr key={idx} className="border-b">
                                <td className="py-1">{item.itemName}</td>
                                <td className="py-1">{item.quantity}</td>
                                <td className="py-1">₹{item.price}</td>
                                <td className="py-1">{item.discount}%</td>
                                <td className="py-1">₹{item.amount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end items-center pt-2 gap-2 mb-4">
                    <span className="text-sm font-medium">Total Amount:</span>
                    <span className="text-sm font-semibold text-black">₹{totalAmount}</span>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 text-sm bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusModal;
