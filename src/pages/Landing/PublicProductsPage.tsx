import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Link, useSearchParams } from "react-router-dom";
import { Package, Monitor, Search, Headphones, Printer, Gamepad2, LayoutGrid } from "lucide-react";
import { ProductData } from "../../types";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";

const ProductCard: React.FC<{ product: ProductData }> = ({ product }) => {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <Link 
      to={`/katalog/${product.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#35ACDF]/30 transition-all overflow-hidden flex flex-col group block"
    >
      <div className="relative aspect-square bg-gray-50/50 flex items-center justify-center border-b border-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img 
            src={product.images[0]} 
            alt={product.nama} 
            className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <Monitor className="w-16 h-16 text-gray-200" />
        )}
        {product.harga_promo && product.harga_normal && product.harga_promo < product.harga_normal && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-bl-lg z-10 shadow-sm">
            Promo
          </div>
        )}
        {/* Mobile Brand Badge */}
        <div className="absolute bottom-2 left-2 md:hidden z-10">
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm backdrop-blur-md bg-white/90 ${product.brand === 'HP Inc' ? 'text-blue-600 border border-blue-100' : 'text-orange-600 border border-orange-100'}`}>
            {product.brand}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col flex-1">
        {/* Desktop Brand Badge */}
        <span className={`hidden md:inline-block text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full w-max mb-2 ${product.brand === 'HP Inc' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
          {product.brand}
        </span>
        <h2 className="text-sm md:text-base font-black text-[#00172D] mb-1 line-clamp-2 leading-tight group-hover:text-[#35ACDF] transition-colors">{product.nama}</h2>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mb-3 line-clamp-1">{product.kategori} Enterprise</p>
        
        <div className="mt-auto">
          {product.harga_normal && product.harga_promo && product.harga_promo < product.harga_normal ? (
            <div>
              <p className="text-[10px] text-gray-400 line-through font-bold mb-0.5">{formatCurrency(product.harga_normal)}</p>
              <p className="text-sm md:text-lg font-black text-[#00172D] tracking-tight">{formatCurrency(product.harga_promo)}</p>
            </div>
          ) : (
             <p className="text-sm md:text-lg font-black text-[#00172D] tracking-tight">{formatCurrency(product.harga_normal || product.harga_satuan)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function PublicProductsPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "Semua";

  useEffect(() => {
    fetch("/data/products.json")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (e.target.value) {
        newParams.set("search", e.target.value);
      } else {
        newParams.delete("search");
      }
      return newParams;
    });
  };

  const handleCategoryClick = (cat: string) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      if (cat !== "Semua") {
        newParams.set("category", cat);
      } else {
        newParams.delete("category");
      }
      return newParams;
    });
  };

  const categories = [
    { id: "Semua", label: "Semua", icon: <LayoutGrid className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: "Poly", label: "Poly", icon: <Headphones className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: "Laptop", label: "Laptop", icon: <Monitor className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: "Konsol/PC", label: "Konsol/PC", icon: <Gamepad2 className="w-4 h-4 md:w-5 md:h-5" /> },
    { id: "Printer", label: "Printer", icon: <Printer className="w-4 h-4 md:w-5 md:h-5" /> }
  ];

  const filteredProducts = products.filter(product => {
    const matchSearch = product.nama.toLowerCase().includes(search.toLowerCase()) || 
      (product.deskripsi && product.deskripsi.toLowerCase().includes(search.toLowerCase()));
      
    // The id we used maps approximately to these rules:
    // If Poly: brand should be Poly.
    // If Laptop/Konsol/Printer: map string simply by contains check on kategori.
    let matchCat = true;
    if (category !== "Semua") {
       if (category === "Poly") {
         matchCat = product.brand === "Poly";
       } else if (category === "Laptop" || category === "Printer") {
         matchCat = product.kategori.toLowerCase().includes(category.toLowerCase());
       } else if (category === "Konsol/PC") {
         matchCat = product.kategori.toLowerCase().includes("pc") || product.kategori.toLowerCase().includes("desktop") || product.kategori.toLowerCase().includes("workstation");
       }
    }

    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col text-[#00172D] pb-16 md:pb-0">
      <Header />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-24 md:pt-32 pb-12 md:pb-24 w-full">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="mb-8 md:mb-12 text-left w-full"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block">Marketplace</span>
          <h1 className="text-3xl md:text-5xl font-black text-[#00172D] mb-4 md:mb-6 tracking-tight">Katalog Produk</h1>
          <p className="text-gray-500 font-medium text-sm md:text-lg leading-relaxed max-w-2xl">
            Eksplorasi jajaran produk perangkat keras premium dari HP Inc dan Poly untuk kebutuhan bisnis dan korporasi.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-10 w-full">
           <div className="flex flex-col gap-6">
             {/* Search Bar */}
             <form className="relative flex items-center w-full shadow-lg rounded-full mb-2">
                <Search className="absolute left-5 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={search}
                  onChange={handleSearch}
                  placeholder="Cari nama atau spesifikasi produk..." 
                  className="w-full pl-14 pr-32 py-4 md:py-5 rounded-full bg-white border border-gray-100/50 text-[#00172D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 focus:border-[#35ACDF] transition-all font-medium md:text-lg shadow-sm"
                />
                <button type="submit" onClick={(e) => e.preventDefault()} className="absolute right-2 top-2 bottom-2 bg-[#35ACDF] hover:bg-[#2b8eb8] text-white font-bold uppercase tracking-widest text-[10px] md:text-xs px-6 md:px-8 rounded-full transition-colors shadow-sm">
                  Cari
                </button>
             </form>

             {/* Category Cards */}
             <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 w-full">
               {categories.map((cat, index) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex flex-col items-center justify-center p-4 md:p-5 rounded-2xl border shadow-sm transition-all group ${index === 0 ? 'col-span-2 md:col-span-1' : ''} ${category === cat.id ? 'bg-[#00172D] border-[#00172D] text-white shadow-md' : 'bg-white border-gray-100 hover:shadow-xl hover:border-[#35ACDF]/30'}`}
                  >
                    <div className={`${category === cat.id ? 'text-[#35ACDF]' : 'text-gray-400 group-hover:text-[#35ACDF]'} transition-colors mb-2 md:mb-3`}>
                      {cat.icon}
                    </div>
                    <span className={`${category === cat.id ? 'text-white' : 'text-[#00172D]'} text-[10px] md:text-xs font-black uppercase tracking-widest`}>
                      {cat.label}
                    </span>
                  </button>
               ))}
             </div>
           </div>
        </div>

        {loading ? (
           <div className="flex flex-col items-center justify-center py-20 text-gray-400">
             <Package className="w-10 h-10 md:w-12 md:h-12 mb-4 animate-bounce text-[#35ACDF]" />
             <p className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Memuat Katalog Produk...</p>
           </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-lg font-black text-[#00172D] mb-2">Produk Tidak Ditemukan</h3>
                <p className="text-gray-500 font-medium text-sm">Coba sesuaikan kata kunci pencarian atau ganti kategori.</p>
                <button onClick={() => { setSearchParams({}); }} className="mt-6 text-[10px] font-black tracking-widest uppercase px-6 py-3 bg-[#35ACDF] text-white rounded-full hover:bg-[#2b8eb8] transition-colors">
                  Reset Filter
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 md:py-8 text-center bg-white mt-auto md:mb-0 mb-16">
        <p className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">
          &copy; {new Date().getFullYear()} Harry Gultom. Data Katalog Terverifikasi.
        </p>
      </footer>
      <BottomNavigation />
    </div>
  );
}
