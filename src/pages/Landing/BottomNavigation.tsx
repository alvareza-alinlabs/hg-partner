import { Link, useLocation } from "react-router-dom";
import { Home, Package, PhoneIcon, UserIcon } from "lucide-react";

export default function BottomNavigation() {
  const location = useLocation();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe">
      <div className="flex items-center justify-around px-2 py-2">
        <Link to="/" className={`flex flex-col items-center gap-1 p-2 transition-colors ${location.pathname === '/' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Beranda</span>
        </Link>
        <Link to="/katalog" className={`flex flex-col items-center gap-1 p-2 transition-colors ${location.pathname === '/katalog' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Katalog</span>
        </Link>
        <Link to="/appointment" className={`flex flex-col items-center gap-1 p-2 transition-colors ${location.pathname === '/appointment' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <PhoneIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Konsultasi</span>
        </Link>
        <Link to="/login" className={`flex flex-col items-center gap-1 p-2 transition-colors ${location.pathname === '/login' ? 'text-[#35ACDF]' : 'text-gray-400 hover:text-gray-600'}`}>
          <UserIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest mt-0.5">Login</span>
        </Link>
      </div>
    </div>
  );
}
