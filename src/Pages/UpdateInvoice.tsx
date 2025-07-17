// import { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { baseURL } from "../lib/constant.ts";
// import { Plus } from "lucide-react";
// import jsPDF from "jspdf";
// import PdfTemplate from "@/components/ui/PdfTemplate.tsx";
// import html2canvas from "html2canvas";
// import { MdDeleteOutline } from "react-icons/md";

// interface Customer {
//     _id: string;
//     name: string;
//     address: string;
//     city: string;
//     state: string;
//     postalCode: string;
//     country: string;
//     contact: string;
//     description: string;
//     firmname?: string;
//     cinNo?: string;
//     gstNo?: string;
//     panNo: string;
// }

// interface Item {
//     _id: string;
//     itemId: string;
//     itemName: string;
//     description: string;
//     price: string;
//     quantity: string;
//     amount: string;
//     discount: string;
//     total: string;
//     gstPercentage: string;
// }

// interface Invoice {
//     id: string;
//     name: string;
//     address: string;
//     city: string;
//     postalCode: string;
//     state: string;
//     country: string;
//     contact: string;
//     description: string;
//     firmname: string;
//     cinNo: string;
//     gstNo: string;
//     panNo: string;
//     itemId: string;
//     itemName: string;
//     itemDescription: string;
//     quantity: string;
//     price: string;
//     gstPercentage?: string;
//     amount: string;
//     status: string;
//     totalAmount?: string;
//     total: string;
//     overallDiscount: string;
//     invoiceNumber: string;
// }

// function UpdateInvoice() {
//     const [activeSection, setActiveSection] = useState<"Name" | "item" | null>(null);
//     const [customer, setCustomer] = useState<Customer[]>([]);
//     const [selectcustomer, setSelectCustomer] = useState<Customer | null>(null);
//     const [item, setItem] = useState<Item[]>([]);
//     const [overallDiscount, setOverallDiscount] = useState<string>("");
//     const templateRef = useRef<HTMLDivElement>(null);
//     const [status, setStatus] = useState("");
//     //Invoice
//     const [invoice, setInvoice] = useState<Invoice>({
//         id: "",
//         name: "",
//         address: "",
//         city: "",
//         postalCode: "",
//         state: "",
//         country: "",
//         contact: "",
//         description: "",
//         firmname: "",
//         cinNo: "",
//         gstNo: "",
//         panNo: "",
//         itemId: "",
//         itemName: "",
//         itemDescription: "",
//         quantity: "",
//         price: "",
//         gstPercentage: "",
//         amount: "",
//         status: "",
//         totalAmount: "",
//         total: "",
//         overallDiscount,
//         invoiceNumber: "",
//     });

//     const navigate = useNavigate();
//     const { id } = useParams();

//      useEffect(() => {
//         const fetchCustomer = async () => {
//             try {
//                 const response = await fetch(`${baseURL}/getcustomer`);
//                 const result = await response.json();
//                 setCustomer(result);
//             } catch (error) {
//                 console.error("Error fetching customers", error);
//             }
//         };
//         fetchCustomer();
//     }, []);

//     useEffect(() => {
//         const fetchItem = async () => {
//             try {
//                 const response = await fetch(`${baseURL}/getservice`);
//                 const result = await response.json();
//                 setItem(result.data);
//             } catch (error) {
//                 console.error("Error fetching items", error);
//             }
//         };
//         fetchItem();
//     }, []);

//     useEffect(() => {
//         const fetchInvoiceById = async () => {
//             if (!id) return;

//             try {
//                 const response = await fetch(`${baseURL}/getinvoice/${id}`);
//                 const data = await response.json();
//                 if (response.ok && data?.data) {
//                     const inv = data.data;
//                     setInvoice({
//                         id: inv._id,
//                         name: inv.name,
//                         address: inv.address,
//                         city: inv.city,
//                         postalCode: inv.postalCode,
//                         state: inv.state,
//                         country: inv.country,
//                         contact: inv.contact,
//                         description: inv.description,
//                         firmname: inv.firmName,
//                         cinNo: inv.cinNo,
//                         gstNo: inv.gstNo,
//                         panNo: inv.panNo,
//                         itemId: "",
//                         itemName: "",
//                         itemDescription: "",
//                         quantity: "",
//                         price: "",
//                         gstPercentage: "",
//                         amount: "",
//                         status: inv.status,
//                         totalAmount: inv.totalAmount,
//                         total: "",
//                         overallDiscount: inv.overallDiscount || "0",
//                         invoiceNumber: inv.invoiceNumber || "",
//                     });

//                     // Pre-fill selected customer if available
//                     setSelectCustomer({
//                         _id: inv._id,
//                         name: inv.name,
//                         address: inv.address,
//                         city: inv.city,
//                         state: inv.state,
//                         postalCode: inv.postalCode,
//                         country: inv.country,
//                         contact: inv.contact,
//                         description: inv.description,
//                         firmname: inv.firmName,
//                         cinNo: inv.cinNo,
//                         gstNo: inv.gstNo,
//                         panNo: inv.panNo,
//                     });

//                     // Pre-fill items
//                     const updatedItems = inv.items.map((item: any) => ({
//                         itemId: item.itemId || "",
//                         itemName: item.itemName,
//                         itemDescription: item.itemDescription || "",
//                         quantity: item.quantity || "1",
//                         price: item.price || "0",
//                         gstPercentage: item.gstPercentage || "0",
//                         discount: item.discount || "0",
//                         total: item.total || item.price,
//                         amount: item.amount,
//                     }));
//                     setItemsList(updatedItems);
//                 }
//             } catch (error) {
//                 console.error("Error fetching invoice:", error);
//             }
//         };

//         fetchInvoiceById();
//     }, [id]);


//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         const invoiceData = {
//             ...invoice,
//             items: itemsList,
//             status,
//             totalAmount: calculateTotal(),
//             overallDiscount: overallDiscount,
//         };
//         try {
//             const response = await fetch(
//                 id ? `${baseURL}/updateinvoice/${id}` : `${baseURL}/createinvoice`,
//                 {
//                     method: id ? "PUT" : "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(invoiceData),
//                 }
//             );

//             const result = await response.json();
//             if (response.ok) {

//                 if (id && result.message === "Invoice updated successfully!") {
//                     alert("Invoice updated!");
//                 } else if (!id && result.data?.invoiceNumber) {
//                     setInvoice((prev) => ({
//                         ...prev,
//                         invoiceNumber: result.data.invoiceNumber,
//                     }));
//                 }

//                 const input = templateRef.current;
//                 if (input) {
//                     const input = templateRef.current;
//                     if (input) {
//                         const canvas = await html2canvas(input, {
//                             backgroundColor: "#fff",
//                             scale: 2,
//                         });
//                         const imgData = canvas.toDataURL("image/png");
//                         const pdf = new jsPDF("p", "mm", "a4");
//                         const pdfWidth = pdf.internal.pageSize.getWidth(); 
//                         const pdfHeight = pdf.internal.pageSize.getHeight();
//                         const imgProps = pdf.getImageProperties(imgData);
//                         const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
//                         let heightLeft = imgHeight;
//                         let position = 0;
//                         pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
//                         heightLeft -= pdfHeight;

//                         while (heightLeft > 0) {
//                             position = heightLeft - imgHeight;
//                             pdf.addPage();
//                             pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
//                             heightLeft -= pdfHeight;
//                         }

//                         pdf.save(`Invoice_${invoiceData.name}.pdf`);
//                     }
//                 }
//                 setInvoice({
//                     id: "", name: "", address: "", city: "", postalCode: "", country: "", state: "", contact: "", description: "",
//                     firmname: "", cinNo: "", gstNo: "", panNo: "", itemId: "", itemName: "", itemDescription: "",
//                     quantity: "", price: "", gstPercentage: "", amount: "", status: "", totalAmount: "", total: "", overallDiscount: "", invoiceNumber: ""
//                 });
//                 setItemsList([]);
//                 setStatus("");

//                 navigate("/");
//             } else {
//                 alert("Failed to submit: " + result.message);
//             }
//         } catch (error) {
//             console.error("Submit error:", error);
//             alert("Error while saving invoice.");
//         }
//     };

//     const [itemsList, setItemsList] = useState<
//         {
//             discount: string;
//             itemId: string;
//             itemName: string;
//             itemDescription: string;
//             quantity: string;
//             price: string;
//             gstPercentage: string;
//             amount: string;
//             total: string;
//         }[]
//     >([]);

//     const handleAddNewItem = () => {
//         setItemsList([
//             ...itemsList,
//             {
//                 itemId: "",
//                 itemName: "",
//                 itemDescription: "",
//                 quantity: "",
//                 price: "",
//                 gstPercentage: "",
//                 amount: "",
//                 discount: "",
//                 total: "",
//             },
//         ]);
//     };

//     const handleDelete = (index: number) => {
//         const newItemsList = [...itemsList];
//         newItemsList.splice(index, 1);
//         setItemsList(newItemsList);
//     };

//     const handleItemChange = (index: number, selectedId: string) => {
//         const selectedItem = item.find((i) => i._id === selectedId);
//         if (selectedItem) {
//             const updatedItems = [...itemsList];
//             const quantity = updatedItems[index]?.quantity || "1";
//             const amount = (
//                 parseFloat(quantity) * parseFloat(selectedItem.total)
//             ).toFixed(2);

//             updatedItems[index] = {
//                 itemId: selectedItem._id,
//                 itemName: selectedItem.itemName,
//                 itemDescription: selectedItem.description,
//                 quantity: quantity,
//                 price: selectedItem.price,
//                 gstPercentage: selectedItem.gstPercentage || "0",
//                 amount: amount,
//                 discount: updatedItems[index]?.discount || "0",
//                 total: selectedItem.total,
//             };
//             setItemsList(updatedItems);
//         }
//     };

//     useEffect(() => {
//         const updatedItems = itemsList.map((item) => {
//             const quantity = parseFloat(item.quantity || "1");
//             const total = parseFloat(item.total || "0");
//             const itemDiscount = parseFloat(item.discount || "0");
//             const overall = parseFloat(overallDiscount || "0");

//             const originalPrice = quantity * total;
//             const combinedDiscount = itemDiscount + overall;
//             const discountAmount = (originalPrice * combinedDiscount) / 100;
//             const amount = (originalPrice - discountAmount).toFixed(2);

//             return {
//                 ...item,
//                 amount,
//             };
//         });

//         setItemsList(updatedItems);
//     }, [overallDiscount]);


//     const handleDiscountChange = (index: number, value: string) => {
//         const updatedItems = [...itemsList];
//         updatedItems[index].discount = value;

//         const quantity = parseFloat(updatedItems[index].quantity || "1");
//         const total = parseFloat(updatedItems[index].total || "0");
//         const itemDiscount = parseFloat(value || "0");
//         const overall = parseFloat(overallDiscount || "0");

//         const combinedDiscount = itemDiscount + overall;
//         const originalPrice = quantity * total;
//         const discountAmount = (originalPrice * combinedDiscount) / 100;

//         updatedItems[index].amount = (originalPrice - discountAmount).toFixed(2);
//         setItemsList(updatedItems);
//     };


//     const handleQuantityChange = (index: number, value: string) => {
//         const updatedItems = [...itemsList];
//         updatedItems[index].quantity = value;

//         const quantity = parseFloat(value || "1");
//         const total = parseFloat(updatedItems[index].total || "0");
//         const itemDiscount = parseFloat(updatedItems[index].discount || "0");
//         const overall = parseFloat(overallDiscount || "0");

//         const combinedDiscount = itemDiscount + overall;
//         const originalPrice = quantity * total;
//         const discountAmount = (originalPrice * combinedDiscount) / 100;

//         updatedItems[index].amount = (originalPrice - discountAmount).toFixed(2);
//         setItemsList(updatedItems);
//     };


//     const calculateTotal = () => {
//         const totalBeforeDiscount = itemsList.reduce(
//             (total, item) => total + parseFloat(item.amount || "0"),
//             0
//         );
//         return totalBeforeDiscount.toFixed(2);
//     };

//     return (
//         <div className="mx-auto flex flex-col md:flex-row gap-5 p-4 md:p-6 lg:p-8">
//             {/* Left side */}
//             <div className="w-full md:w-[70%] border rounded-xl shadow-md">
//                 <h1 className="bg-[#1D3557] text-xl md:text-2xl text-white py-4 border-b rounded-t-lg font-bold mb-4 text-center">
//                     Create Invoice
//                 </h1>
//                 <form onSubmit={handleSubmit} className="p-4">
//                     <div className="flex flex-col sm:flex-row mt-6 mb-4 justify-between items-start sm:items-center gap-4 sm:gap-0">
//                         <div>
//                             <h1 className="text-[#008080] font-bold text-sm md:text-lg">
//                                 Customer details
//                             </h1>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             <button
//                                 onClick={() => navigate("/createcustomer", { state: { from: "invoice" } })}
//                                 className="flex items-center gap-1 font-semibold rounded-md bg-white border px-2.5 py-1.5 hover:bg-gray-50 text-sm"
//                             >
//                                 <Plus size={15} />
//                                 Create customer
//                             </button>
//                         </div>
//                     </div>

