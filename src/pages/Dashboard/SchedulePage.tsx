import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Search, User, Filter, Phone, Edit2, Trash2, Plus, X, AlignLeft, CheckSquare } from "lucide-react";

interface Schedule {
  id: string;
  nama: string;
  perusahaan: string;
  telepon: string;
  email_kantor?: string;
  sektor_industri?: string;
  skala_perusahaan?: string;
  waktu: string;
  tujuan: string;
  produk: string[];
  tipe_jadwal?: string;
  status?: string;
  diajukan_oleh?: string;
}

interface RoutineSchedule {
  id: string;
  waktu: string;
  kegiatan: string;
  deskripsi: string;
  tipe: "Harian" | "Mingguan";
}

const FIXED_SCHEDULES: RoutineSchedule[] = [
  { id: "RTN-1", waktu: "08:30 WIB", kegiatan: "Daily Standup Sales", deskripsi: "Briefing target harian dan evaluasi masalah lapangan dari hari sebelumnya.", tipe: "Harian" },
  { id: "RTN-2", waktu: "13:00 WIB", kegiatan: "Laporan Kunjungan Tengah Hari", deskripsi: "Update status prospek dan hasil visit pagi hari.", tipe: "Harian" },
  { id: "RTN-3", waktu: "16:30 WIB", kegiatan: "Wrap-up & Pipeline Review", deskripsi: "Rekap pencapaian harian sebelum absensi pulang.", tipe: "Harian" },
  { id: "RTN-4", waktu: "Jumat, 14:00 WIB", kegiatan: "Weekly Team Meeting", deskripsi: "Evaluasi kinerja mingguan, pembahasan strategi minggu depan.", tipe: "Mingguan" }
];

