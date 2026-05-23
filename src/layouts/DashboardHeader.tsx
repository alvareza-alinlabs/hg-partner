import { UserCircle, Menu, ArrowLeft } from "lucide-react";
import React from "react";
import { getCurrentUser } from "../lib/auth";
import { useLocation, useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onMenuClick: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function DashboardHeader({ onMenuClick, title, subtitle, actions }: DashboardHeaderProps) {
  const user = getCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Checking if the current route is a detail or add page
  const isSubPage = location.pathname.split('/').length > 3;

  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-gray-200 px-4 md:px-8 flex items-center justify-between z-10 flex-shrink-0">
      <div className="flex items-center gap-3 md:gap-0">
        {isSubPage ? (
          <button 
            onClick={() => navigate(-1)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
        ) : (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <div className={isSubPage ? "" : ""}>
          {title ? (
            typeof title === 'string' ? <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">{title}</h2> : title
          ) : (
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">Sistem Internal <span className="text-[#35ACDF]">Partner</span></h2>
          )}
          
          {subtitle ? (
            typeof subtitle === 'string' ? <p className="hidden md:block text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">{subtitle}</p> : subtitle
          ) : (
            <p className="hidden md:block text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">Jaringan Distribusi Perangkat Keras HP Inc & Poly</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {actions && (
          <div className="hidden md:flex items-center gap-3">
             {actions}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-gray-800 leading-none">{user.name}</p>
            <p className="text-[10px] text-gray-500 font-medium uppercase mt-0.5">{user.id === 1 ? 'Super Admin' : 'Staff'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 border-2 border-white shadow-sm flex items-center justify-center text-gray-400">
            <UserCircle className="w-6 h-6 text-[#35ACDF]" />
          </div>
        </div>
      </div>
    </header>
  );
}
