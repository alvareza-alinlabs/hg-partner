import React, { useState, useEffect, useMemo, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Phone, MapPin, X, Building, CheckCircle2, User, Mail, FileText, Briefcase, Hash, LayoutGrid, List, Table as TableIcon, Target, Download, Upload, Plus, Filter, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ClientData } from "../../types";
import { exportData, importData } from "../../lib/exportUtils";

export default function DatabasePage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"card" | "list" | "table">("card");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("Semua");
  const [statusFilter, setStatusFilter] = useState("Semua");

  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<ClientData>>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [partnersRes] = await Promise.all([
          fetch("/data/partners.json")
        ]);
        const partnersData = await partnersRes.json();
        
        const allClients = [...partnersData].map((c: any) => {
          const statuses = ["Mitra Aktif", "Calon Mitra", "Target"];
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          return { ...c, status_kemitraan: statuses[charCode % 3] };
        });

        setClients(allClients);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const matchSearch = client.nama_pic?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          client.perusahaan.toLowerCase().includes(searchQuery.toLowerCase());
      const matchProduct = productFilter === "Semua" || client.fokus_produk.includes(productFilter);
      const matchStatus = statusFilter === "Semua" || client.status_kemitraan === statusFilter;

      return matchSearch && matchProduct && matchStatus;
    });
  }, [clients, searchQuery, productFilter, statusFilter]);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      importData(file, (data) => {
        if (data.length > 0) {
          setClients(prev => [...prev, ...data]);
        }
      });
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const newPartner = {
      ...formData,
      id: `PTR-${Date.now()}`,
      fokus_produk: formData.fokus_produk || [],
      koordinat_lat: formData.koordinat_lat || -6.200000,
      koordinat_long: formData.koordinat_long || 106.816666
    } as ClientData;
    
    setClients([newPartner, ...clients]);
    setIsAdding(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <input 
        type="file" 
        accept=".csv,.json" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleImport} 
      />
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex flex-col min-w-0">
              <h1 className="text-3xl font-black text-[#00172D] tracking-tight whitespace-nowrap truncate">Database Mitra</h1>
              <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest whitespace-nowrap truncate">Daftar Jaringan Aktif</p>
            </div>
          </div>
        </motion.div>

        {/* Filters & View Toggles */}
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
               className="pl-9 pr-10 py-2 w-full h-[38px] bg-transparent focus:outline-none text-sm font-medium rounded-full min-w-0"
             />
             <div className="absolute right-1 top-1/2 -translate-y-1/2 group">
               <button className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${statusFilter !== "Semua" ? "text-[#35ACDF] bg-blue-50" : "text-gray-400 hover:bg-gray-100"}`}>
                 <Filter className="w-4 h-4" />
               </button>
               <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                 <button onClick={() => setStatusFilter("Semua")} className={`px-4 py-3 text-left text-xs font-bold ${statusFilter === "Semua" ? "text-[#35ACDF] bg-blue-50/50" : "text-gray-700 hover:bg-gray-50"} uppercase tracking-widest border-b border-gray-50`}>Semua Status</button>
                 <button onClick={() => setStatusFilter("Mitra Aktif")} className={`px-4 py-3 text-left text-xs font-bold ${statusFilter === "Mitra Aktif" ? "text-[#35ACDF] bg-blue-50/50" : "text-gray-700 hover:bg-gray-50"} uppercase tracking-widest border-b border-gray-50`}>Mitra Aktif</button>
                 <button onClick={() => setStatusFilter("Calon Mitra")} className={`px-4 py-3 text-left text-xs font-bold ${statusFilter === "Calon Mitra" ? "text-[#35ACDF] bg-blue-50/50" : "text-gray-700 hover:bg-gray-50"} uppercase tracking-widest border-b border-gray-50`}>Calon Mitra</button>
                 <button onClick={() => setStatusFilter("Target")} className={`px-4 py-3 text-left text-xs font-bold ${statusFilter === "Target" ? "text-[#35ACDF] bg-blue-50/50" : "text-gray-700 hover:bg-gray-50"} uppercase tracking-widest`}>Target (Prospek)</button>
               </div>
             </div>
          </div>

          <div className="flex gap-2 shrink-0 justify-end">
            <button 
              onClick={() => navigate('/dashboard/partners/add')}
              className="px-3 sm:px-4 py-2 bg-[#00172D] hover:bg-gray-900 text-white text-[10px] h-[40px] font-bold uppercase tracking-widest rounded-full shadow-sm transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-[#35ACDF]" /> <span className="inline">Tambah</span>
            </button>

            <div className="hidden md:flex bg-white border border-gray-200 rounded-full p-1 shadow-sm h-[40px] shrink-0 w-max">
              <button onClick={() => setViewMode("card")} className={`px-3 py-1 flex items-center justify-center rounded-full transition-colors ${viewMode === "card" ? "bg-[#35ACDF] text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                <LayoutGrid className={`w-4 h-4 ${viewMode === "card" ? "text-white" : "text-[#35ACDF]"}`} />
              </button>
              <button onClick={() => setViewMode("list")} className={`px-3 py-1 flex items-center justify-center rounded-full transition-colors ${viewMode === "list" ? "bg-[#35ACDF] text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                <List className={`w-4 h-4 ${viewMode === "list" ? "text-white" : "text-[#35ACDF]"}`} />
              </button>
              <button onClick={() => setViewMode("table")} className={`px-3 py-1 flex items-center justify-center rounded-full transition-colors ${viewMode === "table" ? "bg-[#35ACDF] text-white" : "text-gray-400 hover:bg-gray-100"}`}>
                <TableIcon className={`w-4 h-4 ${viewMode === "table" ? "text-white" : "text-[#35ACDF]"}`} />
              </button>
            </div>

            <div className="flex md:hidden shrink-0">
              <button 
                onClick={() => setViewMode(viewMode === "card" ? "list" : viewMode === "list" ? "table" : "card")} 
                className="w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#35ACDF] text-white transition-colors shadow-sm"
              >
                {viewMode === "card" && <LayoutGrid className="w-4 h-4 text-white" />}
                {viewMode === "list" && <List className="w-4 h-4 text-white" />}
                {viewMode === "table" && <TableIcon className="w-4 h-4 text-white" />}
              </button>
            </div>

            <div className="relative group shrink-0">
              <button className="w-[40px] h-[40px] bg-white border border-gray-200 text-[#00172D] hover:bg-gray-50 rounded-full shadow-sm transition-all flex items-center justify-center">
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl flex flex-col overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
                 <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Tindakan</div>
                 <button onClick={() => fileInputRef.current?.click()} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                   <Upload className="w-3.5 h-3.5 text-gray-400" /> Import File
                 </button>
                 <div className="px-4 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 bg-gray-50">Export Sebagai</div>
                 <button onClick={() => exportData(filteredClients, 'data_mitra', 'csv')} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest border-b border-gray-50 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> File CSV
                 </button>
                 <button onClick={() => exportData(filteredClients, 'data_mitra', 'json')} className="px-4 py-3 text-left text-xs font-bold text-gray-700 hover:bg-gray-50 uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-400" /> File JSON
                 </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Database Container */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="mt-8">
          {viewMode === "card" && (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <AnimatePresence>
                {filteredClients.map((client) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={client.id}
                    onClick={() => navigate(`/dashboard/client/${client.id}`)}
                    className="bg-white rounded-2xl md:rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer flex flex-col hover:scale-[1.02]"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex flex-col">
                        {client.tipe !== "Sales" && (
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                            {client.tipe}
                          </span>
                        )}
                      </div>
                      {client.status_kemitraan && (
                         <span className={`px-2 py-0.5 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded whitespace-nowrap mt-1 md:mt-0 ${client.status_kemitraan === "Mitra Aktif" ? "bg-emerald-50 text-emerald-600" : client.status_kemitraan === "Calon Mitra" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                           {client.status_kemitraan}
                         </span>
                      )}
                    </div>
                    
                    <h3 className="text-base md:text-lg font-bold text-[#00172D] mb-0.5 md:mb-1">{client.perusahaan}</h3>
                    <p className="text-[9px] md:text-[10px] uppercase font-bold text-gray-400 mb-3 md:mb-4 flex items-center gap-1.5 tracking-wider line-clamp-1">
                       {client.provinsi} &bull; {client.kota}
                    </p>

                    <div className="mt-auto space-y-2 pt-3 md:pt-4 border-t border-gray-50 flex-1">
                      <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-gray-600">
                        <User className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-400" />
                        <span className="truncate">PIC: {client.nama_pic}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-gray-600">
                        <Briefcase className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#35ACDF]" />
                        <span className="truncate">Sales: {client.nama_sales || "-"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] md:text-xs font-semibold text-gray-600">
                        <Phone className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#35ACDF]" />
                        <span>{client.telepon_kantor}</span>
                      </div>
                    </div>

                    <div className="mt-3 md:mt-4 flex flex-wrap gap-1.5">
                      {client.fokus_produk.map(f => (
                        <span key={f} className="text-[8px] md:text-[9px] uppercase tracking-widest font-bold bg-gray-50 text-gray-500 px-2 py-1 rounded">
                          {f}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === "list" && (
            <div className="space-y-3 md:space-y-4">
              <AnimatePresence>
                {filteredClients.map((client) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={client.id}
                    onClick={() => navigate(`/dashboard/client/${client.id}`)}
                    className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-4 cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
                       <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                         <Building className="w-4 h-4 md:w-5 md:h-5 text-[#35ACDF]" />
                       </div>
                       <div className="min-w-0">
                         <h3 className="font-bold text-[#00172D] text-base md:text-lg truncate">{client.perusahaan}</h3>
                         <p className="text-[11px] md:text-xs font-semibold text-gray-500 truncate">{client.nama_pic} &bull; {client.provinsi}</p>
                       </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 md:gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-0 border-gray-50">
                        {client.status_kemitraan && (
                         <span className={`px-2 py-1 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded ${client.status_kemitraan === "Mitra Aktif" ? "bg-emerald-50 text-emerald-600" : client.status_kemitraan === "Calon Mitra" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                           {client.status_kemitraan}
                         </span>
                        )}
                        {client.tipe !== "Sales" && (
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest pl-1 text-gray-400">
                            {client.tipe}
                          </span>
                        )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}

          {viewMode === "table" && (
            <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap min-w-[600px]">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Perusahaan</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">PIC / Kontak</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Tipe / Area</th>
                      <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredClients.map((client) => (
                      <tr key={client.id} onClick={() => navigate(`/dashboard/client/${client.id}`)} className="hover:bg-gray-50/50 cursor-pointer transition-colors group">
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold text-[#00172D] text-xs md:text-sm">{client.perusahaan}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          <div className="font-bold text-[#00172D] text-xs md:text-sm">{client.nama_pic}</div>
                          <div className="text-[9px] md:text-[10px] font-semibold text-gray-400 mt-0.5">{client.telepon_kantor}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                           {client.tipe !== "Sales" && (
                             <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-gray-400">
                               {client.tipe}
                             </span>
                           )}
                           <div className="text-[9px] md:text-[10px] font-semibold text-gray-400 mt-1">{client.kota}</div>
                        </td>
                        <td className="px-4 md:px-6 py-3 md:py-4">
                          {client.status_kemitraan && (
                           <span className={`px-2 py-1 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded ${client.status_kemitraan === "Mitra Aktif" ? "bg-emerald-50 text-emerald-600" : client.status_kemitraan === "Calon Mitra" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                             {client.status_kemitraan}
                           </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {filteredClients.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm"
            >
              Tidak ada mitra yang ditemukan
            </motion.div>
          )}
        </div>
      )}

    </motion.div>
  );
}
