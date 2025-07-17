import { useState } from "react";
import { MdWork } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { Link, Outlet } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";
import { UserRound } from "lucide-react";

function SideBar() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-full">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 text-white dark:text-white bg-[#1D3557] dark:bg-gray-700 rounded-md"
        >
          <HiMenuAlt2 size={32} />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen dark:bg-gray-800 border-r bg border-gray-200 dark:border-gray-700 transition-all duration-300
          ${isHovered ? "md:w-64" : "md:w-20"
          }
          ${isMobileMenuOpen ? "w-64" : "w-0"
          }
          ${!isMobileMenuOpen && "hidden md:block"
          }
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-full overflow-y-auto justify-between flex flex-col">
          <a href="/" className="flex items-center justify-center py-4">
            <img src="fundflick.png" alt="Logo" className="w-16  mr-2" />
            {(isHovered || isMobileMenuOpen) && (
              <div className="flex items-center">
              </div>
            )}
          </a>
          <hr />
          {/* Sidebar Menu */}
          <nav className="flex-1 p-4 space-y-4">
            <ul className="space-y-2 font-medium">
              <li>
                <Link
                  to="/"
                  className="flex items-center p-2 gap-1 rounded-lg text-sm md:text-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <RxDashboard className="w-5 h-5 " />
                  {(isHovered || isMobileMenuOpen) && (
                    <span className="ml-3">Dashboard</span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/service"
                  className="flex items-center p-2 gap-1 rounded-lg text-sm md:text-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <MdWork className="w-5 h-5 " />
                  {(isHovered || isMobileMenuOpen) && (
                    <span className="ml-3">Service</span>
                  )}
                </Link>
              </li>
              <li>
                <Link
                  to="/customer"
                  className="flex items-center gap-1 p-2 rounded-lg text-sm md:text-normal text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserRound className="w-5 h-5 " />
                  {(isHovered || isMobileMenuOpen) && (
                    <span className="ml-3">Customer</span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>
          <hr />
          <div className="flex items-center justify-center py-2">
            <p className="text-center text-xs md:text-sm text-gray-500 dark:text-gray-400">
              ©2025 
              {(isHovered || isMobileMenuOpen) && (
                <span className="block flex flex-col text-xs md:text-sm text-gray-500 dark:text-gray-400">

                  <span>Maitrii Infotech Pvt. Ltd.</span>
                  <span>All rights reserved.</span>
                </span>
                
              )}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 dark:bg-neutral-900 transition-all duration-300
          ${isHovered ? "md:ml-64" : "md:ml-20"
          }
          ${isMobileMenuOpen ? "ml-64" : "ml-0"
          }
          ${!isMobileMenuOpen && "md:ml-20"
          }
        `}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default SideBar;