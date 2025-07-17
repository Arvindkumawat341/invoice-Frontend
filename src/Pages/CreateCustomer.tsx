import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../lib/constant.ts"
import { toast, ToastContainer } from "react-toastify";
import { useLocation } from "react-router-dom";

function CreateCustomer() {
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

    const [errors, setErrors] = useState({
        panNo: "",
        gstNo: "",
        cinNo: ""
    });

    const validatePAN = (pan: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/i.test(pan);
    const validateGST = (gst: string) => /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i.test(gst);
    const validateCIN = (cin: string) => /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/i.test(cin);


    const navigate = useNavigate();

    const location = useLocation();
    const fromPage = location.state?.from || "invoice";

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseURL}/createcustomer`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(customer),
            });

            const result = await response.json();

            if (response.ok) {
                setCustomer({
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
                toast.success("Customer created successfully!");

                // Redirect based on source
                if (fromPage === "invoice") {
                    navigate("/create-invoice");
                } else {
                    navigate("/customer");
                }

            } else {
                toast.error("Submit failed : " + result.message);
            }
        } catch (error) {
            console.error("Error", error);
            alert("Error in catch");
        }
    };


    return (
        <div className="">
            <div className="bg-white w-full md:w-[60%]  border mt-0 md:mt-5 rounded-xl shadow-ms mx-auto ms:mx-0">
                <h1 className="bg-[#1D3557] rounded-t-lg text-xl md:text-2xl  font-bold mb-4 text-center text-white border-b py-4">Create Customer</h1>
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
                            <label htmlFor="State" className="block text-gray-700 text-sm font-medium">
                                State
                                <span className="text-red-600">*</span>
                            </label>
                            <input
                                type="text"
                                id="state"
                                value={customer.state}
                                onChange={(e) =>
                                    setCustomer({ ...customer, state: e.target.value })
                                }
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
                        
                    </div>
                    <div className="mt-4">
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

                    <div className="mt-4">
                        <label htmlFor="Contact" className="block text-gray-700 text-sm font-medium ">
                            Contact
                            <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="tel"
                            id="Contact"
                            value={customer.contact}
                            onChange={(e) => {
                                let value = e.target.value;

                                value = value.replace(/[^\d]/g, "");

                                if (value.startsWith("91")) value = value.slice(2);

                                value = value.slice(0, 10);

                                let formatted = value;
                                if (value.length > 5) {
                                    formatted = `${value.slice(0, 5)}-${value.slice(5)}`;
                                }
                                setCustomer({ ...customer, contact: `+91 ${formatted}` });
                            }}
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
                                    onChange={(e) => setCustomer({ ...customer, cinNo: e.target.value.toUpperCase() })}
                                    onBlur={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            cinNo: customer.cinNo && !validateCIN(customer.cinNo) ? "Invalid CIN format" : "",
                                        }))
                                    }
                                    placeholder="Enter CIN"
                                    className={`w-full px-4 py-2 border ${errors.cinNo ? "border-red-500" : "border-gray-300"} rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400`}
                                />
                                {errors.cinNo && <p className="text-red-500 text-sm mt-1">{errors.cinNo}</p>}

                            </div>
                            <div className="w-full md:w-full">
                                <label htmlFor="gstNo" className="block text-gray-700 text-sm font-medium">
                                    GST No.
                                </label>
                                <input
                                    type="text"
                                    id="gstNo"
                                    value={customer.gstNo}
                                    onChange={(e) => setCustomer({ ...customer, gstNo: e.target.value.toUpperCase() })}
                                    onBlur={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            gstNo: customer.gstNo && !validateGST(customer.gstNo) ? "Invalid GST format" : "",
                                        }))
                                    }
                                    placeholder="Enter GST"
                                    className={`w-full px-4 py-2 border ${errors.gstNo ? "border-red-500" : "border-gray-300"} rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400`}
                                />
                                {errors.gstNo && <p className="text-red-500 text-sm mt-1">{errors.gstNo}</p>}

                            </div>
                            <div className="w-full md:w-full">
                                <label htmlFor="panNo" className="block text-gray-700 text-sm font-medium">
                                    PAN No.
                                </label>
                                <input
                                    type="text"
                                    id="panNo"
                                    value={customer.panNo}
                                    onChange={(e) => setCustomer({ ...customer, panNo: e.target.value.toUpperCase() })}
                                    onBlur={() =>
                                        setErrors((prev) => ({
                                            ...prev,
                                            panNo: customer.panNo && !validatePAN(customer.panNo) ? "Invalid PAN format" : "",
                                        }))
                                    }
                                    placeholder="Enter PAN"
                                    className={`w-full px-4 py-2 border ${errors.panNo ? "border-red-500" : "border-gray-300"} rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400`}
                                />
                                {errors.panNo && <p className="text-red-500 text-sm mt-1">{errors.panNo}</p>}

                            </div>
                        </div>
                    )}

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="px-4 py-2 w-full bg-[#1D3557] text-white text-sm rounded-full hover:bg-gray-800"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreateCustomer;