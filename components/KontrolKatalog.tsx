"use client";

import { useMemo, useState } from "react";
import { menu } from "@/data/menu";
import KartuMenu from "./KartuMenu";

export default function KontrolKatalog() {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urutan, setUrutan] = useState("awal");

  const hasil = useMemo(() => {
    let data = [...menu];

    // Pencarian nama menu
    if (cari.trim()) {
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(cari.toLowerCase()),
      );
    }

    // Filter kategori
    if (kategori !== "Semua") {
      data = data.filter((item) => item.kategori === kategori);
    }

    // Pengurutan
    if (urutan === "termurah") {
      data.sort((a, b) => a.harga - b.harga);
    } else if (urutan === "termahal") {
      data.sort((a, b) => b.harga - a.harga);
    } else if (urutan === "nama") {
      data.sort((a, b) => a.nama.localeCompare(b.nama, "id"));
    }

    return data;
  }, [cari, kategori, urutan]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="Cari nama menu..."
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Camilan">Camilan</option>
        </select>

        <select
          value={urutan}
          onChange={(e) => setUrutan(e.target.value)}
          className="rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        >
          <option value="awal">Urutan awal</option>
          <option value="termurah">Harga termurah</option>
          <option value="termahal">Harga termahal</option>
          <option value="nama">Nama A-Z</option>
        </select>
      </div>

      {hasil.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasil.map((item) => (
            <KartuMenu key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-gray-500">Menu tidak ditemukan.</p>
      )}
    </div>
  );
}
