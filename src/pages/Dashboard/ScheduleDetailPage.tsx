import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Edit2, Phone, Trash2, MapPin, Building, Flag, Mail, Briefcase, Users } from "lucide-react";

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<any>(null);
  const [salesPerson, setSalesPerson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/schedules.json").then(res => res.json()),
      fetch("/data/sales.json").then(res => res.json())
    ])
      .then(([schedulesData, salesData]) => {
        const found = schedulesData.find((s: any) => s.id === id);
        if (found) {
          setSchedule(found);
          if (found.diajukan_oleh) {
            const sp = salesData.find((s: any) => s.id === found.diajukan_oleh);
            if (sp) {
              setSalesPerson(sp);
            }
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!schedule) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-gray-500 uppercase tracking-widest">Jadwal tidak ditemukan</h2>
      </div>
    );
  }

  const dateObj = new Date(schedule.waktu);
  const formattedDate = dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const formattedTime = dateObj.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20 space-y-6"
    >
      <Link to="/dashboard/schedule" className="hidden md:inline-flex items-center gap-2 text-gray-400 hover:text-[#35ACDF] transition-colors font-bold uppercase tracking-widest text-[10px] mb-4">
        <ArrowLeft className="w-4 h-4 text-gray-400" /> Kembali
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
         <div>
            <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Detail Jadwal</h1>
            <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">{schedule.id}</p>
         </div>
         <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/dashboard/schedule/add?edit=${schedule.id}`)} className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 transition-colors border border-gray-200">
               <Edit2 className="w-4 h-4 text-gray-400" /> Edit
            </button>
            <button onClick={() => alert("Fitur hapus belum tersedia")} className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase tracking-widest text-[10px] rounded-xl flex items-center gap-2 transition-colors border border-red-100">
               <Trash2 className="w-4 h-4 text-gray-400" /> Hapus
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-6 border-b border-gray-100 pb-6">
                  <div>
                    <h2 className="text-2xl font-black text-[#00172D] uppercase tracking-tight">{schedule.nama}</h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                       <Building className="w-4 h-4 text-[#35ACDF]" /> {schedule.perusahaan}
                    </div>
                    {schedule.email_kantor && (
                      <div className="flex items-center gap-2 mt-1 text-gray-500 font-bold text-xs uppercase tracking-widest">
                         <Mail className="w-4 h-4 text-gray-400" /> {schedule.email_kantor}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-gray-500 font-bold text-xs uppercase tracking-widest">
                       <Phone className="w-4 h-4 text-gray-400" /> {schedule.telepon}
                    </div>
                    
                    {(schedule.sektor_industri || schedule.skala_perusahaan) && (
                      <div className="flex items-center gap-3 mt-3">
                         {schedule.sektor_industri && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                               <Briefcase className="w-3 h-3 text-[#35ACDF]" /> {schedule.sektor_industri}
                            </span>
                         )}
                         {schedule.skala_perusahaan && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                               <Users className="w-3 h-3 text-[#35ACDF]" /> {schedule.skala_perusahaan} Karyawan
                            </span>
                         )}
                      </div>
                    )}
                 </div>
                 <div className="flex flex-col items-start sm:items-end gap-2">
                    {schedule.tipe_jadwal && (
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${schedule.tipe_jadwal === 'sales' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                        Tipe: {schedule.tipe_jadwal}
                      </span>
                    )}
                    {schedule.status && (
                      <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full ${schedule.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : schedule.status === 'canceled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                        Status: {schedule.status}
                      </span>
                    )}
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-2 text-[#35ACDF] mb-3">
                       <Calendar className="w-5 h-5 text-gray-400" />
                       <span className="font-black uppercase tracking-widest text-xs">Tanggal Pelaksanaan</span>
                    </div>
                    <p className="font-bold text-[#00172D]">{formattedDate}</p>
                 </div>
                 
                 <div className="bg-blue-50/50 p-6 rounded-2xl border border-orange-100">
                    <div className="flex items-center gap-2 text-[#35ACDF] mb-3">
                       <Clock className="w-5 h-5 text-gray-400" />
                       <span className="font-black uppercase tracking-widest text-xs">Waktu Pelaksanaan</span>
                    </div>
                    <p className="font-bold text-[#00172D]">{formattedTime} WIB</p>
                 </div>
              </div>

              <div>
                 <div className="flex items-center gap-2 text-gray-400 mb-3 border-b border-gray-100 pb-2">
                    <Flag className="w-4 h-4 text-[#35ACDF]" />
                    <span className="font-black uppercase tracking-widest text-xs">Tujuan & Agenda</span>
                 </div>
                 <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-medium text-gray-600 leading-relaxed">
                    {schedule.tujuan}
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center space-y-4">
              <h3 className="font-black text-[#00172D] uppercase tracking-widest text-xs border-b border-gray-100 pb-3">Produk Diminati</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                 {schedule.produk && schedule.produk.map((p: string, idx: number) => (
                    <span key={idx} className="bg-gray-100 text-gray-700 font-bold uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl">
                       {p}
                    </span>
                 ))}
                 {(!schedule.produk || schedule.produk.length === 0) && (
                    <span className="text-gray-400 text-xs italic">Tidak ada referensi produk</span>
                 )}
              </div>
           </div>

           {schedule.diajukan_oleh && (
             <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
               <h3 className="font-black text-[#00172D] uppercase tracking-widest text-xs border-b border-gray-100 pb-3 text-center">Diajukan Oleh</h3>
               <div className="text-center">
                  <p className="font-bold text-gray-800">{salesPerson ? salesPerson.nama_pic : schedule.diajukan_oleh}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {salesPerson?.jabatan || (schedule.diajukan_oleh.startsWith('S') ? 'Sales Representative' : 'Sistem Referensi')}
                  </p>
               </div>
               
               {salesPerson && (
                 <div className="pt-4 border-t border-gray-50 flex flex-col gap-3">
                   {salesPerson.email_kantor && (
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest justify-center">
                       <Mail className="w-3.5 h-3.5 text-gray-400" />
                       {salesPerson.email_kantor}
                     </div>
                   )}
                   {salesPerson.no_hp && (
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest justify-center">
                       <Phone className="w-3.5 h-3.5 text-gray-400" />
                       {salesPerson.no_hp}
                     </div>
                   )}
                   {(salesPerson.provinsi || salesPerson.area) && (
                     <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest justify-center">
                       <MapPin className="w-3.5 h-3.5 text-gray-400" />
                       {salesPerson.area ? `${salesPerson.area}, ` : ''}{salesPerson.provinsi}
                     </div>
                   )}
                 </div>
               )}
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}
