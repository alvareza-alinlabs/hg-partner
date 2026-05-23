import { Link, useLocation, useNavigate } from "react-router-dom";
import { Server, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isKatalogDetail = location.pathname.startsWith('/katalog/') && location.pathname !== '/katalog';
  const isHomePage = location.pathname === '/';
  const isTransparent = isHomePage && !isScrolled;
  
  return (
    <>
      {/* Desktop Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 hidden md:block ${isTransparent ? 'bg-transparent border-transparent' : 'bg-white border-b border-gray-100 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between relative">
          <div className="flex items-center">
            {isKatalogDetail ? (
              <button onClick={() => navigate(-1)} className="flex items-center gap-3 hover:opacity-80 transition-opacity text-left">
                <div className="w-10 h-10 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                  <ArrowLeft className="w-5 h-5 text-[#00172D]" />
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className={`font-black text-xl tracking-tight leading-none mb-1 ${isTransparent ? 'text-white' : 'text-[#00172D]'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                  <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400'}`}>Sales Development Manager</span>
                </div>
              </button>
            ) : (
              <Link to="/" className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md flex-shrink-0 bg-white">
                   <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
                 </div>
                 <div className="hidden lg:flex flex-col">
                   <span className={`font-black text-xl tracking-tight leading-none mb-1 ${isTransparent ? 'text-white' : 'text-[#00172D]'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                   <span className={`text-[10px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400'}`}>Sales Development Manager</span>
                 </div>
              </Link>
            )}
          </div>

          <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-8 font-bold text-[11px] uppercase tracking-widest ${isTransparent ? 'text-white/90' : 'text-gray-500'}`}>
            <Link to="/" className={`transition-colors ${location.pathname === '/' ? (isTransparent ? 'text-white' : 'text-[#35ACDF]') : (isTransparent ? 'hover:text-white' : 'hover:text-[#35ACDF]')}`}>
              Beranda
            </Link>
            <Link to="/katalog" className={`transition-colors ${location.pathname === '/katalog' ? (isTransparent ? 'text-white' : 'text-[#35ACDF]') : (isTransparent ? 'hover:text-white' : 'hover:text-[#35ACDF]')}`}>
              Katalog
            </Link>
            <Link to="/appointment" className={`transition-colors ${location.pathname === '/appointment' ? (isTransparent ? 'text-white' : 'text-[#35ACDF]') : (isTransparent ? 'hover:text-white' : 'hover:text-[#35ACDF]')}`}>
              Konsultasi
            </Link>
          </div>

          <div>
            <Link to="/login" className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[10px] uppercase tracking-widest transition-colors shadow-lg ${isTransparent ? 'bg-white text-[#00172D] hover:bg-gray-100' : 'bg-[#00172D] text-white hover:bg-[#35ACDF] shadow-[#00172D]/20'}`}>
              <Server className="w-3.5 h-3.5" /> Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <nav className={`md:hidden fixed top-0 w-full z-50 transition-all duration-300 ${isTransparent ? 'bg-transparent border-transparent' : 'bg-white border-b border-gray-100 shadow-sm'}`}>
        <div className="px-6 h-16 flex items-center justify-between">
          {isKatalogDetail ? (
             <button onClick={() => navigate(-1)} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left">
               <div className={`w-8 h-8 ${!isTransparent ? 'bg-gray-50 border-gray-200 text-[#00172D]' : 'bg-white/20 border-transparent text-white backdrop-blur-sm'} border rounded-lg flex items-center justify-center shadow-sm`}>
                 <ArrowLeft className="w-4 h-4" />
               </div>
               <div className="flex flex-col text-left">
                 <span className={`font-black text-lg tracking-tight leading-none mb-0.5 ${isTransparent ? 'text-white' : 'text-[#00172D]'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                 <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400'}`}>Sales Development Manager</span>
               </div>
             </button>
          ) : (
            <Link to="/" className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-lg overflow-hidden shadow-md flex-shrink-0 bg-white">
                 <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
               </div>
               <div className="flex flex-col">
                 <span className={`font-black text-lg tracking-tight leading-none mb-0.5 ${isTransparent ? 'text-white' : 'text-[#00172D]'}`}>Harry <span className={isTransparent ? 'text-blue-300' : 'text-[#35ACDF]'}>Gultom</span></span>
                 <span className={`text-[8px] font-bold uppercase tracking-widest leading-none ${isTransparent ? 'text-white/80' : 'text-gray-400'}`}>Sales Development Manager</span>
               </div>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