//                     <div className="mb-4">
//                         <label htmlFor="Name" className="block text-gray-700 text-sm font-medium">
//                             Name
//                         </label>
//                         <select
//                             id="id"
//                             value={selectcustomer ? selectcustomer._id : ""}
//                             onChange={(e) => {
//                                 const selected = customer.find((c) => c._id === e.target.value);
//                                 setSelectCustomer(selected || null);
//                                 setActiveSection("Name");
//                                 if (selected) {
//                                     setInvoice({
//                                         ...invoice,
//                                         name: selected.name,
//                                         address: selected.address,
//                                         city: selected.city,
//                                         state: selected.state,
//                                         postalCode: selected?.postalCode,
//                                         country: selected.country,
//                                         contact: selected.contact,
//                                         description: selected.description,
//                                         firmname: selected.firmname || "",
//                                         cinNo: selected.cinNo || "",
//                                         gstNo: selected.gstNo || "",
//                                         panNo: selected.panNo || "",
//                                     });
//                                 }
//                             }}
//                             className="w-full px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm md:text-base"
//                             required
//                         >
//                             <option value="">Select Customer</option>
//                             {customer.map((data) => (
//                                 <option
//                                     key={data._id}
//                                     value={data._id}
//                                     className="max-w-14 text-sm md:text-normal"
//                                 >
//                                     {data.name} - {data.firmname}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                     <hr />
//                     <div className="flex flex-col sm:flex-row mt-6 justify-between items-start sm:items-center gap-4 sm:gap-0">
//                         <div>
//                             <h1 className="text-[#008080] font-bold text-lg">Item List</h1>
//                         </div>
//                         <div>
//                             <button
//                                 onClick={() => navigate("/createservice", { state: { from: "invoice" } })}
//                                 className="flex items-center gap-1 font-semibold rounded-md bg-white border px-2.5 py-1.5 hover:bg-gray-50 text-sm"
//                             >
//                                 <Plus size={15} />
//                                 Create Service
//                             </button>
//                         </div>
//                     </div>

//                     {itemsList.map((invoiceItem, index) => (
//                         <div
//                             key={index}
//                             className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 p-2 border rounded-md bg-gray-50 items-end"
//                         >
//                             {/* Added grid layout for items */}
//                             <div className="mb-2 sm:mb-0">
//                                 <label
//                                     htmlFor={`itemName-${index}`}
//                                     className="block text-gray-700 font-medium text-sm"
//                                 >
//                                     Item Name
//                                 </label>
//                                 <select
//                                     id={`itemName-${index}`}
//                                     value={invoiceItem?.itemId || ""}
//                                     onChange={(e) => {
//                                         handleItemChange(index, e.target.value);
//                                         setActiveSection("item"); // Update active section for right panel
//                                     }}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                                     required
//                                 >
//                                     <option value="">Select Item</option>
//                                     {item.map((data) => (
//                                         <option key={data._id} value={data._id}>
//                                             {data.itemName}
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="mb-2 sm:mb-0">
//                                 <label
//                                     htmlFor={`quantity-${index}`}
//                                     className="block text-gray-700 font-medium text-sm"
//                                 >
//                                     Quantity
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id={`quantity-${index}`}
//                                     value={invoiceItem.quantity}
//                                     onChange={(e) => handleQuantityChange(index, e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-2 sm:mb-0">
//                                 <label
//                                     htmlFor={`price-${index}`}
//                                     className="block text-gray-700 font-medium text-sm"
//                                 >
//                                     Price
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id={`price-${index}`}
//                                     value={invoiceItem.price}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-2 sm:mb-0">
//                                 <label
//                                     htmlFor={`gstPercentage-${index}`}
//                                     className="block text-gray-700 font-medium text-sm"
//                                 >
//                                     GST %
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id={`gstPercentage-${index}`}
//                                     value={invoiceItem.gstPercentage}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-2 sm:mb-0">
//                                 <label
//                                     htmlFor={`discount-${index}`}
//                                     className="block text-gray-700 font-medium text-sm"
//                                 >
//                                     Discount %
//                                 </label>
//                                 <input
//                                     type="number"
//                                     id={`discount-${index}`}
//                                     value={invoiceItem.discount}
//                                     onChange={(e) => handleDiscountChange(index, e.target.value)}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                                     required
//                                 />
//                             </div>

//                             <div className="mb-2 sm:mb-0 flex items-end justify-between gap-2">
//                                 <div>
//                                     <label
//                                         htmlFor={`total-${index}`}
//                                         className="block text-gray-700 font-medium text-sm"
//                                     >
//                                         Amount
//                                     </label>
//                                     <input
//                                         type="number"
//                                         id={`total-${index}`}
//                                         value={invoiceItem.amount}
//                                         className="w-full px-3 py-2 border border-gray-300 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
//                                         readOnly // Amount is calculated, so read-only
//                                         required
//                                     />
//                                 </div>
//                                 <button
//                                     type="button"
//                                     onClick={() => handleDelete(index)}
//                                     className="flex justify-center items-center text-red-500 hover:text-red-700 p-2"
//                                     title="Delete"
//                                 >
//                                     <MdDeleteOutline size={24} />
//                                 </button>
//                             </div>
//                         </div>
//                     ))}
//                     <div>
//                         <button
//                             type="button"
//                             onClick={handleAddNewItem}
//                             className="flex items-center gap-1 border rounded-lg py-1.5 px-2 md:py-1.5 mt-4 bg-[#008080] text-white hover:bg-[#1c6464] text-sm"
//                         >
//                             <Plus size={15} />
//                             Add New Item
//                         </button>
//                     </div>

//                     <div className="flex flex-col sm:flex-row justify-between mt-6 items-start sm:items-center">
//                         <div className="mb-4 sm:mb-0">
//                             <label htmlFor="status" className="sr-only">
//                                 Invoice Status
//                             </label>
//                             <select
//                                 id="status"
//                                 value={status}
//                                 onChange={(e) => setStatus(e.target.value)}
//                                 className={`w-36 md:w-52 px-4 py-2 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 text-sm md:text-base
//                                 ${status === "paid"
//                                         ? "bg-green-600 text-white"
//                                         : status === "unpaid"
//                                             ? "bg-red-600 text-white"
//                                             : "bg-white text-black"
//                                     }`}
//                                 required
//                             >
//                                 <option value="">Select Status</option>
//                                 <option value="paid">Paid</option>
//                                 <option value="unpaid">Unpaid</option>
//                             </select>
//                         </div>
//                         {/* <div className="mt-2">
//                             <label htmlFor="overallDiscount" className="block text-sm font-medium text-gray-700">
//                                 Overall Discount (₹)
//                             </label>
//                             <input
//                                 type="number"
//                                 id="overallDiscount"
//                                 value={overallDiscount}
//                                 onChange={(e) => setOverallDiscount(e.target.value)}
//                                 className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 text-sm"
//                                 placeholder="Enter discount in ₹"
//                             />
//                         </div> */}

//                         <div className="mt-2 sm:mt-0 text-right text-base md:text-lg font-bold">
//                             Total Amount: ₹{calculateTotal()}
//                         </div>
//                     </div>
//                     <button
//                         type="submit"
//                         className="px-4 py-2 mt-8 md:mt-12 bg-[#1D3557] text-white w-full rounded-full hover:bg-gray-800 text-base md:text-lg"
//                     >
//                         Save & Print
//                     </button>
//                     <div style={{ position: "absolute", left: "-9999px", top: "", zIndex: 1 }}>
//                         <div ref={templateRef}>
//                             <PdfTemplate
//                                 state={{
//                                     name: invoice.name,
//                                     address: invoice.address,
//                                     city: invoice.city,
//                                     state: invoice.state,
//                                     postalCode: invoice.postalCode,
//                                     country: invoice.country,
//                                     contact: invoice.contact,
//                                     description: invoice.description,
//                                     firmname: invoice.firmname,
//                                     cinNo: invoice.cinNo,
//                                     gstNo: invoice.gstNo,
//                                     panNo: invoice.panNo,
//                                     item: itemsList.map((i) => ({
//                                         itemName: i.itemName,
//                                         description: i.itemDescription,
//                                         quantity: i.quantity,
//                                         price: i.price,
//                                         discount: i.discount,
//                                         gstPercentage: i.gstPercentage,
//                                         amount: i.amount,
//                                     })),
//                                     total: calculateTotal(),
//                                     invoiceNumber: invoice.invoiceNumber,
//                                 }}
//                             />
//                         </div>
//                     </div>
//                 </form>
//             </div>

