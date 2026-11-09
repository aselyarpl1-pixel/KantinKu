"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import KartuMenu from "@/components/KartuMenu";
import type { Menu } from "@/data/menu";

export default function FavoritPage() {
  const [menu, setMenu] = useState<Menu[]>([]);
  const [daftarId, setDaftarId] = useState<number[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState("");

  useEffect(() => {
    let batal = false;

    async function ambilData() {
      setMemuat(true);
      setGalat("");

      try {
        const res = await fetch("/api/menu");

        if (!res.ok) {
          throw new Error("Gagal mengambil data menu.");
        }

        const data: Menu[] = await res.json();

        if (batal) return;

        setMenu(data);
      } catch (err) {
        if (batal) return;

        setGalat(
          err instanceof Error ? err.message : "Terjadi kesalahan tak terduga.",
        );
      } finally {
        if (!batal) setMemuat(false);
      }
    }

    function bacaFavorit() {
      try {
        setDaftarId(JSON.parse(localStorage.getItem("favorit") || "[]"));
      } catch {
        setDaftarId([]);
      }
    }

    ambilData();
    bacaFavorit();

    window.addEventListener("favorit-berubah", bacaFavorit);
    window.addEventListener("storage", bacaFavorit);

    return () => {
      batal = true;
      window.removeEventListener("favorit-berubah", bacaFavorit);
      window.removeEventListener("storage", bacaFavorit);
    };
  }, []);

  const daftarFavorit = menu.filter((item) => daftarId.includes(item.id));

  return (
    <section className="mx-auto min-h-[75vh] max-w-6xl space-y-8 px-4 py-8">
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
          ❤️ Koleksi KantinKu
        </span>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Menu <span className="text-blue-600">Favorit</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Kumpulan makanan, minuman, dan camilan yang kamu sukai. Semua pilihan
          favoritmu ada di sini!
        </p>
      </div>

      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Daftar Menu Favorit
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Menampilkan {daftarFavorit.length} menu favorit
          </p>
        </div>

        <Link
          href="/menu"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-blue-700"
        >
          + Tambah Favorit
        </Link>
      </div>

      {memuat ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <p className="text-lg font-semibold text-gray-600">Memuat...</p>
        </div>
      ) : galat ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-16 text-center">
          <div className="text-5xl">⚠️</div>
          <h3 className="mt-4 text-xl font-bold text-red-700">
            Gagal memuat data
          </h3>
          <p className="mt-2 text-red-600">{galat}</p>
        </div>
      ) : daftarFavorit.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {daftarFavorit.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <div className="text-6xl">💔</div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            Belum ada menu favorit.
          </h3>

          <p className="mt-2 text-gray-500">
            Kamu belum memilih menu favorit. Yuk, cari menu kesukaanmu!
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Jelajahi Menu
          </Link>
        </div>
      )}
    </section>
  );
}
