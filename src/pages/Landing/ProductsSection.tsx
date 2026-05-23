import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Monitor, ArrowRight } from "lucide-react";
import { ProductData } from "../../types";

export default function ProductsSection({ products }: { products: ProductData[] }) {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "-";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);
  };

  return (
    <section id="produk" className="py-16 md:py-24 relative z-10 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-20">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#35ACDF] mb-3 block">Inventaris Enterprise</span>
          <h2 className="text-3xl md:text-5xl font-black text-[#00172D] mb-4 md:mb-6 tracking-tight">Katalog Solusi Premium</h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium text-sm md:text-base px-4">Jajaran perangkat keras terbaik di kelasnya untuk transformasi tempat kerja digital. Bergaransi resmi, dirancang untuk keandalan maksimal.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.slice(0, 4).map((product, idx) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                to={`/katalog/${product.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-[#35ACDF]/30 transition-all overflow-hidden flex flex-col group block h-full"
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
            </motion.div>
          ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
           <Link to="/katalog" className="inline-flex items-center justify-center px-8 py-4 w-full sm:w-auto bg-[#00172D] hover:bg-gray-900 text-white font-black uppercase tracking-widest text-[11px] md:text-xs rounded-2xl shadow-lg transition-all gap-2">
              Lihat Semua Produk Katalog <ArrowRight className="w-4 h-4 text-gray-400" />
           </Link>
        </div>
      </div>
    </section>
  );
}