//             {/* Right Side */}
//             <div className="w-full md:w-[30%] mt-8 md:mt-0">
//                 {selectcustomer && (
//                     <div className="border rounded-lg shadow-md">
//                         <h1 className="text-lg text-white py-4 px-4 border-b rounded-t-lg bg-[#1D3557] text-center">
//                             Customer Details
//                         </h1>
//                         <div className="p-4 text-sm space-y-1">
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">Name :</p>
//                                 <p>{selectcustomer?.name}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">Address :</p>
//                                 <p>{selectcustomer?.address}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">City :</p>
//                                 <p>{selectcustomer?.city}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">State :</p>
//                                 <p>{selectcustomer?.state}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">Postal Code :</p>
//                                 <p>{selectcustomer?.postalCode}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">Country :</p>
//                                 <p>{selectcustomer?.country}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">Contact :</p>
//                                 <p>{selectcustomer?.contact}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">Firm Name :</p>
//                                 <p>{selectcustomer?.firmname || "N/A"}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">CIN No :</p>
//                                 <p>{selectcustomer?.cinNo || "N/A"}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">GST No :</p>
//                                 <p>{selectcustomer?.gstNo || "N/A"}</p>
//                             </div>
//                             <div className="flex justify-between">
//                                 <p className="font-semibold">PAN No :</p>
//                                 <p>{selectcustomer?.panNo || "N/A"}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {itemsList.length > 0 && (
//                     <div className="w-full border rounded-lg shadow-md mt-4">
//                         <h1 className="text-lg text-white py-4 px-4 border-b rounded-t-lg bg-[#1D3557] text-center">
//                             Items List
//                         </h1>
//                         {/* <div className="p-4 text-sm space-y-4">
//                             {itemsList.map((item, index) => (
//                                 <div key={index} className="mb-4 border-b pb-4 last:border-b-0 last:pb-0">
//                                     <div className="flex justify-between">
//                                         <p className="font-semibold">Item Name :</p>
//                                         <p>{item.itemName}</p>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <p className="font-semibold">Description :</p>
//                                         <p>{item.itemDescription}</p>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <p className="font-semibold">Quantity :</p>
//                                         <p>{item.quantity}</p>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <p className="font-semibold">Price :</p>
//                                         <p>{item.price}</p>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <p className="font-semibold">GST :</p>
//                                         <p>{item.gstPercentage}%</p>
//                                     </div>
//                                     <div className="flex justify-between">
//                                         <p className="font-semibold">Discount :</p>
//                                         <p>{item.discount}%</p>
//                                     </div>
//                                     <div className="flex justify-between font-bold text-base mt-2">
//                                         <p>Total :</p>
//                                         <p>₹{item.amount}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                             <div className="text-right font-bold text-lg ">
//                                 Overall Total: ₹{calculateTotal()}
//                             </div>
//                         </div> */}

//                         <table className="w-full text-sm rounded-lg">
//                             <thead className="">
//                                 <tr>
//                                     <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Item Name</th>
//                                     <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Qty.</th>
//                                     <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Price</th>
//                                     <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Dis%</th>
//                                     <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">GST</th>
//                                     <th className="h-8 px-2 md:px-2 text-left text-xs md:text-xs text-gray-600 font-medium">Total</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {itemsList.map((item, index) => (
//                                     <tr key={index} className=" hover:bg-gray-100/20">
//                                         <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.itemName}</td>
//                                         <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.quantity}</td>
//                                         <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.price}</td>
//                                         <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.discount}</td>
//                                         <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.gstPercentage}</td>
//                                         <td className="h-8 px-2 md:px-2 text-left text-xs md:text-xs">{item.total}</td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                         <div className="text-right font-bold text-sm p-2 ">
//                             Overall Total: ₹{calculateTotal()}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default UpdateInvoice;