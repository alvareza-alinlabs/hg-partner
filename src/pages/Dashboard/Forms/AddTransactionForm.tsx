import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Plus, Trash2, ShoppingBag } from "lucide-react";
import { ClientData, ProductData, TransactionData, TransactionItem } from "../../../types";

export default function AddTransactionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<TransactionData>>({
    status: "Selesai",
    jenis_pembelian: "Full Payment",
    items: [],
    total_harga: 0
  });

  const [partners, setPartners] = useState<ClientData[]>([]);
  const [sales, setSales] = useState<ClientData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, partnersRes, prodRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/products.json")
        ]);

        const salesData: ClientData[] = await salesRes.json();
        setSales(salesData);

        const partnersData: ClientData[] = await partnersRes.json();
        setPartners([...salesData, ...partnersData]);

        const prodData: ProductData[] = await prodRes.json();
        setProducts(prodData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const recalculateTotal = (items: TransactionItem[]) => {
    return items.reduce((acc, item) => acc + ((item.harga_satuan || 0) * item.jumlah_unit), 0);
  };

  const handleAddItem = () => {
    if (products.length === 0) return;
    const newItem: TransactionItem = {
      product_id: "",
      jumlah_unit: 1,
      harga_satuan: 0
    };
    setFormData(prev => ({ ...prev, items: [...(prev.items || []), newItem] }));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = [...(formData.items || [])];
    newItems.splice(index, 1);
    setFormData(prev => ({ ...prev, items: newItems, total_harga: recalculateTotal(newItems) }));
  };

  const handleItemChange = (index: number, field: keyof TransactionItem, value: any) => {
    const newItems = [...(formData.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      if (product) {
        newItems[index].harga_satuan = product.harga_satuan;
      }
    }
    
    setFormData(prev => ({ ...prev, items: newItems, total_harga: recalculateTotal(newItems) }));
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.items || formData.items.length === 0) {
      alert("Tambahkan minimal 1 produk ke dalam transaksi.");
      return;
    }
    navigate("/dashboard/transactions");
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
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Tambah Transaksi</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Catat Pembelian Baru dengan Multi Produk</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pilih Partner / PIC</label>
              <select required value={formData.partner_id || ""} onChange={e => setFormData({...formData, partner_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                <option value="" disabled>-- Pilih Partner --</option>
                {partners.map(p => (
                  <option key={p.id} value={p.id}>{p.perusahaan} ({p.nama_pic})</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">Sales Tanggung Jawab</label>
              <select value={formData.sales_id || ""} onChange={e => setFormData({...formData, sales_id: e.target.value})} className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                <option value="">-- Tanpa Sales Internal --</option>
                {sales.map(s => (
                  <option key={s.id} value={s.id}>{s.nama_pic} ({s.provinsi})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 pb-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#35ACDF]" />
                <h3 className="text-sm font-black text-[#00172D] uppercase tracking-widest">Daftar Produk</h3>
              </div>
              <button type="button" onClick={handleAddItem} className="px-4 py-2 bg-blue-50 text-[#35ACDF] hover:bg-[#35ACDF] hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                <Plus className="w-4 h-4 text-[#35ACDF]" /> Tambah Produk
              </button>
            </div>

            <div className="space-y-4">
              <AnimatePresence>
                {(!formData.items || formData.items.length === 0) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-8 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Belum ada produk. Klik tambah produk.</p>
                  </motion.div>
                )}
                {formData.items?.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-gray-50 rounded-2xl border border-gray-100"
                  >
                    <div className="space-y-1 md:col-span-5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Produk {index + 1}</label>
                      <select required value={item.product_id} onChange={e => handleItemChange(index, "product_id", e.target.value)} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                        <option value="" disabled>-- Pilih--</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>{p.nama}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jumlah Unit</label>
                      <input required type="number" min="1" value={item.jumlah_unit || ""} onChange={e => handleItemChange(index, "jumlah_unit", Number(e.target.value))} className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1 md:col-span-4">
                      <label className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest">Harga / Unit (Rp)</label>
                      <input required type="number" min="0" value={item.harga_satuan || ""} onChange={e => handleItemChange(index, "harga_satuan", Number(e.target.value))} className="w-full px-4 py-3 bg-blue-50/50 border border-blue-100 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="md:col-span-1 flex justify-center pb-1">
                      <button type="button" onClick={() => handleRemoveItem(index)} className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            <div className="mt-4 flex justify-end">
              <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between w-full md:w-1/2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Keseluruhan</span>
                <span className="text-xl font-black text-[#00172D]">
                  Rp {(formData.total_harga || 0).toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metode Pembelian</label>
              <select required value={formData.jenis_pembelian || "Full Payment"} onChange={e => setFormData({...formData, jenis_pembelian: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                <option value="Full Payment">Full Payment</option>
                <option value="Termin">Termin</option>
                <option value="Sewa">Sewa / DaaS</option>
                <option value="Trial">Trial / PoC</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Transaksi</label>
              <select required value={formData.status || "Selesai"} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                <option value="Selesai">Selesai</option>
                <option value="Proses">Proses</option>
                <option value="Batal">Batal</option>
              </select>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-6">
             <button type="button" onClick={() => navigate(-1)} className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all">
               Batal
             </button>
             <button type="submit" className="px-6 py-3 bg-[#00172D] hover:bg-[#004A7D] text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center gap-2">
               <Save className="w-4 h-4 text-[#35ACDF]" /> Simpan Transaksi
             </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
