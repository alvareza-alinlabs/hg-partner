import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Monitor, Headphones, Printer, Gamepad2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeroProps {
  y: any;
  data?: {
    label: string;
    title_black: string;
    title_blue: string;
    subtitle: string;
    button_primary: string;
    button_secondary: string;
  };
}

export default function Hero({ y, data }: HeroProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data/products.json')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error loading products:", err));
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/katalog?search=${encodeURIComponent(searchTerm)}`);
    } else {
      navigate(`/katalog`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/katalog?category=${encodeURIComponent(category)}`);
  };

  const filteredProducts = searchTerm
    ? products.filter(p => p.nama.toLowerCase().includes(searchTerm.toLowerCase()) || p.kategori.toLowerCase().includes(searchTerm.toLowerCase()))
    : products.slice(0, 3);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
  };

  const categories = [
    { id: "Poly", label: "Poly", icon: <Headphones className="w-5 h-5 md:w-6 md:h-6" /> },
    { id: "Laptop", label: "Laptop", icon: <Monitor className="w-5 h-5 md:w-6 md:h-6" /> },
    { id: "Konsol/PC", label: "Konsol/PC", icon: <Gamepad2 className="w-5 h-5 md:w-6 md:h-6" /> },
    { id: "Printer", label: "Printer", icon: <Printer className="w-5 h-5 md:w-6 md:h-6" /> }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <section className="relative overflow-hidden bg-[#00172D] w-full pt-16 md:pt-20 min-h-[400px] md:h-[500px]">
        {/* Video Block Full Width under Header */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 mix-blend-lighten"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-10 flex flex-col justify-center">
          <motion.div 
            style={{ y }}
            className="flex flex-col items-start text-left w-full max-w-7xl mx-auto pt-8 px-6"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 md:mb-6 leading-[1.15] md:leading-[1.1] tracking-tight max-w-5xl text-white drop-shadow-xl">
              {data?.title_black || "Solusi Komputasi"} <br className="hidden md:block" />
              <span className="text-[#35ACDF] drop-shadow-none">
                {data?.title_blue || "Premium Enterprise."}
              </span>
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base md:text-lg lg:text-xl mb-4 max-w-3xl leading-relaxed font-medium drop-shadow-md">
              {data?.subtitle || "Eksplorasi jajaran perangkat korporat terbaik dan terdepan. Temukan lini produk HP dan Poly yang dikurasi khusus untuk mempercepat transformasi bisnis Anda."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Floating Section */}
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-6 -mt-8 md:-mt-10 z-20 relative flex flex-col items-center md:items-start mb-10 md:mb-16">
        {/* Floating Search Bar */}
        <div ref={searchRef} className="w-full md:max-w-xl lg:max-w-3xl relative mb-8">
          <form onSubmit={handleSearch} className="relative flex items-center w-full shadow-2xl rounded-full bg-white z-30">
            <Search className="absolute left-5 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Cari perangkat korporat..." 
              className="w-full pl-14 pr-6 py-4 md:py-5 rounded-full bg-transparent border-2 border-transparent text-[#00172D] placeholder-gray-400 focus:outline-none focus:border-[#35ACDF]/30 focus:bg-white transition-all font-medium md:text-lg"
            />
          </form>

          {/* Autocomplete Popup */}
          <AnimatePresence>
            {isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 w-full mt-3 bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-20 flex flex-col"
              >
                <div className="p-4 md:p-6 pb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-4 block">
                    {searchTerm ? "Hasil Pencarian" : "Rekomendasi Pilihan"}
                  </span>
                  
                  {filteredProducts.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {filteredProducts.slice(0, 4).map((product) => (
                        <button
                          key={product.id}
                          onClick={() => navigate(`/katalog/${product.id}`)}
                          className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors text-left group w-full"
                        >
                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 border border-gray-100">
                            {product.images?.[0] ? (
                              <img src={product.images[0]} alt={product.nama} className="w-full h-full object-contain p-1 mix-blend-multiply" />
                            ) : (
                              <Monitor className="w-6 h-6 text-gray-300" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm md:text-base font-black text-[#00172D] group-hover:text-[#35ACDF] transition-colors truncate">{product.nama}</h4>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{product.kategori} Enterprise</p>
                          </div>
                          <div className="hidden sm:block text-right shrink-0 px-2">
                            <p className="text-sm font-black text-[#00172D]">{formatCurrency(product.harga_promo || product.harga_satuan)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                       <Search className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                       <p className="text-sm font-medium text-gray-500">Tidak ada produk yang cocok dengan "{searchTerm}"</p>
                    </div>
                  )}
                </div>
                
                <div className="bg-gray-50 p-3 md:p-4 border-t border-gray-100 mt-2">
                  <button
                    onClick={() => {
                        setIsFocused(false);
                        if (searchTerm.trim()) {
                            navigate(`/katalog?search=${encodeURIComponent(searchTerm)}`);
                        } else {
                            navigate(`/katalog`);
                        }
                    }}
                    className="w-full py-3 bg-white border border-gray-200 hover:border-[#35ACDF] text-[#00172D] hover:text-[#35ACDF] rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all shadow-sm flex items-center justify-center gap-2"
                  >
                    Lihat Semua Produk <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className="flex flex-col items-center justify-center p-5 md:p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#35ACDF]/30 transition-all group"
            >
              <div className="text-gray-400 group-hover:text-[#35ACDF] transition-colors mb-3">
                {cat.icon}
              </div>
              <span className="text-[#00172D] text-[10px] md:text-xs font-black uppercase tracking-widest">
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
