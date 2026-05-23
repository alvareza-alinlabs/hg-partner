import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-6 md:px-12 lg:px-6 relative z-10 w-full max-w-6xl mx-auto text-center">
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] lg:rounded-[4rem] p-10 md:p-16 lg:p-24 shadow-2xl border border-gray-100 relative overflow-hidden">
        
        <h2 className="text-3xl md:text-6xl font-black text-[#00172D] mb-6 md:mb-8 tracking-tight relative z-10 leading-[1.1]">
          Saatnya Membangun <br/> <span className="text-[#35ACDF]">Landasan Bisnis Digital.</span>
        </h2>
        <p className="text-gray-500 text-base md:text-xl max-w-2xl mx-auto mb-10 md:mb-12 relative z-10 leading-relaxed font-medium">
          Terhubung langsung dengan saya, untuk berdiskusi menemukan produk teknologi terbaik yang relevan dengan skala kebutuhan Anda hari ini.
        </p>
        <Link to="/appointment">
           <button className="px-8 md:px-10 py-4 md:py-5 bg-[#00172D] hover:bg-gray-900 border border-transparent hover:border-gray-700 text-white font-black text-[11px] md:text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-[#00172D]/20 transition-all relative z-10 flex items-center justify-center gap-2 md:gap-3 mx-auto w-full sm:w-auto">
             <Calendar className="w-4 h-4 md:w-5 md:h-5 text-gray-400" /> Atur Konsultasi Privat
           </button>
        </Link>
      </div>
    </section>
  );
}
