import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import {baseURL} from "../lib/constant.ts"


interface CustomerData {
    id: string;
    name: string;
    items: ItemsData[];
    totalAmount: string;
    status: string;
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

function Invoice() {
    const [invoice, setInvoice] = useState<CustomerData[]>([]);
    const [filteredInvoice, setFilteredInvoice] = useState<CustomerData[]>([]);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
    };

    // Filter data based on the search input and status filter
    useEffect(() => {
        let filteredData = invoice;

        // Apply status filter
        if (statusFilter !== "all") {
            filteredData = filteredData.filter((data) => data.status === statusFilter);
        }

        // Apply search filter
        if (search.trim() !== "") {
            filteredData = filteredData.filter((data) =>
                data.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredInvoice(filteredData);
    }, [statusFilter, search, invoice]);

    useEffect(() => {
        const fetchInvoice = async () => {
            try {
                const response = await fetch(`${baseURL}/getinvoice`);
                const result = await response.json();
                setInvoice(result.data);
                setFilteredInvoice(result.data);
            } catch (error) {
                console.error("Error fetching Invoice data", error);
            }
        };

        fetchInvoice();
    }, []);

    return (
        <>
            <div className="container">
                <h1 className="bg-[#1D3557] font-medium text-base text-white md:text-2xl rounded-lg w-full p-2 md:p-3">
                    Invoice
                </h1>

                <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                    <div className="flex flex-wrap gap-1 md:gap-2">
                        <Link
                            to={"/create-invoice"}
                            className="font-semibold rounded-md text-xs md:text-base bg-white border px-2 py-1 hover:bg-gray-50"
                        >
                            Create Invoice
                        </Link>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex items-center gap-3 ">
                            <label htmlFor="statusFilter" className="block text-gray-700 font-medium text-xs md:text-base">
                                Status
                            </label>
                            <select
                                id="statusFilter"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full md:w-32 p-0 md:p-1 text-xs md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                            >
                                <option value="all" >All</option>
                                <option value="paid">Paid</option>
                                <option value="unpaid">Unpaid</option>
                            </select>
                        </div>

                        <div className="flex items-center border rounded-md px-2 py-1 w-20 md:w-40 h-8  focus:outline-none focus:ring-2 focus:ring-gray-400">
                            <FaSearch className="text-gray-400 mr-2" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={search}
                                onChange={handleSearch}
                                className="outline-none flex-grow text-xs  md:text-base p-1 w-12 md:w-28"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-5 overflow-x-auto">
                    <table className="w-full text-sm rounded-lg">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    S.no
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Name
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Item Name
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Quantity
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Price
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Amount
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Total Amount
                                </th>
                                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-base text-gray-600 font-medium">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoice.map((data, index) => (
                                <tr key={data.id} className="border-b hover:bg-gray-100">
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        {index + 1}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        {data.name}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>{item.itemName}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>{item.quantity}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>₹{item.price}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        {data.items.map((item) => (
                                            <div key={item.itemId}>₹{item.amount}</div>
                                        ))}
                                    </td>
                                    <td className="h-10 px-2 md:px-4 text-left text-xs md:text-base">
                                        ₹{data.totalAmount}
                                    </td>
                                    <td
                                        className={`h-10 px-2 md:px-4 text-left text-xs md:text-base font-medium ${
                                            data.status === "paid" ? "text-green-600" : "text-red-600"
                                        }`}
                                    >
                                        {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Invoice;