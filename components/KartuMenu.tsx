"use client";

import Link from "next/link";
import { rupiah, type Menu } from "@/data/menu";
import TombolFavorit from "@/components/TombolFavorit";

type Props = {
  item: Menu;
};

export default function KartuMenu({ item }: Props) {
  const habis = item.stok <= 0;

  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm transition ${
        habis
          ? "border-gray-300 bg-gray-100 opacity-70 grayscale"
          : "border-gray-200 bg-white hover:-translate-y-1 hover:shadow-md"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
          {item.kategori}
        </span>

        <span
          className={`text-xs font-semibold ${
            habis ? "text-gray-500" : "text-green-600"
          }`}
        >
          {habis ? "Habis" : "Tersedia"}
        </span>
      </div>

      <h2 className="text-lg font-bold text-gray-800">{item.nama}</h2>

      <p
        className={`mt-2 text-xl font-extrabold ${
          habis ? "text-gray-500" : "text-blue-600"
        }`}
      >
        {rupiah(item.harga)}
      </p>

      <p className="mt-1 text-sm text-gray-500">Stok: {item.stok}</p>

      <div className="mt-5 flex flex-col gap-2">
        {habis ? (
          <button
            type="button"
            disabled
            className="w-full cursor-not-allowed rounded-xl bg-gray-300 px-4 py-3 text-center font-semibold text-gray-500"
          >
            Menu Habis
          </button>
        ) : (
          <Link
            href={`/menu/${item.id}`}
            className="rounded-xl bg-blue-600 px-4 py-3 text-center font-semibold text-white hover:bg-blue-700"
          >
            Lihat Detail
          </Link>
        )}

        <TombolFavorit id={item.id} />
      </div>
    </div>
  );
}
