import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../lib/constant.ts";
import {  FileChartLine, MapPin, PackageSearch, Phone, Plus, Save, UserRound } from "lucide-react";
import jsPDF from "jspdf";
import PdfTemplate from "@/components/ui/PdfTemplate.tsx";
import html2canvas from "html2canvas";
import { MdDeleteOutline } from "react-icons/md";
import {  toast } from 'react-toastify';

interface Customer {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    contact: string;
    description: string;
    firmname?: string;
    cinNo?: string;
    gstNo?: string;
    panNo: string;
}

interface Item {
    _id: string;
    itemId: string;
    itemName: string;
    description: string;
    price: string;
    quantity: string;
    amount: string;
    discount: string;
    total: string;
    gstPercentage: string;
}

interface Invoice {
    id: string;
    invoiceNumber: string;
    customerId: string; // simplified for frontend
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    contact?: string;
    description?: string;
    firmname?: string;
    cinNo?: string;
    gstNo?: string;
    panNo?: string;
    items: Item[];
    totalAmount: string;
    status: string;
    overallDiscount: string;
}



function CreateInvoice() {
    const [, setActiveSection] = useState<"Name" | "item" | null>(null);
    const [customer, setCustomer] = useState<Customer[]>([]);
    const [selectcustomer, setSelectCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        if (selectcustomer) {
            setInvoice((prev) => ({
                ...prev,
                customerId: selectcustomer._id,
                name: selectcustomer.name,
                address: selectcustomer.address,
                city: selectcustomer.city,
                postalCode: selectcustomer.postalCode,
                state: selectcustomer.state,
                country: selectcustomer.country,
                contact: selectcustomer.contact,
                description: selectcustomer.description,
                firmname: selectcustomer.firmname,
                cinNo: selectcustomer.cinNo,
                gstNo: selectcustomer.gstNo,
                panNo: selectcustomer.panNo
            }));
        }
    }, [selectcustomer]);
    const [item, setItem] = useState<Item[]>([]);
    const [overallDiscount, setOverallDiscount] = useState<string>("");
    const templateRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState("");

    //Invoice
    const [invoice, setInvoice] = useState<Invoice>({
        id: "",
        customerId: "",
        items: [],
        totalAmount: "",
        status: "",
        overallDiscount: "",
        invoiceNumber: "",
    });

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchCustomer = async () => {
            try {
                const response = await fetch(`${baseURL}/getcustomer`);
                const result = await response.json();
                setCustomer(result);
            } catch (error) {
                console.error("Error fetching customers", error);
            }
        };
        fetchCustomer();
    }, []);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await fetch(`${baseURL}/getservice`);
                const result = await response.json();
                setItem(result.data);
            } catch (error) {
                console.error("Error fetching items", error);
            }
        };
        fetchItem();
    }, []);

    useEffect(() => {
        const fetchInvoiceData = async () => {
            if (!id) return;

            try {
                const res = await fetch(`${baseURL}/getinvoice/${id}`);
                const result = await res.json();

                const invoiceData = result.data;

                // Set customer from invoice
                const matchedCustomer = customer.find(c => c._id === invoiceData.customerId._id);
                if (matchedCustomer) setSelectCustomer(matchedCustomer);

                // Set invoice fields
                setInvoice({
                    ...invoice,
                    customerId: invoiceData.customerId._id,
                    invoiceNumber: invoiceData.invoiceNumber,
                    totalAmount: invoiceData.totalAmount,
                    status: invoiceData.status,
                    overallDiscount: invoiceData.overallDiscount,
                    name: invoiceData.customerId.name,
                    address: invoiceData.customerId.address,
                    city: invoiceData.customerId.city,
                    state: invoiceData.customerId.state,
                    postalCode: invoiceData.customerId.postalCode,
                    country: invoiceData.customerId.country,
                    contact: invoiceData.customerId.contact,
                    description: invoiceData.customerId.description,
                    firmname: invoiceData.customerId.firmname,
                    cinNo: invoiceData.customerId.cinNo,
                    gstNo: invoiceData.customerId.gstNo,
                    panNo: invoiceData.customerId.panNo,
                    items: invoiceData.items,
                });

                // Set items list for UI
                const populatedItems = invoiceData.items.map((item: any) => ({
                    itemId: item.itemId,
                    itemName: item.itemName,
                    itemDescription: item.description,
                    quantity: item.quantity,
                    price: item.price,
                    gstPercentage: item.gstPercentage,
                    amount: item.amount,
                    discount: item.discount,
                    total: item.total,
                }));
                setItemsList(populatedItems);
                setStatus(invoiceData.status || "");
                setOverallDiscount(invoiceData.overallDiscount || "");

            } catch (err) {
                console.error("Failed to fetch invoice:", err);
                toast.error("Failed to fetch invoice data");
            }
        };

        fetchInvoiceData();
    }, [id, customer]);

    const handleSubmit = async () => {
        const isUpdate = Boolean(id);
        const invoiceData = {
            customerId: invoice.customerId,
            items: itemsList,
            totalAmount: calculateTotal(),
            status,
            overallDiscount,
        };

        try {
            const response = await fetch(
                isUpdate ? `${baseURL}/updateinvoice/${id}` : `${baseURL}/createinvoice`,
                {
                    method: isUpdate ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(invoiceData),
                }
            );

            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                result = { message: await response.text() };
            }

            if (response.ok) {
                toast.success(isUpdate ? "Invoice Updated successfully!" : "Invoice Created successfully!");
                setTimeout(() => {
                    navigate("/");
                }, 1000);

                // Update invoice number in state if received
                if (result.invoiceNumber) {
                    setInvoice((prev) => ({
                        ...prev,
                        invoiceNumber: result.invoiceNumber,
                    }));
                }

                // Generate and download PDF (use result.invoiceNumber directly)
                const input = templateRef.current;
                if (input) {
                    // 👇 Yahan invoiceNumber backend se pass karein
                    const pdfTemplateDiv = document.createElement("div");
                    document.body.appendChild(pdfTemplateDiv);

                    // Render PdfTemplate with latest invoiceNumber
                    import("react-dom").then(ReactDOM => {
                        ReactDOM.render(
                            <PdfTemplate
                                state={{
                                    name: invoice.name || "",
                                    address: invoice.address || "",
                                    city: invoice.city || "",
                                    state: invoice.state || "",
                                    postalCode: invoice.postalCode || "",
                                    country: invoice.country || "",
                                    contact: invoice.contact || "",
                                    description: invoice.description || "",
                                    firmname: invoice.firmname || "",
                                    cinNo: invoice.cinNo || "",
                                    gstNo: invoice.gstNo || "",
                                    panNo: invoice.panNo || "",
                                    invoiceNumber: result.invoiceNumber || invoice.invoiceNumber || "",
                                    item: itemsList.map((i) => ({
                                        itemName: i.itemName,
                                        description: i.itemDescription,
                                        quantity: i.quantity,
                                        price: i.price,
                                        discount: i.discount,
                                        gstPercentage: i.gstPercentage,
                                        amount: i.amount,
                                    })),
                                    total: calculateTotal(),
                                }}
                            />,
                            pdfTemplateDiv
                        );

                        html2canvas(pdfTemplateDiv, {
                            backgroundColor: "#fff",
                            scale: 2,
                        }).then(canvas => {
                            const imgData = canvas.toDataURL("image/png");
                            const pdf = new jsPDF("p", "mm", "a4");
                            const pdfWidth = pdf.internal.pageSize.getWidth();
                            const pdfHeight = pdf.internal.pageSize.getHeight();
                            const imgProps = pdf.getImageProperties(imgData);
                            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                            let heightLeft = imgHeight;
                            let position = 0;

                            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                            heightLeft -= pdfHeight;

                            while (heightLeft > 0) {
                                position = heightLeft - imgHeight;
                                pdf.addPage();
                                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                                heightLeft -= pdfHeight;
                            }

                            pdf.save(`Invoice_${result.invoiceNumber || invoice.name}.pdf`);
                            ReactDOM.unmountComponentAtNode(pdfTemplateDiv);
                            document.body.removeChild(pdfTemplateDiv);
                        });
                    });
                }

                // Optional: redirect after download

            } else {
                console.error("Backend error:", result);
                toast.error(`Failed to ${isUpdate ? "update" : "create"} invoice: ${result.message || result}`);
            }
        } catch (error) {
            console.error("Save error:", error);
            toast.error(`Error while ${isUpdate ? "updating" : "creating"} invoice: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };


    // Generate item fields
    const [itemsList, setItemsList] = useState<
        {
            discount: string;
            itemId: string;
            itemName: string;
            itemDescription: string;
            quantity: string;
            price: string;
            gstPercentage: string;
            amount: string;
            total: string;
        }[]
    >([]);

    const handleAddNewItem = () => {
        setItemsList([
            ...itemsList,
            {
                itemId: "",
                itemName: "",
                itemDescription: "",
                quantity: "",
                price: "",
                gstPercentage: "",
                amount: "",
                discount: "",
                total: "",
            },
        ]);
    };

    const handleDelete = (index: number) => {
        const newItemsList = [...itemsList];
        newItemsList.splice(index, 1);
        setItemsList(newItemsList);
    };

    const handleItemChange = (index: number, selectedId: string) => {
        const selectedItem = item.find((i) => i._id === selectedId);
        if (selectedItem) {
            const updatedItems = [...itemsList];
            const quantity = updatedItems[index]?.quantity || "1";
            const amount = (
                parseFloat(quantity) * parseFloat(selectedItem.total)
            ).toFixed(2);

            updatedItems[index] = {
                itemId: selectedItem._id,
                itemName: selectedItem.itemName,
                itemDescription: selectedItem.description,
                quantity: quantity,
                price: selectedItem.price,
                gstPercentage: selectedItem.gstPercentage || "0", // Ensure gstPercentage is always present
                total: selectedItem.total,
                amount: amount,
                discount: updatedItems[index]?.discount || "0"
            };
            setItemsList(updatedItems);
        }
    };

    useEffect(() => {
        const updatedItems = itemsList.map((item) => {
            const quantity = parseFloat(item.quantity || "1");
            const total = parseFloat(item.total || "0");
            const itemDiscount = parseFloat(item.discount || "0");
            const overall = parseFloat(overallDiscount || "0");

            const originalPrice = quantity * total;
            const combinedDiscount = itemDiscount + overall;
            const discountAmount = (originalPrice * combinedDiscount) / 100;
            const amount = (originalPrice - discountAmount).toFixed(2);

            return {
                ...item,
                amount,
            };
        });

        setItemsList(updatedItems);
    }, [overallDiscount]);


    const handleDiscountChange = (index: number, value: string) => {
        const updatedItems = [...itemsList];
        updatedItems[index].discount = value;

        const quantity = parseFloat(updatedItems[index].quantity || "1");
        const total = parseFloat(updatedItems[index].total || "0");
        const itemDiscount = parseFloat(value || "0");
        const overall = parseFloat(overallDiscount || "0");

        const combinedDiscount = itemDiscount + overall;
        const originalPrice = quantity * total;
        const discountAmount = (originalPrice * combinedDiscount) / 100;

        updatedItems[index].amount = (originalPrice - discountAmount).toFixed(2);
        setItemsList(updatedItems);
    };


    const handleQuantityChange = (index: number, value: string) => {
        const updatedItems = [...itemsList];
        updatedItems[index].quantity = value;

        const quantity = parseFloat(value || "1");
        const total = parseFloat(updatedItems[index].total || "0");
        const itemDiscount = parseFloat(updatedItems[index].discount || "0");
        const overall = parseFloat(overallDiscount || "0");

        const combinedDiscount = itemDiscount + overall;
        const originalPrice = quantity * total;
        const discountAmount = (originalPrice * combinedDiscount) / 100;

        updatedItems[index].amount = (originalPrice - discountAmount).toFixed(2);
        setItemsList(updatedItems);
    };


    const calculateTotal = () => {
        const totalBeforeDiscount = itemsList.reduce(
            (total, item) => total + parseFloat(item.amount || "0"),
            0
        );
        return totalBeforeDiscount.toFixed(2);
    };

    return (
        <div className="">
            <h1 className="bg-[#1D3557] text-xl md:text-2xl text-white p-4 border-b rounded-lg font-bold mb-4">
                Create Invoice
            </h1>

            <div className="flex flex-col md:flex-row justify-center gap-4">
                <div className="w-full md:w-[70%]">
                    <form onSubmit={handleSubmit}>
                        <div className="border rounded-lg">
                            <div className="flex flex-col sm:flex-row border-b p-4 justify-between items-start sm:items-center gap-4 sm:gap-0">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#1D3557]/20 text-[#1D3557] p-2 rounded-full">
                                        <UserRound />
                                    </div>
                                    <div>
                                        <p className=" font-semibold text-sm md:text-lg">
                                            Customer details
                                        </p>
                                        <p className="text-sm text-gray-600">Select customer for this invoice</p>
                                    </div>

                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => navigate("/createcustomer", { state: { from: "invoice" } })}
                                        className="flex items-center gap-1 font-semibold rounded-md bg-[#1D3557] text-white border px-2.5 py-1.5 hover:bg-gray-50 text-sm"
                                    >
                                        <Plus size={15} />
                                        Create customer
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                <label htmlFor="Name" className="block text-gray-700 text-sm font-medium">
                                    Name
                                </label>
                                <select
                                    id="id"
                                    value={selectcustomer ? selectcustomer._id : ""}
                                    onChange={(e) => {
                                        const selected = customer.find((c) => c._id === e.target.value);
                                        setSelectCustomer(selected || null);
                                        setActiveSection("Name");
                                        if (selected) {
                                            setInvoice({
                                                ...invoice,
                                                name: selected.name,
                                                address: selected.address,
                                                city: selected.city,
                                                state: selected.state,
                                                postalCode: selected?.postalCode,
                                                country: selected.country,
                                                contact: selected.contact,
                                                description: selected.description,
                                                firmname: selected.firmname || "",
                                                cinNo: selected.cinNo || "",
                                                gstNo: selected.gstNo || "",
                                                panNo: selected.panNo || "",
                                            });
                                        }
                                    }}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base"
                                    required
                                >
                                    <option value="">Select Customer</option>
                                    {customer.map((data) => (
                                        <option
                                            key={data._id}
                                            value={data._id}
                                            className="max-w-14 text-sm md:text-normal"
                                        >
                                            {data.name} - {data.firmname}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="border rounded-lg mt-4">
                            <div className="flex flex-col sm:flex-row border-b p-4 justify-between items-start sm:items-center gap-4 sm:gap-0">
                                <div className="flex items-center gap-3">
                                    <div className="text-[#1D3557] bg-[#1D3557]/20 rounded-full p-2">
                                        <PackageSearch />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-lg">Item List</p>
                                        <p className="text-gray-600 text-sm">Select products & services for this invoice</p>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        onClick={() => navigate("/createservice", { state: { from: "invoice" } })}
                                        className="flex items-center gap-1 font-semibold rounded-md bg-[#1D3557] text-white border px-2.5 py-1.5 hover:bg-gray-50 text-sm"
                                    >
                                        <Plus size={15} />
                                        Create Service
                                    </button>
                                </div>
                            </div>

                            <div className="p-4">
                                {itemsList.map((invoiceItem, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4 p-3 border rounded-md bg-gray-50 items-end"
                                    >
                                        {/* Added grid layout for items */}
                                        <div className="mb-2 sm:mb-0">
                                            <label
                                                htmlFor={`itemName-${index}`}
                                                className="block text-gray-700 font-medium text-sm"
                                            >
                                                Item Name
                                            </label>
                                            <select
                                                id={`itemName-${index}`}
                                                value={invoiceItem?.itemId || ""}
                                                onChange={(e) => {
                                                    handleItemChange(index, e.target.value);
                                                    setActiveSection("item"); // Update active section for right panel
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                required
                                            >
                                                <option value="">Select Item</option>
                                                {item.map((data) => (
                                                    <option key={data._id} value={data._id}>
                                                        {data.itemName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="mb-2 sm:mb-0">
                                            <label
                                                htmlFor={`quantity-${index}`}
                                                className="block text-gray-700 font-medium text-sm"
                                            >
                                                Quantity
                                            </label>
                                            <input
                                                type="number"
                                                id={`quantity-${index}`}
                                                value={invoiceItem.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                required
                                            />
                                        </div>

                                        <div className="mb-2 sm:mb-0">
                                            <label
                                                htmlFor={`price-${index}`}
                                                className="block text-gray-700 font-medium text-sm"
                                            >
                                                Price
                                            </label>
                                            <input
                                                type="number"
                                                id={`price-${index}`}
                                                value={invoiceItem.price}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                required
                                            />
                                        </div>

                                        <div className="mb-2 sm:mb-0">
                                            <label
                                                htmlFor={`gstPercentage-${index}`}
                                                className="block text-gray-700 font-medium text-sm"
                                            >
                                                GST %
                                            </label>
                                            <input
                                                type="number"
                                                id={`gstPercentage-${index}`}
                                                value={invoiceItem.gstPercentage}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                required
                                            />
                                        </div>

                                        <div className="mb-2 sm:mb-0">
                                            <label
                                                htmlFor={`discount-${index}`}
                                                className="block text-gray-700 font-medium text-sm"
                                            >
                                                Discount %
                                            </label>
                                            <input
                                                type="number"
                                                id={`discount-${index}`}
                                                value={invoiceItem.discount}
                                                onChange={(e) => handleDiscountChange(index, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                required
                                            />
                                        </div>

                                        <div className="mb-2 sm:mb-0 flex items-end justify-between gap-2">
                                            <div>
                                                <label
                                                    htmlFor={`total-${index}`}
                                                    className="block text-gray-700 font-medium text-sm"
                                                >
                                                    Amount
                                                </label>
                                                <input
                                                    type="number"
                                                    id={`total-${index}`}
                                                    value={invoiceItem.amount}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                                                    readOnly // Amount is calculated, so read-only
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(index)}
                                                className="flex justify-center items-center text-red-500 hover:text-red-700 p-2"
                                                title="Delete"
                                            >
                                                <MdDeleteOutline size={24} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <div>
                                    <button
                                        type="button"
                                        onClick={handleAddNewItem}
                                        className="flex items-center justify-center gap-1 border border-dashed border-gray-500 w-full bg-gray-50 rounded-lg py-1.5 px-2 md:py-3 text-gray-600 hover:bg-gray-200 text-sm"
                                    >
                                        <Plus size={15} />
                                        Add New Item
                                    </button>
                                </div>
                            </div>

                        </div>

                        <div className="border rounded-lg mt-4">
                            <div className="flex justify-between border-b p-4 items-start sm:items-center">
                                <div className="flex items-center gap-3">
                                    <div className="text-[#1D3557] bg-[#1D3557]/20 rounded-full p-2">
                                        <FileChartLine />
                                    </div>
                                    <p className="text-lg font-semibold">Invoice Status</p>
                                </div>
                                <div className="mt-2 sm:mt-0 text-right text-base md:text-lg font-bold">
                                    <p className="text-sm font-semibold">
                                        Total Amount
                                    </p>
                                    ₹{calculateTotal()}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="mb-4 sm:mb-0">
                                    <select
                                        id="status"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 text-sm md:text-base
                                ${status === "paid"
                                                ? "bg-green-600 text-white"
                                                : status === "unpaid"
                                                    ? "bg-red-600 text-white"
                                                    : "bg-white text-black"
                                            }`}
                                        required
                                    >
                                        <option value="">Select payment status..</option>
                                        <option value="paid">Paid</option>
                                        <option value="unpaid">Unpaid</option>
                                    </select>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="flex justify-center items-center gap-2 w-full  px-4 py-2 bg-[#1D3557] text-white rounded-full hover:bg-gray-800 text-base md:text-lg"
                                    >
                                        <Save size={20} />
                                        Save
                                    </button>
                                    {/* <button
                                        type="button"
                                        onClick={handlePrintOnly}
                                        className="flex justify-center items-center gap-2 w-full sm:w-1/2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-800 text-base md:text-lg"
                                    >
                                        <Download size={20} />
                                        Print
                                    </button> */}
                                </div>
                            </div>
                        </div>


                        <div style={{ position: "absolute", left: "-9999px", top: "", zIndex: 1 }}>
                            <div ref={templateRef}>
                                <PdfTemplate
                                    state={{
                                        name: invoice.name || "",
                                        invoiceNumber: invoice.invoiceNumber || "",
                                        address: invoice.address || "",
                                        city: invoice.city || "",
                                        state: invoice.state || "",
                                        postalCode: invoice.postalCode || "",
                                        country: invoice.country || "",
                                        contact: invoice.contact || "",
                                        description: invoice.description || "",
                                        firmname: invoice.firmname || "",
                                        cinNo: invoice.cinNo || "",
                                        gstNo: invoice.gstNo || "",
                                        panNo: invoice.panNo || "",
                                        item: itemsList.map((i) => ({
                                            itemName: i.itemName,
                                            description: i.itemDescription,
                                            quantity: i.quantity,
                                            price: i.price,
                                            discount: i.discount,
                                            gstPercentage: i.gstPercentage,
                                            amount: i.amount,
                                        })),
                                        total: calculateTotal(),
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                {/* Right Side */}
                <div className="w-full md:w-[30%] mt-8 md:mt-0">
                    {selectcustomer && (
                        <div className="border rounded-lg shadow-md">
                            <h1 className="text-lg text-white py-4 px-4 border-b rounded-t-lg bg-[#1D3557] text-center">
                                Customer Details
                            </h1>
                            <div className="p-4 text-sm space-y-1">
                                <div className="flex items-center border-b pb-3 gap-3">
                                    <div className="text-[#1D3557] bg-[#1D3557]/20 rounded-full p-2">
                                        <UserRound size={16} />
                                    </div>
                                    <div>
                                        <p className="text-lg font-semibold">{selectcustomer?.name}</p>
                                        <p>{selectcustomer?.firmname}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between py-2">
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} />
                                        <p>{selectcustomer?.contact}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={14} />
                                        <p>{selectcustomer?.address}, {selectcustomer?.city},</p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3">
                                    <div className="flex justify-between">
                                        <p className="font-semibold">State :</p>
                                        <p>{selectcustomer?.state}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Postal Code :</p>
                                        <p>{selectcustomer?.postalCode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Country :</p>
                                        <p>{selectcustomer?.country}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">Firm Name :</p>
                                        <p>{selectcustomer?.firmname || "N/A"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">CIN No :</p>
                                        <p>{selectcustomer?.cinNo || "N/A"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">GST No :</p>
                                        <p>{selectcustomer?.gstNo || "N/A"}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p className="font-semibold">PAN No :</p>
                                        <p>{selectcustomer?.panNo || "N/A"}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {itemsList.length > 0 && (
                        <div className="w-full border rounded-lg shadow-md mt-4">
                            <h1 className="text-lg text-white py-4 px-4 border-b rounded-t-lg bg-[#1D3557] text-center">
                                Items List
                            </h1>
                            <table className="w-full text-sm rounded-lg">
                                <thead className="">
                                    <tr>
                                        <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Item Name</th>
                                        <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Qty.</th>
                                        <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Price</th>
                                        <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Dis%</th>
                                        <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">GST</th>
                                        <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsList.map((item, index) => (
                                        <tr key={index} className=" hover:bg-gray-100/20">
                                            <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.itemName}</td>
                                            <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.quantity}</td>
                                            <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.price}</td>
                                            <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.discount}</td>
                                            <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.gstPercentage}</td>
                                            <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="text-right font-bold text-sm p-2 ">
                                Overall Total: ₹{calculateTotal()}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {/* Left side */}

        </div>
    );
}

export default CreateInvoice;