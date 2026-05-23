import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Users, Target, Calendar as CalendarIcon, Activity, DollarSign, Package, ArrowRight, MapPin, Receipt, Clock } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Link, useNavigate } from "react-router-dom";
import L from "leaflet";
import { getCurrentUser } from "../../lib/auth";

const salesIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #35ACDF; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const distIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #f97316; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const endUserIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="background-color: #10b981; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function MapInteractionController({ isInteractive, boundsType, clients }: { isInteractive: boolean, boundsType: "Jakarta" | "Semua", clients: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (isInteractive) {
      map.scrollWheelZoom.enable();
      map.dragging.enable();
    } else {
      map.scrollWheelZoom.disable();
      map.dragging.disable();
    }
  }, [isInteractive, map]);

  useEffect(() => {
     if (boundsType === "Jakarta") {
        const bounds = L.latLngBounds([[-6.3956, 106.685], [-6.0829, 106.973]]);
        map.fitBounds(bounds, { padding: [50, 50] });
     } else {
        if (clients.length > 0) {
           const latLngs = clients.filter(c => c.koordinat_lat && c.koordinat_long).map(c => [c.koordinat_lat, c.koordinat_long] as [number, number]);
           if (latLngs.length > 0) {
             map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
           }
        }
     }
  }, [boundsType, clients, map]);
  return null;
}

