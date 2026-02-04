// src/components/layout/Footer.tsx
import Link from "next/link";

const links = {
  services: [
    { href: "/services/drone-videography", label: "Drone Videography" },
    { href: "/services/photography", label: "Property Photography" },
    { href: "/services/video-production", label: "Video Production" },
    { href: "/services/digital-marketing", label: "Digital Marketing" },
    { href: "/services/branding", label: "Branding & Design" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/portfolio", label: "Portfolio" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ]
};

const socials = [
  { label: "Facebook", icon: "f", href: "#" },
  { label: "Instagram", icon: "ig", href: "#" },
  { label: "LinkedIn", icon: "in", href: "#" },
  { label: "YouTube", icon: "yt", href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container-main section-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                Nova<span className="text-brand-400">Fusion</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Ahmedabad's leading real estate marketing agency. Helping builders sell properties faster with stunning visuals and digital marketing.
            </p>
            
            {/* Socials */}
            <div className="flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-slate-800 hover:bg-brand-600 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {links.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {links.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="text-slate-400">
                📍 Ahmedabad, Gujarat
              </li>
              <li>
                <a href="tel:+918153836923" className="text-slate-400 hover:text-white transition-colors">
                  📞 +91 81538 36923
                </a>
              </li>
              <li>
                <a href="mailto:hello@novafusion.in" className="text-slate-400 hover:text-white transition-colors">
                  ✉️ hello@novafusion.in
                </a>
              </li>
              <li>
                <a href="https://wa.me/918153836923" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:text-green-300 transition-colors">
                  💬 WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container-main py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© {new Date().getFullYear()} NovaFusion. All rights reserved.</p>
            <div className="flex gap-6">
              {links.legal.map((link) => (
                <Link key={link.href} href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
