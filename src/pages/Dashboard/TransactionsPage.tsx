import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Receipt, Search, Filter, TrendingUp, DollarSign, Package, CheckCircle2, Clock, BarChart3, PieChartIcon, Table as TableIcon, Download, Upload, Plus, X, Activity, Target, MoreVertical, FileText } from "lucide-react";
import { ClientData, ProductData, TransactionData } from "../../types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { exportData, importData } from "../../lib/exportUtils";

import { useNavigate } from "react-router-dom";

export default function TransactionsPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [partners, setPartners] = useState<Record<string, ClientData>>({});
  const [products, setProducts] = useState<Record<string, ProductData>>({});
  const [loading, setLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterJenis, setFilterJenis] = useState("Semua");
  const [filterPeriode, setFilterPeriode] = useState("Semua");
  const [viewMode, setViewMode] = useState<"table" | "chart">("table");

  const [isAnalisisTransaksiOpen, setIsAnalisisTransaksiOpen] = useState(false);
  const [isAnalisisTargetOpen, setIsAnalisisTargetOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<TransactionData>>({});

  const [sales, setSales] = useState<Record<string, ClientData>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, partnersRes, prodRes, transRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/products.json"),
          fetch("/data/transactions.json")
        ]);

        const salesData: ClientData[] = await salesRes.json();
        const salesMap: Record<string, ClientData> = {};
        salesData.forEach(s => { salesMap[s.id] = s; });
        setSales(salesMap);

        const partnersData: ClientData[] = await partnersRes.json();
        const allPartners = [...salesData, ...partnersData];
        
        const partnerMap: Record<string, ClientData> = {};
        allPartners.forEach(p => { partnerMap[p.id] = p; });
        setPartners(partnerMap);

        const prodData: ProductData[] = await prodRes.json();
        const prodMap: Record<string, ProductData> = {};
        prodData.forEach(p => { prodMap[p.id] = p; });
        setProducts(prodMap);

        const transData: TransactionData[] = await transRes.json();
        setTransactions(transData);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
  };

  const filteredTransactions = transactions.filter(t => {
    const partner = partners[t.partner_id];
    const product = products[t.product_id];
    
    const matchSearch = (partner?.perusahaan || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (product?.nama || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                  t.id.toLowerCase().includes(searchQuery.toLowerCase());
                  
    const matchJenis = filterJenis === "Semua" || (t.jenis_pembelian || "Full Payment") === filterJenis;
    
    let matchPeriode = true;
    if (filterPeriode === "3Bulan") {
      const txDate = new Date(t.tanggal);
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
      matchPeriode = txDate >= threeMonthsAgo;
    } else if (filterPeriode === "BulanIni") {
      const txDate = new Date(t.tanggal);
      const now = new Date();
      matchPeriode = txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    }

    return matchSearch && matchJenis && matchPeriode;
  });

  const totalRevenue = filteredTransactions.filter(t => t.status === "Selesai").reduce((acc, t) => acc + t.total_harga, 0);
  const totalUnits = filteredTransactions.filter(t => t.status === "Selesai").reduce((acc, t) => {
    const items = t.items && t.items.length > 0 ? t.items : (t.product_id ? [{ jumlah_unit: t.jumlah_unit || 1 }] : []);
    return acc + items.reduce((sum, item) => sum + (item.jumlah_unit || 1), 0);
  }, 0);

  // Chart Data Preparation
  const chartData = useMemo(() => {
    const revenueByProduct: Record<string, number> = {};
    const unitsByProduct: Record<string, number> = {};
    const typeDistribution: Record<string, number> = {};

    filteredTransactions.filter(t => t.status === "Selesai").forEach(t => {
      const items = t.items && t.items.length > 0 ? t.items : (t.product_id ? [{ product_id: t.product_id, jumlah_unit: t.jumlah_unit || 1, harga_satuan: t.total_harga / (t.jumlah_unit || 1) }] : []);

      items.forEach(item => {
        const pName = products[item.product_id]?.nama || item.product_id || "Unknown";
        const unitPrice = item.harga_satuan || 0;
        const totalLinePrice = unitPrice * item.jumlah_unit;
        
        revenueByProduct[pName] = (revenueByProduct[pName] || 0) + totalLinePrice;
        unitsByProduct[pName] = (unitsByProduct[pName] || 0) + item.jumlah_unit;
      });
      
      const type = t.jenis_pembelian || "Full Payment";
      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
    });

    return {
      revenueByProduct: Object.entries(revenueByProduct).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      unitsByProduct: Object.entries(unitsByProduct).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5),
      typeDistribution: Object.entries(typeDistribution).map(([name, value]) => ({ name, value }))
    };
  }, [filteredTransactions, products]);

  const COLORS = ['#35ACDF', '#f97316', '#10b981', '#6366f1', '#eab308'];

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          setTransactions(prev => [...prev, ...data]);
        }
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newTx = {
      ...formData,
      id: `TRX-${Date.now()}`,
      tanggal: new Date().toISOString().split("T")[0],
      jumlah_unit: Number(formData.jumlah_unit || 1),
      total_harga: Number(formData.total_harga || 0),
    } as TransactionData;
    
    setTransactions([newTx, ...transactions]);
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <input 
        type="file" 
        accept=".csv,.json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
      <div className="flex flex-col md:flex-row gap-6 mb-8 md:items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex flex-col min-w-0">
              <h1 className="text-3xl font-black text-[#00172D] tracking-tight whitespace-nowrap truncate">Transaksi</h1>
              <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest whitespace-nowrap truncate">Catatan Pembelian Partner & End User</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 shrink-0 pb-2 md:pb-0 relative z-30"
        >
          <div className="hidden md:flex bg-white border border-gray-100 rounded-full p-1 shadow-sm h-[40px] shrink-0">
            <button onClick={() => setViewMode("table")} className={`px-3 sm:px-4 py-1 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-widest ${viewMode === "table" ? "bg-[#00172D] text-white" : "text-gray-400 hover:bg-gray-50"}`}>
              <TableIcon className="w-3.5 h-3.5 text-[#35ACDF]" /> Tabel
            </button>
            <button onClick={() => setViewMode("chart")} className={`px-3 sm:px-4 py-1 flex items-center justify-center gap-1.5 sm:gap-2 rounded-full transition-colors text-[10px] sm:text-xs font-bold uppercase tracking-widest ${viewMode === "chart" ? "bg-[#00172D] text-white" : "text-gray-400 hover:bg-gray-50"}`}>
              <BarChart3 className="w-3.5 h-3.5 text-[#35ACDF]" /> Visual
            </button>
          </div>
          
           <button 
             onClick={() => navigate('/dashboard/transactions/add')}
             className="w-[40px] sm:w-auto px-0 sm:px-4 py-2 bg-[#00172D] hover:bg-gray-900 text-white text-[10px] h-[40px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0 ml-auto md:ml-0"
           >
             <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#35ACDF]" /> <span className="hidden sm:inline">Tambah</span>
           </button>

           <div className="flex md:hidden shrink-0">
             <button 
               onClick={() => setViewMode(viewMode === "table" ? "chart" : "table")} 
               className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#35ACDF] text-white transition-colors shadow-sm"
             >
               {viewMode === "table" && <TableIcon className="w-4 h-4 text-white" />}
               {viewMode === "chart" && <BarChart3 className="w-4 h-4 text-white" />}
             </button>
           </div>

           <div className="relative">
             <button 
               onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
               onBlur={() => setTimeout(() => setIsActionMenuOpen(false), 200)}
               className="w-[40px] h-[40px] bg-white border border-gray-200 text-[#00172D] hover:bg-gray-50 rounded-full shadow-sm transition-all flex items-center justify-center shrink-0"
             >
               <MoreVertical className="w-4 h-4 text-gray-500" />
             </button>
             <div className={`absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col overflow-hidden transition-all z-30 ${isActionMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Analisa Data</div>
                <button onClick={() => { setIsAnalisisTransaksiOpen(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1500); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-gray-400" /> Analisa Transaksi
                </button>
                <button onClick={() => { setIsAnalisisTargetOpen(true); setIsAnalyzing(true); setTimeout(() => setIsAnalyzing(false), 1500); }} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                  <Target className="w-3.5 h-3.5 text-gray-400" /> Analisa Target
                </button>
                <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Tindakan</div>
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5 text-gray-400" /> Import File
                </button>
                <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Export Sebagai</div>
                <button onClick={() => exportData(filteredTransactions, 'transaksi', 'csv')} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                   <FileText className="w-3.5 h-3.5 text-gray-400" /> File CSV
                </button>
                <button onClick={() => exportData(filteredTransactions, 'transaksi', 'json')} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest flex items-center gap-2">
                   <FileText className="w-3.5 h-3.5 text-gray-400" /> File JSON
                </button>
             </div>
           </div>
        </motion.div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 relative overflow-hidden"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 z-10">
            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
          </div>
          <div className="z-10">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Pendapatan (Selesai)</p>
            <p className="text-xl md:text-2xl font-black text-[#00172D]">{loading ? "..." : formatCurrency(totalRevenue)}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <TrendingUp className="w-24 h-24 md:w-32 md:h-32 text-gray-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 md:gap-6 relative overflow-hidden"
        >
          <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 z-10">
            <Package className="w-6 h-6 md:w-8 md:h-8 text-[#35ACDF]" />
          </div>
          <div className="z-10">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Unit Terjual (Selesai)</p>
            <p className="text-xl md:text-2xl font-black text-[#00172D]">{loading ? "..." : (Number.isNaN(totalUnits) ? "0" : totalUnits)}</p>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Package className="w-24 h-24 md:w-32 md:h-32 text-gray-100" />
          </div>
        </motion.div>
      </div>

      {/* Transaction List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50/50">
          <div className="relative w-full md:w-96 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari ID, Partner, atau Produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-20 md:pr-4 py-2 w-full bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 shadow-sm text-xs font-medium transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 md:hidden">
              <div className="relative w-5 h-5 flex items-center justify-center bg-gray-100 rounded-md">
                <Filter className="w-3.5 h-3.5 text-gray-600" />
                <select
                  value={filterJenis}
                  onChange={(e) => setFilterJenis(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                >
                  <option value="Semua">Semua Pembelian</option>
                  <option value="Full Payment">Full Payment</option>
                  <option value="Termin">Termin</option>
                  <option value="Sewa">Sewa / DaaS</option>
                  <option value="Trial">Trial / PoC</option>
                </select>
                {filterJenis !== "Semua" && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#35ACDF] rounded-full"></div>
                )}
              </div>
              <div className="relative w-5 h-5 flex items-center justify-center bg-gray-100 rounded-md">
                <Clock className="w-3.5 h-3.5 text-gray-600" />
                <select
                  value={filterPeriode}
                  onChange={(e) => setFilterPeriode(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                >
                  <option value="Semua">Semua Waktu</option>
                  <option value="BulanIni">Bulan Ini</option>
                  <option value="3Bulan">3 Bulan Terakhir</option>
                </select>
                {filterPeriode !== "Semua" && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#35ACDF] rounded-full"></div>
                )}
              </div>
            </div>
          </div>
          <div className="hidden md:flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:flex-none">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <select 
                 value={filterJenis}
                 onChange={(e) => setFilterJenis(e.target.value)}
                 className="pl-9 pr-8 py-2 w-full bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 appearance-none cursor-pointer"
               >
                 <option value="Semua">Semua Pembelian</option>
                 <option value="Full Payment">Full Payment</option>
                 <option value="Termin">Termin</option>
                 <option value="Sewa">Sewa / DaaS</option>
                 <option value="Trial">Trial / PoC</option>
               </select>
             </div>
             
             <div className="relative flex-1 md:flex-none">
               <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <select 
                 value={filterPeriode}
                 onChange={(e) => setFilterPeriode(e.target.value)}
                 className="pl-9 pr-8 py-2 w-full bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 appearance-none cursor-pointer"
               >
                 <option value="Semua">Semua Waktu</option>
                 <option value="BulanIni">Bulan Ini</option>
                 <option value="3Bulan">3 Bulan Terakhir</option>
               </select>
             </div>
          </div>
        </div>

        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">ID Transaksi</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Tanggal</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Pembeli (Partner)</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Total Harga</th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Memuat data...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm font-bold text-gray-400 uppercase tracking-widest">
                      Tidak ada transaksi ditemukan
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((trx) => {
                    const partner = partners[trx.partner_id];
                    let productNames = "-";
                    let discountGiven = 0;
                    let basePriceAcc = 0;
                    
                    const txItems = trx.items && trx.items.length > 0 ? trx.items : (trx.product_id ? [{ product_id: trx.product_id, jumlah_unit: trx.jumlah_unit || 1, harga_satuan: trx.total_harga / (trx.jumlah_unit || 1) }] : []);
                    const totalQty = txItems.reduce((acc, item) => acc + item.jumlah_unit, 0);
                    
                    if (txItems.length === 1) {
                        const product = products[txItems[0].product_id];
                        productNames = product ? product.nama : "-";
                        const normalPrice = product ? (product.harga_normal || product.harga_satuan) : 0;
                        const basePrice = product ? (product.harga_dasar || product.harga_satuan * 0.9) : 0;
                        discountGiven = (normalPrice * txItems[0].jumlah_unit) - trx.total_harga;
                        basePriceAcc = basePrice * txItems[0].jumlah_unit;
                    } else if (txItems.length > 1) {
                        productNames = `${txItems.length} Produk Berbeda`;
                        txItems.forEach(item => {
                            const product = products[item.product_id];
                            const normalPrice = product ? (product.harga_normal || product.harga_satuan) : 0;
                            const basePrice = product ? (product.harga_dasar || product.harga_satuan * 0.9) : 0;
                            discountGiven += (normalPrice * item.jumlah_unit) - ((item.harga_satuan || 0) * item.jumlah_unit);
                            basePriceAcc += basePrice * item.jumlah_unit;
                        });
                    }
                    
                    const marginValue = trx.total_harga - basePriceAcc;

                    return (
                        <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => navigate(`/dashboard/transaction/${trx.id}`)}>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <span className="font-mono text-xs font-bold text-[#35ACDF]">{trx.id}</span>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-gray-600">
                          {trx.tanggal}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold text-[#00172D] text-xs md:text-sm">{partner ? partner.perusahaan : "-"}</div>
                          <div className="text-[9px] md:text-[10px] font-semibold text-gray-400 uppercase tracking-wider mt-0.5">{partner ? partner.tipe : ""}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4 font-black text-[#00172D] text-xs md:text-sm">
                          {formatCurrency(trx.total_harga)}
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          {trx.status === "Selesai" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                              <CheckCircle2 className="w-3 h-3 text-[#35ACDF]" /> Selesai
                            </span>
                          ) : trx.status === "Proses" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-orange-50 text-orange-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                              <Clock className="w-3 h-3 text-gray-400" /> Proses
                            </span>
                          ) : (
                             <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-50 text-red-600 text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                               Batal
                             </span>
                          )}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 bg-white rounded-b-2xl md:rounded-b-3xl">
            <div className="space-y-4">
              <h3 className="font-black text-[#00172D] text-base md:text-lg flex items-center gap-2">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /> Pendapatan by Produk (Top 5)
              </h3>
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.revenueByProduct}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <YAxis tickFormatter={(val) => `Rp${(val / 1000000).toFixed(0)}M`} tick={{ fontSize: 10, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <RechartsTooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="value" fill="#35ACDF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-black text-[#00172D] text-base md:text-lg flex items-center gap-2">
                <PieChartIcon className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" /> Distribusi Metode Pembelian
              </h3>
              <div className="h-[250px] md:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData.typeDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.typeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Analisa Transaksi Modal */}
      <AnimatePresence>
        {isAnalisisTransaksiOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00172D]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-8 relative scrollbar-hide"
            >
              <button 
                onClick={() => setIsAnalisisTransaksiOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#35ACDF]">
                  <Activity className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#00172D] tracking-tight">Analisa Transaksi</h2>
                  <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5">Performa & Tren Penjualan</p>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-[#35ACDF]/20 border-t-[#35ACDF] rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Memproses Data Transaksi...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest mb-2">Ringkasan Eksekutif</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Total transaksi terverifikasi berjumlah {filteredTransactions.length} dengan nilai omset mencapai {formatCurrency(totalRevenue)}.
                      Metode pembayaran "Full Payment" mendominasi penjualan aktif saat ini.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-100 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Transaksi Tertinggi</p>
                      <p className="text-lg font-black text-[#00172D] break-words">
                        {filteredTransactions.length > 0 ? formatCurrency(Math.max(...filteredTransactions.map(t => t.total_harga))) : "Rp 0"}
                      </p>
                    </div>
                    <div className="p-4 border border-gray-100 rounded-2xl shadow-sm">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status Keberhasilan</p>
                      <p className="text-lg font-black text-emerald-600">
                        {((filteredTransactions.filter(t => t.status === "Selesai").length / (filteredTransactions.length || 1)) * 100).toFixed(0)}% Selesai
                      </p>
                    </div>
                  </div>

                  <div className="p-5 border border-gray-100 rounded-2xl">
                     <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-4">Pola Pemesanan Partner</h3>
                     <ul className="space-y-3 text-sm text-gray-600">
                       <li className="flex items-start gap-2">
                         <CheckCircle2 className="w-4 h-4 text-[#35ACDF] shrink-0 mt-0.5 text-[#35ACDF]" />
                         Mayoritas volume perangkat keras diserap oleh distributor besar.
                       </li>
                       <li className="flex items-start gap-2">
                         <CheckCircle2 className="w-4 h-4 text-[#35ACDF] shrink-0 mt-0.5 text-[#35ACDF]" />
                         Stabilitas pembayaran (Termin) lebih disukai oleh klien area Jabodetabek.
                       </li>
                     </ul>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analisa Target Modal */}
      <AnimatePresence>
        {isAnalisisTargetOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#00172D]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl md:rounded-3xl shadow-2xl p-5 md:p-8 relative scrollbar-hide"
            >
              <button 
                onClick={() => setIsAnalisisTargetOpen(false)}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-1.5 md:p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors"
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              </button>
              
              <div className="flex items-center gap-3 mb-6 md:mb-8 border-b border-gray-100 pb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#35ACDF]">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-[#00172D] tracking-tight">Analisa Target</h2>
                  <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-0.5">Evaluasi Capaian & Rekomendasi</p>
                </div>
              </div>

              {isAnalyzing ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest animate-pulse">Menghitung Deviasi Target...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                    <h3 className="text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest mb-2">Evaluasi Momentum</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Secara keseluruhan produk kita mengejar ambang batas aman. 
                      Beberapa lini produk premium membutuhkan dukungan sales lapangan tambahan karena menunjukkan defisit pencapaian (tercapai &lt; target bulanan).
                    </p>
                  </div>

                  <div className="space-y-4">
                     <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">Tindakan Prioritas Penjualan</h3>
                     
                     <div className="space-y-3">
                       {(Object.values(products) as ProductData[]).filter(p => p.tercapai < p.target_bulanan).map((p, idx) => {
                         const deficit = p.target_bulanan - p.tercapai;
                         const percent = (p.tercapai / p.target_bulanan) * 100;
                         return (
                           <div key={p.id || idx} className="p-4 border border-red-100 bg-gray-50 rounded-2xl">
                             <div className="flex justify-between items-start mb-2">
                               <p className="font-bold text-gray-800">{p.nama}</p>
                               <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-600 rounded">TARGET TERTINGGAL</span>
                             </div>
                             <p className="text-xs text-gray-600 mb-2">Hanya mencapai <b>{Number.isNaN(percent) ? "0" : percent.toFixed(0)}%</b> dari target bulanan ({Number.isNaN(p.tercapai) ? 0 : p.tercapai} / {Number.isNaN(p.target_bulanan) ? 0 : p.target_bulanan} unit).</p>
                             <div className="w-full bg-white rounded-full h-1.5 border border-red-100 overflow-hidden">
                                <div className="bg-red-500 h-1.5" style={{ width: `${Number.isNaN(percent) ? 0 : percent}%` }}></div>
                             </div>
                             <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-3">Rekomendasi: Fokus diskon atau bundling {Number.isNaN(deficit) ? "0" : deficit} unit</p>
                           </div>
                         )
                       })}
                     </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
