import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Shield, UserPlus, CheckCircle2, Trash2, Edit2, LogIn } from "lucide-react";
import { MOCK_USERS, getCurrentUser, setCurrentUser, UserAccount } from "../../lib/auth";

export default function AccessPage() {
  const [successMsg, setSuccessMsg] = useState("");
  const [currentUser, setLocalCurrentUser] = useState<UserAccount>(getCurrentUser());

  useEffect(() => {
    const handleStorage = () => setLocalCurrentUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const simulateSwitchUser = (user: UserAccount) => {
    setCurrentUser(user);
    setLocalCurrentUser(user);
    setSuccessMsg(`Berhasil beralih profil ke: ${user.name}`);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
         <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Hak Akses</h1>
         <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Kelola akun dan izin yang dibagikan antar pengguna</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-widest border border-emerald-200">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-[#35ACDF]" /> {successMsg}
        </div>
      )}

      <div className="space-y-6">
        <div className="flex justify-between items-center max-sm:flex-col items-start gap-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[#35ACDF]">
                <Shield className="w-5 h-5 text-[#35ACDF]" />
             </div>
             <div>
               <h2 className="text-lg font-black text-[#00172D]">Bagikan Akses</h2>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kelola siapa yang dapat melihat / mengedit data sistem</p>
             </div>
           </div>
           <Link to="/dashboard/access/add" className="flex items-center gap-2 px-6 py-2.5 bg-[#35ACDF] hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[10px] rounded-xl shadow-md shadow-[#35ACDF]/20 transition-all">
             <UserPlus className="w-4 h-4 text-[#35ACDF]" /> Pengguna Baru
           </Link>
        </div>

        {/* User Table */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Pengguna</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Kata Sandi</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Ringkasan</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Peta & Mitra</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Kinerja</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500">Akses Sistem</th>
                  <th className="p-4 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Tindakan</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_USERS.map(rowUser => (
                  <tr key={rowUser.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${currentUser.id === rowUser.id ? "bg-blue-50/30" : ""}`}>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-[#00172D] text-sm">{rowUser.name}</p>
                        {currentUser.id === rowUser.id && (
                          <span className="px-2 py-0.5 bg-[#35ACDF] text-white text-[9px] rounded-md font-bold uppercase tracking-widest">Saat Ini</span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{rowUser.email}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600 tracking-widest">
                           {rowUser.password ? "••••••••" : "Belum diatur"}
                         </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.permissions.ringkasan === 'Super Admin' ? 'bg-[#00172D] text-white' : rowUser.permissions.ringkasan === 'Viewer' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                        {rowUser.permissions.ringkasan}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.permissions.map === 'Super Admin' ? 'bg-[#00172D] text-white' : rowUser.permissions.map === 'Viewer' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                          Peta: {rowUser.permissions.map}
                        </span>
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.permissions.partners === 'Super Admin' ? 'bg-[#00172D] text-white' : rowUser.permissions.partners === 'Viewer' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                          Mitra: {rowUser.permissions.partners}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.permissions.transactions === 'Super Admin' ? 'bg-[#00172D] text-white' : rowUser.permissions.transactions === 'Viewer' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                          Trx: {rowUser.permissions.transactions}
                        </span>
                        <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.permissions.products === 'Super Admin' ? 'bg-[#00172D] text-white' : rowUser.permissions.products === 'Viewer' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-400'}`}>
                          Produk: {rowUser.permissions.products}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                       <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded inline-block w-max ${rowUser.permissions.access === 'Super Admin' ? 'bg-[#00172D] text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {rowUser.permissions.access}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button 
                           onClick={() => simulateSwitchUser(rowUser)} 
                           title="Simulasikan Login sebagai User ini"
                           className="p-2 text-[#35ACDF] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200"
                         >
                           <LogIn className="w-4 h-4 text-[#35ACDF]" />
                         </button>
                        <Link to={`/dashboard/access/edit?id=${rowUser.id}`} className="p-2 text-gray-400 hover:text-[#35ACDF] hover:bg-blue-50 rounded-lg transition-colors inline-block"><Edit2 className="w-4 h-4 text-gray-400" /></Link>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 flex items-start gap-2">
            <span className="font-bold uppercase tracking-widest text-gray-800 shrink-0">Info Simulasi:</span> 
            Klik ikon "Log In" di kolom Tindakan untuk berpindah sesi dan melihat perubahan menu di Sidebar sesuai izin peran. Peran "None" menyembunyikan navigasi secara visual.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
