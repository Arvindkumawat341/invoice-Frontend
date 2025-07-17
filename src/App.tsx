import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SideBar from "./Shared/sideBar";
import Index from "./Routes/Index";

function App() {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <div className="flex-grow w-full p-2 md:p-4">
          <Routes>
            <Route path="/*" element={<Index />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
