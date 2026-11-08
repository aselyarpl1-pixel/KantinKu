"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { menu } from "@/data/menu";
import KartuMenu from "@/components/KartuMenu";

function berlangganan(callback: () => void) {
  window.addEventListener("favorit-berubah", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("favorit-berubah", callback);
    window.removeEventListener("storage", callback);
  };
}

function ambilFavorit() {
  return localStorage.getItem("favorit") || "[]";
}

function ambilFavoritServer() {
  return "[]";
}

export default function FavoritPage() {
  const dataFavorit = useSyncExternalStore(
    berlangganan,
    ambilFavorit,
    ambilFavoritServer,
  );

  let daftarId: number[] = [];

  try {
    daftarId = JSON.parse(dataFavorit);
  } catch {
    daftarId = [];
  }

  const daftarFavorit = menu.filter((item) => daftarId.includes(item.id));

  return (
    <section className="mx-auto min-h-[75vh] max-w-6xl space-y-8 px-4 py-8">
      {/* HEADER */}
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

      {/* JUMLAH FAVORIT */}
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

      {/* KARTU FAVORIT */}
      {daftarFavorit.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {daftarFavorit.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* TAMPILAN KOSONG */
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <div className="text-6xl">💔</div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            Belum Ada Menu Favorit
          </h3>

          <p className="mt-2 text-gray-500">
            Kamu belum memilih menu favorit. Yuk, cari menu kesukaanmu!
          </p>

          <Link
            href="/menu"
            className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            🍽️ Jelajahi Menu
          </Link>
        </div>
      )}
    </section>
  );
}
