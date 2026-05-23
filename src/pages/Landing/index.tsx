import { useState, useEffect } from "react";
import { useScroll, useTransform } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";

import BottomNavigation from "./BottomNavigation";
import Header from "./Header";
import Hero from "./Hero";
import ProductsSection from "./ProductsSection";
import InsightsSection from "./InsightsSection";
import CorporateValues from "./CorporateValues";
import CTA from "./CTA";
import Footer from "./Footer";

export interface Product {
  id: string;
  nama: string;
  kategori: string;
  brand: string;
  target_bulanan: number;
  tercapai: number;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const skipRedirect = queryParams.get("skip") === "true";

  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    volumeUnit: 24500,
    roomCollab: 8200,
    tenderSuccess: 99.4,
    volumePercent: 85,
    roomPercent: 65,
  });

  const [landingData, setLandingData] = useState<any>(null);

  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    // Check if logged in
    const isLoggedIn = localStorage.getItem("userLoggedIn") === "true";
    if (isLoggedIn && !skipRedirect) {
       navigate("/dashboard");
    }
  }, [navigate, skipRedirect]);

  useEffect(() => {
    Promise.all([
      fetch("/data/products.json"),
      fetch("/data/transactions.json"),
      fetch("/data/schedules.json"),
      fetch("/data/landing.json")
    ])
      .then(async ([prodRes, transRes, schedRes, landingRes]) => {
        const prodData = await prodRes.json();
        const transData = await transRes.json();
        const landingJson = await landingRes.json().catch(() => null);

        setLandingData(landingJson);
        
        setProducts(prodData);

        const totalUnits = transData
          .filter((t: any) => t.status === "Selesai")
          .reduce((acc: number, curr: any) => acc + (Number(curr.jumlah_unit) || 0), 0);
          
        const collabProducts = prodData.filter((p: any) => p.kategori === "Video Bar" || p.brand === "Poly");
        const collabTarget = collabProducts.reduce((acc: number, curr: any) => acc + (Number(curr.target_bulanan) || 0), 0);
        const collabAchieved = collabProducts.reduce((acc: number, curr: any) => acc + (Number(curr.tercapai) || 0), 0);

        const dynamicVolume = 24500 + totalUnits;
        const dynamicRooms = 8200 + collabAchieved; 
        
        let tenderSuccess = 99.4;
        let volumePercent = 85;
        let roomPercent = 65;
        
        if (transData.length > 0) {
          const finished = transData.filter((t: any) => t.status === "Selesai").length;
          const calculatedSuccess = (finished / transData.length) * 100;
          if (!Number.isNaN(calculatedSuccess)) {
            tenderSuccess = Number(calculatedSuccess.toFixed(1));
          }
        }

        if (collabTarget > 0) {
           const calcRoom = (collabAchieved / collabTarget) * 100;
           if (!Number.isNaN(calcRoom)) {
             roomPercent = Math.min(100, Math.round(calcRoom));
           }
        }

        setStats({
          volumeUnit: dynamicVolume || 24500,
          roomCollab: dynamicRooms || 8200,
          tenderSuccess: tenderSuccess > 0 ? tenderSuccess : 99.4,
          volumePercent: volumePercent || 85,
          roomPercent: roomPercent || 65
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen w-full bg-white font-sans flex flex-col overflow-x-hidden text-[#00172D] pb-16 md:pb-0">
      <Header />
      <Hero y={y} data={landingData?.hero} />
      <ProductsSection products={products} />
      <InsightsSection />
      <CorporateValues stats={stats} data={landingData?.corporate_values} />
      <CTA />
      <Footer data={landingData?.footer} />
      <BottomNavigation />
    </div>
  );
}
