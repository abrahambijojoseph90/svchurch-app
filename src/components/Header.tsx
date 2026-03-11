"use client";

import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, PenLine, User, LogOut, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "Leadership", href: "/about/leadership" },
      { label: "Our Ministries", href: "/about/ministries" },
    ],
  },
  { label: "Blogs", href: "/blogs" },
  {
    label: "Media Centre",
    href: "/media-centre",
    children: [
      { label: "Media", href: "/media-centre/media" },
      { label: "Gallery", href: "/media-centre/gallery" },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileDropdown, setMobileDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  };

  const toggleMobileDropdown = (label: string) => {
    setMobileDropdown((prev) => (prev === label ? null : label));
  };

  const userAvatar = (session?.user as { avatar?: string })?.avatar;
  const userName = session?.user?.name;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#1e232b]/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="relative flex-shrink-0">
            <Image
              src="/images/logo-white.png"
              alt="Spring Valley Church"
              width={120}
              height={60}
              className="h-[60px] w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.children ? handleMouseEnter(item.label) : undefined
                }
                onMouseLeave={item.children ? handleMouseLeave : undefined}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors rounded-md hover:bg-white/10"
                >
                  {item.label}
                  {item.children && (
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.children && (
                  <AnimatePresence>
                    {openDropdown === item.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 mt-1 w-52 rounded-lg bg-[#1e232b] border border-white/10 shadow-xl overflow-hidden"
                        onMouseEnter={() => handleMouseEnter(item.label)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}

            {/* Write Button (shown for signed-in users) */}
            {session && (
              <Link
                href="/write"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors rounded-md hover:bg-white/10"
              >
                <PenLine size={15} />
                Write
              </Link>
            )}

            {/* Give Button */}
            <a
              href="https://www.stewardship.org.uk/partners/SpringValleyChurchLuton"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center rounded-md bg-[#ab815a] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#96704d] transition-colors shadow-md"
            >
              Give
            </a>

            {/* User Menu / Sign In */}
            {session ? (
              <div className="relative ml-2" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-[#ab815a]/30 flex items-center justify-center">
                    {userAvatar ? (
                      <Image
                        src={userAvatar}
                        alt={userName || ""}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs font-bold text-white">
                        {userName?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 rounded-lg bg-[#1e232b] border border-white/10 shadow-xl overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white truncate">{userName}</p>
                        <p className="text-xs text-white/50 truncate">{session.user?.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <User size={15} />
                        Profile
                      </Link>
                      <Link
                        href="/my-posts"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <FileText size={15} />
                        My Posts
                      </Link>
                      <Link
                        href="/write"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <PenLine size={15} />
                        Write a Post
                      </Link>
                      <div className="border-t border-white/10">
                        <button
                          onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                          className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="ml-2 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-md hover:bg-white/10 border border-white/20"
              >
                <User size={15} />
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 top-20 bg-black/50 lg:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-in Panel */}
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-20 right-0 bottom-0 w-80 max-w-[85vw] bg-[#1e232b] border-l border-white/10 shadow-2xl lg:hidden overflow-y-auto"
            >
              <div className="flex flex-col py-4">
                {navItems.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleMobileDropdown(item.label)}
                          className="flex w-full items-center justify-between px-6 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {item.label}
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${
                              mobileDropdown === item.label ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileDropdown === item.label && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden bg-white/5"
                            >
                              {item.children.map((child) => (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="block px-10 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                  {child.label}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-6 py-3 text-base font-medium text-white/90 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* Mobile: Write link */}
                {session && (
                  <Link
                    href="/write"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-6 py-3 text-base font-medium text-[#ab815a] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <PenLine size={18} />
                    Write a Post
                  </Link>
                )}

                {/* Mobile Give Button */}
                <div className="mx-6 mt-4 pt-4 border-t border-white/10">
                  <a
                    href="https://www.stewardship.org.uk/partners/SpringValleyChurchLuton"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-md bg-[#ab815a] px-5 py-3 text-center text-base font-semibold text-white hover:bg-[#96704d] transition-colors shadow-md"
                  >
                    Give
                  </a>
                </div>

                {/* Mobile User Section */}
                <div className="mx-6 mt-4 pt-4 border-t border-white/10">
                  {session ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-3 px-0 py-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-[#ab815a]/30 flex items-center justify-center">
                          {userAvatar ? (
                            <Image src={userAvatar} alt="" width={32} height={32} className="object-cover w-full h-full" />
                          ) : (
                            <span className="text-xs font-bold text-white">{userName?.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{userName}</p>
                          <p className="text-xs text-white/50">{session.user?.email}</p>
                        </div>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/my-posts"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block py-2 text-sm text-white/70 hover:text-white transition-colors"
                      >
                        My Posts
                      </Link>
                      <button
                        onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                        className="block py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block w-full rounded-md border border-white/20 px-5 py-3 text-center text-base font-medium text-white hover:bg-white/10 transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
