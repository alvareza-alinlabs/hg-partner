import { useState, useEffect, FormEvent } from "react";
import { motion } from "motion/react";
import { CheckCircle2, Loader2, AlertCircle, Phone, Briefcase, Mail, User, Calendar, Clock } from "lucide-react";
import Header from "./Landing/Header";
import BottomNavigation from "./Landing/BottomNavigation";

export default function AppointmentPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [schedules, setSchedules] = useState<{ waktu: string }[]>([]);
  const [conflictError, setConflictError] = useState("");

  useEffect(() => {
    fetch("/data/schedules.json")
      .then(res => res.json())
      .then(data => setSchedules(data));
  }, []);

  const handleDateTimeChange = (newDate: string, newTime: string) => {
    setSelectedDate(newDate);
    setSelectedTime(newTime);
    setConflictError("");

    if (!newDate || !newTime) return;

    // Check if the selected time is within 1 hour of any existing schedule
    const selectedDateTime = new Date(`${newDate}T${newTime}`).getTime();
    const hasConflict = schedules.some(schedule => {
      const scheduleTime = new Date(schedule.waktu).getTime();
      const diffInHours = Math.abs(scheduleTime - selectedDateTime) / (1000 * 60 * 60);
      return diffInHours < 1; // Block if within 1 hour
    });

    if (hasConflict) {
      setConflictError("Maaf, jadwal pada waktu tersebut sudah terisi. Silakan pilih waktu lain.");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (conflictError) return;

    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => {
        setStatus("idle");
        setSelectedDate("");
        setSelectedTime("");
        // Reset form would normally be done here
      }, 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col text-[#00172D] pb-16 md:pb-0">
      <Header />
      
      <main className="flex-1 flex flex-col p-6 mb-12 md:mb-24 pt-24 md:pt-32 w-full max-w-7xl mx-auto">
        
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-left mb-8 md:mb-16 w-full"
        >
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block">Konsultasi Personal</span>
          <h1 className="text-3xl md:text-5xl font-black text-[#00172D] mb-4 md:mb-6 tracking-tight">Atur Jadwal Pertemuan</h1>
          <p className="text-gray-500 font-medium text-xs md:text-lg leading-relaxed max-w-2xl">
            Diskusikan kebutuhan distribusi dan jelajahi portofolio produk unggulan bersama kami. Pilih waktu fleksibel untuk sesi Anda.
          </p>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.1 }}
           className="w-full"
        >
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8 bg-white p-6 md:p-12 rounded-3xl md:rounded-[2rem] border border-gray-100 shadow-xl shadow-blue-900/5">
            {/* Segment 1: PIC & Jadwal */}
            <div className="space-y-5 md:space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                  <User className="w-4 h-4 text-[#35ACDF]" />
                </div>
                <h3 className="font-bold text-[#00172D] text-xs md:text-sm uppercase tracking-widest">1. Informasi & Jadwal</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Nama Lengkap (PIC)</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all font-medium text-xs md:text-sm hover:border-gray-300"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Nomor HP</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="tel"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all font-medium text-xs md:text-sm hover:border-gray-300"
                      placeholder="0812..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Tanggal Pertemuan</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required 
                      type="date" 
                      value={selectedDate}
                      onChange={(e) => handleDateTimeChange(e.target.value, selectedTime)}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 transition-all font-medium text-xs md:text-sm hover:border-gray-300 text-gray-600 appearance-none`} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Waktu</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      required 
                      type="time" 
                      value={selectedTime}
                      onChange={(e) => handleDateTimeChange(selectedDate, e.target.value)}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 transition-all font-medium text-xs md:text-sm hover:border-gray-300 text-gray-600 appearance-none ${conflictError ? 'border-red-400 focus:ring-red-500/50' : 'border-gray-200'}`} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Segment 2: Detail Perusahaan */}
            <div className="space-y-5 md:space-y-6 pt-2 md:pt-4">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                  <Briefcase className="w-4 h-4 text-[#35ACDF]" />
                </div>
                <h3 className="font-bold text-[#00172D] text-xs md:text-sm uppercase tracking-widest">2. Profil Perusahaan</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Nama Perusahaan</label>
                  <input
                    required
                    type="text"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all font-medium text-xs md:text-sm hover:border-gray-300"
                    placeholder="PT Maju Bersama"
                  />
                </div>
                <div className="space-y-2">
                   <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Sektor Industri</label>
                   <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 transition-all font-medium text-xs md:text-sm hover:border-gray-300 text-gray-600 appearance-none">
                     <option value="">Pilih Sektor Industri...</option>
                     <option value="Teknologi">Teknologi & IT</option>
                     <option value="Pendidikan">Pendidikan</option>
                     <option value="Kesehatan">Kesehatan</option>
                     <option value="Keuangan">Perbankan & Keuangan</option>
                     <option value="Ritel">Ritel & E-Commerce</option>
                     <option value="Lainnya">Lainnya</option>
                   </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Kantor</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all font-medium text-xs md:text-sm hover:border-gray-300"
                      placeholder="nama@perusahaan.com"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Segment 3: Catatan */}
            <div className="space-y-5 md:space-y-6 pt-2 md:pt-4">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                  <AlertCircle className="w-4 h-4 text-[#35ACDF]" />
                </div>
                <h3 className="font-bold text-[#00172D] text-xs md:text-sm uppercase tracking-widest">3. Detail Tambahan</h3>
              </div>
              
              <div className="space-y-3">
                <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Ketertarikan Produk</label>
                <div className="flex flex-wrap gap-2">
                  {["HP Inc", "Poly", "Laptop", "Printer", "PC"].map((item) => (
                    <label key={item} className="relative flex-shrink-0 cursor-pointer group">
                      <input type="checkbox" className="peer sr-only" />
                      <span className="inline-block px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 border border-gray-200 rounded-lg text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-500 transition-all peer-checked:bg-[#00172D] peer-checked:text-white peer-checked:border-[#00172D] hover:bg-gray-100 peer-checked:hover:bg-[#00172D]">
                        {item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Tujuan Meeting & Catatan</label>
                <textarea 
                  required 
                  rows={3} 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all resize-none font-medium text-xs md:text-sm hover:border-gray-300" 
                  placeholder="Ceritakan singkat tujuan konsultasi Anda..." 
                />
              </div>
            </div>
            
            {conflictError && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="flex items-center gap-2 p-3 md:p-4 bg-red-50 text-red-600 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#35ACDF]" />
                {conflictError}
              </motion.div>
            )}

            <div className="pt-4 md:pt-6">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                disabled={status !== "idle" || !!conflictError}
                type="submit"
                className="w-full py-4 mt-2 bg-[#00172D] hover:bg-gray-900 text-white font-black uppercase tracking-widest text-[11px] md:text-xs rounded-xl shadow-xl shadow-[#00172D]/20 transition-all border border-transparent hover:border-gray-700 flex items-center justify-center h-12 md:h-14 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#00172D]"
              >
                {status === "idle" && "Konfirmasi Jadwalan"}
                {status === "loading" && <Loader2 className="w-5 h-5 animate-spin text-[#35ACDF]" />}
                {status === "success" && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /> Berhasil Dikirim
                  </motion.div>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
      <BottomNavigation />
    </div>
  );
}
