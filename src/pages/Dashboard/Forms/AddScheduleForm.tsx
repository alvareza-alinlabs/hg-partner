import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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

export default function AddScheduleForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Schedule>>({
     tipe_jadwal: 'sales',
     status: 'pending',
     produk: []
  });

  const handleProductToggle = (product: string) => {
    const currentProducts = formData.produk || [];
    if (currentProducts.includes(product)) {
      setFormData({ ...formData, produk: currentProducts.filter(p => p !== product) });
    } else {
      setFormData({ ...formData, produk: [...currentProducts, product] });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    navigate("/dashboard/schedule");
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
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Tambah Rencana Pertemuan</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Atur Jadwal Kunjungan & Aktivitas</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Mitra / PIC</label>
              <input required type="text" value={formData.nama || ""} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon Kontak</label>
              <input required type="text" value={formData.telepon || ""} onChange={e => setFormData({...formData, telepon: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Perusahaan</label>
              <input required type="text" value={formData.perusahaan || ""} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Kantor</label>
              <input type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sektor Industri</label>
              <select value={formData.sektor_industri || ""} onChange={e => setFormData({...formData, sektor_industri: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                <option value="">Pilih Industri...</option>
                <option value="Teknologi">Teknologi & IT</option>
                <option value="Pendidikan">Pendidikan</option>
                <option value="Kesehatan">Kesehatan</option>
                <option value="Keuangan">Perbankan & Keuangan</option>
                <option value="Ritel">Ritel & E-Commerce</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="space-y-1">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skala Perusahaan</label>
               <select value={formData.skala_perusahaan || ""} onChange={e => setFormData({...formData, skala_perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                 <option value="">Pilih Skala...</option>
                 <option value="1-50">1 - 50 Karyawan</option>
                 <option value="51-200">51 - 200 Karyawan</option>
                 <option value="201-500">201 - 500 Karyawan</option>
                 <option value="500+">Lebih dari 500 Karyawan</option>
               </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal & Waktu</label>
              <input required type="datetime-local" value={formData.waktu || ""} onChange={e => setFormData({...formData, waktu: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium text-gray-600" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe Jadwal</label>
              <select value={formData.tipe_jadwal || "sales"} onChange={e => setFormData({...formData, tipe_jadwal: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                <option value="sales">Jadwal Sales (Pengajuan)</option>
                <option value="pribadi">Rencana Pribadi (User)</option>
              </select>
            </div>
          </div>
          
          {formData.tipe_jadwal === "sales" && (
              <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Persetujuan</label>
              <select value={formData.status || "pending"} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                  <option value="pending">Menunggu Persetujuan</option>
                  <option value="approved">Disetujui (Approved)</option>
                  <option value="canceled">Dibatalkan (Canceled)</option>
              </select>
              </div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Ketertarikan Produk</label>
            <div className="flex flex-wrap gap-2">
              {["HP Inc", "Poly", "Laptop", "Printer", "PC"].map((item) => (
                <label key={item} className="relative flex-shrink-0 cursor-pointer group">
                  <input type="checkbox" className="peer sr-only" checked={formData.produk?.includes(item)} onChange={() => handleProductToggle(item)} />
                  <span className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 transition-all peer-checked:bg-[#00172D] peer-checked:text-white peer-checked:border-[#00172D] hover:bg-gray-100 peer-checked:hover:bg-[#00172D]">
                    {item}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catatan Agenda / Tujuan</label>
            <textarea required rows={4} value={formData.tujuan || ""} onChange={e => setFormData({...formData, tujuan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium resize-none" />
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
             <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Batal
             </button>
             <button type="submit" className="px-6 py-3 bg-[#00172D] hover:bg-[#004A7D] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center gap-2">
               <Save className="w-4 h-4 text-[#35ACDF]" /> Simpan Jadwal
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
