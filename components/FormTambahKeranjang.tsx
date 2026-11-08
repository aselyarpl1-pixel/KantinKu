"use client";

import { useState } from "react";
import { ItemKeranjang, bacaKeranjang, simpanKeranjang } from "@/lib/keranjang";
import type { Menu } from "@/data/menu";

export default function FormTambahKeranjang({ item }: { item: Menu }) {
  const [jumlah, setJumlah] = useState(1);
  const [pesan, setPesan] = useState("");

  function tambahKeranjang(e: React.FormEvent) {
    e.preventDefault();

    const keranjang = bacaKeranjang();

    const sudahAda = keranjang.find((data) => data.id === item.id);

    const jumlahLama = sudahAda?.jumlah || 0;

    if (jumlah < 1) {
      setPesan("Jumlah minimal adalah 1.");
      return;
    }

    if (jumlahLama + jumlah > item.stok) {
      setPesan("Jumlah melebihi stok yang tersedia.");
      return;
    }

    let dataBaru: ItemKeranjang[];

    if (sudahAda) {
      dataBaru = keranjang.map((data) =>
        data.id === item.id ? { ...data, jumlah: data.jumlah + jumlah } : data,
      );
    } else {
      dataBaru = [
        ...keranjang,
        {
          id: item.id,
          jumlah,
        },
      ];
    }

    simpanKeranjang(dataBaru);

    setJumlah(1);
    setPesan("Ditambahkan ke keranjang.");
  }

  if (item.stok === 0) {
    return <p className="mt-6 font-semibold text-red-600">Menu ini habis.</p>;
  }

  return (
    <form onSubmit={tambahKeranjang} className="mt-6">
      <label className="mb-2 block font-semibold text-gray-700">
        Jumlah Pesanan
      </label>

      <input
        type="number"
        min="1"
        max={item.stok}
        value={jumlah}
        onChange={(e) => setJumlah(Number(e.target.value))}
        className="w-full rounded-xl border border-gray-300 p-3"
      />

      <button
        type="submit"
        className="mt-4 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Tambah ke Keranjang
      </button>

      {pesan && (
        <p className="mt-3 text-sm font-semibold text-blue-700">{pesan}</p>
      )}
    </form>
  );
}
