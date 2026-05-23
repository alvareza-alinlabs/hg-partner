import { Award, BookOpen, ShieldCheck, Monitor } from "lucide-react";

export default function InsightsSection() {
  return (
    <section id="edukasi" className="py-16 md:py-24 relative z-10 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-6 flex flex-col md:flex-row gap-10 lg:gap-16 items-center">
        <div className="w-full md:w-5/12 lg:w-1/2">
          <div className="relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5] group">
            <img src="https://placehold.co/800x1000/00172D/FFFFFF?text=Harry+Gultom" alt="Harry Gultom" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#00172D] via-[#00172D]/40 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white">
              <span className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-3 md:mb-4">
                <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#35ACDF]" /> Enterprise IT Consultant
              </span>
              <h3 className="text-2xl md:text-3xl font-black mb-2 tracking-tight">Harry Gultom</h3>
              <p className="text-blue-100 text-xs md:text-sm font-medium leading-relaxed">
                Lebih dari 15 tahun pengalaman mengorkestrasi infrastruktur TI berskala nasional untuk sektor pemerintahan dan enterprise.
              </p>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-7/12 lg:w-1/2 text-left">
           <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block">Insight & Edukasi</span>
           <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#00172D] mb-4 md:mb-6 tracking-tight">Menavigasi Ekosistem <br className="hidden md:block" />IT Modern.</h2>
           <p className="text-gray-500 mb-8 md:mb-10 leading-relaxed font-medium text-sm md:text-base">Banyak korporasi berinvestasi pada perangkat keras yang salah. Berikut adalah tiga pilar fundamental yang selalu saya tekankan sebelum melakukan pengadaan infrastruktur teknologi berskala besar.</p>
           
           <div className="space-y-6 md:space-y-8">
             <div className="flex gap-4 md:gap-6 group">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#00172D] group-hover:text-white transition-colors text-gray-400">
                 <BookOpen className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
               </div>
               <div>
                 <h4 className="text-lg md:text-xl font-black text-[#00172D] mb-1 md:mb-2 tracking-tight">Total Cost of Ownership (TCO)</h4>
                 <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Harga pembelian awal hanya merepresentasikan 30% dari total biaya perangkat. Biaya operasional, deployment, dan pemeliharaan adalah beban terbesar.</p>
               </div>
             </div>
             
             <div className="flex gap-4 md:gap-6 group">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#35ACDF] group-hover:text-white transition-colors text-gray-400">
                 <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
               </div>
               <div>
                 <h4 className="text-lg md:text-xl font-black text-[#00172D] mb-1 md:mb-2 tracking-tight">Endpoint Security First</h4>
                 <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Laptop dan PC adalah gerbang utama ancaman siber. Fitur keamanan berbasis hardware (seperti HP Wolf Security) tidak dapat lagi dikesampingkan.</p>
               </div>
             </div>
             
             <div className="flex gap-4 md:gap-6 group">
               <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-[#35ACDF] group-hover:text-white transition-colors text-gray-400">
                 <Monitor className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
               </div>
               <div>
                 <h4 className="text-lg md:text-xl font-black text-[#00172D] mb-1 md:mb-2 tracking-tight">Kolaborasi Hibrida Imersif</h4>
                 <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Sistem video conference harus mampu memberikan keadilan bagi peserta virtual maupun fisik. Kualitas audio dan framing otomatis adalah kunci keterlibatan.</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
}
