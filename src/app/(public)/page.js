"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "./../components/common/logo";
import { motion } from "framer-motion";
import Services from './../components/page_components/services';

export default function Home() {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => {
    const scrollThreshold = 0; // adjust as needed
    setIsScrolled(window.scrollY > scrollThreshold);
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);

  // Automatically change slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % heroImages.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  const gotoTracker = () => {
    router.push("/user_dashboard");
  };

  // Track screen width
  useEffect(() => {
    const checkScreen = () => setIsDesktop(window.innerWidth >= 1024);
    checkScreen(); // initial check
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);
  const heroImages = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Desktop layout
if (isDesktop) {
  return (
    <div className="w-full bg-black text-white">
      {/* === Hero Section (desktop) === */}
      <div className="flex w-full min-h-screen">
        {/* Left Panel */}
        <div className="w-1/2 flex items-center justify-center bg-black p-12">
          <div className="max-w-md w-full">
            <Logo isScrolled={isScrolled} />
            <button
              onClick={gotoTracker}
              className="mt-6 bg-white/10 text-white px-6 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-white/20 transition duration-200 border border-white/20"
            >
              <small>Subscribed?</small> View Tracker
            </button>
          </div>
        </div>

        {/* Right Panel: Slideshow */}
        <div className="relative w-1/2 bg-black">
          {heroImages.map((src, index) => (
            <div
              key={index}
              className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
                index === currentIndex ? "opacity-100" : "opacity-0"
              }`}
              style={{ backgroundImage: `url('${src}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black z-10" />
          <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-black to-transparent z-10" />
          <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
      </div>

      {/* === Services Section (Programs & Pricing) === */}
      <div id="programs" className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Services />
        </motion.div>
      </div>
    </div>
  );
}



  // ✅ Mobile layout
  return (
    <>
      {/* === Hero Section with Slideshow === */}
      <div className="relative flex flex-col items-center justify-center text-center min-h-screen bg-black">
        {/* Background Slideshow Images */}
        {/**
         * This container holds all slideshow images absolutely
         * Only one image will be visible at a time with fade effect
         */}
        {heroImages.map((src, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full bg-cover bg-center transition-opacity duration-1000 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundImage: `url('${src}')` }}
          />
        ))}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/40" />
{/* Bottom fade overlay */}
<div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10" />

        {/* Foreground content (logo + button) */}
        <div className="relative -mt-[10rem] z-10 p-8 rounded-xl bg-[#000000]/[0.39] backdrop-blur-[6px] border-[2px] border-[#636363]/[0.57]">
          <Logo />

          <button
            onClick={gotoTracker}
 className="mt-6 bg-white/50 backdrop-blur-lg border border-gray-300/50 text-white font-medium text-base px-4 py-2 rounded-xl shadow-md hover:bg-white/60 active:bg-gray-300 transition-colors duration-200"
      >
            <small>Subscribed?</small> View Tracker
          </button>
        </div>
      </div>

      {/* === Additional Sections === */}

      {/* Programs / Services Section */}
      <div className="-mt-[200px] relative z-10 transition-all duration-10" id="programs">
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={isScrolled ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
    transition={{ duration: 0.6 }}
  >
    <Services />
  </motion.div>
</div>
    </>
  );
}
