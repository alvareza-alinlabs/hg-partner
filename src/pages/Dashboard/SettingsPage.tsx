import { useState, FormEvent, useEffect } from "react";
import { motion } from "motion/react";
import { Key, CheckCircle2, Globe, Moon, Download } from "lucide-react";
import { getCurrentUser, setCurrentUser, UserAccount } from "../../lib/auth";

export default function SettingsPage() {
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setLocalCurrentUser] = useState<UserAccount>(getCurrentUser());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleStorage = () => setLocalCurrentUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        }
        setDeferredPrompt(null);
      });
    } else {
      alert("Perangkat Anda tidak mendukung instalasi aplikasi (PWA) atau aplikasi sudah diinstal.");
    }
  };

  const handleSaveAccount = (e: FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Pengaturan berhasil disimpan.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-4xl"
    >
      <div>
         <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Pengaturan Pribadi</h1>
         <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Kelola kredensial akun, preferensi bahasa, dan tema</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#35ACDF]" /> {successMsg}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        {/* Kredensial */}
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#35ACDF]">
                <Key className="w-5 h-5 text-[#35ACDF]" />
             </div>
             <div>
               <h2 className="text-lg font-black text-[#00172D]">Kredensial Akun</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Perbarui email & kata sandi Anda</p>
             </div>
          </div>

          <form onSubmit={handleSaveAccount} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap</label>
                <input type="text" disabled value={currentUser.name} className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 transition-all text-sm font-medium opacity-70" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Email</label>
                <input type="email" defaultValue={currentUser.email} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 transition-all text-sm font-medium" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kata Sandi Baru</label>
                <input type="password" placeholder="Kosongkan untuk mempertahankan yang sama" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 transition-all text-sm font-medium" />
              </div>
            </div>
            <div className="pt-2">
              <button type="submit" className="px-8 py-3 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-[#00172D]/20 transition-all">
                Simpan Kredensial
              </button>
            </div>
          </form>
        </div>

        {/* Preferensi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Instalasi PWA */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden md:col-span-2">
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#35ACDF]">
                  <Download className="w-5 h-5 text-[#35ACDF]" />
               </div>
               <div>
                 <h2 className="text-lg font-black text-[#00172D]">Instalasi Aplikasi</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pasang aplikasi ini di perangkat Anda</p>
               </div>
            </div>
            <div className="space-y-4 relative z-10">
              <p className="text-sm text-gray-600">
                Aplikasi ini mendukung Progressive Web App (PWA). Anda dapat menginstalnya di perangkat (desktop atau mobile) untuk akses lebih cepat, tanpa perlu membuka browser.
              </p>
              <button 
                onClick={handleInstallClick}
                className="px-8 py-3 bg-blue-500 hover:bg-emerald-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4 text-[#35ACDF]" /> Install Aplikasi Sekarang
              </button>
            </div>
          </div>

          {/* Bahasa */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-50 rounded-full blur-2xl opacity-50"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#35ACDF]">
                  <Globe className="w-5 h-5 text-[#35ACDF]" />
               </div>
               <div>
                 <h2 className="text-lg font-black text-[#00172D]">Bahasa</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pilih bahasa UI</p>
               </div>
            </div>
            <div className="space-y-3 relative z-10">
              <label className="relative flex items-center justify-between p-4 border border-orange-200 bg-blue-50/30 rounded-2xl cursor-pointer">
                <span className="font-bold text-sm tracking-widest uppercase text-[#00172D]">Bahasa Indonesia</span>
                <input type="radio" name="lang" defaultChecked className="w-4 h-4 text-[#35ACDF] focus:ring-orange-500 border-gray-300" />
              </label>
              <label className="relative flex items-center justify-between p-4 border border-gray-100 hover:border-gray-200 rounded-2xl cursor-pointer">
                <span className="font-bold text-sm tracking-widest uppercase text-gray-500">English (US)</span>
                <input type="radio" name="lang" disabled className="w-4 h-4 text-orange-500 focus:ring-orange-500 border-gray-300" />
              </label>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">*Dukungan bahasa inggris akan segera hadir</p>
            </div>
          </div>

          {/* Tema */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl opacity-50"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
               <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#35ACDF]">
                  <Moon className="w-5 h-5 text-[#35ACDF]" />
               </div>
               <div>
                 <h2 className="text-lg font-black text-[#00172D]">Tema Tampilan</h2>
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mode Terang / Gelap</p>
               </div>
            </div>
            <div className="space-y-3 relative z-10">
              <label className="relative flex items-center justify-between p-4 border border-indigo-200 bg-blue-50/30 rounded-2xl cursor-pointer">
                <span className="font-bold text-sm tracking-widest uppercase text-[#00172D]">Mode Terang</span>
                <input type="radio" name="theme" defaultChecked className="w-4 h-4 text-[#35ACDF] focus:ring-indigo-500 border-gray-300" />
              </label>
              <label className="relative flex items-center justify-between p-4 border border-gray-100 hover:border-gray-200 rounded-2xl cursor-pointer">
                <span className="font-bold text-sm tracking-widest uppercase text-gray-500">Mode Gelap</span>
                <input type="radio" name="theme" disabled className="w-4 h-4 text-indigo-500 focus:ring-indigo-500 border-gray-300" />
              </label>
              <p className="text-[10px] uppercase font-bold text-gray-400 mt-2">*Mode gelap dalam tahap pengembangan</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
