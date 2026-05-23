import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { ProductData } from "../../../types";

export default function AddProductForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<ProductData>>({
    target_bulanan: 10,
    tercapai: 0,
    kategori: "PC",
    brand: "HP Inc",
    spesifikasi: [""],
    images: [""]
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    // Simulate save
    navigate("/dashboard/products");
  };

  const updateSpec = (index: number, value: string) => {
    const newSpecs = [...(formData.spesifikasi || [])];
    newSpecs[index] = value;
    setFormData({ ...formData, spesifikasi: newSpecs });
  };

  const addSpec = () => {
    setFormData({ ...formData, spesifikasi: [...(formData.spesifikasi || []), ""] });
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...(formData.spesifikasi || [])];
    newSpecs.splice(index, 1);
    setFormData({ ...formData, spesifikasi: newSpecs });
  };

  const updateImage = (index: number, value: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...(formData.images || []), ""] });
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-6 pb-10"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="hidden md:flex p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Tambah Produk</h1>
            <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Katalog Produk Baru</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama / Model Produk</label>
              <input required type="text" value={formData.nama || ""} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Merek</label>
                <select required value={formData.brand || "HP Inc"} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                  <option value="HP Inc">HP Inc</option>
                  <option value="Poly">Poly</option>
                  <option value="Dell">Dell</option>
                  <option value="Lenovo">Lenovo</option>
                  <option value="Other">Lainnya</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kategori</label>
                <select required value={formData.kategori || "PC"} onChange={e => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                  <option value="PC">PC</option>
                  <option value="Laptop">Laptop</option>
                  <option value="Video Bar">Video Bar</option>
                  <option value="Printer">Printer</option>
                  <option value="Headset">Headset</option>
                  <option value="Workstation">Workstation</option>
                  <option value="Accessories">Aksesoris</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Deskripsi Produk</label>
            <textarea value={formData.deskripsi || ""} onChange={e => setFormData({...formData, deskripsi: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Normal (IDR)</label>
              <input required type="number" min="0" value={formData.harga_normal || formData.harga_satuan || 0} onChange={e => setFormData({...formData, harga_normal: Number(e.target.value), harga_satuan: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Dasar (Bottom) (IDR)</label>
              <input type="number" min="0" value={formData.harga_dasar || 0} onChange={e => setFormData({...formData, harga_dasar: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Harga Promo (IDR)</label>
              <input type="number" min="0" value={formData.harga_promo || 0} onChange={e => setFormData({...formData, harga_promo: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Target Bulanan (Unit)</label>
              <input required type="number" min="0" value={formData.target_bulanan || 0} onChange={e => setFormData({...formData, target_bulanan: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tercapai Saat Ini</label>
              <input required type="number" min="0" value={formData.tercapai || 0} onChange={e => setFormData({...formData, tercapai: Number(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
            </div>
          </div>

        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest">Spesifikasi Kunci</h3>
            <button type="button" onClick={addSpec} className="px-3 py-1.5 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3 text-[#35ACDF]" /> Tambah
            </button>
          </div>
          <div className="space-y-3">
             <AnimatePresence>
               {formData.spesifikasi?.map((spec, index) => (
                 <motion.div key={index} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex gap-2">
                    <input type="text" value={spec} onChange={(e) => updateSpec(index, e.target.value)} placeholder={`Spec ${index + 1}`} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    <button type="button" onClick={() => removeSpec(index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                       <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#35ACDF]" />
              <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest">Galeri Produk</h3>
            </div>
            <button type="button" onClick={addImage} className="px-3 py-1.5 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-colors">
              <Plus className="w-3 h-3 text-[#35ACDF]" /> Tambah Image URL
            </button>
          </div>
          <div className="space-y-3">
             <AnimatePresence>
               {formData.images?.map((img, index) => (
                 <motion.div key={index} initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="flex gap-2">
                    <input type="url" value={img} onChange={(e) => updateImage(index, e.target.value)} placeholder="https://..." className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    {img && (
                      <div className="w-12 h-10 shrink-0 border border-gray-200 rounded flex items-center justify-center overflow-hidden bg-white">
                        <img src={img} alt="Preview" className="max-w-full max-h-full object-cover" onError={e => e.currentTarget.style.display='none'} />
                      </div>
                    )}
                    <button type="button" onClick={() => removeImage(index)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                       <Trash2 className="w-4 h-4 text-gray-400" />
                    </button>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-end pt-4">
           <button type="submit" className="px-8 py-4 bg-[#00172D] hover:bg-gray-900 text-white text-sm font-bold uppercase tracking-widest rounded-2xl shadow-lg shadow-[#00172D]/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
             <Save className="w-5 h-5 text-[#35ACDF]" /> Simpan Produk
           </button>
        </div>
      </form>
    </motion.div>
  );
}
