import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import CrystalBall from "@/components/fortune/CrystalBall";
import HoroscopeSection from "@/components/fortune/HoroscopeSection";
import FortuneCards from "@/components/fortune/FortuneCards";
import SavedFortunes from "@/components/fortune/SavedFortunes";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-purple-950 text-white font-['Montserrat']">
      <Header />
      <main className="flex-grow" id="main-content">
        <Hero />
        <CrystalBall />
        <HoroscopeSection />
        <FortuneCards />
        <SavedFortunes />
      </main>
      <Footer />
    </div>
  );
}
