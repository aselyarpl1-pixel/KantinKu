"use client";

import { useMemo, useState } from "react";
import { menu } from "@/data/menu";
import KartuMenu from "./KartuMenu";

export default function KontrolKatalog() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutan, setUrutan] = useState("awal");

  // Pencarian, filter kategori, dan pengurutan
  const hasil = useMemo(() => {
    let data = [...menu];

    if (cari.trim()) {
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(cari.toLowerCase()),
      );
    }

    if (kategori !== "Semua") {
      data = data.filter((item) => item.kategori === kategori);
    }

    if (urutan === "termurah") {
      data.sort((a, b) => a.harga - b.harga);
    } else if (urutan === "termahal") {
      data.sort((a, b) => b.harga - a.harga);
    } else if (urutan === "nama") {
      data.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    }

    return data;
  }, [cari, kategori, urutan]);

  const tombolKategori = ["Semua", "Makanan", "Minuman", "Camilan"];

  return (
    <div className="space-y-8">
      {/* PENCARIAN */}
      <div className="mx-auto max-w-2xl">
        <label className="mb-2 block text-sm font-bold text-gray-700">
          Cari Menu Favoritmu
        </label>

        <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
          <span className="text-xl">🔍</span>

          <input
            type="text"
            placeholder="Cari nasi goreng, mie ayam..."
            value={cari}
            onChange={(e) => setCari(e.target.value)}
            className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* KATEGORI */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-gray-800">Kategori Menu</h2>

        <div className="flex flex-wrap gap-3">
          {tombolKategori.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => setKategori(item)}
              className={`rounded-full px-6 py-3 text-sm font-semibold transition ${
                kategori === item
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-600"
              }`}
            >
              {item === "Semua" && "🍽️ "}
              {item === "Makanan" && "🍛 "}
              {item === "Minuman" && "🥤 "}
              {item === "Camilan" && "🍟 "}
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* PENGURUTAN DAN JUMLAH MENU */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Daftar Menu</h2>

          <p className="mt-1 text-sm text-gray-500">
            Menampilkan {hasil.length} menu
          </p>
        </div>

        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-blue-500"
        >
          <option value="awal">Urutan awal</option>
          <option value="termurah">Harga termurah</option>
          <option value="termahal">Harga termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
      </div>

      {/* KARTU MENU */}
      {hasil.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
          <div className="text-5xl">🔎</div>

          <h3 className="mt-4 text-xl font-bold text-gray-800">
            Menu tidak ditemukan.
          </h3>

          <p className="mt-2 text-gray-500">
            Coba gunakan kata kunci atau kategori lainnya.
          </p>

          <button
            type="button"
            onClick={() => {
              setCari("");
              setKategori("Semua");
              setUrutan("awal");
            }}
            className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Reset Pencarian
          </button>
        </div>
      )}
    </div>
  );
}
