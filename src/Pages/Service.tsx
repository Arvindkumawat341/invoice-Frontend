import { Pencil, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { MdDeleteOutline, MdWork } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import { baseURL } from "@/lib/constant";
import { useNavigate } from "react-router-dom";

interface ServiceData {
    _id: string;
    itemId: string;
    itemName: string;
    price: string;
    gstPercentage: string;
    total: string;
}

function Service() {
    const [service, setService] = useState<ServiceData[]>([]);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await fetch(`${baseURL}/getservice`);
                const result = await response.json();
                setService(result.data);
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchService();
    }, []);

    const deleteService = async (id: string) => {
        try {
            const response = await fetch(`${baseURL}/deleteservice/${id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                setService(service.filter((item) => item._id !== id));
                toast.success("Service deleted successfully!");
            } else {
                toast.error("Failed to delete the service.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
            alert("Error deleting service.");
        }
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = service.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="container">
            <h1 className="bg-[#1D3557] flex items-center gap-4 font-medium text-base text-white md:text-2xl rounded-lg w-full p-2 md:p-3">
                <MdWork/>
                Service
            </h1>

            <div className="flex flex-wrap items-end justify-end mt-4 gap-4">
                <button
                    onClick={() => navigate("/createservice", { state: { from: "service" } })}

                    className="flex items-center gap-1 font-semibold rounded-md text-xs md:text-sm text-white bg-[#1D3557] border px-2 py-1 hover:bg-gray-800"
                >
                    <Plus size={15} />
                    Create Service
                </button>
            </div>

            <div className="mt-5 overflow-x-auto">
                <table className="w-full text-sm rounded-lg">
                    <thead className="border-b">
                        <tr>
                            <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Item-Id</th>
                            <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Item Name</th>
                            <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Price</th>
                            <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Gst %</th>
                            <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Total</th>
                            <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((data) => (
                            <tr key={data._id} className="border-b hover:bg-gray-100/20">
                                <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.itemId}</td>
                                <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.itemName}</td>
                                <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">₹{data.price}</td>
                                <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.gstPercentage}%</td>
                                <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">₹{data.total}</td>
                                <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm flex items-center gap-4">
                                    <button
                                        onClick={() => deleteService(data._id)}
                                        className="text-red-500"
                                    >
                                        <MdDeleteOutline size={24} />
                                    </button>
                                    <button>
                                        <Link to={`/updateservice/${data._id}`} className="text-gray-700">
                                            <Pencil size={20} />
                                        </Link>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="flex justify-center mt-4">
                    <div className="flex items-center space-x-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                            className={`px-2 py-1 text-sm font-medium rounded border ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'}`}
                        >
                            Prev
                        </button>
                        {Array.from({ length: Math.ceil(service.length / itemsPerPage) }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`px-2 py-1 text-sm rounded border ${currentPage === index + 1 ? " text-black" : "bg-white text-gray-700"}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === Math.ceil(service.length / itemsPerPage)}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                            className={`px-2 py-1 text-sm font-medium rounded border ${currentPage === Math.ceil(service.length / itemsPerPage) ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'}`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Service;
