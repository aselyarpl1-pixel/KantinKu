"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const daftarMenu = [
  { nama: "Beranda", href: "/beranda" },
  { nama: "Menu", href: "/menu" },
  { nama: "Favorit", href: "/favorit" },
  { nama: "Keranjang", href: "/keranjang" },
  { nama: "Riwayat", href: "/riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar">
      <Link href="/beranda" className="navbar-logo">
        KantinKu
      </Link>

      <div className="navbar-menu">
        {daftarMenu.map((item) => {
          const aktif = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`navbar-link ${aktif ? "aktif" : ""}`}
            >
              {item.nama}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
