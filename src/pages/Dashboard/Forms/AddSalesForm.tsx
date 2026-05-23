import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ClientData } from "../../../types";

export default function AddSalesForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ClientData>>({
    status_kemitraan: "Mitra Aktif",
    brand_utama: "HP Inc"
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/sales");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-6 pb-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="hidden md:flex p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Tambah Tim Sales</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Daftarkan Tim Sales Internal Baru</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap (PIC)</label>
              <input required type="text" value={formData.nama_pic || ""} onChange={e => setFormData({...formData, nama_pic: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jabatan</label>
              <input required type="text" placeholder="Area Sales Manager" value={formData.jabatan || ""} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon / WhatsApp</label>
              <input required type="text" value={formData.no_hp || formData.telepon_kantor || ""} onChange={e => setFormData({...formData, no_hp: e.target.value, telepon_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Perusahaan</label>
              <input required type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area Assignment (Provinsi)</label>
              <input required type="text" value={formData.provinsi || ""} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fokus Brand</label>
              <select required value={formData.brand_utama || "HP Inc"} onChange={e => setFormData({...formData, brand_utama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                <option value="HP Inc">HP Inc</option>
                <option value="Poly">Poly</option>
                <option value="Multibrand">Multibrand</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold flex items-center gap-1 text-orange-500 uppercase tracking-widest">Latitude (Garis Lintang)</label>
              <input required step="any" type="number" value={formData.koordinat_lat || ""} onChange={e => setFormData({...formData, koordinat_lat: parseFloat(e.target.value)})} placeholder="-6.200000" className="w-full px-4 py-3 bg-blue-50/30 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold flex items-center gap-1 text-[#35ACDF] uppercase tracking-widest">Longitude (Garis Bujur)</label>
              <input required step="any" type="number" value={formData.koordinat_long || ""} onChange={e => setFormData({...formData, koordinat_long: parseFloat(e.target.value)})} placeholder="106.816666" className="w-full px-4 py-3 bg-orange-50/30 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Detail Lengkap / Base Area</label>
            <textarea required rows={3} value={formData.alamat_detail || ""} onChange={e => setFormData({...formData, alamat_detail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium resize-none" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
             <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Batal
             </button>
             <button type="submit" className="px-6 py-3 bg-[#00172D] hover:bg-[#004A7D] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center gap-2">
               <Save className="w-4 h-4 text-[#35ACDF]" /> Tambah Sales
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
