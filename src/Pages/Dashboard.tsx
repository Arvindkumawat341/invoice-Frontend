import { IoMdPersonAdd } from "react-icons/io";
import { FaFileInvoice } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { baseURL } from "../lib/constant.ts";
import { Plus } from "lucide-react"
import { Download } from "lucide-react";
import { Pencil } from "lucide-react";
import { MdWork } from "react-icons/md";
import { useRef } from "react";
import { generatePDF } from "../utils/downloadPDF.ts";
import StatusModal from "../components/ui/StatusModal";
import PdfTemplate from "../components/ui/PdfTemplate";
import { RxDashboard } from "react-icons/rx";


interface InvoiceData {
  _id: string;
  invoiceNumber: string;
  customerId: {
    _id: string;
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    contact: string;
    description: string;
    firmname: string;
    cinNo: string;
    gstNo: string;
    panNo: string;
    state: string;
  };
  items: ItemsData[];
  totalAmount: string;
  status: string;
  overallDiscount: string;
}



interface ItemsData {
    itemId: string;
    itemName: string;
    itemDescription: string;
    quantity: string;
    price: string;
    discount: string;
    amount: string;
}


function Dashboard() {
    const [invoice, setInvoice] = useState<InvoiceData[]>([]);
    const [filteredInvoice, setFilteredInvoice] = useState<InvoiceData[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [totalServices, setTotalServices] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const pdfRef = useRef<HTMLDivElement>(null);
     const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInvoiceId, setModalInvoiceId] = useState("");
    const [modalTotalAmount, setModalTotalAmount] = useState("");
    const [modalItems, setModalItems] = useState<ItemsData[]>([]);
    const [selectedInvoice, setSelectedInvoice] = useState<InvoiceData | null>(null);

    const fetchInvoice = async () => {
        try {
            const response = await fetch(`${baseURL}/getinvoice`);
            const result = await response.json();
            setInvoice(result.data);
            setFilteredInvoice(result.data);
            const sales = result.data.reduce(
                (sum: number, invoice: InvoiceData) => sum + parseFloat(invoice.totalAmount || "0"),
                0
            );
            setTotalSales(sales);
        } catch (error) {
            console.error("Error fetching Invoice data", error);
        }
    };

    useEffect(() => {
        fetchInvoice();
    }, []);

    const fetchCustomerData = async () => {
        try {
            const totalResponse = await fetch(`${baseURL}/getcustomer`);
            const totalResult = await totalResponse.json();
            setTotalCustomers(totalResult.length);
        } catch (error) {
            console.error("Error fetching customer data", error);
        }
    };
    useEffect(() => {
        fetchCustomerData();
    }, []);

    const fetchServiceData = async () => {
        try {
            const totalResponse = await fetch(`${baseURL}/getservice`);
            const totalResult = await totalResponse.json();
            setTotalServices(totalResult.data.length);
        } catch (error) {
            console.error("Error fetching service data", error);
        }
    };
    useEffect(() => {
        fetchServiceData();
    }, []);


    useEffect(() => {
        if (statusFilter === "all") {
            setFilteredInvoice(invoice);
        } else {
            const filtered = invoice.filter((data) => data.status === statusFilter);
            setFilteredInvoice(filtered);
        }
        setCurrentPage(1); 
    }, [statusFilter, invoice]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInvoice.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container mx-auto">
            <h1 className="bg-[#1D3557] flex items-center gap-4 font-medium text-base text-white md:text-2xl rounded-lg w-full p-2 md:p-3">
                <RxDashboard/>
                Dashboard
            </h1>

            <div className="mt-5">
                <h1 className="text-base md:text-2xl font-medium">Overview</h1>
                <div className="grid grid-cols-3 md:grid-cols-3  mt-2 md:mt-5 gap-1 md:gap-8 w-full">
                    <Link
                        to={"/customer"}
                        className="w-full"
                    >
                        <div className="border w-full p-2 md:p-4 bg-white rounded-lg">
                            <IoMdPersonAdd className="text-4xl text-black bg-gray-50 rounded p-2" />
                            <h3 className="text-lg md:text-2xl font-medium">{totalCustomers}</h3>
                            <p className="text-xs md:text-base text-gray-600 font-medium">Total Customers</p>
                        </div>
                    </Link>

                    <Link
                        to={"/service"}
                        className="w-full"
                    >
                        <div className="border w-full p-2 md:p-4 bg-white rounded-lg">
                            <MdWork className="text-4xl text-black bg-gray-50 rounded p-2" />
                            <h3 className="text-lg md:text-2xl font-medium">{totalServices}</h3>
                            <p className="text-xs md:text-base text-gray-600 font-medium">Total Services</p>
                        </div>
                    </Link>

                    <Link
                        to="/create-invoice"
                        className="w-full"
                    >
                        <div className="border w-full p-2 md:p-4 bg-white rounded-lg">
                            <FaFileInvoice className="text-4xl text-black bg-gray-50 rounded p-2" />
                            <h3 className="text-lg md:text-2xl font-medium">₹{totalSales.toFixed(2)}</h3>
                            <p className="text-xs md:text-base text-gray-600 font-medium">Total Invoice</p>
                        </div>
                    </Link>

                </div>

                <div className=" mt-5 gap-4">
                    <h1 className="text-base md:text-2xl font-medium">Invoices</h1>
                    <div className="flex justify-end items-end gap-4 mt-2">
                        <div className="flex items-center gap-2">
                            {["all", "paid", "unpaid"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-3 py-1 text-xs md:text-sm font-medium rounded-md border ${statusFilter === status
                                            ? "bg-[#1D3557] text-white border-[#1D3557]"
                                            : "bg-white text-gray-700 border-gray-300"
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>


                        <Link
                            to={"/create-invoice"}
                            className="bg-[#1D3557] text-white flex items-center gap-1 font-semibold rounded-md text-xs md:text-sm border px-2 py-1"
                        >
                            <Plus size={15} />
                            Create Invoice
                        </Link>
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-sm rounded-lg">
                        <thead className="border-b">
                            <tr>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">S.no</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Name</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Item Name</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Quantity</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Price</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">with GST</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Total Amount</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Status</th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((data, index) => (
                                <tr key={data._id} className="border-b hover:bg-gray-100/20">
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">
                                        {(currentPage - 1) * itemsPerPage + index + 1}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.customerId.name}</td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>{item.itemName}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>{item.quantity}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>₹{item.price}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>₹{item.amount}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">₹{data.totalAmount}</td>
                                      <td className="h-10 px-2 md:px-0 text-xs md:text-sm font-medium">
                                        {data.status === "paid" ? (
                                            <div className="text-green-600 border border-green-600 bg-green-600/20 w-16 rounded-full text-center">
                                                Paid
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setModalInvoiceId(data.invoiceNumber);
                                                    setModalItems(data.items);
                                                    setModalTotalAmount(data.totalAmount);
                                                    setIsModalOpen(true);
                                                }}
                                                className="text-red-600 border border-red-600 bg-red-600/20 w-16 rounded-full text-center hover:bg-red-600/30"
                                            >
                                                Unpaid
                                            </button>
                                        )}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">
                                        <button
                                            onClick={async () => {
                                                setSelectedInvoice(data);
                                                setTimeout(async () => {
                                                    if (pdfRef.current) {
                                                        await generatePDF(pdfRef.current, data._id);
                                                    }
                                                }, 100);
                                            }}
                                            className="text-green-600 mr-4"
                                        >
                                            <Download size={24} />
                                        </button>
                                        <button>
                                            <Link to={`/updateinvoice/${data._id}`} className="text-gray-700">
                                                <Pencil size={20} />
                                            </Link>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
               {selectedInvoice && (
                        <div style={{ position: "absolute", left: "-9999px", top: 0 }}>
                            <div ref={pdfRef}>
                                <PdfTemplate
                                    state={{
                                        name: selectedInvoice.customerId.name,
                                        address: selectedInvoice.customerId.address,
                                        city: selectedInvoice.customerId.city,
                                        state: selectedInvoice.customerId.state,
                                        postalCode: selectedInvoice.customerId.postalCode,
                                        country: selectedInvoice.customerId.country,
                                        contact: selectedInvoice.customerId.contact,
                                        description: selectedInvoice.customerId.description,
                                        firmname: selectedInvoice.customerId.firmname,
                                        cinNo: selectedInvoice.customerId.cinNo,
                                        gstNo: selectedInvoice.customerId.gstNo,
                                        panNo: selectedInvoice.customerId.panNo,
                                        item: selectedInvoice.items.map(item => ({
                                            itemName: item.itemName,
                                            description: item.itemDescription,
                                            price: item.price,
                                            quantity: item.quantity,
                                            amount: item.amount,
                                            discount: item.discount,
                                        })),
                                        total: selectedInvoice.totalAmount,
                                        invoiceNumber: selectedInvoice.invoiceNumber
                                    }}
                                />
                            </div>
                        </div>
                    )}

                </div>

                <div className="flex justify-center mt-4">
                    <div className="flex items-center space-x-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={`px-2 py-1 text-sm font-medium rounded border ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'}`}
                        >
                            Prev
                        </button>
                        {Array.from({ length: Math.ceil(filteredInvoice.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-2 py-1 text-sm rounded border ${currentPage === index + 1 ? " text-black" : "bg-white text-gray-700"}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === Math.ceil(filteredInvoice.length / itemsPerPage)}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={`px-2 py-1 text-sm font-medium rounded border ${currentPage === Math.ceil(filteredInvoice.length / itemsPerPage) ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
             <StatusModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                invoiceId={modalInvoiceId}
                totalAmount={modalTotalAmount}
                items={modalItems}
            />
        </div>
    );
}

export default Dashboard;