export default function SchedulePage() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"rencana" | "tetap">("rencana");

  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Schedule>>({});

  useEffect(() => {
    fetch("/data/schedules.json")
      .then((res) => res.json())
      .then((data) => {
        // Sort by dates ascending
        const sorted = data.sort((a: Schedule, b: Schedule) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime());
        setSchedules(sorted);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (isAdding) {
      const newSched = { ...formData, id: `SCH-${Date.now()}`, produk: formData.produk || ["HP Inc"] } as Schedule;
      setSchedules([...schedules, newSched].sort((a, b) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime()));
      setIsAdding(false);
    } else if (isEditing) {
      setSchedules(schedules.map(s => s.id === isEditing ? { ...s, ...formData } as Schedule : s).sort((a, b) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime()));
      setIsEditing(null);
    }
  };

  const filteredSchedules = schedules.filter(s => 
    s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.perusahaan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tujuan.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Jadwal</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Manajemen Aktivitas Harian & Rencana Kunjungan</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col lg:flex-row items-center gap-4 w-full justify-between"
        >
          <div className="w-full lg:flex-1 lg:max-w-md">
            {activeTab === "rencana" && (
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari rencana..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2.5 w-full bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 shadow-sm transition-all text-sm font-medium h-[42px]"
                />
              </div>
            )}
          </div>

          <div className="flex w-full lg:w-auto gap-3 shrink-0 justify-between lg:justify-end">
            {activeTab === "rencana" && (
              <button 
                 onClick={() => navigate('/dashboard/schedule/add')}
                 className="px-5 py-2 h-[42px] bg-[#00172D] hover:bg-gray-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md transition-all flex items-center gap-1.5"
              >
                 <Plus className="w-4 h-4 text-[#35ACDF]" /> Tambah
              </button>
            )}

            <div className="flex bg-white border border-gray-100 rounded-full p-1 shadow-sm h-[42px] w-full lg:w-auto overflow-x-auto shrink-0">
              <button onClick={() => setActiveTab("rencana")} className={`flex-none px-4 py-1 flex items-center justify-center gap-2 rounded-full transition-colors text-[10px] font-bold uppercase tracking-widest ${activeTab === "rencana" ? "bg-[#00172D] text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> <span className="hidden sm:inline">Jadwal Rencana</span><span className="sm:hidden">Rencana</span>
              </button>
              <button onClick={() => setActiveTab("tetap")} className={`flex-none px-4 py-1 flex items-center justify-center gap-2 rounded-full transition-colors text-[10px] font-bold uppercase tracking-widest ${activeTab === "tetap" ? "bg-[#00172D] text-white" : "text-gray-400 hover:bg-gray-50"}`}>
                <CheckSquare className="w-3.5 h-3.5 text-[#35ACDF]" /> <span className="hidden sm:inline">Rutinitas Tetap</span><span className="sm:hidden">Rutinitas</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === "rencana" ? (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredSchedules.map((schedule, index) => {
              const dateObj = new Date(schedule.waktu);
              const formattedDate = dateObj.toLocaleDateString("id-ID", {
                weekday: "long",
                day: "numeric",
                month: "short",
                year: "numeric"
              });
              const formattedTime = dateObj.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit"
              });

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={schedule.id}
                  onClick={() => navigate(`/dashboard/schedule/detail/${schedule.id}`)}
                  className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col group relative cursor-pointer"
                >
                  <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); navigate('/dashboard/schedule/add?edit=' + schedule.id); }} className="p-1.5 text-gray-400 hover:text-[#35ACDF] hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4 text-gray-400" /></button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(schedule.id); }} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400" /></button>
                  </div>

                  <div className="flex justify-between items-start mb-4 md:mb-6 border-b border-gray-50 pb-3 md:pb-4">
                    <div className="flex flex-col">
                       <span className="text-[#35ACDF] font-black text-xs md:text-sm uppercase tracking-widest flex items-center gap-1.5">
                         <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" /> {formattedDate}
                       </span>
                       <span className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1.5 mt-1">
                         <Clock className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-400" /> {formattedTime} WIB
                       </span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {schedule.tipe_jadwal && (
                        <span className={`px-2 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded ${schedule.tipe_jadwal === 'sales' ? 'bg-indigo-50 text-indigo-600' : 'bg-purple-50 text-purple-600'}`}>
                          {schedule.tipe_jadwal}
                        </span>
                      )}
                      {schedule.status && (
                        <span className={`px-2 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded ${schedule.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : schedule.status === 'canceled' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'}`}>
                          {schedule.status}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-black text-[#00172D] mb-1 pr-16">{schedule.nama}</h3>
                  <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-3 md:mb-4">
                    {schedule.perusahaan}
                  </p>

                  <div className="bg-gray-50 rounded-xl md:rounded-2xl p-3 md:p-4 border border-gray-100 mb-4 md:mb-6 flex-1">
                    <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Agenda / Target</p>
                    <p className="text-xs md:text-sm font-medium text-gray-700 leading-relaxed">{schedule.tujuan}</p>
                  </div>
                  
                  <div className="mt-auto space-y-3 md:space-y-4">
                     <div className="flex justify-between items-center text-[9px] md:text-[10px] uppercase font-bold tracking-widest pt-3 md:pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-1.5 text-gray-500">
                           <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#35ACDF]" /> {schedule.telepon}
                        </div>
                        <div className="flex gap-1.5 flex-wrap justify-end">
                          {schedule.produk.map(p => (
                            <span key={p} className="bg-gray-100 text-[#35ACDF] px-2 py-0.5 rounded-full">
                              {p}
                            </span>
                          ))}
                        </div>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredSchedules.length === 0 && (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }}
               className="col-span-full py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm"
             >
               Tidak ada jadwal ditemukan
             </motion.div>
          )}
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <AnimatePresence>
             {FIXED_SCHEDULES.map((routine, index) => (
               <motion.div
                 layout
                 initial={{ opacity: 0, scale: 0.9 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.9 }}
                 transition={{ duration: 0.2, delay: index * 0.05 }}
                 key={routine.id}
                 className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm flex flex-col group relative"
               >
                 <div className="flex justify-between items-start border-b border-gray-50 pb-3 md:pb-4 mb-4 md:mb-6">
                    <span className="text-[#00172D] font-black text-base md:text-lg">{routine.kegiatan}</span>
                    <span className={`px-2 md:px-3 py-1 text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-full ${routine.tipe === "Harian" ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"}`}>
                      {routine.tipe}
                    </span>
                 </div>
                 
                 <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-[#35ACDF] mb-3 md:mb-4">
                   <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /> {routine.waktu}
                 </div>

                 <p className="text-gray-500 text-xs md:text-sm font-medium leading-relaxed mb-1 mt-auto">
                   {routine.deskripsi}
                 </p>
               </motion.div>
             ))}
          </AnimatePresence>
        </motion.div>
      )}

    </motion.div>
  );
}
