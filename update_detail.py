import sys

with open('src/pages/Dashboard/ProductDetailPage.tsx', 'r') as f:
    content = f.read()

OLD_START = '             </form>\n           ) : (\n             <div className="space-y-6">'
OLD_END = '         </div>\n      </div>\n    </motion.div>'

def extract_target(content, start_str, end_str):
    start_idx = content.find(start_str)
    if start_idx == -1: return None
    end_idx = content.find(end_str, start_idx)
    if end_idx == -1: return None
    return content[start_idx:end_idx]

target = extract_target(content, OLD_START, OLD_END)

NEW_REPLACEMENT = """             </form>
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
        <div className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 pb-8">
             {/* Image Gallery */}
             <div className="space-y-4">
               <div className="aspect-square bg-gray-50 rounded-3xl border border-gray-100 overflow-hidden flex items-center justify-center">
                 {product.images && product.images.length > 0 ? (
                   <img src={product.images[0]} alt={product.nama} className="w-full h-full object-cover" />
                 ) : (
                   <PackageSearch className="w-16 h-16 text-gray-300" />
                 )}
               </div>
               {product.images && product.images.length > 1 && (
                 <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                   {product.images.map((img, idx) => (
                     <div key={idx} className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-2xl border border-gray-200 overflow-hidden cursor-pointer hover:border-[#35ACDF] transition-colors bg-white">
                        <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                     </div>
                   ))}
                 </div>
               )}
             </div>

             {/* Product Detail Text */}
             <div className="flex flex-col">
               <div className="flex items-center gap-2 mb-3">
                 <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded">
                   {product.brand}
                 </span>
                 <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-blue-50 text-[#35ACDF] rounded">
                   {product.kategori}
                 </span>
               </div>
               
               <h2 className="text-2xl md:text-3xl font-black text-[#00172D] mb-4 leading-tight">{product.nama}</h2>
               
               <div className="mb-8 p-4 md:p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  {((product.harga_normal || product.harga_dasar) && (product.harga_promo || product.harga_satuan)) ? (
                    <div className="flex items-center gap-3 mb-1.5">
                       <span className="text-sm md:text-base text-gray-400 line-through font-medium">Rp {(product.harga_normal || product.harga_dasar || 0).toLocaleString('id-ID')}</span>
                       {(product.harga_promo) && (
                         <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-black rounded uppercase tracking-widest">
                           Diskon {Math.round((1 - product.harga_promo / (product.harga_normal || product.harga_dasar || 1)) * 100)}%
                         </span>
                       )}
                    </div>
                  ) : null}
                  <p className="text-3xl md:text-5xl font-black text-[#35ACDF]">
                    Rp {(product.harga_promo || product.harga_satuan || 0).toLocaleString('id-ID')}
                  </p>
               </div>

               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3 mb-8">
                  <button className="flex-1 py-4 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2">
                     Konsultasi Sekarang
                  </button>
                  <button onClick={() => toggleEdit(true)} className="px-6 py-4 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-2">
                     <Edit2 className="w-4 h-4" /> Edit Produk
                  </button>
                  <button onClick={handleDelete} className="px-4 py-4 bg-red-50 hover:bg-red-100 border border-red-50 text-red-600 rounded-2xl transition-all flex items-center justify-center">
                     <Trash2 className="w-4 h-4" />
                  </button>
               </div>

               <div className="space-y-8">
                 {product.deskripsi && (
                   <div>
                     <h3 className="text-[10px] md:text-xs font-black text-[#00172D] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Deskripsi Produk</h3>
                     <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{product.deskripsi}</p>
                   </div>
                 )}
                 
                 {product.spesifikasi && product.spesifikasi.length > 0 && (
                   <div>
                     <h3 className="text-[10px] md:text-xs font-black text-[#00172D] uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Spesifikasi Detail</h3>
                     <ul className="space-y-3 pl-4 list-disc text-sm text-gray-600 marker:text-[#35ACDF]">
                       {product.spesifikasi.map((spec, idx) => (
                         <li key={idx} className="pl-2 leading-relaxed">{spec}</li>
                       ))}
                     </ul>
                   </div>
                 )}
               </div>
             </div>
           </div>
"""

new_content = content.replace(target, NEW_REPLACEMENT)
with open('src/pages/Dashboard/ProductDetailPage.tsx', 'w') as f:
    f.write(new_content)
