// src/app/admin/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel | NovaFusion",
    template: "%s | Admin | NovaFusion"
  },
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-100 antialiased">{children}</body>
    </html>
  );
}
