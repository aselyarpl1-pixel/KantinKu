import Link from "next/link";
import { Menu, rupiah } from "@/data/menu";

export default function KartuMenu({ item }: { item: Menu }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-2">
        <h2 className="text-lg font-bold">{item.nama}</h2>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {item.kategori}
        </span>
      </div>

      <p className="mb-2 text-xl font-bold text-blue-600">
        {rupiah(item.harga)}
      </p>

      <p className="mb-4 text-sm text-gray-600">
        Stok: {item.stok === 0 ? "Habis" : item.stok}
      </p>

      <Link
        href={`/menu/${item.id}`}
        className="block rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
      >
        Lihat Detail
      </Link>
    </div>
  );
}
