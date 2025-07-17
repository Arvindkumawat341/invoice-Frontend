import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../lib/constant.ts"
import { toast, ToastContainer } from "react-toastify";

function UpdateCustomer() {
    const [isFirm, setIsFirm] = useState(false);
    const [customer, setCustomer] = useState({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        state: "",
        country: "India",
        contact: "",
        description: "",
        firmname: "",
        cinNo: "",
        gstNo: "",
        panNo: "",
    });
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (!id) return;
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`${baseURL}/getcustomer/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setCustomer(data);
                    setIsFirm(!!data.firmname);
                }
            } catch (error) {
                toast.error("Failed to fetch customer data");
            }
        };
        fetchCustomer();
    }, [id]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/updatecustomer/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            });

            const result = await response.json();

            if (response.ok) {
                toast.success("Customer updated successfully!");
                navigate("/customer");
            } else {
                toast.error("Update failed: " + result.message);
            }
        } catch (error) {
            console.error("Error", error);
            toast.error("Error updating customer.");
        }
    };


    return (
        <div className="">
            <div className="bg-white w-full md:w-[60%]  border mt-5 rounded-xl shadow-ms mx-auto ms:mx-0">
                <h1 className="bg-[#1D3557] rounded-t-lg text-xl md:text-2xl  font-bold mb-4 text-center text-white border-b py-4">Update Customer</h1>
                <form onSubmit={handleSubmit} className="p-4 md:p-8">
                    <div className="mb-4">
                        <label htmlFor="Name" className="block text-gray-700 text-sm font-medium">
                            Name
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="Name"
                            value={customer.name}
                            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            placeholder="Enter name"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="Address" className="block text-gray-700 text-sm font-medium">
                            Address
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="Address"
                            value={customer.address}
                            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                            placeholder="Enter address"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="w-full md:w-1/3">
                            <label htmlFor="city" className="block text-gray-700 text-sm font-medium">
                                City
                                <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="city"
                                value={customer.city}
                                onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                                placeholder="Enter city"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label htmlFor="state" className="block text-gray-700 text-sm font-medium">
                                State
                                <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={customer.state}
                                onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
                                placeholder="Enter state"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label htmlFor="postalcode" className="block text-gray-700 text-sm font-medium">
                                Postal Code
                                <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="postalcode"
                                value={customer.postalCode}
                                onChange={(e) =>
                                    setCustomer({ ...customer, postalCode: e.target.value })
                                }
                                placeholder="Enter postal code"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/3">
                            <label htmlFor="country" className="block text-gray-700 text-sm font-medium">
                                Country
                                <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="country"
                                value={customer.country}
                                onChange={(e) => setCustomer({ ...customer, country: e.target.value })}
                                placeholder="Enter country"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="Contact" className="block text-gray-700 text-sm font-medium">
                            Contact
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            id="Contact"
                            value={customer.contact}
                            onChange={(e) => setCustomer({ ...customer, contact: e.target.value })}
                            placeholder="Enter contact"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <label htmlFor="description" className="block text-gray-700 text-sm font-medium">
                            Description
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={customer.description}
                            onChange={(e) =>
                                setCustomer({ ...customer, description: e.target.value })
                            }
                            placeholder="Enter description"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                        />
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                        <label htmlFor="ifFirm" className="block text-gray-700 text-sm font-medium">
                            If any firm of customer?
                        </label>
                        <input
                            type="checkbox"
                            className="mr-2 w-4 h-4"
                            onChange={(e) => setIsFirm(e.target.checked)}
                        />
                    </div>

                    {isFirm && (
                        <div className="flex flex-wrap gap-4 mt-4">
                            <div className="w-full md:w-full">
                                <label htmlFor="firmname" className="block text-gray-700 text-sm font-medium">
                                    Firm Name
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firmname"
                                    value={customer.firmname}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, firmname: e.target.value })
                                    }
                                    placeholder="Enter firm name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-full">
                                <label htmlFor="cinNo" className="block text-gray-700 text-sm font-medium">
                                    CIN No.
                                    <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="cinNo"
                                    value={customer.cinNo}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, cinNo: e.target.value })
                                    }
                                    placeholder="Enter CIN"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                    required
                                />
                            </div>
                            <div className="w-full md:w-full">
                                <label htmlFor="gstNo" className="block text-gray-700 text-sm font-medium">
                                    GST No.
                                </label>
                                <input
                                    type="text"
                                    id="gstNo"
                                    value={customer.gstNo}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, gstNo: e.target.value })
                                    }
                                    placeholder="Enter GST"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                            <div className="w-full md:w-full">
                                <label htmlFor="panNo" className="block text-gray-700 text-sm font-medium">
                                    PAN No.
                                </label>
                                <input
                                    type="text"
                                    id="panNo"
                                    value={customer.panNo}
                                    onChange={(e) =>
                                        setCustomer({ ...customer, panNo: e.target.value })
                                    }
                                    placeholder="Enter PAN"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 w-full bg-[#1D3557] text-white text-sm rounded-md hover:bg-gray-600"
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

export default UpdateCustomer;