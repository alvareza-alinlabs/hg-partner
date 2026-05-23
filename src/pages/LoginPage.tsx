import { motion } from "motion/react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Lock, Mail, Server, UserCircle2 } from "lucide-react";
import { FormEvent, useState, useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [recentLogins, setRecentLogins] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedLogins = localStorage.getItem("recentLogins");
    if (storedLogins) {
      try {
        setRecentLogins(JSON.parse(storedLogins));
      } catch (e) {}
    }
  }, []);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Fetch users from JSON
      const res = await fetch('/data/users.json');
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");
      const users = await res.json();

      // Find user
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        // Save to recent logins
        const updatedLogins = [email, ...recentLogins.filter(e => e !== email)].slice(0, 3);
        localStorage.setItem("recentLogins", JSON.stringify(updatedLogins));
        
        // Save login session
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Show welcome popup only on fresh login
        sessionStorage.setItem("showWelcomePopup", "true");
        
        // Dispatch storage event to update other components
        window.dispatchEvent(new Event("storage"));

        navigate("/dashboard");
      } else {
        setError("Email atau kata sandi salah. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan hubungi administrator.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentLoginClick = async (savedEmail: string) => {
    setEmail(savedEmail);
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch('/data/users.json');
      if (!res.ok) throw new Error("Gagal mengambil data pengguna");
      const users = await res.json();

      const user = users.find((u: any) => u.email === savedEmail);

      if (user) {
        const updatedLogins = [savedEmail, ...recentLogins.filter(e => e !== savedEmail)].slice(0, 3);
        localStorage.setItem("recentLogins", JSON.stringify(updatedLogins));
        
        localStorage.setItem("userLoggedIn", "true");
        localStorage.setItem("currentUser", JSON.stringify(user));
        
        // Show welcome popup only on fresh login
        sessionStorage.setItem("showWelcomePopup", "true");
        
        window.dispatchEvent(new Event("storage"));

        navigate("/dashboard");
      } else {
        setError("Akun tidak ditemukan. Silakan masuk manual.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem. Silakan hubungi administrator.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-[#00172D] md:bg-[#f8fafc] flex flex-col md:flex-row font-sans relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#35ACDF] rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-400 rounded-full blur-[150px]" />
      </div>

      {/* Top Mobile Header / Left Desktop Panel */}
      <div className="flex flex-col w-full aspect-[4/3] md:w-auto md:aspect-auto md:flex-1 bg-[#00172D] text-white px-6 pb-12 md:p-12 relative z-0 overflow-hidden items-center justify-center">
        <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#00172D] via-transparent to-transparent md:block hidden"></div>
        
        <div className="max-w-md w-full relative z-20">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-3 md:mb-10">
             <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center flex-shrink-0">
               <img src="/gambar/icon-dashboard-white.png" alt="Dashboard Logo" className="w-full h-full object-contain" />
             </div>
             <div className="text-center md:text-left">
               <span className="font-black text-xl md:text-2xl tracking-tight text-white block leading-tight">HG Partner</span>
               <span className="hidden md:block text-[10px] font-bold text-[#35ACDF] uppercase tracking-widest mt-0.5">Portal Internal</span>
             </div>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-4xl font-black mb-6 leading-tight">Akses Ekosistem <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-[#35ACDF]">Kemitraan Pribadi</span></h2>
            <p className="text-blue-100/80 text-sm leading-relaxed mb-12">
              Portal ini ditujukan bagi mitra distribusi terpilih untuk mengelola operasional bisnis dan mengeksplorasi portfolio katalog eksklusif.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                  <Server className="w-5 h-5 text-[#35ACDF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Sistem Terintegrasi</p>
                  <p className="text-[10px] text-blue-200 mt-1">Distribusi data instan dan tersinkronisasi</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#35ACDF]">
                  <Lock className="w-5 h-5 text-[#35ACDF]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">Keamanan Tingkat Tinggi</p>
                  <p className="text-[10px] text-blue-200 mt-1">Enkripsi end-to-end untuk seluruh data perusahaan</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - Login form (Bottom Sheet on Mobile) */}
      <div className="flex-[1.2] flex flex-col justify-start md:justify-center items-center py-8 md:py-10 px-6 sm:p-12 relative z-10 bg-white md:bg-transparent rounded-t-[2.5rem] md:rounded-none -mt-12 md:mt-0 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-none min-h-[75vh] md:min-h-0">
        
        {/* Mobile drag indicator (decorative) */}
        <div className="w-14 h-1.5 bg-gray-200 rounded-full mb-8 md:hidden mx-auto flex-shrink-0"></div>

        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-10 text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black text-[#00172D] tracking-tight">Otentikasi Sistem</h1>
            <p className="text-gray-500 mt-1.5 md:mt-2 text-xs md:text-sm font-medium px-4 md:px-0">Masuk untuk mengakses portal partner internal dan kelengkapan katalog.</p>
          </div>

          {recentLogins.length > 0 && (
            <div className="mb-6 md:mb-8 space-y-3">
              <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Akun Terakhir Digunakan</label>
              <div className="flex flex-col gap-2">
                {recentLogins.map((savedEmail, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleRecentLoginClick(savedEmail)}
                    className={`flex items-center gap-3 p-2.5 md:p-3 rounded-xl border transition-all ${
                      email === savedEmail 
                        ? 'bg-blue-50 border-blue-200 text-[#35ACDF]' 
                        : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <UserCircle2 className={`w-7 h-7 md:w-8 md:h-8 ${email === savedEmail ? 'text-[#35ACDF]' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <p className="text-xs md:text-sm font-bold truncate max-w-[180px] md:max-w-[200px]">{savedEmail}</p>
                      <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-60">Ketuk untuk pilih</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5 md:space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-xl text-xs md:text-sm font-medium border border-red-100">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Email Perusahaan</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-3.5 bg-white border border-gray-200 text-gray-800 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all font-medium text-xs md:text-sm shadow-sm hover:border-gray-300"
                  placeholder="admin@gmgconsole.id"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-gray-500">Kata Sandi</label>
                <a href="#" className="text-[9px] md:text-[10px] font-bold tracking-widest uppercase text-[#35ACDF] hover:text-blue-500 transition-colors">Lupa Sandi?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 md:pl-12 pr-4 py-3 md:py-3.5 bg-white border border-gray-200 text-gray-800 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#35ACDF]/50 placeholder-gray-400 transition-all font-medium text-xs md:text-sm shadow-sm hover:border-gray-300"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 md:py-4 mt-6 bg-[#00172D] hover:bg-gray-900 text-white font-black uppercase tracking-widest text-[11px] md:text-xs rounded-xl md:rounded-2xl shadow-lg shadow-[#00172D]/20 transition-all border border-transparent hover:border-gray-700 disabled:opacity-75"
            >
              {isLoading ? "Masuk..." : "Masuk Ekosistem"}
            </motion.button>

            <div className="mt-5 text-center">
              <Link to="/" className="text-[10px] md:text-xs font-bold text-gray-500 hover:text-[#00172D] hover:underline uppercase tracking-widest transition-all">
                Kembali ke Beranda
              </Link>
            </div>
          </form>
          
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Sistem tertutup, akses hanya untuk personel yang diizinkan.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
