import { useState, FormEvent } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { ClientData } from "../../../types";

export default function AddPartnerForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ClientData>>({
    tipe: "Distributor",
    brand_utama: "HP Inc",
    status_kemitraan: "Calon Mitra",
    fokus_produk: []
  });

  const handleProductToggle = (product: string) => {
    const currentProducts = formData.fokus_produk || [];
    if (currentProducts.includes(product)) {
      setFormData({ ...formData, fokus_produk: currentProducts.filter(p => p !== product) });
    } else {
      setFormData({ ...formData, fokus_produk: [...currentProducts, product] });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // Simulate save
    navigate("/dashboard/partners");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="hidden md:flex p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Formulir Partner</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Tambah / Edit Data Mitra</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Bagian 1: Perusahaan */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">1. Profil Perusahaan</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Perusahaan</label>
                <input required type="text" value={formData.perusahaan || ""} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jenis Perusahaan</label>
                <select required value={formData.jenis_perusahaan || ""} onChange={e => setFormData({...formData, jenis_perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                  <option value="" disabled>-- Pilih Jenis Perusahaan --</option>
                  <option value="Manufaktur">Manufaktur</option>
                  <option value="Bank / Keuangan">Bank / Keuangan</option>
                  <option value="Retail">Retail</option>
                  <option value="Teknologi / IT">Teknologi / IT</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Lainnya">Lainnya...</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Kantor</label>
                <input type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon Kantor</label>
                <input type="text" value={formData.telepon_kantor || ""} onChange={e => setFormData({...formData, telepon_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          {/* Bagian 2: PIC */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">2. Person In Charge (PIC)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama PIC / Kontak</label>
                <input required type="text" value={formData.nama_pic || ""} onChange={e => setFormData({...formData, nama_pic: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jabatan PIC</label>
                <input required type="text" value={formData.jabatan || ""} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nomor HP / WhatsApp</label>
                <input required type="text" value={formData.no_hp || ""} onChange={e => setFormData({...formData, no_hp: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">Nama Sales Internal (Penanggung Jawab)</label>
                <input type="text" value={formData.nama_sales || ""} onChange={e => setFormData({...formData, nama_sales: e.target.value})} className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
            </div>
          </div>

          {/* Bagian 3: Lokasi & Koordinat */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">3. Lokasi & Peta (WAJIB UNTUK MAPS)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provinsi</label>
                <input required type="text" value={formData.provinsi || ""} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kota / Kabupaten</label>
                <input required type="text" value={formData.kota || ""} onChange={e => setFormData({...formData, kota: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area Kawasan</label>
                <input type="text" value={formData.area || ""} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold flexitems-center gap-1 text-orange-500 uppercase tracking-widest">Latitude (Garis Lintang)</label>
                <input required step="any" type="number" value={formData.koordinat_lat || ""} onChange={e => setFormData({...formData, koordinat_lat: parseFloat(e.target.value)})} placeholder="-6.200000" className="w-full px-4 py-3 bg-blue-50/30 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold flexitems-center gap-1 text-[#35ACDF] uppercase tracking-widest">Longitude (Garis Bujur)</label>
                <input required step="any" type="number" value={formData.koordinat_long || ""} onChange={e => setFormData({...formData, koordinat_long: parseFloat(e.target.value)})} placeholder="106.816666" className="w-full px-4 py-3 bg-orange-50/30 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Detail Lengkap</label>
              <textarea required rows={3} value={formData.alamat_detail || ""} onChange={e => setFormData({...formData, alamat_detail: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium resize-none" />
            </div>
          </div>

          {/* Bagian 4: Sistem & Relasi */}
          <div>
            <h3 className="text-sm font-bold text-[#00172D] uppercase tracking-widest border-b border-gray-100 pb-2 mb-4">4. Status Kemitraan & Produk</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe Organisasi</label>
                <select required value={formData.tipe || "Distributor"} onChange={e => setFormData({...formData, tipe: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                  <option value="Distributor">Distributor</option>
                  <option value="End User">End User</option>
                  <option value="Sales">Tim Sales Internal</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand Utama</label>
                <select required value={formData.brand_utama || "HP Inc"} onChange={e => setFormData({...formData, brand_utama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                  <option value="HP Inc">HP Inc</option>
                  <option value="Poly">Poly</option>
                  <option value="Lainnya">Lainnya...</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Kemitraan</label>
                <select required value={formData.status_kemitraan || "Calon Mitra"} onChange={e => setFormData({...formData, status_kemitraan: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                  <option value="Calon Mitra">Calon Mitra</option>
                  <option value="Target">Target (Prospek Baru)</option>
                  <option value="Mitra Aktif">Mitra Aktif</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fokus Produk</label>
              <div className="flex flex-wrap gap-2">
                {["HP Inc", "Poly", "Laptop", "Printer", "PC"].map((item) => (
                  <label key={item} className="relative flex-shrink-0 cursor-pointer group">
                    <input type="checkbox" className="peer sr-only" checked={formData.fokus_produk?.includes(item)} onChange={() => handleProductToggle(item)} />
                    <span className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 transition-all peer-checked:bg-[#00172D] peer-checked:text-white peer-checked:border-[#00172D] hover:bg-gray-100 peer-checked:hover:bg-[#00172D]">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List Produk Kompetitor (Opsional)</label>
              <input type="text" placeholder="Gunakan koma untuk pisahkan (e.g. Dell, Lenovo, Logitech)" value={formData.list_produk_kompetitor?.join(", ") || ""} onChange={e => setFormData({...formData, list_produk_kompetitor: e.target.value.split(",").map(v => v.trim()).filter(v => v)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>

            <div className="space-y-3 mb-6">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value / Kelebihan Kompetitor vs Kita</label>
              <textarea rows={2} placeholder="Sebutkan kenapa kompetitor lebih dipilih (jika status Calon/Target)..." value={formData.value_kompetitor || ""} onChange={e => setFormData({...formData, value_kompetitor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium resize-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catatan Tambahan</label>
              <textarea rows={3} value={formData.catatan || ""} onChange={e => setFormData({...formData, catatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium resize-none" />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
             <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Batal
             </button>
             <button type="submit" className="px-6 py-3 bg-[#00172D] hover:bg-[#004A7D] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center gap-2">
               <Save className="w-4 h-4 text-[#35ACDF]" /> Simpan Partner
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
