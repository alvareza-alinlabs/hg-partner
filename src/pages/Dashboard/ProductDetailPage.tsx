import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, PackageSearch, Target, TrendingUp, Edit2, Trash2, Save, X, Image as ImageIcon, Plus, Tags, Info, ChevronRight } from "lucide-react";
import { ProductData } from "../../types";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [formData, setFormData] = useState<Partial<ProductData>>({});

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await fetch("/data/products.json");
        const data = await res.json();
        const found = data.find((p: ProductData) => p.id === id);
        if (found) {
          setProduct(found);
          setFormData(found);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  const toggleEdit = (status: boolean) => {
    if (status) {
      setSearchParams({ edit: 'true' });
      setFormData(product || {});
    } else {
      setSearchParams({});
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (product) {
      setProduct({ ...product, ...formData } as ProductData);
      toggleEdit(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
       navigate('/dashboard/products');
    }
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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-[#00172D] mb-4">Produk tidak ditemukan</h2>
        <button onClick={() => navigate(-1)} className="text-[#35ACDF] font-bold hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  const percentage = Math.round(((product.tercapai || 0) / (product.target_bulanan || 1)) * 100);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined || isNaN(value)) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 pb-10"
    >
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="hidden md:flex p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">{isEditing ? `Edit ${product.nama}` : product.nama}</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">{isEditing ? "Mode Edit Produk" : "Detail Produk & Performa"}</p>
        </div>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT AREA: EDIT FORM */}
          <div className="lg:col-span-2 space-y-6">
             <form id="edit-product-form" onSubmit={handleSave} className="space-y-6">
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
                       {(!formData.spesifikasi || formData.spesifikasi.length === 0) && (
                         <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 rounded-xl">Belum ada spesifikasi</div>
                       )}
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
                       {(!formData.images || formData.images.length === 0) && (
                         <div className="p-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest bg-gray-50 rounded-xl">Belum ada gambar</div>
                       )}
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
             </form>
          </div>
          
          {/* RIGHT AREA: QUICK ACTIONS (EDIT MODE) */}
          <div className="lg:col-span-1 space-y-6">
             <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3">
                <button type="submit" form="edit-product-form" className="w-full py-4 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                   <Save className="w-4 h-4 text-[#35ACDF]" /> Simpan Perubahan
                </button>
                <button type="button" onClick={() => toggleEdit(false)} className="w-full py-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                   <X className="w-4 h-4 text-gray-400" /> Batalkan
                </button>
             </div>
             
             <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Performa Penjualan</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-1.5 text-gray-400 mb-2">
                         <Target className="w-4 h-4 text-[#35ACDF]" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Target</span>
                      </div>
                      <p className="text-2xl font-black text-[#00172D]">{Number.isNaN(product.target_bulanan) ? 0 : product.target_bulanan}</p>
                   </div>
                   <div className="bg-[#35ACDF]/5 p-4 rounded-2xl border border-[#35ACDF]/10">
                      <div className="flex items-center gap-1.5 text-[#35ACDF] mb-2">
                         <TrendingUp className="w-4 h-4 text-[#35ACDF]" />
                         <span className="text-[9px] font-bold uppercase tracking-widest">Achieved</span>
                      </div>
                      <p className="text-2xl font-black text-[#35ACDF]">{Number.isNaN(product.tercapai) ? 0 : product.tercapai}</p>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                      <span className="text-gray-400">Progress</span>
                      <span className={percentage >= 100 ? "text-emerald-500" : "text-[#35ACDF]"}>{Number.isNaN(percentage) ? 0 : percentage}%</span>
                   </div>
                   <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Number.isNaN(percentage) ? 0 : Math.min(percentage, 100)}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${percentage >= 100 ? "bg-emerald-500" : "bg-[#35ACDF]"}`}
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
          {/* Left Column: Image Area */}
          <div className="w-full lg:w-1/2 flex flex-col shrink-0">
            {/* Hero-like Full Width Main Image (1:1 Ratio) */}
            <div className="group relative w-full aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden border border-gray-100 rounded-3xl shrink-0">
              {product.images && product.images.length > 0 ? (
                <>
                  <img 
                    src={product.images[activeImage] || product.images[0]} 
                    alt={product.nama} 
                    className="w-full h-full object-cover md:object-contain object-center" 
                  />
                  
                  {/* Gradient Overlay (Visible on Hover) - Mobile Only */}
                  <div className="lg:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  {/* Mini Gallery (Visible on Hover) - Mobile Only */}
                  <div className="lg:hidden absolute bottom-6 right-6 z-10 flex gap-3 overflow-x-auto max-w-[calc(100vw-3rem)] px-2 py-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    {product.images.map((img, iIdx) => (
                      <button 
                        key={iIdx} 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImage(iIdx);
                        }}
                        className={`w-14 h-14 rounded-xl overflow-hidden transition-all duration-300 shrink-0 ${activeImage === iIdx ? 'opacity-100 scale-110 shadow-2xl z-20 border-[#35ACDF] border-2' : 'border-2 border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                      >
                        <img src={img} alt={`Thumb ${iIdx}`} className="w-full h-full object-cover object-center" />
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <PackageSearch className="w-24 h-24 text-gray-300" />
              )}
            </div>

            {/* Desktop Static Mini Gallery below main image */}
            {product.images && product.images.length > 0 && (
              <div className="hidden lg:flex gap-4 mt-6 overflow-x-auto pb-2 px-1">
                {product.images.map((img, iIdx) => (
                  <button 
                    key={iIdx} 
                    onClick={() => setActiveImage(iIdx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 shrink-0 border-2 bg-[#f8fafc] ${activeImage === iIdx ? 'border-[#35ACDF] shadow-md scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105 hover:border-gray-200'}`}
                  >
                    <img src={img} alt={`Thumb ${iIdx}`} className="w-full h-full object-cover lg:object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex flex-col gap-6 mb-8">
               <div className="flex-1">
                 <div className="flex flex-wrap items-center gap-2 mb-3">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${product.brand === 'HP Inc' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                     {product.brand}
                   </span>
                   <span className="text-[10px] text-[#35ACDF] font-black uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">{product.kategori} Enterprise</span>
                 </div>
                 <h2 className="text-2xl lg:text-4xl font-black text-[#00172D] mb-2 leading-tight tracking-tight">{product.nama}</h2>
                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">ID Produk: {product.id}</p>
               </div>
               
               {/* Pricing Information */}
               <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 relative overflow-hidden shadow-sm w-full shrink-0">
                 {product.harga_promo && product.harga_normal && product.harga_promo < product.harga_normal && (
                   <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl z-10 shadow-sm">
                     Promo Eksklusif
                   </div>
                 )}
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <Tags className="w-4 h-4 text-[#35ACDF]" /> Harga Investasi
                 </p>
                 
                 {product.harga_normal && product.harga_promo && product.harga_promo < product.harga_normal ? (
                   <div className="mt-1">
                     <p className="text-3xl font-black text-[#00172D] tracking-tight">{formatCurrency(product.harga_promo)}</p>
                     <p className="text-sm text-gray-400 line-through font-bold mt-1">{formatCurrency(product.harga_normal)}</p>
                   </div>
                 ) : (
                    <p className="text-3xl font-black text-[#00172D] tracking-tight mt-1">{formatCurrency(product.harga_normal || product.harga_satuan)}</p>
                 )}
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
               <button onClick={() => toggleEdit(true)} className="flex-1 py-3.5 bg-[#00172D] border border-[#00172D] text-white font-bold uppercase tracking-widest text-[#00172D] text-xs rounded-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                 <Edit2 className="w-4 h-4 text-[#35ACDF]" /> Edit Produk
               </button>
               <button onClick={handleDelete} className="px-6 py-3.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                 <Trash2 className="w-4 h-4" /> Hapus
               </button>
            </div>

            <div className="mb-10">
              <h3 className="text-[10px] lg:text-xs font-black text-[#00172D] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2 flex items-center gap-2">
                 Deskripsi Produk
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                {product.deskripsi || "Informasi deskripsi belum tersedia untuk produk ini."}
              </p>
            </div>

            <div className="mb-8">
               <h3 className="text-[10px] lg:text-xs font-black text-[#00172D] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#35ACDF]" /> Spesifikasi Utama
               </h3>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                 {product.spesifikasi && product.spesifikasi.length > 0 ? (
                   product.spesifikasi.map((spec, sIdx) => (
                     <div key={sIdx} className="flex items-start gap-2.5">
                       <div className="w-4 h-4 rounded-full bg-[#35ACDF]/10 flex items-center justify-center shrink-0 mt-0.5">
                         <ChevronRight className="w-3 h-3 text-[#35ACDF]" />
                       </div>
                       <span className="text-sm font-medium text-gray-600 leading-relaxed">{spec}</span>
                     </div>
                   ))
                 ) : (
                    <span className="text-sm text-gray-400 font-medium italic col-span-2">Spesifikasi detail tidak tersedia.</span>
                 )}
               </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
