import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Map, Database, LogOut, Menu, PackageSearch, Calendar, X, LayoutDashboard, Settings, Receipt, Users, Shield } from "lucide-react";
import { cn } from "../lib/utils";
import { getCurrentUser, hasAccess } from "../lib/auth";

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  setIsMobileOpen: (isOpen: boolean) => void;
}

export default function DashboardSidebar({ isMobileOpen, setIsMobileOpen }: DashboardSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  // State for current user permissions
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const handleStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userLoggedIn");
    localStorage.removeItem("currentUser");
    // force a simple reload to apply side effects just in case
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const navGroupsRaw = [
    {
      title: "Navigasi",
      items: [
        { name: "Ringkasan", path: "/dashboard", icon: LayoutDashboard, exact: true, action: "ringkasan" as keyof typeof user.permissions },
      ]
    },
    {
      title: "Partner & Sales",
      items: [
        { name: "Peta Distribusi", path: "/dashboard/map", icon: Map, action: "map" as keyof typeof user.permissions },
        { name: "Daftar Partner", path: "/dashboard/partners", icon: Database, action: "partners" as keyof typeof user.permissions },
        { name: "Daftar Sales", path: "/dashboard/sales", icon: Users, action: "sales" as keyof typeof user.permissions },
      ]
    },
    {
      title: "Kinerja",
      items: [
        { name: "Transaksi", path: "/dashboard/transactions", icon: Receipt, action: "transactions" as keyof typeof user.permissions },
        { name: "Produk", path: "/dashboard/products", icon: PackageSearch, action: "products" as keyof typeof user.permissions },
        { name: "Jadwal", path: "/dashboard/schedule", icon: Calendar, action: "schedule" as keyof typeof user.permissions },
      ]
    },
    {
      title: "Sistem",
      items: [
        { name: "Landing Page", path: "/dashboard/landing-config", icon: LayoutDashboard, action: "access" as keyof typeof user.permissions },
        { name: "Hak Akses", path: "/dashboard/access", icon: Shield, action: "access" as keyof typeof user.permissions },
      ]
    }
  ];

  const navGroups = navGroupsRaw.map(group => ({
    ...group,
    items: group.items.filter(item => hasAccess(user.permissions[item.action]))
  })).filter(group => group.items.length > 0);

  // Add the "Pengaturan" option manually to "Sistem" since it's accessible to everyone
  const finalNavGroups = navGroups.map(group => {
    if (group.title === "Sistem") {
      return {
        ...group,
        items: [...group.items, { name: "Pengaturan", path: "/dashboard/settings", icon: Settings }]
      };
    }
    return group;
  });

  // If "Sistem" was completely filtered out but we need to add Pengaturan, we should ensure it exists.
  if (!finalNavGroups.find(g => g.title === "Sistem")) {
    finalNavGroups.push({
      title: "Sistem",
      items: [{ name: "Pengaturan", path: "/dashboard/settings", icon: Settings }]
    });
  }

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        className={cn(
          "bg-[#00172D] flex flex-col shadow-2xl z-50 h-full transition-all duration-300",
          "fixed md:relative inset-y-0 left-0",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden md:flex absolute -right-3 top-8 bg-[#35ACDF] text-white rounded-full p-1 shadow-lg hover:bg-blue-400 transition-colors z-30"
        >
          <Menu className="w-4 h-4 text-white" />
        </button>
        


      <div className="flex items-center gap-3 p-6 mb-2">
        <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
          <img src="/gambar/icon-dashboard-white.png" alt="Dashboard Logo" className="w-full h-full object-contain" />
        </div>
        {!isCollapsed && (
          <motion.h1 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white font-bold text-lg leading-tight tracking-tight whitespace-nowrap overflow-hidden"
          >
            HG Partner<br/><span className="text-[#35ACDF] text-xs uppercase tracking-widest">Portal Internal</span>
          </motion.h1>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 scrollbar-hide">
        <nav className="space-y-6">
          {finalNavGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="space-y-1">
              {!isCollapsed && (
                <h3 className="px-3 mb-2 text-[10px] font-black uppercase tracking-widest text-[#35ACDF]">
                  {group.title}
                </h3>
              )}
              {isCollapsed && <div className="h-4" />} {/* Spacer for collapsed state to separate groups visually */}
              
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={(item as any).exact}
                    onClick={() => { if (isMobileOpen) setIsMobileOpen(false); }}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-3 p-3 rounded-lg transition-colors group",
                        isActive
                          ? "bg-white/10 text-white font-medium shadow-inner"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )
                    }
                  >
                    <item.icon
                      className={cn(
                        "w-5 h-5 flex-shrink-0 transition-colors",
                        "group-[.active]:text-[#35ACDF]"
                      )}
                    />
                    {!isCollapsed && (
                      <span className="whitespace-nowrap overflow-hidden text-sm truncate">
                        {item.name}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      <div className="w-full px-3 pb-6 border-t border-white/10 pt-4 mt-auto">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center ${isCollapsed ? 'justify-center' : ''} p-3 text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-md`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-white" />
          {!isCollapsed && <span className="ml-3 font-medium whitespace-nowrap overflow-hidden text-sm">Keluar</span>}
        </button>
      </div>
    </motion.aside>
    </>
  );
}
