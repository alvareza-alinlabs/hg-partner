import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, Monitor, Package, Tags, Info, ChevronRight } from "lucide-react";
import { ProductData } from "../../types";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

export default function PublicProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetch("/data/products.json")
      .then(res => res.json())
      .then((data: ProductData[]) => {
        const found = data.find(p => p.id === id);
        if (found) {
          setProduct(found);
        }
        setLoading(false);
      });
  }, [id]);

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col text-[#00172D]">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center py-20 text-gray-400 mt-20">
          <Package className="w-10 h-10 md:w-12 md:h-12 mb-4 animate-bounce text-[#35ACDF]" />
          <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Memuat Detail Produk...</p>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white font-sans flex flex-col text-[#00172D]">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 w-full text-center">
          <h1 className="text-2xl font-black text-[#00172D] mb-4">Produk Tidak Ditemukan</h1>
          <button onClick={() => navigate('/katalog')} className="text-[#35ACDF] font-bold hover:underline">Kembali ke Katalog</button>
        </main>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-[#00172D] pb-16 md:pb-0">
      <Header />

      <main className="flex-1 w-full flex flex-col md:flex-row md:max-w-7xl md:mx-auto md:px-6 md:pt-28 md:pb-12 md:gap-12">
        {/* Left Column: Image Area */}
        <div className="w-full md:w-1/2 flex flex-col shrink-0">
          {/* Hero-like Full Width Main Image (1:1 Ratio) */}
          <div className="group relative w-full aspect-square bg-[#f8fafc] flex items-center justify-center overflow-hidden mt-16 md:mt-0 border-b md:border md:border-gray-100 md:rounded-3xl shrink-0">
            {product.images && product.images.length > 0 ? (
              <>
                <img 
                  src={product.images[activeImage]} 
                  alt={product.nama} 
                  className="w-full h-full object-cover md:object-contain object-center" 
                />
                
                {/* Gradient Overlay (Visible on Hover) - Mobile Only */}
                <div className="md:hidden absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                {/* Mini Gallery (Visible on Hover) - Mobile Only */}
                <div className="md:hidden absolute bottom-6 right-6 z-10 flex gap-3 overflow-x-auto max-w-[calc(100vw-3rem)] px-2 py-2 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                  {product.images.map((img, iIdx) => (
                    <button 
                      key={iIdx} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImage(iIdx);
                      }}
                      className={`w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden transition-all duration-300 shrink-0 ${activeImage === iIdx ? 'opacity-100 scale-110 shadow-2xl z-20 border-[#35ACDF] border-2' : 'border-2 border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                    >
                      <img src={img} alt={`Thumb ${iIdx}`} className="w-full h-full object-cover object-center" />
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <Package className="w-24 h-24 text-gray-300" />
            )}
          </div>

          {/* Desktop Static Mini Gallery below main image */}
          {product.images && product.images.length > 0 && (
            <div className="hidden md:flex gap-4 mt-6 overflow-x-auto pb-2 px-1">
              {product.images.map((img, iIdx) => (
                <button 
                  key={iIdx} 
                  onClick={() => setActiveImage(iIdx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 shrink-0 border-2 bg-[#f8fafc] ${activeImage === iIdx ? 'border-[#35ACDF] shadow-md scale-105 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105 hover:border-gray-200'}`}
                >
                  <img src={img} alt={`Thumb ${iIdx}`} className="w-full h-full object-cover md:object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Details Section directly on page */}
        <div className="w-full md:w-1/2 flex flex-col px-6 py-12 md:px-0 md:py-0">
          <div className="flex flex-col gap-8 mb-12">
             <div className="flex-1">
               <div className="flex flex-wrap items-center gap-3 mb-4">
                 <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${product.brand === 'HP Inc' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                   {product.brand}
                 </span>
                 <span className="text-[10px] text-[#35ACDF] font-black uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full">{product.kategori} Enterprise</span>
               </div>
               <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#00172D] mb-4 leading-tight tracking-tight">{product.nama}</h1>
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
               <p className="text-[10px] text-gray-500 mt-4 font-medium leading-relaxed border-t border-gray-200 pt-3">*Harga sudah termasuk garansi resmi dan dukungan teknis awal.</p>
             </div>
          </div>

          <div className="mb-12">
            <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest mb-4">Deskripsi Produk</h3>
            <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
              {product.deskripsi || "Informasi deskripsi belum tersedia untuk produk ini."}
            </p>
          </div>

          <div className="mb-12">
             <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest mb-5 flex items-center gap-2">
                <Info className="w-5 h-5 text-[#35ACDF]" /> Spesifikasi Utama
             </h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
               {product.spesifikasi && product.spesifikasi.length > 0 ? (
                 product.spesifikasi.map((spec, sIdx) => (
                   <div key={sIdx} className="flex items-start gap-3">
                     <div className="w-5 h-5 rounded-full bg-[#35ACDF]/10 flex items-center justify-center shrink-0 mt-0.5">
                       <ChevronRight className="w-3.5 h-3.5 text-[#35ACDF]" />
                     </div>
                     <span className="text-sm font-medium text-gray-700 leading-relaxed">{spec}</span>
                   </div>
                 ))
               ) : (
                  <span className="text-sm text-gray-400 font-medium italic col-span-2">Spesifikasi detail tidak tersedia.</span>
               )}
             </div>
          </div>
          
          <div className="pt-8 hidden md:flex flex-row items-center gap-4 border-t border-gray-100">
             <Link 
               to="/appointment" 
               className="w-auto bg-[#00172D] hover:bg-gray-900 shadow-xl shadow-[#00172D]/10 text-white text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-all hover:-translate-y-0.5 text-center flex items-center justify-center gap-2"
             >
               Konsultasi Pengadaan
             </Link>
             <button onClick={() => window.print()} className="w-auto bg-gray-50 hover:bg-gray-100 text-[#00172D] text-[11px] font-black uppercase tracking-widest px-8 py-4 rounded-xl transition-colors text-center border border-gray-200">
               Cetak Penawaran / PDF
             </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center bg-white mt-auto md:mb-0 mb-20">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Harry Gultom. Data Katalog Terverifikasi.
        </p>
      </footer>
      
      {/* Custom Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe p-3 flex gap-3">
         <button onClick={() => window.print()} className="w-1/3 bg-gray-50 hover:bg-gray-100 text-[#00172D] text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl transition-colors text-center border border-gray-200">
           Cetak PDF
         </button>
         <Link 
           to="/appointment" 
           className="flex-1 bg-[#00172D] shadow-xl shadow-[#00172D]/10 text-white text-[10px] font-black uppercase tracking-widest py-3.5 rounded-xl text-center flex items-center justify-center gap-2"
         >
           Konsultasi
         </Link>
      </div>
    </div>
  );
}
