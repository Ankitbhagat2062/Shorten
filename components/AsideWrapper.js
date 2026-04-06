"use client";

import { useSidebar } from "@/context/SidebarContext";
import { navItems } from "@/lib/constants";
import { BurgerIcon, LinkIcon, LogoutIcon } from "@/lib/icons";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";


// Main Dashboard Component
const AsideWrapper = ({ children }) => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const { isOpen, toggleSidebar } = useSidebar();
  const pathname = usePathname()
  
  useEffect(() => {
    const path = pathname.split('/')[1]
    navItems.map((item) => {
      if (path === item.id) setActiveNav(item.id)
    })
  }, [pathname])

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-between">
      {/* Sidebar */}
      <aside
        className={`
          fixed glass left-0 top-0 h-full px-4 z-50 transition-all duration-300
          ${isOpen ? ' w-15' : 'w-45'}
        `}
      >
        {/* Navigation */}
        <nav className="py-2 px-1 space-y-2">
          <div className="flex items-center justify-center">
            {/* Collapse Toggle */}
            <button
              onClick={() => toggleSidebar(!isOpen)}
              className="cursor-pointer w-6 h-6 mx-1 rounded-full bg-[#667eea] text-white flex items-center justify-center transition-colors"
            >
              <BurgerIcon className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Logo */}
            <Link href={'/'} className="border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-white" />
                </div>

                <span className={`text-xl font-bold gradient-text ${!isOpen ? 'block' : 'hidden'} `}>Shorten</span>
              </div>
            </Link>
          </div>
          <div className={` mt-8 flex flex-col items-center justify-center`}>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}` }
                className={`
                w-full flex items-center justify-center gap-3 md:px-2 px-4 py-1 my-4 rounded-xl transition-all duration-200
                ${activeNav === item.id
                    ? 'bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                  }
              `}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button type="button" onClick={()=>signOut()} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors">
            <LogoutIcon className="w-5 h-5 shrink-0" />
            {!isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>

      </aside>
      {children}
    </div>
  );
};

export default AsideWrapper;