export default function DashboardMain() {
  const user = getCurrentUser();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [locationName, setLocationName] = useState("");
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [focusArea, setFocusArea] = useState<"Jakarta" | "Semua">("Jakarta");
  const [typeFilters, setTypeFilters] = useState({
    Sales: true,
    Distributor: true,
    EndUser: true
  });
  const [statusFilters, setStatusFilters] = useState({
    "Mitra Aktif": true,
    "Target": true,
    "Calon Mitra": true
  });
  const [stats, setStats] = useState({
    partners: 0,
    targets: 0,
    achieved: 0,
    schedules: 0,
    revenue: 0,
    unitsSold: 0
  });
  const [clients, setClients] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<any[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, any>>({});
  const [partnersMap, setPartnersMap] = useState<Record<string, any>>({});

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 10) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data && data.address) {
              const city = data.address.city || data.address.town || data.address.county || data.address.state || "Lokasi Ditemukan";
              setLocationName(city);
            }
          } catch (e) {
            console.error("Gagal mendapatkan nama lokasi", e);
          }
        },
        (err) => {
          // Akses lokasi ditolak atau silakan tambahkan handler lain jika perlu
          setLocationName(null);
        }
      );
    }
  }, []);

  useEffect(() => {
    Promise.all([
      fetch("/data/sales.json"),
      fetch("/data/partners.json"),
      fetch("/data/products.json"),
      fetch("/data/schedules.json"),
      fetch("/data/transactions.json")
    ]).then(async ([salesRes, partnersRes, prodRes, schedRes, transRes]) => {
      const sales = await salesRes.json();
      const partners = await partnersRes.json();
      const prod = await prodRes.json();
      const sched = await schedRes.json();
      const trans = await transRes.json();

      const allClients = [...sales, ...partners].map((c: any) => {
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          let statusKemitraan = "";
          if (c.tipe === "Distributor" || c.tipe === "End User") {
             statusKemitraan = c.status_distributor || c.status_kemitraan || (["Mitra Aktif", "Calon Mitra", "Target"][charCode % 3]);
          }
          return { ...c, status_kemitraan: statusKemitraan };
      });
      setClients(allClients);

      const pMap: Record<string, any> = {};
      prod.forEach((p: any) => { pMap[p.id] = p; });
      setProductsMap(pMap);

      const clientMap: Record<string, any> = {};
      allClients.forEach((c: any) => { clientMap[c.id] = c; });
      setPartnersMap(clientMap);

      const totalTarget = prod.reduce((acc: number, curr: any) => acc + (Number(curr.target_bulanan) || 0), 0);
      const totalAchieved = prod.reduce((acc: number, curr: any) => acc + (Number(curr.tercapai) || 0), 0);

      const completedTrans = trans.filter((t: any) => t.status === "Selesai");
      const totalRevenue = completedTrans.reduce((acc: number, curr: any) => acc + (Number(curr.total_harga) || 0), 0);
      const totalUnits = completedTrans.reduce((acc: number, curr: any) => {
          const items = curr.items && curr.items.length > 0 ? curr.items : (curr.product_id ? [{ jumlah_unit: curr.jumlah_unit || 1 }] : []);
          return acc + items.reduce((sum: number, item: any) => sum + (Number(item.jumlah_unit) || 1), 0);
      }, 0);

      setStats({
        partners: allClients.length,
        targets: totalTarget,
        achieved: totalAchieved,
        schedules: sched.length,
        revenue: totalRevenue,
        unitsSold: totalUnits
      });

      // Sort recent transactions by date descending
      setRecentTransactions(trans.sort((a: any, b: any) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()).slice(0, 5));
      // Upcoming schedules
      setUpcomingSchedules(sched.sort((a: any, b: any) => new Date(a.waktu).getTime() - new Date(b.waktu).getTime()).slice(0, 3));
    });
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);
  };

  const filteredClients = clients.filter(client => {
     if (client.tipe === "Sales" && !typeFilters.Sales) return false;
     if (client.tipe === "End User") {
        if (!typeFilters.EndUser) return false;
        if (client.status_kemitraan === "Mitra Aktif" && !statusFilters["Mitra Aktif"]) return false;
        if (client.status_kemitraan === "Target" && !statusFilters["Target"]) return false;
        if (client.status_kemitraan === "Calon Mitra" && !statusFilters["Calon Mitra"]) return false;
     }
     if (client.tipe === "Distributor") {
        if (!typeFilters.Distributor) return false;
        if (client.status_kemitraan === "Mitra Aktif" && !statusFilters["Mitra Aktif"]) return false;
        if (client.status_kemitraan === "Target" && !statusFilters["Target"]) return false;
        if (client.status_kemitraan === "Calon Mitra" && !statusFilters["Calon Mitra"]) return false;
     }
     return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-10"
    >
      <div>
        <h1 className="text-3xl font-black text-[#00172D] tracking-tight">{greeting}, {user.name}</h1>
        <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest flex items-center gap-1">
          {locationName ? <><MapPin className="w-3.5 h-3.5 text-gray-400" /> {locationName}</> : "Ringkasan Sistem Internal"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-[#35ACDF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Pendapatan Total</p>
            <p className="text-base md:text-lg xl:text-xl font-black text-[#00172D] mt-0.5 truncate" title={stats.revenue !== undefined ? formatCurrency(stats.revenue) : "..."}>{stats.revenue !== undefined ? formatCurrency(stats.revenue) : "..."}</p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 md:w-7 md:h-7 text-[#35ACDF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Unit Terjual</p>
            <p className="text-lg md:text-xl font-black text-[#00172D] mt-0.5 truncate" title={String(stats.unitsSold || 0)}>{String(stats.unitsSold || 0)}</p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 md:w-7 md:h-7 text-[#35ACDF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Total Mitra</p>
            <p className="text-lg md:text-xl font-black text-[#00172D] mt-0.5 truncate" title={String(filteredClients.length || 0)}>{String(filteredClients.length || 0)}</p>
          </div>
        </div>

        <div className="bg-white p-4 md:p-6 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6 md:w-7 md:h-7 text-[#35ACDF]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">Target Tercapai</p>
            <p className="text-lg md:text-xl font-black text-[#00172D] mt-0.5 truncate" title={`${String(stats.achieved || 0)} / ${String(stats.targets || 0)}`}>{String(stats.achieved || 0)} / {String(stats.targets || 0)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Map */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
            <h2 className="text-lg font-black text-[#00172D]">Peta Distribusi & Mitra</h2>
            <div className="flex bg-white rounded-full border border-gray-200 p-1 shadow-sm">
              <button 
                onClick={() => setFocusArea("Semua")}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${focusArea === "Semua" ? "bg-[#00172D] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                 Semua Area
              </button>
              <button 
                onClick={() => setFocusArea("Jakarta")}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-colors ${focusArea === "Jakarta" ? "bg-[#00172D] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                 Jakarta
              </button>
            </div>
          </div>
          
          <div className="flex flex-col xl:flex-row xl:items-center gap-3 mb-4">
             <div className="flex gap-2 flex-wrap">
               <button 
                 onClick={() => setTypeFilters(prev => ({ ...prev, Sales: !prev.Sales }))}
                 className={`px-3 py-1.5 rounded-full shadow-sm border text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 md:gap-2 transition-colors ${typeFilters.Sales ? 'bg-white border-blue-200 text-[#00172D]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                 <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeFilters.Sales ? 'bg-[#35ACDF]' : 'bg-gray-400'}`}></div> Sales
               </button>
               <button 
                 onClick={() => setTypeFilters(prev => ({ ...prev, Distributor: !prev.Distributor }))}
                 className={`px-3 py-1.5 rounded-full shadow-sm border text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 md:gap-2 transition-colors ${typeFilters.Distributor ? 'bg-white border-orange-200 text-[#00172D]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                 <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeFilters.Distributor ? 'bg-orange-500' : 'bg-gray-400'}`}></div> Distributor
               </button>
               <button 
                 onClick={() => setTypeFilters(prev => ({ ...prev, EndUser: !prev.EndUser }))}
                 className={`px-3 py-1.5 rounded-full shadow-sm border text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex items-center gap-1.5 md:gap-2 transition-colors ${typeFilters.EndUser ? 'bg-white border-emerald-200 text-[#00172D]' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                 <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeFilters.EndUser ? 'bg-emerald-500' : 'bg-gray-400'}`}></div> Partner
               </button>
             </div>
             
             {(typeFilters.Distributor || typeFilters.EndUser) && (
               <div className="flex gap-2 flex-wrap">
                 <button
                   onClick={() => setStatusFilters(prev => ({ ...prev, "Mitra Aktif": !prev["Mitra Aktif"] }))}
                   className={`px-2.5 py-1.5 rounded-full shadow-sm border text-[8px] md:text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 md:gap-1.5 transition-colors ${statusFilters["Mitra Aktif"] ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                 >
                   <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${statusFilters["Mitra Aktif"] ? 'bg-indigo-500' : 'bg-gray-400'}`}></div> Mitra Aktif
                 </button>
                 <button
                   onClick={() => setStatusFilters(prev => ({ ...prev, "Target": !prev["Target"] }))}
                   className={`px-2.5 py-1.5 rounded-full shadow-sm border text-[8px] md:text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 md:gap-1.5 transition-colors ${statusFilters["Target"] ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                 >
                   <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${statusFilters["Target"] ? 'bg-pink-500' : 'bg-gray-400'}`}></div> Target
                 </button>
                 <button
                   onClick={() => setStatusFilters(prev => ({ ...prev, "Calon Mitra": !prev["Calon Mitra"] }))}
                   className={`px-2.5 py-1.5 rounded-full shadow-sm border text-[8px] md:text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 md:gap-1.5 transition-colors ${statusFilters["Calon Mitra"] ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-gray-100 border-gray-200 text-gray-400'}`}
                 >
                   <div className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${statusFilters["Calon Mitra"] ? 'bg-blue-500' : 'bg-gray-400'}`}></div> Calon Mitra
                 </button>
               </div>
             )}
          </div>

          <div 
            className="h-[400px] bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm relative z-10"
            onMouseLeave={() => setIsMapInteractive(false)}
          >
            {!isMapInteractive && (
              <div 
                className="absolute inset-0 z-[500] bg-black/5 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
                onClick={() => setIsMapInteractive(true)}
              >
                <div className="bg-[#00172D] text-white px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg flex items-center gap-2">
                  Klik untuk interaksi peta
                </div>
              </div>
            )}
            <MapContainer 
              center={[-6.200000, 106.816666]} 
              zoom={11} 
              style={{ height: '100%', width: '100%', background: '#f8fafc' }}
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
            >
              <MapInteractionController isInteractive={isMapInteractive} boundsType={focusArea} clients={filteredClients} />
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {filteredClients.map(client => (
                <Marker 
                  key={client.id}
                  position={[client.koordinat_lat, client.koordinat_long]}
                  icon={client.tipe === "Sales" ? salesIcon : client.tipe === "Distributor" ? distIcon : endUserIcon}
                >
                  <Popup className="custom-popup border-none rounded-2xl shadow-2xl p-0">
                    <div 
                      onClick={() => navigate(`/dashboard/client/${client.id}`)}
                      className="p-3 min-w-[180px] bg-[#00172D] hover:bg-gray-900 transition-colors cursor-pointer text-white rounded-2xl group"
                    >
                      <div className="flex items-center flex-wrap gap-1.5 mb-2">
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${client.tipe === "Sales" ? "bg-blue-500/20 text-[#35ACDF]" : client.tipe === "Distributor" ? "bg-orange-500/20 text-[#35ACDF]" : "bg-emerald-500/20 text-emerald-400"}`}>
                          {client.tipe}
                        </span>
                        {client.status_kemitraan && (
                           <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${client.status_kemitraan === "Mitra Aktif" ? "bg-emerald-500/20 text-emerald-400" : client.status_kemitraan === "Calon Mitra" ? "bg-blue-500/20 text-[#35ACDF]" : "bg-pink-500/20 text-pink-400"}`}>
                             {client.status_kemitraan}
                           </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-bold text-xs group-hover:text-[#35ACDF] transition-colors">{client.perusahaan}</p>
                        <svg className="w-4 h-4 text-gray-500 group-hover:text-[#35ACDF] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </div>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">{client.kota}, {client.provinsi}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
        
        {/* Right Side Panels */}
        <div className="space-y-6">
          {/* Upcoming Schedules */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs md:text-sm font-black text-[#00172D] uppercase tracking-widest">Jadwal Mendatang</h2>
              <Link to="/dashboard/schedule" className="text-[9px] md:text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest hover:underline">Lihat Semua</Link>
            </div>
            <div className="space-y-3 md:space-y-4">
              {upcomingSchedules.length > 0 ? upcomingSchedules.map((sched, idx) => {
                const dateObj = new Date(sched.waktu);
                return (
                <div key={idx} className="flex gap-3 md:gap-4 items-start pb-3 md:pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 text-[#35ACDF] flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-black leading-none">{dateObj.getDate() || '-'}</span>
                    <span className="text-[8px] font-bold uppercase tracking-widest mt-0.5">{dateObj.toLocaleString('id-ID', { month: 'short' }) || ''}</span>
                  </div>
                  <div>
                    <p className="text-[11px] md:text-xs font-bold text-[#00172D]">{sched.perusahaan}</p>
                    <p className="text-[9px] md:text-[10px] text-gray-500 font-medium mt-0.5 line-clamp-1">{sched.tujuan}</p>
                    <div className="flex items-center gap-1 mt-1 text-[8px] md:text-[9px] font-bold uppercase tracking-widest text-gray-400">
                      <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-400" /> {dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}) : (
                <p className="text-[11px] md:text-xs text-gray-400 font-medium">Tidak ada jadwal.</p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-[#00172D] text-white rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm">
             <h2 className="text-xs md:text-sm font-black uppercase tracking-widest mb-4">Aksi Cepat</h2>
             <div className="space-y-2 md:space-y-3">
               <Link to="/?skip=true" className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                 <div className="flex items-center gap-3">
                   <Target className="w-4 h-4 text-white" />
                   <span className="text-[11px] md:text-xs font-bold">Lihat Landing Page Public</span>
                 </div>
                 <ArrowRight className="w-3 h-3 text-white" />
               </Link>
               <Link to="/dashboard/transactions" className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                 <div className="flex items-center gap-3">
                   <Receipt className="w-4 h-4 text-white" />
                   <span className="text-[11px] md:text-xs font-bold">Catat Transaksi Baru</span>
                 </div>
                 <ArrowRight className="w-3 h-3 text-white" />
               </Link>
               <Link to="/dashboard/partners" className="flex items-center justify-between p-2.5 md:p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
                 <div className="flex items-center gap-3">
                   <Users className="w-4 h-4 text-white" />
                   <span className="text-[11px] md:text-xs font-bold">Daftarkan Mitra</span>
                 </div>
                 <ArrowRight className="w-3 h-3 text-white" />
               </Link>
             </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-white rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-gray-50/50">
          <div>
            <h2 className="text-base md:text-lg font-black text-[#00172D]">Transaksi Terbaru</h2>
            <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5 md:mt-1">Aktivitas Penjualan Partner & End User</p>
          </div>
          <Link to="/dashboard/transactions" className="text-[10px] md:text-xs font-bold text-[#35ACDF] hover:underline flex items-center gap-1">
            Lihat Lengkap <ArrowRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap min-w-[600px]">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">ID / Tanggal</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Pembeli</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400">Produk</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Nilai Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentTransactions.map(trx => {
                const partner = partnersMap[trx.partner_id];
                
                let productNames = "-";
                let qtyTotal = 0;
                
                const txItems = trx.items && trx.items.length > 0 ? trx.items : (trx.product_id ? [{ product_id: trx.product_id, jumlah_unit: trx.jumlah_unit || 1 }] : []);
                qtyTotal = txItems.reduce((acc: number, item: any) => acc + (Number(item.jumlah_unit) || 1), 0);
                
                if (txItems.length === 1) {
                    const product = productsMap[txItems[0].product_id];
                    productNames = product ? product.nama : "-";
                } else if (txItems.length > 1) {
                    productNames = `${txItems.length} Produk Berbeda`;
                }

                return (
                  <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="font-mono text-[10px] md:text-xs font-bold text-[#35ACDF]">{trx.id}</div>
                      <div className="text-[9px] md:text-[10px] font-semibold text-gray-500 mt-0.5">{trx.tanggal}</div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="font-bold text-[#00172D] text-xs md:text-sm">{partner ? partner.perusahaan : "-"}</div>
                      <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{partner ? partner.tipe : ""}</div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4">
                      <div className="font-bold text-gray-800 text-xs md:text-sm">{productNames}</div>
                      <div className="text-[9px] md:text-[10px] font-bold text-gray-500 mt-0.5">{qtyTotal} Unit</div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                      <div className="font-black text-[#00172D] text-xs md:text-sm">{formatCurrency(trx.total_harga)}</div>
                      <div className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest inline-block mt-0.5 md:mt-1 px-2 py-0.5 rounded ${trx.status === "Selesai" ? "bg-emerald-50 text-emerald-600" : trx.status === "Proses" ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                        {trx.status}
                      </div>
                    </td>
                  </tr>
                )}
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
