// src/components/layout/Navbar.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { 
    href: "/services", 
    label: "Services",
    children: [
      { href: "/services/drone-videography", label: "Drone Videography" },
      { href: "/services/photography", label: "Property Photography" },
      { href: "/services/video-production", label: "Video Production" },
      { href: "/services/digital-marketing", label: "Digital Marketing" },
      { href: "/services/branding", label: "Branding & Design" },
      { href: "/services/web-development", label: "Web Development" },
    ]
  },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
    }`}>
      <nav className="container-main">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="relative z-10">
            <span className={`text-xl sm:text-2xl font-bold transition-colors ${scrolled ? "text-slate-900" : "text-white"}`}>
              Nova<span className="text-brand-500">Fusion</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div 
                key={link.href}
                className="relative"
                onMouseEnter={() => link.children && setDropdown(link.href)}
                onMouseLeave={() => setDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                    pathname === link.href
                      ? "text-brand-600"
                      : scrolled 
                        ? "text-slate-600 hover:text-slate-900 hover:bg-slate-100" 
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                  {link.children && (
                    <svg className={`w-4 h-4 transition-transform ${dropdown === link.href ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </Link>

                {/* Dropdown */}
                {link.children && dropdown === link.href && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 animate-fade-down">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+918153836923" className={`text-sm font-medium ${scrolled ? "text-slate-600" : "text-white/80"}`}>
              📞 +91 81538 36923
            </a>
            <Link href="/contact" className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
              scrolled 
                ? "bg-slate-900 text-white hover:bg-slate-800" 
                : "bg-white text-slate-900 hover:bg-slate-100"
            }`}>
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden relative z-10 p-2 rounded-lg transition-colors ${
              scrolled || isOpen ? "text-slate-900 hover:bg-slate-100" : "text-white hover:bg-white/10"
            }`}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-white z-40 animate-fade-in">
            <div className="container-main py-6 h-full overflow-y-auto">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      className={`block py-3 px-4 rounded-xl text-base font-medium transition-colors ${
                        pathname === link.href 
                          ? "text-brand-600 bg-brand-50" 
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.label}
                    </Link>
                    {link.children && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-100 pl-4">
                        {link.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-2 text-sm text-slate-500 hover:text-brand-600"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                <a href="tel:+918153836923" className="flex items-center justify-center gap-2 py-3 text-slate-700 font-medium">
                  📞 +91 81538 36923
                </a>
                <Link href="/contact" className="block w-full btn-primary text-center">
                  Get Free Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
