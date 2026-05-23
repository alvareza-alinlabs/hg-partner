import React, { useState, useEffect, FormEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PackageSearch, Target, TrendingUp, Search, Plus, Trash2, Edit2, X, Download, Upload, Image as ImageIcon, MoreVertical, FileText } from "lucide-react";
import { exportData, importData } from "../../lib/exportUtils";

import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  nama: string;
  kategori: string;
  brand: string;
  target_bulanan: number;
  tercapai: number;
  images?: string[];
  harga_satuan?: number;
  harga_normal?: number;
  harga_dasar?: number;
  harga_promo?: number;
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/data/products.json")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const filteredProducts = products.filter(p => 
    p.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          setProducts(prev => [...prev, ...data]);
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 h-full"
    >
      <input 
        type="file" 
        accept=".csv,.json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
      <div className="flex flex-col md:flex-row gap-6 lg:items-end justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex flex-col min-w-0">
              <h1 className="text-3xl font-black text-[#00172D] tracking-tight whitespace-nowrap truncate">Produk & Target</h1>
              <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest whitespace-nowrap truncate">Katalog Produk & Target Penjualan</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-row gap-2 sm:gap-3 w-full justify-between items-center"
        >
          <div className="relative flex-1 min-w-[100px] sm:max-w-md flex items-center bg-white border border-gray-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#35ACDF]/50 h-[40px]">
             <Search className="absolute left-3 w-4 h-4 text-gray-400 shrink-0" />
             <input
               type="text"
               placeholder="Cari..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="pl-9 pr-4 py-2 w-full h-[38px] bg-transparent focus:outline-none text-sm font-medium rounded-full min-w-0"
             />
          </div>

          <div className="flex gap-2 shrink-0 justify-end">
            <button 
              onClick={() => navigate('/dashboard/product/add')}
              className="px-3 sm:px-4 py-2 bg-[#00172D] hover:bg-gray-900 text-white text-[10px] h-[40px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#35ACDF]" /> <span className="inline">Tambah</span>
            </button>

            <div className="relative z-30 shrink-0">
              <button 
                onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                onBlur={() => setTimeout(() => setIsActionMenuOpen(false), 200)}
                className="w-[40px] h-[40px] bg-white border border-gray-200 text-[#00172D] hover:bg-gray-50 rounded-full shadow-sm transition-all flex items-center justify-center shrink-0"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              <div className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col overflow-hidden transition-all ${isActionMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                 <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Tindakan</div>
                 <button onClick={() => fileInputRef.current?.click()} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                   <Upload className="w-3.5 h-3.5 text-gray-400" /> Import File
                 </button>
                 <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Export Sebagai</div>
                 <button onClick={() => exportData(filteredProducts, 'produk', 'csv')} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> File CSV
                 </button>
                 <button onClick={() => exportData(filteredProducts, 'produk', 'json')} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> File JSON
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {filteredProducts.map((product, index) => {
              const percentage = Math.round((product.tercapai / product.target_bulanan) * 100);
              const displayImage = product.images?.[0] || null;
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  key={product.id}
                  onClick={() => navigate(`/dashboard/product/${product.id}`)}
                  className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] flex flex-col cursor-pointer group overflow-hidden"
                >
                  <div className="w-full aspect-square bg-gray-50 flex items-center justify-center relative overflow-hidden">
                    {displayImage ? (
                      <img src={displayImage} alt={product.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-300" />
                    )}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/product/${product.id}?edit=true`); }} className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-[#35ACDF] rounded-xl shadow-sm transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(product.id); }} className="p-2 bg-white/90 backdrop-blur text-gray-600 hover:text-red-500 rounded-xl shadow-sm transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  
                  <div className="p-4 md:p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 mb-2">
                       <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded shrink-0">
                         {product.brand}
                       </span>
                       <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest line-clamp-1">{product.kategori}</span>
                    </div>
                    
                    <h3 className="text-sm md:text-base font-bold text-[#00172D] mb-1 line-clamp-2 leading-tight">{product.nama}</h3>
                    
                    <div className="mt-auto pt-3">
                       {((product.harga_normal || product.harga_dasar) && (product.harga_promo || product.harga_satuan)) ? (
                         <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] md:text-xs text-gray-400 line-through font-medium">Rp {(product.harga_normal || product.harga_dasar || 0).toLocaleString('id-ID')}</span>
                            {(product.harga_promo) && (
                              <span className="px-1.5 py-0.5 bg-red-50 text-red-600 text-[8px] font-black rounded uppercase tracking-widest">
                                Disc {Math.round((1 - product.harga_promo / (product.harga_normal || product.harga_dasar || 1)) * 100)}%
                              </span>
                            )}
                         </div>
                       ) : null}
                       <p className="text-lg md:text-xl font-black text-[#35ACDF] leading-none">
                         Rp {(product.harga_promo || product.harga_satuan || 0).toLocaleString('id-ID')}
                       </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
}
