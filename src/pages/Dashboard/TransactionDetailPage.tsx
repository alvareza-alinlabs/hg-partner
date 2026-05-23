import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft, CheckCircle2, User, Package, Building, Calendar, Tag, FileText, ShoppingBag, Edit2, Trash2 } from "lucide-react";
import { TransactionData, ClientData, ProductData } from "../../types";

export default function TransactionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionData | null>(null);
  const [partner, setPartner] = useState<ClientData | null>(null);
  const [sales, setSales] = useState<ClientData | null>(null);
  const [productDetails, setProductDetails] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [transRes, partnersRes, salesRes, productsRes] = await Promise.all([
          fetch("/data/transactions.json"),
          fetch("/data/partners.json"),
          fetch("/data/sales.json"),
          fetch("/data/products.json")
        ]);
        const transData = await transRes.json();
        const partnersData = await partnersRes.json();
        const salesData = await salesRes.json();
        const productsData = await productsRes.json();

         const allClients = [...partnersData, ...salesData];
        
        const found = transData.find((t: TransactionData) => t.id === id);
        if (found) {
          setTransaction(found);
          const p = allClients.find((c: ClientData) => c.id === found.partner_id);
          if (p) setPartner(p);
          
          if (found.sales_id) {
            const s = salesData.find((c: ClientData) => c.id === found.sales_id);
            if (s) setSales(s);
          }

          // Handle single product vs multiple items
          let transactionItems = found.items;
          if (!transactionItems && found.product_id) {
             transactionItems = [{ product_id: found.product_id, jumlah_unit: found.jumlah_unit || 1, harga_satuan: found.harga_satuan_custom }];
          }

          if (transactionItems && transactionItems.length > 0) {
            const matchedProducts = transactionItems.map((item: any) => {
              const matched = productsData.find((prod: ProductData) => prod.id === item.product_id);
              const customPrice = item.harga_satuan || found.harga_satuan_custom || (found.total_harga / (found.jumlah_unit || 1));
              return { 
                ...matched, 
                purchased_unit: item.jumlah_unit, 
                purchased_price: customPrice,
                normal_price: matched?.harga_normal || matched?.harga_satuan || 0,
                base_price: matched?.harga_dasar || (matched?.harga_satuan ? matched.harga_satuan * 0.9 : 0)
              };
            }).filter(Boolean);
            setProductDetails(matchedProducts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch transaction detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-[#00172D] mb-4">Transaksi tidak ditemukan</h2>
        <button onClick={() => navigate(-1)} className="text-[#35ACDF] font-bold hover:underline">
          Kembali
        </button>
      </div>
    );
  }

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
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Detail Transaksi</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">{transaction.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 border-b border-gray-50 pb-6 gap-6 sm:gap-4">
                <div>
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 sm:mb-1">Status Transaksi</span>
                   <div className="flex items-center gap-2">
                     <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded ${transaction.status === "Selesai" ? "bg-emerald-50 text-emerald-600" : transaction.status === "Proses" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                       {transaction.status}
                     </span>
                     {transaction.status === "Selesai" && <CheckCircle2 className="w-5 h-5 text-[#35ACDF]" />}
                   </div>
                </div>
                <div className="text-left sm:text-right">
                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2 sm:mb-1">Tanggal & Jenis</span>
                   <p className="font-bold text-gray-800 text-sm flex items-center sm:justify-end gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      {new Date(transaction.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                   </p>
                   <p className="font-semibold text-gray-500 text-xs mt-1.5 sm:mt-1 bg-gray-100 px-2 py-0.5 rounded inline-block">{transaction.jenis_pembelian || "Standard"}</p>
                </div>
             </div>

             <div className="mb-8">
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Informasi Partner & Sales</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl flex items-start gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm text-gray-400 flex items-center justify-center shrink-0">
                        <Building className="w-5 h-5 text-[#35ACDF]" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Partner / Pembeli</span>
                        <p className="font-bold text-[#00172D] text-sm break-words">{partner ? partner.perusahaan : transaction.partner_id}</p>
                        {partner && <p className="font-semibold text-gray-500 text-xs mt-0.5 break-words">{partner.nama_pic} &bull; {partner.kota}</p>}
                     </div>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-2xl flex items-start gap-4">
                     <div className="w-10 h-10 bg-white rounded-xl shadow-sm text-[#35ACDF] flex items-center justify-center shrink-0">
                        <User className="w-5 h-5 text-[#35ACDF]" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-[#35ACDF] uppercase tracking-widest block mb-1">Sales (Opsional)</span>
                        {sales ? (
                          <>
                             <p className="font-bold text-[#00172D] text-sm break-words">{sales.nama_pic}</p>
                             <p className="font-semibold text-gray-500 text-xs mt-0.5 break-words">Direct Sales</p>
                          </>
                        ) : (
                          <p className="font-bold text-gray-500 text-sm mt-1">- (Kosong)</p>
                        )}
                     </div>
                  </div>
                </div>
             </div>

             <div>
                <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#35ACDF]" /> Item Transaksi
                </h3>
                 <div className="space-y-3">
                   {productDetails.length > 0 ? productDetails.map((prod: any, idx: number) => {
                      const totalNormal = prod.normal_price * prod.purchased_unit;
                      const totalPurchase = prod.purchased_price * prod.purchased_unit;
                      const totalDasar = prod.base_price * prod.purchased_unit;
                      const discount = totalNormal - totalPurchase;
                      const margin = totalPurchase - totalDasar;

                      return (
                      <div key={idx} className="border border-gray-100 rounded-2xl p-4 flex flex-col gap-4">
                         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                           <div className="flex items-start sm:items-center gap-4">
                              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                 <Package className="w-6 h-6 text-[#35ACDF]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                 <p className="font-bold text-[#00172D] text-sm break-words limit-lines line-clamp-2">{prod.nama || prod.id}</p>
                                 <p className="text-gray-500 text-xs font-semibold mt-0.5">{prod.brand} &bull; {prod.kategori}</p>
                              </div>
                           </div>
                           <div className="text-left pl-16 sm:pl-0 sm:text-right shrink-0">
                               <p className="font-black text-gray-800 text-sm">{prod.purchased_unit} x Rp {(prod.purchased_price || 0).toLocaleString('id-ID')}</p>
                               <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-0.5">
                                  Total: Rp {totalPurchase.toLocaleString('id-ID')}
                               </p>
                           </div>
                         </div>
                     <div className="flex flex-col gap-2 bg-gray-50 rounded-xl p-4 text-xs">
                       <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 sm:gap-2 border-b border-gray-200 pb-3 mb-2">
                          <div className="flex flex-col gap-1.5">
                             <div className="flex items-center justify-between sm:justify-start gap-2"><span className="font-bold text-gray-500 w-28">Harga Dasar:</span><span className="font-bold text-gray-800">Rp {Number(prod.base_price || 0).toLocaleString('id-ID')}</span></div>
                             <div className="flex items-center justify-between sm:justify-start gap-2"><span className="font-bold text-gray-500 w-28">Harga Normal:</span><span className="font-bold text-gray-800">Rp {Number(prod.normal_price || 0).toLocaleString('id-ID')}</span></div>
                             <div className="flex items-center justify-between sm:justify-start gap-2"><span className="font-bold text-gray-500 w-28">Harga Terjual:</span><span className="font-bold text-[#35ACDF]">Rp {Number(prod.purchased_price || 0).toLocaleString('id-ID')}</span></div>
                          </div>
                          <div className="text-left sm:text-right flex flex-col gap-1.5 pt-2 sm:pt-0 border-t border-gray-200 sm:border-t-0">
                             <div className="flex items-center justify-between sm:justify-end gap-2">
                               <span className="font-bold text-orange-500">Diskon/Unit:</span>
                               <span className="font-black text-orange-600">Rp {((prod.normal_price || 0) - (prod.purchased_price || 0)) > 0 ? ((prod.normal_price || 0) - (prod.purchased_price || 0)).toLocaleString('id-ID') : "0"}</span>
                             </div>
                             <div className="flex items-center justify-between sm:justify-end gap-2">
                               <span className="font-bold text-emerald-500">Margin/Unit:</span>
                               <span className="font-black text-emerald-600">{((prod.purchased_price || 0) - (prod.base_price || 0)) > 0 ? "+" : ""}Rp {((prod.purchased_price || 0) - (prod.base_price || 0)).toLocaleString('id-ID')}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex justify-between items-center pt-1">
                          <span className="font-black text-gray-400 uppercase tracking-widest text-[10px]">Total Keuntungan Item</span>
                          <span className="font-black text-emerald-600">Rp {(margin > 0 ? margin : 0).toLocaleString('id-ID')}</span>
                       </div>
                     </div>
                      </div>
                   )}) : (
                     <div className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                         <div className="flex items-start sm:items-center gap-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                               <Package className="w-6 h-6 text-[#35ACDF]" />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-bold text-[#00172D] text-sm break-words line-clamp-2">{transaction.product_id}</p>
                               <p className="text-gray-500 text-xs font-semibold mt-0.5">Produk tidak terdaftar di katalog</p>
                            </div>
                         </div>
                         <div className="text-left pl-16 sm:pl-0 sm:text-right shrink-0">
                             <p className="font-black text-gray-800 text-sm">{transaction.jumlah_unit || 1} Unit</p>
                         </div>
                      </div>
                   )}
                </div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           {(() => {
               let totalDiscountInfo = 0;
               let totalMarginInfo = 0;
               productDetails.forEach(p => {
                 const totalNormal = (p.normal_price || 0) * (p.purchased_unit || 1);
                 const totalPurchase = (p.purchased_price || 0) * (p.purchased_unit || 1);
                 const totalBase = (p.base_price || 0) * (p.purchased_unit || 1);
                 totalDiscountInfo += (totalNormal - totalPurchase);
                 totalMarginInfo += (totalPurchase - totalBase);
               });
             
             return (
               <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Ringkasan Keuangan</h3>
                 
                 <div className="space-y-4 mb-6 pb-6 border-b border-gray-50">
                    <div className="flex justify-between items-center text-sm font-bold">
                       <span className="text-gray-500">Subtotal Terbayar</span>
                       <span className="text-gray-800">Rp {(transaction.total_harga).toLocaleString('id-ID')}</span>
                    </div>
                    {productDetails.length > 0 && (
                      <>
                        <div className="flex justify-between items-center text-sm font-bold text-orange-600">
                           <span>Total Diskon</span>
                           <span>{totalDiscountInfo > 0 ? "Rp " + totalDiscountInfo.toLocaleString('id-ID') : "-"}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                           <span>Total Margin Pendapatan</span>
                           <span>{totalMarginInfo > 0 ? "+Rp " + totalMarginInfo.toLocaleString('id-ID') : "Rp " + totalMarginInfo.toLocaleString('id-ID')}</span>
                        </div>
                      </>
                    )}
                 </div>
                 
                 <div className="bg-blue-50 rounded-2xl p-5 border border-emerald-100 text-center">
                     <span className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest block mb-1">Total Transaksi</span>
                     <p className="text-3xl font-black text-[#00172D]">Rp {(transaction.total_harga).toLocaleString('id-ID')}</p>
                 </div>
               </div>
             );
           })()}

           <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
              <button onClick={() => navigate(`/dashboard/transactions?edit=${transaction.id}`)} className="w-full py-3 bg-[#00172D] hover:bg-gray-800 text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                 <Edit2 className="w-4 h-4 text-gray-400" /> Edit Transaksi
              </button>
              <button onClick={() => alert("Fitur hapus belum tersedia di UI")} className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                 <Trash2 className="w-4 h-4 text-gray-400" /> Hapus Transaksi
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
