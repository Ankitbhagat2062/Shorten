'use client'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { useSidebar } from '@/context/SidebarContext';
import { navItems } from '@/lib/constants';
import React from 'react'
import { LogoutIcon } from '@/lib/icons';
import { redirect, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
    const { isOpen, toggleSidebar } = useSidebar();
    const { data: session } = useSession()
    const Pathname = usePathname();
    const activeNav = Pathname.split('/')[1];
    return (
        <>
            {/* Navigation Navbar */}
            <nav className="glass fixed top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 relative">
                        {/* Logo */}
                        <Link href={'/'} className=" flex items-center gap-3 justify-center">
                            <div className="w-10 h-10 bg-linear-to-br from-[#667eea] to-[#764ba2] rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                            </div>
                            <span className="text-2xl font-bold gradient-text">Shorten</span>
                        </Link>

                        {/* Navigation Links - Desktop */}
                        <div className="flex items-center justify-center gap-2">
                            {/* Login/Signup Buttons */}
                            <div className={`flex ml-10 md:ml-0 items-center justify-center space-x-3`}>
                                <div className={`${isOpen ? 'flex-col absolute top-15 bg-black/50 right-0' : 'hidden md:flex'} flex ml-10 md:ml-0 items-baseline space-x-6`}>
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.id}
                                            href={`/${item.id}`}
                                            className={`
                                               w-full flex items-center justify-center gap-3 md:gap-0 md:m-0 md:px-2 px-4 py-1 my-2 rounded-xl transition-all duration-200
                                               ${activeNav === item.id
                                                    ? 'bg-linear-to-r from-[#667eea]/20 to-[#764ba2]/20 text-white border border-white/20'
                                                    : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }
                                             `}
                                        >
                                            <item.icon className="w-5 h-5 shrink-0" />
                                            <span className="font-medium">{item.label}</span>
                                        </Link>
                                    ))}
                                </div>
                                <div className='md:flex hidden'>
                                    {session?.user ?
                                        <div className="profiles">

                                            <Menu as="div" className="relative inline-block">
                                                <MenuButton className="inline-flex w-full justify-center rounded-full text-sm font-semibold text-white inset-ring-1 inset-ring-white/5">
                                                    <Image src={session.user.image} className='rounded-full' height={30} width={30} alt='profilePic' />
                                                </MenuButton>

                                                <MenuItems
                                                    transition
                                                    className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gray-800 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                                                >
                                                    <div className="py-1">
                                                        <MenuItem>
                                                            <Link
                                                                href="/"
                                                                className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                                                            >
                                                                {session?.user?.name}
                                                            </Link>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <Link
                                                                href="#"
                                                                className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                                                            >
                                                                {session.user.email}
                                                            </Link>
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <button onClick={() => signOut()}
                                                                type="button"
                                                                className="flex items-center justify-start cursor-pointer w-full px-4 py-2 text-left text-sm text-red-300 data-focus:bg-white/5 data-focus:text-white data-focus:outline-hidden"
                                                            >
                                                               <LogoutIcon className={`w-5 h-5`} /> Sign out
                                                            </button>
                                                        </MenuItem>
                                                    </div>
                                                </MenuItems>
                                            </Menu>
                                        </div>
                                        :
                                        <button type='button' className="btn-primary cursor-pointer p-2 sm:px-3 md:px-4"
                                            onClick={() => redirect('/register')} >Sign Up</button>
                                    }
                                </div>
                            </div>
                            {/* Mobile menu button */}
                            <div className="md:hidden">
                                <button onClick={() => toggleSidebar(!isOpen)} className="text-white p-2">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
