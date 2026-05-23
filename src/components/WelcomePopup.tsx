import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Download, X, PartyPopper, CheckCircle2 } from "lucide-react";
import { getCurrentUser } from "../lib/auth";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showWelcomePopup") === "true";
    if (shouldShow) {
      // Delay slightly for better UX
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.removeItem("showWelcomePopup");
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
       setIsInstalled(true);
    }
  }, []);

  const handleInstallClick = async () => {
    const deferredPrompt = (window as any).deferredPrompt;
    if (!deferredPrompt) {
      // Fallback if not supported or already installed/prompted
      alert("Aplikasi PWA sudah terinstal atau peramban Anda tidak mendukung instalasi otomatis. Anda bisa menginstal melalui menu pengaturan peramban (contoh: 'Add to Home Screen').");
      return;
    }

    setIsInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      // Clear the prompt
      (window as any).deferredPrompt = null;
    } catch (e) {
      console.error(e);
    } finally {
      setIsInstalling(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#00172D]/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Decorative background */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#35ACDF]/10 rounded-full blur-3xl pointer-events-none"></div>
              
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex flex-col items-center text-center mt-4">
                <div className="w-16 h-16 bg-[#00172D] rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-[#00172D]/20 transform -rotate-6">
                  <PartyPopper className="w-8 h-8 text-[#35ACDF]" />
                </div>
                
                <h2 className="text-2xl font-black text-[#00172D] tracking-tight mb-2">
                  Selamat Datang, {user?.name || 'Partner'}!
                </h2>
                
                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                  Anda telah berhasil masuk ke HG Partner. Untuk pengalaman terbaik dan akses cepat, instal aplikasi ini ke perangkat Anda.
                </p>
                
                <div className="w-full flex flex-col tracking-widest uppercase mb-4 space-y-3">
                  {isInstalled ? (
                     <div className="w-full py-3.5 px-6 rounded-xl bg-green-50 text-green-600 font-bold border border-green-100 flex items-center justify-center gap-2 text-xs">
                        <CheckCircle2 className="w-5 h-5" />
                        Terinstal
                     </div>
                  ) : (
                    <button 
                      onClick={handleInstallClick}
                      disabled={isInstalling}
                      className="w-full py-3.5 px-6 rounded-xl bg-[#00172D] hover:bg-gray-900 text-white font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-xs min-h-[48px]"
                    >
                      {isInstalling ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Download className="w-4 h-4 text-[#35ACDF]" />
                          Instal Aplikasi PWA
                        </>
                      )}
                    </button>
                  )}
                </div>
                
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest mt-2"
                >
                  Nanti Saja
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
