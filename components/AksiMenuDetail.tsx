"use client";

import { bacaKeranjang, simpanKeranjang } from "@/lib/keranjang";
import TombolFavorit from "@/components/TombolFavorit";

type Props = {
  id: number;
  stok: number;
};

export default function AksiMenuDetail({ id, stok }: Props) {
  function tambahKeranjang() {
    const keranjang = bacaKeranjang();
    const item = keranjang.find((data) => data.id === id);

    if (item) {
      if (item.jumlah >= stok) {
        alert("Jumlah melebihi stok yang tersedia.");
        return;
      }

      simpanKeranjang(
        keranjang.map((data) =>
          data.id === id ? { ...data, jumlah: data.jumlah + 1 } : data,
        ),
      );
    } else {
      simpanKeranjang([...keranjang, { id, jumlah: 1 }]);
    }

    alert("Menu berhasil ditambahkan ke keranjang!");
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <button
        type="button"
        onClick={tambahKeranjang}
        disabled={stok <= 0}
        className="rounded-xl bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        Tambah ke Keranjang
      </button>

      <TombolFavorit id={id} />
    </div>
  );
}
