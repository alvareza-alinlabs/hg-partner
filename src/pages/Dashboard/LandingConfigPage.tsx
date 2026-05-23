import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LayoutDashboard, Save, Loader2, CheckCircle2 } from "lucide-react";

export default function LandingConfigPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    fetch("/data/landing.json")
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleSave = () => {
    setSaving(true);
    setSaveSuccess(false);
    // Simulate save to backend
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1500);
  };

  const handleChange = (section: string, field: string, value: string) => {
    setData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#35ACDF] animate-spin text-[#35ACDF]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-[#00172D] tracking-tight">Landing Page Config</h1>
          <p className="text-gray-500 mt-1 font-medium text-xs uppercase tracking-widest">Atur konten halaman utama portal</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving || !data}
          className="px-6 py-3 bg-[#00172D] hover:bg-gray-800 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center gap-2 justify-center"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin text-[#35ACDF]" /> : saveSuccess ? <CheckCircle2 className="w-4 h-4 text-[#35ACDF]" /> : <Save className="w-4 h-4 text-[#35ACDF]" />}
          {saving ? "Menyimpan..." : saveSuccess ? "Tersimpan" : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hero Section Config */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
           <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
              <div className="w-10 h-10 bg-blue-50 text-[#35ACDF] rounded-xl flex items-center justify-center">
                 <LayoutDashboard className="w-5 h-5 text-[#35ACDF]" />
              </div>
              <h2 className="text-lg font-black text-[#00172D]">Hero Section</h2>
           </div>
           
           <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Label Flag</label>
                <input 
                  type="text" 
                  value={data?.hero?.label || ""}
                  onChange={(e) => handleChange('hero', 'label', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Judul Utama (Baris 1)</label>
                <input 
                  type="text" 
                  value={data?.hero?.title_black || ""}
                  onChange={(e) => handleChange('hero', 'title_black', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Judul Utama (Baris 2 Biru)</label>
                <input 
                  type="text" 
                  value={data?.hero?.title_blue || ""}
                  onChange={(e) => handleChange('hero', 'title_blue', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Subtitle Deskripsi</label>
                <textarea 
                  rows={4}
                  value={data?.hero?.subtitle || ""}
                  onChange={(e) => handleChange('hero', 'subtitle', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-medium resize-none"
                />
              </div>
           </div>
        </div>

        <div className="space-y-8">
           {/* Corporate Values Config */}
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                 <div className="w-10 h-10 bg-blue-50 text-[#35ACDF] rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-[#35ACDF]" />
                 </div>
                 <h2 className="text-lg font-black text-[#00172D]">Nilai Strategis</h2>
              </div>
              
              <div className="space-y-4">
                 <div>
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Judul Section (Bisa gunakan \n untuk enter)</label>
                   <input 
                     type="text" 
                     value={data?.corporate_values?.title || ""}
                     onChange={(e) => handleChange('corporate_values', 'title', e.target.value)}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-semibold"
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Deskripsi Singkat</label>
                   <textarea 
                     rows={3}
                     value={data?.corporate_values?.subtitle || ""}
                     onChange={(e) => handleChange('corporate_values', 'subtitle', e.target.value)}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-medium resize-none"
                   />
                 </div>
              </div>
           </div>

           {/* Footer Config */}
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                 <div className="w-10 h-10 bg-blue-50 text-[#35ACDF] rounded-xl flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-[#35ACDF]" />
                 </div>
                 <h2 className="text-lg font-black text-[#00172D]">Footer & Profil</h2>
              </div>
              
              <div className="space-y-4">
                 <div>
                   <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">Deskripsi Profil (Bawah Logo)</label>
                   <textarea 
                     rows={3}
                     value={data?.footer?.description || ""}
                     onChange={(e) => handleChange('footer', 'description', e.target.value)}
                     className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 text-sm font-medium resize-none"
                   />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
