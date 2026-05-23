import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Users, Briefcase, Building2, ExternalLink, Target, TrendingUp, Percent, Map } from "lucide-react";
import { ClientData } from "../../types";
import { useNavigate } from "react-router-dom";

// Fix standard marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons
const createCustomIcon = (color: string) => {
  return new L.DivIcon({
    className: "custom-leaflet-icon",
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

const salesIcon = createCustomIcon("#35ACDF"); // Blue
const distIcon = createCustomIcon("#f97316"); // Orange
const endUserIcon = createCustomIcon("#10b981"); // Emerald

function MapInteractionController({ isInteractive, boundsType, clients }: { isInteractive: boolean, boundsType: "Jakarta" | "Semua", clients: ClientData[] }) {
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

export default function MapPage() {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [targets, setTargets] = useState({ totalTarget: 0, totalTercapai: 0 });
  const [loading, setLoading] = useState(true);
  const [isMapInteractive, setIsMapInteractive] = useState(false);
  const [focusArea, setFocusArea] = useState<"Jakarta" | "Semua">("Jakarta");
  const [typeFilters, setTypeFilters] = useState({
    "Sales": true,
    "Distributor": true,
    "EndUser": true
  });
  const [statusFilters, setStatusFilters] = useState({
    "Mitra Aktif": true,
    "Target": true,
    "Calon Mitra": true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, partnersRes, prodRes] = await Promise.all([
          fetch("/data/sales.json"),
          fetch("/data/partners.json"),
          fetch("/data/products.json")
        ]);
        const salesData = await salesRes.json();
        const partnersData = await partnersRes.json();
        const prodData = await prodRes.json();
        
        const allClients = [...salesData, ...partnersData].map((c: any) => {
          const charCode = c.id.charCodeAt(c.id.length - 1) + c.id.length;
          let statusKemitraan = "";
          if (c.tipe === "Distributor" || c.tipe === "End User") {
             statusKemitraan = c.status_distributor || c.status_kemitraan || (["Mitra Aktif", "Calon Mitra", "Target"][charCode % 3]);
          }
          return { ...c, status_kemitraan: statusKemitraan };
        });

        setClients(allClients);
        
        const totalTarget = prodData.reduce((acc: number, curr: any) => acc + (Number(curr.target_bulanan) || 0), 0);
        const totalTercapai = prodData.reduce((acc: number, curr: any) => acc + (Number(curr.tercapai) || 0), 0);
        
        setTargets({ totalTarget, totalTercapai });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredClients = clients.filter(client => {
     if (client.tipe === "Sales" && !typeFilters["Sales"]) return false;
     if (client.tipe === "Distributor" && !typeFilters["Distributor"]) return false;
     if (client.tipe === "End User" && !typeFilters["EndUser"]) return false;

     if (client.tipe === "End User" || client.tipe === "Distributor") {
        if (client.status_kemitraan === "Mitra Aktif" && !statusFilters["Mitra Aktif"]) return false;
        if (client.status_kemitraan === "Target" && !statusFilters["Target"]) return false;
        if (client.status_kemitraan === "Calon Mitra" && !statusFilters["Calon Mitra"]) return false;
     }
     
     return true;
  });

  const totalClients = filteredClients.length;
  const calcRate = (targets.totalTercapai / targets.totalTarget) * 100;
  const achievementRate = targets.totalTarget > 0 && !Number.isNaN(calcRate) ? calcRate.toFixed(1) : "0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Peta Distribusi & Mitra</h1>
            <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Pelacakan Jaringan & Target Waktu Nyata</p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex bg-white rounded-full border border-gray-200 p-1 shadow-sm self-start md:self-auto max-w-full overflow-x-auto"
          >
            <button 
               onClick={() => setFocusArea("Semua")}
               className={`px-4 py-2 rounded-full text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-colors ${focusArea === "Semua" ? "bg-[#00172D] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
               Semua Area
            </button>
            <button 
               onClick={() => setFocusArea("Jakarta")}
               className={`px-4 py-2 rounded-full text-[10px] whitespace-nowrap font-bold uppercase tracking-widest transition-colors ${focusArea === "Jakarta" ? "bg-[#00172D] text-white" : "text-gray-500 hover:bg-gray-50"}`}
            >
               Jakarta
            </button>
          </motion.div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col gap-3 mb-2"
        >
           <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide snap-x">
              <button
                onClick={() => setTypeFilters(prev => ({ ...prev, "Sales": !prev["Sales"] }))}
                className={`px-3 py-2 rounded-full shadow-sm border text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex shrink-0 items-center gap-1.5 transition-colors ${typeFilters["Sales"] ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-gray-100 border-gray-200 text-gray-400'} snap-start`}
              >
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeFilters["Sales"] ? 'bg-[#35ACDF]' : 'bg-gray-400'}`}></div> Sales
              </button>
              <button
                onClick={() => setTypeFilters(prev => ({ ...prev, "Distributor": !prev["Distributor"] }))}
                className={`px-3 py-2 rounded-full shadow-sm border text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex shrink-0 items-center gap-1.5 transition-colors ${typeFilters["Distributor"] ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-100 border-gray-200 text-gray-400'} snap-start`}
              >
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeFilters["Distributor"] ? 'bg-orange-500' : 'bg-gray-400'}`}></div> Distributor
              </button>
              <button
                onClick={() => setTypeFilters(prev => ({ ...prev, "EndUser": !prev["EndUser"] }))}
                className={`px-3 py-2 rounded-full shadow-sm border text-[9px] md:text-[10px] uppercase tracking-widest font-bold flex shrink-0 items-center gap-1.5 transition-colors ${typeFilters["EndUser"] ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-100 border-gray-200 text-gray-400'} snap-start`}
              >
                <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${typeFilters["EndUser"] ? 'bg-emerald-500' : 'bg-gray-400'}`}></div> Partner
              </button>
           </div>
           
           {(typeFilters["Distributor"] || typeFilters["EndUser"]) && (
             <div className="flex gap-2 w-full overflow-x-auto pb-2 scrollbar-hide snap-x">
                <button
                  onClick={() => setStatusFilters(prev => ({ ...prev, "Mitra Aktif": !prev["Mitra Aktif"] }))}
                  className={`px-3 py-1.5 rounded-full shadow-sm border text-[8px] md:text-[9px] uppercase tracking-widest font-bold flex shrink-0 items-center gap-1.5 transition-colors ${statusFilters["Mitra Aktif"] ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-gray-100 border-gray-200 text-gray-400'} snap-start`}
                >
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${statusFilters["Mitra Aktif"] ? 'bg-purple-500' : 'bg-gray-400'}`}></div> Mitra Aktif
                </button>
                <button
                  onClick={() => setStatusFilters(prev => ({ ...prev, "Target": !prev["Target"] }))}
                  className={`px-3 py-1.5 rounded-full shadow-sm border text-[8px] md:text-[9px] uppercase tracking-widest font-bold flex shrink-0 items-center gap-1.5 transition-colors ${statusFilters["Target"] ? 'bg-pink-50 border-pink-200 text-pink-700' : 'bg-gray-100 border-gray-200 text-gray-400'} snap-start`}
                >
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${statusFilters["Target"] ? 'bg-pink-500' : 'bg-gray-400'}`}></div> Target
                </button>
                <button
                  onClick={() => setStatusFilters(prev => ({ ...prev, "Calon Mitra": !prev["Calon Mitra"] }))}
                  className={`px-3 py-1.5 rounded-full shadow-sm border text-[8px] md:text-[9px] uppercase tracking-widest font-bold flex shrink-0 items-center gap-1.5 transition-colors ${statusFilters["Calon Mitra"] ? 'bg-yellow-50 border-yellow-300 text-yellow-700' : 'bg-gray-100 border-gray-200 text-gray-400'} snap-start`}
                >
                  <div className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${statusFilters["Calon Mitra"] ? 'bg-yellow-400' : 'bg-gray-400'}`}></div> Calon Mitra
                </button>
             </div>
           )}
        </motion.div>
      </div>

      {/* Stats Cards - Matching Sleek HTML Theme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Users className="w-16 h-16 md:w-24 md:h-24 text-gray-100" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Total Mitra</span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] relative z-10">{loading ? "..." : totalClients}</span>
          <div className="flex items-center text-emerald-500 text-[8px] md:text-[10px] uppercase font-bold tracking-widest mt-auto relative z-10">
            SEMUA WILAYAH AKTIF
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
          className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Target className="w-16 h-16 md:w-24 md:h-24 text-gray-100" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Target Bulanan</span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] relative z-10">{loading ? "..." : targets.totalTarget}</span>
          <span className="text-gray-400 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-auto relative z-10">Unit Hardware</span>
        </motion.div>

        {/* Highlighted prominent card from HTML theme */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }}
          className="bg-[#35ACDF] p-4 md:p-5 rounded-3xl shadow-lg shadow-blue-500/20 text-white flex flex-col gap-2 relative overflow-hidden"
        >
           <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none">
            <TrendingUp className="w-16 h-16 md:w-24 md:h-24 text-gray-100" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-white/70 uppercase tracking-widest relative z-10">Target Tercapai</span>
          <span className="text-2xl md:text-3xl font-black relative z-10">{loading ? "..." : targets.totalTercapai}</span>
          <span className="text-white/80 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-auto relative z-10">Total Terdistribusi</span>
        </motion.div>

        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5 }}
          className="bg-white p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-2 relative overflow-hidden"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <Percent className="w-16 h-16 md:w-24 md:h-24 text-gray-100" />
          </div>
          <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest relative z-10">Pencapaian (%)</span>
          <span className="text-2xl md:text-3xl font-black text-[#00172D] relative z-10">{loading ? "..." : `${achievementRate}%`}</span>
          <span className="text-emerald-500 text-[8px] md:text-[10px] font-bold uppercase tracking-widest mt-auto relative z-10">Optimasi Waktu</span>
        </motion.div>
      </div>

      {/* Map Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full h-[500px] bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative z-10"
      >
        {!loading && (
          <div 
            className="w-full h-full relative" 
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
              className="w-full h-full"
              zoomControl={false}
              scrollWheelZoom={false}
              dragging={false}
            >
              <MapInteractionController isInteractive={isMapInteractive} boundsType={focusArea} clients={filteredClients} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              />
            {filteredClients.map((client) => (
              <Marker
                key={client.id}
                position={[client.koordinat_lat, client.koordinat_long]}
                icon={client.tipe === "Sales" ? salesIcon : client.tipe === "Distributor" ? distIcon : endUserIcon}
              >
                <Popup className="custom-popup border-none rounded-2xl shadow-2xl p-0">
                  <div 
                    onClick={() => navigate(`/dashboard/client/${client.id}`)}
                    className="p-4 min-w-[200px] bg-[#00172D] hover:bg-gray-900 transition-colors cursor-pointer text-white rounded-2xl group"
                  >
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${client.tipe === "Sales" ? "bg-blue-500/20 text-[#35ACDF]" : client.tipe === "Distributor" ? "bg-orange-500/20 text-[#35ACDF]" : "bg-emerald-500/20 text-emerald-400"}`}>
                        {client.tipe}
                      </span>
                      {client.status_kemitraan && (
                         <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded ${client.status_kemitraan === "Mitra Aktif" ? "bg-emerald-500/20 text-emerald-400" : client.status_kemitraan === "Calon Mitra" ? "bg-blue-500/20 text-[#35ACDF]" : "bg-pink-500/20 text-pink-400"}`}>
                           {client.status_kemitraan}
                         </span>
                      )}
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest bg-white/10 text-white rounded">
                        {client.brand_utama}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                       <h3 className="font-bold text-white text-sm leading-tight group-hover:text-[#35ACDF] transition-colors">{client.perusahaan}</h3>
                       <svg className="w-4 h-4 text-gray-500 group-hover:text-[#35ACDF] transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </div>
                    <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-1 flex items-center gap-1 mt-1">
                      {client.nama_pic}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
