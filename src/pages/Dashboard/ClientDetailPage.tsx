import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Phone, Mail, User, Briefcase, Hash, FileText, ArrowLeft, Building, Receipt, ShoppingBag, Edit2, Trash2, Save, X, Plus } from "lucide-react";
import { ClientData, TransactionData } from "../../types";

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [client, setClient] = useState<ClientData | null>(null);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [partners, setPartners] = useState<ClientData[]>([]); // For Sales, to list their partners
  const [allSales, setAllSales] = useState<ClientData[]>([]); // To populate Sales dropdown in edit partner
  
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(searchParams.get("edit") === "true");
  const [formData, setFormData] = useState<Partial<ClientData>>({});

  const handleProductToggle = (product: string) => {
    const currentProducts = formData.fokus_produk || [];
    if (currentProducts.includes(product)) {
      setFormData({ ...formData, fokus_produk: currentProducts.filter(p => p !== product) });
    } else {
      setFormData({ ...formData, fokus_produk: [...currentProducts, product] });
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const [salesRes, partnersRes, transRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/transactions.json")
        ]);
        const salesData = await salesRes.json();
        const partnersData = await partnersRes.json();
        const allTrans = await transRes.json();
        
        const allClients = [...salesData, ...partnersData].map((c: any) => {
          const statuses = ["Mitra Aktif", "Calon Mitra", "Target"];
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          return { ...c, status_kemitraan: statuses[charCode % 3] };
        });

        setAllSales(salesData);

        const found = allClients.find(c => c.id === id);
        if (found) {
          setClient(found);
          setFormData(found);
          if (found.tipe === "Sales") {
            const myPartners = allClients.filter(c => c.tipe !== "Sales" && (c.sales_id === found.id || c.nama_sales === found.nama_pic));
            setPartners(myPartners);
            
            const partnerIds = myPartners.map(p => p.id);
            const salesTrans = allTrans.filter((t: any) => t.partner_id === id || partnerIds.includes(t.partner_id) || t.sales_id === id);
            setTransactions(salesTrans);
          } else {
             const clientTrans = allTrans.filter((t: any) => t.partner_id === id);
             setTransactions(clientTrans);
          }
        }
      } catch (error) {
        console.error("Failed to fetch client detail:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchDetail();
    }
  }, [id]);

  useEffect(() => {
    setIsEditing(searchParams.get("edit") === "true");
  }, [searchParams]);

  const toggleEdit = (status: boolean) => {
    if (status) {
      setSearchParams({ edit: 'true' });
      setFormData(client || {});
    } else {
      setSearchParams({});
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (client) {
      setClient({ ...client, ...formData } as ClientData);
      toggleEdit(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
       if (client?.tipe === "Sales") {
         navigate('/dashboard/sales');
       } else {
         navigate('/dashboard/partners');
       }
    }
  };

  const formatWa = (numStr?: string) => {
    if (!numStr) return "";
    let clean = numStr.replace(/\D/g, '');
    if (clean.startsWith('0')) return '62' + clean.slice(1);
    return clean;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-[#35ACDF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-black text-[#00172D] mb-4">Data tidak ditemukan</h2>
        <button onClick={() => navigate(-1)} className="text-[#35ACDF] font-bold hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  const isSalesDetails = client.tipe === "Sales";

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
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">
            {isEditing 
                ? `Edit ${isSalesDetails ? client.nama_pic : client.perusahaan}` 
                : (isSalesDetails ? client.nama_pic : client.perusahaan)
            }
          </h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">
            {isEditing 
              ? `Mode Edit ${isSalesDetails ? 'Sales' : 'Partner'}` 
              : `Detail Informasi & Riwayat ${isSalesDetails ? 'Sales' : 'Partner'}`
            }
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Detail Content or Edit Form */}
        <div className="lg:col-span-2 space-y-6">
           {isEditing ? (
             <form id="edit-client-form" onSubmit={handleSave} className="space-y-6">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {!isSalesDetails && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Perusahaan*</label>
                        <input required type="text" value={formData.perusahaan || ""} onChange={e => setFormData({...formData, perusahaan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nama Lengkap (PIC/Sales)*</label>
                      <input required type="text" value={formData.nama_pic || ""} onChange={e => setFormData({...formData, nama_pic: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Jabatan</label>
                      <input type="text" value={formData.jabatan || ""} onChange={e => setFormData({...formData, jabatan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                  </div>

                  {!isSalesDetails && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sales Penanggung Jawab</label>
                      <select value={formData.sales_id || ""} onChange={e => {
                        const s = allSales.find(sale => sale.id === e.target.value);
                        setFormData({...formData, sales_id: s?.id, nama_sales: s?.nama_pic});
                      }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium cursor-pointer">
                        <option value="">Pilih Sales Team...</option>
                        {allSales.map(s => (
                           <option key={s.id} value={s.id}>{s.nama_pic}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Provinsi</label>
                      <input type="text" value={formData.provinsi || ""} onChange={e => setFormData({...formData, provinsi: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kota</label>
                      <input type="text" value={formData.kota || ""} onChange={e => setFormData({...formData, kota: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area</label>
                      <input type="text" value={formData.area || ""} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold flex items-center gap-1 text-orange-500 uppercase tracking-widest">Latitude (Garis Lintang)</label>
                      <input step="any" type="number" value={formData.koordinat_lat || ""} onChange={e => setFormData({...formData, koordinat_lat: parseFloat(e.target.value)})} placeholder="-6.200000" className="w-full px-4 py-3 bg-blue-50/30 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold flex items-center gap-1 text-[#35ACDF] uppercase tracking-widest">Longitude (Garis Bujur)</label>
                      <input step="any" type="number" value={formData.koordinat_long || ""} onChange={e => setFormData({...formData, koordinat_long: parseFloat(e.target.value)})} placeholder="106.816666" className="w-full px-4 py-3 bg-orange-50/30 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500/50 outline-none text-sm font-medium" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Alamat Detail</label>
                    <textarea value={formData.alamat_detail || ""} onChange={e => setFormData({...formData, alamat_detail: e.target.value})} rows={2} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No. Handphone*</label>
                      <input required type="text" value={formData.no_hp || ""} onChange={e => setFormData({...formData, no_hp: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Telepon Kantor</label>
                      <input type="text" value={formData.telepon_kantor || ""} onChange={e => setFormData({...formData, telepon_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email</label>
                      <input type="email" value={formData.email_kantor || ""} onChange={e => setFormData({...formData, email_kantor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Catatan (Internal)</label>
                    <textarea value={formData.catatan || ""} onChange={e => setFormData({...formData, catatan: e.target.value})} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                  </div>

                  {!isSalesDetails && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tipe Organisasi</label>
                          <select required value={formData.tipe || "Distributor"} onChange={e => setFormData({...formData, tipe: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                            <option value="Distributor">Distributor</option>
                            <option value="End User">End User</option>
                            <option value="Sales">Tim Sales Internal</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Brand Utama</label>
                          <select required value={formData.brand_utama || "HP Inc"} onChange={e => setFormData({...formData, brand_utama: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                            <option value="HP Inc">HP Inc</option>
                            <option value="Poly">Poly</option>
                            <option value="Lainnya">Lainnya...</option>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Kemitraan</label>
                          <select required value={formData.status_kemitraan || "Calon Mitra"} onChange={e => setFormData({...formData, status_kemitraan: e.target.value as any})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium">
                            <option value="Calon Mitra">Calon Mitra</option>
                            <option value="Target">Target (Prospek Baru)</option>
                            <option value="Mitra Aktif">Mitra Aktif</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Fokus Produk</label>
                        <div className="flex flex-wrap gap-2">
                          {["HP Inc", "Poly", "Laptop", "Printer", "PC"].map((item) => (
                            <label key={item} className="relative flex-shrink-0 cursor-pointer group">
                              <input type="checkbox" className="peer sr-only" checked={formData.fokus_produk?.includes(item)} onChange={() => handleProductToggle(item)} />
                              <span className="inline-block px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 transition-all peer-checked:bg-[#00172D] peer-checked:text-white peer-checked:border-[#00172D] hover:bg-gray-100 peer-checked:hover:bg-[#00172D]">
                                {item}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">List Produk Kompetitor (Opsional)</label>
                        <input type="text" placeholder="Gunakan koma untuk pisahkan (e.g. Dell, Lenovo, Logitech)" value={formData.list_produk_kompetitor?.join(", ") || ""} onChange={e => setFormData({...formData, list_produk_kompetitor: e.target.value.split(",").map(v => v.trim()).filter(v => v)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium" />
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Value / Kelebihan Kompetitor vs Kita</label>
                        <textarea rows={2} placeholder="Sebutkan kenapa kompetitor lebih dipilih (jika status Calon/Target)..." value={formData.value_kompetitor || ""} onChange={e => setFormData({...formData, value_kompetitor: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#35ACDF]/50 outline-none text-sm font-medium resize-none" />
                      </div>
                    </>
                  )}
                </div>
             </form>
           ) : (
             <div className="space-y-6">
               <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                 <div className="flex items-center gap-2 mb-6">
                    {!isSalesDetails && (
                      <>
                        <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded ${client.tipe === "Sales" ? "bg-blue-50 text-[#35ACDF]" : client.tipe === "Distributor" ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600"}`}>
                          {client.tipe}
                        </span>
                        {client.jenis_perusahaan && (
                          <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded drop-shadow-sm">
                            {client.jenis_perusahaan}
                          </span>
                        )}
                        {client.status_kemitraan && (
                          <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded ${client.status_kemitraan === "Mitra Aktif" ? "bg-emerald-50 text-emerald-600" : client.status_kemitraan === "Calon Mitra" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                            {client.status_kemitraan}
                          </span>
                        )}
                        <span className="px-2 py-1 text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 rounded">
                          {client.brand_utama}
                        </span>
                      </>
                    )}
                 </div>

                 <div className="space-y-5">
                     <div className="flex items-start gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 mt-0.5">
                         <MapPin className="w-4 h-4 text-gray-400" />
                       </div>
                       <div>
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isSalesDetails ? 'Area Operasional' : 'Alamat Lengkap'}</p>
                         <p className="font-bold text-gray-800 text-sm mt-0.5 leading-relaxed">{client.alamat_detail}</p>
                         <p className="font-semibold text-gray-500 text-xs mt-1">{client.kota}, {client.provinsi}</p>
                       </div>
                     </div>
                     
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                         <Building className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isSalesDetails ? 'Kantor' : 'Telepon Kantor'}</p>
                         <p className="font-bold text-gray-800 text-sm mt-0.5">{isSalesDetails ? client.perusahaan : client.telepon_kantor}</p>
                       </div>
                       {!isSalesDetails && client.telepon_kantor && (
                         <a href={`tel:${client.telepon_kantor.replace(/\D/g,'')}`} title="Call" className="w-8 h-8 rounded bg-gray-50 hover:bg-[#35ACDF] hover:text-white text-gray-400 flex items-center justify-center transition-colors">
                           <Phone className="w-4 h-4 text-gray-400" />
                         </a>
                       )}
                     </div>
                     
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                         <Mail className="w-4 h-4 text-gray-400" />
                       </div>
                       <div className="flex-1 min-w-0">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email {isSalesDetails ? 'Personal' : 'Kantor'}</p>
                         <p className="font-bold text-gray-800 text-sm mt-0.5 truncate">{client.email_kantor}</p>
                       </div>
                       {client.email_kantor && (
                         <a href={`mailto:${client.email_kantor}`} title="Send Email" className="w-8 h-8 rounded bg-gray-50 hover:bg-[#35ACDF] hover:text-white text-gray-400 flex items-center justify-center transition-colors shrink-0">
                           <Mail className="w-4 h-4 text-gray-400" />
                         </a>
                       )}
                     </div>
                 </div>

                 <div className="border-t border-gray-100 mt-6 pt-6 space-y-5">
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                         <User className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{isSalesDetails ? 'Nama Lengkap' : 'Nama PIC'}</p>
                         <p className="font-bold text-gray-800 text-sm mt-0.5">{client.nama_pic}</p>
                       </div>
                     </div>

                     {!isSalesDetails && (
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-50/50 flex items-center justify-center text-[#35ACDF] shrink-0">
                           <Briefcase className="w-4 h-4 text-[#35ACDF]" />
                         </div>
                         <div className="flex-1">
                           <p className="text-[9px] font-bold text-[#35ACDF] uppercase tracking-widest">Sales Tanggung Jawab</p>
                           <p className="font-bold text-[#00172D] text-sm mt-0.5">{client.nama_sales || "-"}</p>
                         </div>
                       </div>
                     )}
                     
                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                         <Hash className="w-4 h-4 text-[#35ACDF]" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Jabatan</p>
                         <p className="font-bold text-gray-800 text-sm mt-0.5">{client.jabatan}</p>
                       </div>
                     </div>

                     <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                         <Phone className="w-4 h-4 text-gray-400" />
                       </div>
                       <div className="flex-1">
                         <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">No. Handphone</p>
                         <p className="font-bold text-gray-800 text-sm mt-0.5">{client.no_hp}</p>
                       </div>
                       <div className="flex gap-2 shrink-0">
                         <a href={`tel:${client.no_hp.replace(/\D/g,'')}`} title="Call" className="w-8 h-8 rounded bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-400 flex items-center justify-center transition-colors">
                           <Phone className="w-4 h-4 text-gray-400" />
                         </a>
                         <a href={`https://wa.me/${formatWa(client.no_hp)}`} target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-8 h-8 rounded bg-gray-50 hover:bg-emerald-500 hover:text-white text-gray-400 flex items-center justify-center transition-colors">
                           <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                         </a>
                       </div>
                     </div>
                 </div>

                 {!isSalesDetails && (
                   <div className="border-t border-gray-100 mt-6 pt-6">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Fokus Produk / Spesialisasi</p>
                       <div className="flex flex-wrap gap-2">
                         {client.fokus_produk.map(f => (
                           <span key={f} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                             {f}
                           </span>
                         ))}
                       </div>
                   </div>
                 )}

                 {client.list_produk_kompetitor && client.list_produk_kompetitor.length > 0 && (
                     <div className="border-t border-gray-100 mt-6 pt-6">
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Produk Kompetitor</p>
                         <div className="flex flex-wrap gap-2">
                           {client.list_produk_kompetitor.map(f => (
                             <span key={f} className="px-3 py-1.5 bg-red-50 text-red-600 text-[9px] font-bold uppercase tracking-widest rounded shadow-sm">
                               {f}
                             </span>
                           ))}
                         </div>
                     </div>
                 )}

                 {client.value_kompetitor && (
                     <div className="border-t border-gray-100 mt-6 pt-6">
                       <div className="flex items-start gap-3 group">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#35ACDF] mt-0.5">
                           <FileText className="w-4 h-4 text-[#35ACDF]" />
                         </div>
                         <div>
                           <p className="text-[9px] font-bold text-orange-500 uppercase tracking-widest">Value Kompetitor vs Kita</p>
                           <p className="font-bold text-gray-800 text-sm mt-0.5">{client.value_kompetitor}</p>
                         </div>
                       </div>
                     </div>
                 )}
                 
                 {client.catatan && (
                     <div className="border-t border-gray-100 mt-6 pt-6">
                       <div className="flex items-start gap-3 group">
                         <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#35ACDF] mt-0.5">
                           <FileText className="w-4 h-4 text-[#35ACDF]" />
                         </div>
                         <div>
                           <p className="text-[9px] font-bold text-[#35ACDF] uppercase tracking-widest">Catatan Tambahan</p>
                           <p className="font-bold text-gray-800 text-sm mt-0.5">{client.catatan}</p>
                         </div>
                       </div>
                     </div>
                 )}
               </div>

               {/* Jika ini adalah detail khusus internal Sales, tampilkan daftar partner mereka */}
               {isSalesDetails && (
                 <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm">
                   <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                         <Building className="w-5 h-5 text-[#35ACDF]" />
                      </div>
                      <div>
                         <h2 className="text-xl font-black text-[#00172D]">Mitra / Klien Binaan</h2>
                         <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-0.5">Partner dibawah kelolaan {client.nama_pic}</p>
                      </div>
                   </div>

                   {partners.length === 0 ? (
                      <div className="pt-6 pb-2 text-center flex flex-col items-center">
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Belum memiliki partner kelolaan</p>
                      </div>
                   ) : (
                     <div className="space-y-3">
                       {partners.map(partner => (
                         <Link to={`/dashboard/client/${partner.id}`} key={partner.id} className="flex items-center justify-between p-4 bg-gray-50/50 hover:bg-gray-50 hover:shadow-sm rounded-2xl border border-gray-100 transition-all gap-4">
                            <div>
                               <div className="font-bold text-gray-800">{partner.perusahaan}</div>
                               <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{partner.tipe} &bull; {partner.kota}</div>
                            </div>
                            <ArrowLeft className="w-4 h-4 rotate-180 text-gray-400" />
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               )}

               {/* Riwayat Transaksi */}
               <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm min-h-[400px]">
                  <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
                     <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                        <Receipt className="w-5 h-5 text-[#35ACDF]" />
                     </div>
                     <div>
                        <h2 className="text-xl font-black text-[#00172D]">Riwayat Transaksi</h2>
                        <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mt-0.5">Semua Transaksi oleh {isSalesDetails ? client.nama_pic : client.perusahaan}</p>
                     </div>
                  </div>

                  {transactions.length === 0 ? (
                     <div className="py-20 text-center flex flex-col items-center">
                       <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                         <ShoppingBag className="w-8 h-8 text-gray-300" />
                       </div>
                       <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Belum ada riwayat transaksi</p>
                     </div>
                  ) : (
                     <div className="space-y-4">
                        {transactions.map(trx => (
                          <Link to={`/dashboard/transaction/${trx.id}`} key={trx.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-gray-50/50 hover:bg-gray-50 hover:shadow-md cursor-pointer rounded-2xl border border-gray-100 transition-all gap-4">
                             <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#35ACDF]">
                                  <ShoppingBag className="w-6 h-6 text-[#35ACDF]" />
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <span className="font-black text-gray-800 text-base">{trx.id}</span>
                                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${trx.status === "Selesai" ? "bg-emerald-50 text-emerald-600" : trx.status === "Proses" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                                        {trx.status}
                                      </span>
                                   </div>
                                   <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{new Date(trx.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                             </div>
                             <div className="md:text-right border-t md:border-t-0 border-gray-100 pt-3 md:pt-0">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{trx.items?.reduce((acc, curr) => acc + curr.jumlah_unit, 0) || trx.jumlah_unit || 0} Unit &bull; {trx.jenis_pembelian}</p>
                                <p className="text-lg font-black text-[#00172D]">Rp {(trx.total_harga).toLocaleString('id-ID')}</p>
                             </div>
                          </Link>
                        ))}
                     </div>
                  )}
               </div>
             </div>
           )}
        </div>

        {/* Action Panel on Right Sidebar */}
        <div className="lg:col-span-1 space-y-6">
           {isEditing ? (
             <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3">
                <button type="submit" form="edit-client-form" className="w-full py-4 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                   <Save className="w-4 h-4 text-[#35ACDF]" /> Simpan Perubahan
                </button>
                <button type="button" onClick={() => toggleEdit(false)} className="w-full py-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                   <X className="w-4 h-4 text-gray-400" /> Batalkan
                </button>
             </div>
           ) : (
             <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col gap-3">
                <button onClick={() => toggleEdit(true)} className="w-full py-3 bg-[#00172D] hover:bg-gray-900 text-white font-bold uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2">
                   <Edit2 className="w-4 h-4 text-gray-400" /> Edit Data
                </button>
                <button onClick={handleDelete} className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold uppercase tracking-widest text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                   <Trash2 className="w-4 h-4 text-gray-400" /> Hapus Data
                </button>
             </div>
           )}
        </div>
      </div>
    </motion.div>
  );
}

