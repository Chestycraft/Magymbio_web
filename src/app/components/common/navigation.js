"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";


export const Navigation = () => {
  const pathname = usePathname();
  const [atTop, setAtTop] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setAtTop(window.scrollY <= 0);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
     { href: "/", label: "Home"},
    { href: "/user_dashboard", label: "Tracker"},
  ];

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {/* Top Navigation */}
      <nav
  className={`w-full fixed top-0 left-0 z-50 px-6 ${
    atTop ? "py-3" : "py-6"
  } flex items-center justify-between transition-all duration-700 ease-in-out
  ${
    atTop
      ? "bg-foreground text-white md:bg-transparent md:text-black"
      : "bg-background text-black shadow-sm"
  }`}
>
  {/* Hamburger (mobile only) */}
        <button
          className="md:hidden z-[60]"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={28} className="text-white"/>
        </button>

        {/* Logo */}
     <motion.h1
  className="text-xl font-extrabold tracking-wide absolute md:static left-1/2 -translate-x-1/2 md:translate-x-0"
  animate={{ scale: atTop ? 1 : 1.2 }}
  transition={{ duration: 0.3 }}
>
<div className="text-3xl  font-bold">
  <span className="text-white">MA</span>
  <span className="text-[#de0f3f]">GYM</span>
  <span className="text-white">BO</span>
</div>
        </motion.h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex relative px-2 py-2 bg-black rounded-full overflow-hidden">
  {/* Left gradient fade */}
  <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-black to-transparent pointer-events-none z-10" />
  
  {/* Right gradient fade */}
  <div className="absolute right-0 top-0 h-full w-6 bg-gradient-to-l from-black to-transparent pointer-events-none z-10" />
  
  {/* Nav Links */}
  <div className="flex space-x-2 px-6 relative z-20">
    {navItems.map(({ href, label }) => (
      <Link
        key={href}
        href={href}
        className="text-white px-4 py-2 text-sm font-medium"
      >
        {label}
      </Link>
    ))}
  </div>
</div>

      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-full z-[70] transform transition-transform duration-500 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
         text-white`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/20">
          <h2 className="text-lg">Menu</h2>
          <button onClick={closeSidebar}>
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col space-y-4 p-6">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={closeSidebar}
              className={`text-base font-medium transition-colors ${
                pathname === href ? "text-red-400" : "hover:text-red-500"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Blur Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[60] backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};
