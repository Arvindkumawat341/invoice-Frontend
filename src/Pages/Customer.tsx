import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { baseURL } from "../lib/constant.ts";
import { Pencil, Plus, UserRound } from "lucide-react";
import { MdDeleteOutline } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

interface CustomerData {
  _id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  firmname: string;
}

function Customer() {
  const [customer, setCustomer] = useState<CustomerData[]>([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`${baseURL}/getcustomer`);
        const result = await response.json();
        setCustomer(result);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomer();
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setCurrentPage(1);
  };

  const deleteCustomer = async (id: string) => {
    try {
      const response = await fetch(`${baseURL}/deletecustomer/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCustomer((prev) => prev.filter((item) => item._id !== id));
        toast.success("Customer deleted successfully!");
      } else {
        toast.error("Failed to delete the customer.");
      }
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast.error("Error deleting customer.");
    }
  };

  const filteredData = customer.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  return (
    <>
      <div className="container">
        <h1 className="bg-[#1D3557] flex items-center gap-4 font-medium text-base text-white md:text-2xl rounded-lg w-full p-2 md:p-3">
          <UserRound />
          Customers
        </h1>

        <div className="flex flex-wrap items-end justify-end mt-5 gap-4">
          <button
            onClick={() => navigate("/createcustomer", { state: { from: "customer" } })}
            className="flex items-center gap-1 font-semibold rounded-md text-xs md:text-sm bg-white border px-2 py-1 hover:bg-gray-50"
          >
            <Plus size={15} />
            Create Customer
          </button>
          <div className="flex items-center border rounded-md p-1 w-32">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={handleSearch}
              className="outline-none flex-grow w-16 text-sm"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm rounded-lg">
            <thead className="border-b">
              <tr>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">S.no</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Name</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Address</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">City</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">State</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Contact</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Firm Name</th>
                <th className="h-10 px-2 md:px-4 text-left text-xs md:text-sm text-gray-600 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data, index) => (
                <tr key={data._id} className="border-b hover:bg-gray-100/20">
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{indexOfFirstItem + index + 1}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.name}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.address}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.city}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.state}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.contact}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm">{data.firmname || "N/A"}</td>
                  <td className="h-10 px-2 md:px-4 text-left text-xs md:text-sm flex items-center gap-4">
                    <button onClick={() => deleteCustomer(data._id)} className="text-red-500">
                      <MdDeleteOutline size={24} />
                    </button>
                    <button>
                      <Link to={`/updatecustomer/${data._id}`} className="text-gray-700">
                        <Pencil size={20} />
                      </Link>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={`px-2 py-1 text-sm font-medium rounded border ${currentPage === 1 ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'}`}
              >
                Prev
              </button>
              {Array.from({ length: Math.ceil(filteredData.length / itemsPerPage) }, (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-2 py-1 text-sm rounded border ${currentPage === index + 1 ? " text-black" : "bg-white text-gray-700"}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`px-2 py-1 text-sm font-medium rounded border ${currentPage === Math.ceil(filteredData.length / itemsPerPage) ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'}`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Customer;
