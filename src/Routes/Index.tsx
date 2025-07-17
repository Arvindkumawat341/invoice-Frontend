
import CreateCustomer from "@/Pages/CreateCustomer";
import CreateInvoice from "@/Pages/CreateInvoice";
import CreateService from "@/Pages/CreateService";
import Customer from "@/Pages/Customer";
import Dashboard from "@/Pages/Dashboard";
import Service from "@/Pages/Service";
import { Route, Routes } from "react-router-dom";
import PdfTemplate from "@/components/ui/PdfTemplate";
import UpdateCustomer from "@/Pages/UpdateCustomer";
import UpdateService from "@/Pages/UpdateService";

const route = [
  {
    path: "/",
    component: <Dashboard />,
  },
  {
    path: "/service",
    component: <Service />,
  },
  {
    path: "/customer",
    component: <Customer />,
  },
  {
    path: "/createcustomer",
    component: <CreateCustomer/>,
  },
  {
    path: "/updatecustomer/:id",
    component: <UpdateCustomer />,
  },
  {
    path: "/createservice",
    component: <CreateService/>,
  },
  {
    path: "/updateservice/:id",
    component: <UpdateService/>,
  },
  {
    path: "/create-invoice",
    component: <CreateInvoice/>,
  },
  {
    path: "/updateinvoice/:id",
    component: <CreateInvoice/>,
  },
  // {
  //   path: "/updateinvoice/:id",
  //   component: <UpdateInvoice/>,
  // },
  
  {
    path: "/template",
    component: <PdfTemplate state={{ name: "", address: "", item: [], total: "", description: "", city:"", state:"", country:"", postalCode:"", contact: "", firmname: "", cinNo: "", gstNo:"", panNo:"" , invoiceNumber:"" }} />,
  },
 
];

const Index = () => {
  return (
    <Routes>
      {route.map(({ path, component }) => (
        <Route path={path} element={component} />
      ))}
    </Routes>
  );
};
export default Index;
