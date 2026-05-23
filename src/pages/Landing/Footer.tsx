import { Server } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer({ data }: { data?: any }) {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="max-w-sm">
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 bg-white rounded-xl flex-shrink-0 flex items-center justify-center shadow-md overflow-hidden">
               <img src="/gambar/poto-harry.png" alt="Harry Gultom Logo" className="w-full h-full object-cover" />
             </div>
             <span className="font-black text-xl tracking-tight text-[#00172D]">Harry <span className="text-[#35ACDF]">Gultom</span></span>
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">{data?.description || "Seorang Sales Development Manager dan wakil produk principal resmi untuk ekosistem TI, komputasi HP Inc, serta kolaborasi pintar dari Poly."}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-10 lg:gap-16 w-full md:w-auto md:justify-end">
          <div className="flex flex-col gap-4">
             <h4 className="font-black text-[#00172D] mb-4 uppercase tracking-widest text-[10px]">Portal Eksekutif</h4>
             <Link to="/login" className="text-sm font-bold text-gray-500 hover:text-[#35ACDF] transition-colors flex items-center gap-2"><Server className="w-3 h-3 text-[#35ACDF]" /> Login Partner</Link>
             <Link to="/katalog" className="text-sm font-bold text-gray-500 hover:text-[#35ACDF] transition-colors">Katalog Solusi</Link>
             <Link to="/appointment" className="text-sm font-bold text-gray-500 hover:text-[#35ACDF] transition-colors">Biro Kemitraan</Link>
          </div>

          <div className="flex flex-col gap-4">
             <h4 className="font-black text-[#00172D] mb-4 uppercase tracking-widest text-[10px]">Informasi Korporat</h4>
             <p className="text-sm font-bold text-gray-500 flex flex-col gap-1">
               <span className="text-[#00172D]">Kantor Pusat</span>
               Gedung Harry Gultom<br/>SCBD, Jakarta Selatan 12190
             </p>
             <p className="text-sm font-bold text-gray-500 mt-2 flex flex-col gap-1">
               <span className="text-[#00172D]">Direktori Utama</span>
               info@harrygultom.id<br/>+62 21 8900 1200
             </p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-100 py-8 text-center bg-gray-50">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} Harry Gultom.
        </p>
      </div>
    </footer>
  );
}
