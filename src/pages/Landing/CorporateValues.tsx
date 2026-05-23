import { ShieldCheck, HeadphonesIcon } from "lucide-react";

export default function CorporateValues({ stats, data }: { stats: any, data?: any }) {
  return (
    <section id="nilai" className="bg-[#00172D] py-16 md:py-24 lg:py-32 relative z-10 overflow-hidden text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-6 relative z-10 grid lg:grid-cols-2 gap-12 md:gap-16 items-center">
         <div>
           <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3 md:mb-4 block">Nilai Strategis</span>
           <h2 className="text-3xl md:text-5xl font-black mb-4 md:mb-6 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: data?.title?.replace('\n', '<br/>') || "Komitmen Kepada <br/>Mitra & Klien." }}></h2>
           <p className="text-blue-100/80 text-sm md:text-lg mb-8 md:mb-10 leading-relaxed">
             {data?.subtitle || "Bukan sekadar menawarkan produk, namun kami memastikan kemitraan yang berkelanjutan. Kami memberikan dukungan solusi perangkat keras yang tepat sasaran, dengan jaminan layanan resmi dari principal."}
           </p>
           
           <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400 shrink-0 backdrop-blur-sm border border-white/5">
                  <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-[#35ACDF]" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black mb-1">Jaminan Keaslian Eksekutif</h4>
                  <p className="text-[11px] md:text-xs text-blue-200/70 leading-relaxed md:leading-relaxed">Sertifikasi rantai pasok ketat menjamin tidak ada komponen pasar abu-abu. Garansi prinsipal berlaku penuh hari pertama.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center text-[#35ACDF] shrink-0 backdrop-blur-sm border border-white/5">
                  <HeadphonesIcon className="w-5 h-5 md:w-6 md:h-6 text-[#35ACDF]" />
                </div>
                <div>
                  <h4 className="text-base md:text-lg font-black mb-1">Dukungan Lapis Kedua (L2)</h4>
                  <p className="text-[11px] md:text-xs text-blue-200/70 leading-relaxed md:leading-relaxed">Tim rekayasa internal bersertifikasi siap memandu eskalasi kompleks, melewati batas layanan dasar vendor.</p>
                </div>
              </div>
           </div>
         </div>
         
         <div className="bg-white/5 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-10 border border-white/10 backdrop-blur-md">
            <h3 className="text-lg md:text-xl font-black mb-6 md:mb-8 text-center tracking-tight">Kinerja Kemitraan Tahunan</h3>
            
            <div className="space-y-6 md:space-y-8">
              <div>
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-200">Volume Perangkat Komputasi</span>
                  <span className="text-base md:text-lg font-black">{Number.isNaN(stats.volumeUnit) ? "0" : stats.volumeUnit.toLocaleString()}+ <span className="text-[10px] md:text-xs text-blue-400 font-bold uppercase tracking-widest">Unit</span></span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full transition-all duration-1000" style={{ width: `${stats.volumePercent || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-200">Penyebaran Alat Kolaborasi</span>
                  <span className="text-base md:text-lg font-black">{Number.isNaN(stats.roomCollab) ? "0" : stats.roomCollab.toLocaleString()}+ <span className="text-[10px] md:text-xs text-orange-400 font-bold uppercase tracking-widest">Ruang</span></span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full transition-all duration-1000" style={{ width: `${stats.roomPercent || 0}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-2 md:mb-3">
                  <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-blue-200">Indeks Penyelesaian Tender</span>
                  <span className="text-base md:text-lg font-black">{Number.isNaN(stats.tenderSuccess) ? "0" : stats.tenderSuccess}%</span>
                </div>
                <div className="h-1.5 md:h-2 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${stats.tenderSuccess || 0}%` }}></div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 md:mt-12 text-center pt-6 md:pt-8 border-t border-white/10">
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pencapaian Berkelanjutan Hari Ini (Q3 2024)</p>
            </div>
         </div>
      </div>
    </section>
  );
}
