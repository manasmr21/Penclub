import { X, LogOut, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Sidebar({ 
  collapsed, 
  menuItems, 
  mobileOpen, 
  setMobileOpen,
  onLogout,
  activePath,
  className = ""
}) { 
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNavigation = (path) => {
    if (typeof window !== "undefined") {
      router.push(path)
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  return (
    <>
      {/* Backdrop with blur */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static z-50 bg-white h-full 
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${collapsed ? "w-20" : "w-72"}
          ${className}
          border-r border-gray-100
        `}
        aria-label="Sidebar navigation"
      >
        {/* Header - No border/underline */}
        <div className={`
          flex items-center justify-between p-6
          transition-all duration-300
          ${collapsed ? "px-4" : "px-6"}
        `}>
          {!collapsed ? (
            <div className="flex items-center gap-3 animate-slideRight">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  PenClub
                </h1>
                <p className="text-xs text-gray-500 mt-0.5">Admin Portal</p>
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center animate-fadeIn">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
            </div>
          )}

          {/* Close button - mobile only */}
          <button
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 active:scale-95"
            onClick={() => setMobileOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto custom-scrollbar" style={{ height: "calc(100% - 140px)" }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activePath === item.path;
            
            return (
              <div
                key={index}
                onClick={() => handleNavigation(item.path)}
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`
                  group relative flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer 
                  transition-all duration-300
                  ${isActive 
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700" 
                    : "hover:bg-gray-50 text-gray-700"
                  }
                  ${collapsed ? "justify-center px-2" : ""}
                  ${mounted ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}
                `}
                style={{ transitionDelay: `${index * 50}ms` }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && handleNavigation(item.path)}
                aria-label={item.name}
              >
                {/* Icon container */}
                <div className="relative">
                  <Icon className={`
                    w-5 h-5 transition-all duration-300
                    ${isActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700 group-hover:scale-110"}
                  `} />
                  
                  {/* Active indicator dot */}
                  {isActive && !collapsed && (
                    <div className="absolute -right-2 -top-1 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  )}
                </div>
                
                {!collapsed && (
                  <span className={`
                    font-medium transition-all duration-300
                    ${isActive ? "text-blue-700" : "group-hover:translate-x-1"}
                  `}>
                    {item.name}
                  </span>
                )}

                {/* Badge example (optional) */}
                {!collapsed && item.badge && (
                  <span className="ml-auto text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}

                {/* Tooltip for collapsed mode */}
                {collapsed && hoveredItem === index && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 animate-fadeIn">
                    {item.name}
                    <div className="absolute left-0 top-1/2 transform -translate-x-1 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
                  </div>
                )}

                {/* Active indicator for collapsed mode */}
                {collapsed && isActive && (
                  <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                )}

                {/* Hover arrow for collapsed mode */}
                {collapsed && hoveredItem === index && (
                  <ChevronRight className="absolute right-2 w-4 h-4 text-gray-400 animate-pulse" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer with Logout - No border */}
        <div className="absolute bottom-0 w-full p-4">
          <div
            onClick={handleLogout}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer 
              transition-all duration-300 group
              hover:bg-red-50 text-red-600
              ${collapsed ? "justify-center px-2" : ""}
              active:scale-95
            `}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleLogout()}
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
            {!collapsed && (
              <span className="font-medium group-hover:font-semibold transition-all duration-300 group-hover:translate-x-1">
                Logout
              </span>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}