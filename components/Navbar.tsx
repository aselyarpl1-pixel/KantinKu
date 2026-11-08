"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { bacaJumlahKeranjang } from "@/lib/keranjang";

const daftarMenu = [
  { nama: "Beranda", href: "/beranda" },
  { nama: "Menu", href: "/menu" },
  { nama: "Favorit", href: "/favorit" },
  { nama: "Keranjang", href: "/keranjang" },
  { nama: "Riwayat", href: "/riwayat" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [jumlah, setJumlah] = useState(0);

  useEffect(() => {
    const hitung = () => {
      setJumlah(bacaJumlahKeranjang());
    };

    hitung();

    window.addEventListener("keranjang-berubah", hitung);
    window.addEventListener("storage", hitung);

    return () => {
      window.removeEventListener("keranjang-berubah", hitung);
      window.removeEventListener("storage", hitung);
    };
  }, []);

  return (
    <nav className="navbar">
      <a href="/beranda" className="navbar-logo">
        KantinKu
      </a>

      <div className="navbar-menu">
        {daftarMenu.map((item) => {
          const aktif = pathname === item.href;

          return (
            <a
              key={item.href}
              href={item.href}
              className={`navbar-link ${aktif ? "aktif" : ""}`}
              aria-current={aktif ? "page" : undefined}
            >
              {item.nama}

              {item.href === "/keranjang" && jumlah > 0 && (
                <span className="ml-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white">
                  {jumlah}
                </span>
              )}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
