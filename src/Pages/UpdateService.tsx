import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../lib/constant.ts";
import { toast, ToastContainer } from "react-toastify";

function UpdateService() {
    const [service, setService] = useState({
        itemId: "",
        itemName: "",
        description: "",
        price: "",
        gstPercentage: "",
        total: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        const fetchService = async () => {
            try {
                const response = await fetch(`${baseURL}/getservice/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setService(data);
                } else {
                    toast.error("Failed to fetch service data.");
                }
            } catch (error) {
                toast.error("Error fetching service data.");
            }
        };
        fetchService();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/updateservice/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(service),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Service updated successfully!");
                navigate("/service");
            } else {
                toast.error(result.message || "Failed to update service.");
            }
        } catch (error) {
            toast.error("Error updating service.");
        }
    };


    const calculateTotal = (price: string, gstPercentage: string) => {
        const cleanedGstPercentage = gstPercentage.replace('%', '');
        const priceValue = parseFloat(price) || 0;
        const gstValue = parseFloat(cleanedGstPercentage) || 0;
        const total = priceValue + (priceValue * gstValue) / 100;
        setService((prevService) => ({ ...prevService, total: total.toFixed(2) }));
    };

    return (
        <div className="container mx-auto px-0 py-0 sm:px-6 lg:px-8">
            <div className="bg-white w-full max-w-2xl mx-auto border border-gray-200 rounded-xl shadow-lg">
                {/* Form Header */}
                <h1 className="bg-[#1D3557] rounded-t-lg text-xl sm:text-2xl text-white border-b border-gray-700 py-4 font-bold mb-4 text-center">
                    Update Service
                </h1>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-2 md:space-y-4">
                    {/* Item ID */}
                    <div>
                        <label htmlFor="itemId" className="block text-gray-700 font-medium text-sm mb-1">
                            Item ID
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="itemId"
                            value={service.itemId}
                            onChange={(e) => setService({ ...service, itemId: e.target.value })}
                            placeholder="Enter item ID"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Item Name */}
                    <div>
                        <label htmlFor="itemName" className="block text-gray-700 font-medium text-sm mb-1">
                            Item Name
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="itemName"
                            value={service.itemName}
                            onChange={(e) => setService({ ...service, itemName: e.target.value })}
                            placeholder="Enter item name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-gray-700 font-medium text-sm mb-1">
                            Description
                        </label>
                        <textarea // Changed to textarea for potentially longer descriptions
                            id="description"
                            value={service.description}
                            onChange={(e) => setService({ ...service, description: e.target.value })}
                            placeholder="Enter description"
                            rows={3} // Added rows for better multi-line input experience
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base resize-y"
                        ></textarea>
                    </div>

                    {/* Price and GST Percentage (flex container) */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Price */}
                        <div className="w-full sm:w-2/3"> {/* Adjusted width for better ratio on sm+ screens */}
                            <label htmlFor="price" className="block text-gray-700 font-medium text-sm mb-1">
                                Price
                                <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="number"
                                id="price"
                                value={service.price}
                                onChange={(e) => {
                                    const updatedPrice = e.target.value;
                                    setService({ ...service, price: updatedPrice });
                                    calculateTotal(updatedPrice, service.gstPercentage);
                                }}
                                placeholder="Enter price"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                required
                            />
                        </div>

                        {/* GST Percentage */}
                        <div className="w-full sm:w-1/3"> {/* Adjusted width for better ratio on sm+ screens */}
                            <label htmlFor="gstPercentage" className="block text-gray-700 font-medium text-sm mb-1">
                                GST Percentage
                                <span className="text-red-600">*</span>
                            </label>
                            <select
                                id="gstPercentage"
                                value={service.gstPercentage || ""}
                                onChange={(e) => {
                                    const updatedGstPercentage = e.target.value;
                                    setService({ ...service, gstPercentage: updatedGstPercentage });
                                    calculateTotal(service.price, updatedGstPercentage);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                                required
                            >
                                <option value="">Select GST %</option>
                                <option value="0">0%</option> {/* Changed value to number for easier calculation */}
                                <option value="5">5%</option>
                                <option value="12">12%</option>
                                <option value="18">18%</option>
                                <option value="28">28%</option>
                            </select>
                        </div>
                    </div>

                    {/* Total */}
                    <div>
                        <label htmlFor="total" className="block text-gray-700 font-medium text-sm mb-1">
                            Total Amount
                        </label>
                        <input
                            type="text" // Changed type to text as it's readOnly and can show formatted currency
                            id="total"
                            value={service.total ? `₹${service.total}` : ''} // Display with currency symbol
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800 cursor-not-allowed focus:outline-none text-sm sm:text-base"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="mt-2">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-[#1D3557] text-white text-sm font-semibold rounded-md hover:bg-[#2A4D7C] focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200 mt-2"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateService;