import Link from "next/link";
import { menu, rupiah } from "@/data/menu";
import FormTambahKeranjang from "@/components/FormTambahKeranjang";

export default function MenuPage() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-10">
      {/* HEADER */}
      <div className="mb-10 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
          🍽️ KantinKu
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
          Menu Kantin
        </h1>

        <p className="mt-3 text-gray-500">
          Pilih makanan dan minuman favoritmu.
        </p>
      </div>

      {/* DAFTAR MENU */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {menu.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            {/* GAMBAR / IKON MENU */}
            <div className="flex h-40 items-center justify-center bg-blue-50 text-6xl">
              {item.kategori === "Makanan"
                ? "🍛"
                : item.kategori === "Minuman"
                  ? "🥤"
                  : "🍌"}
            </div>

            {/* INFORMASI MENU */}
            <div className="p-5">
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                {item.kategori}
              </span>

              <h2 className="mt-4 text-xl font-bold text-gray-800">
                {item.nama}
              </h2>

              <p className="mt-2 text-lg font-extrabold text-blue-600">
                {rupiah(item.harga)}
              </p>

              <p
                className={`mt-2 text-sm font-semibold ${
                  item.stok > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.stok > 0 ? `Stok tersedia: ${item.stok}` : "Stok habis"}
              </p>

              {/* TOMBOL DETAIL */}
              <Link
                href={`/menu/${item.id}`}
                className="mt-4 block rounded-xl border border-blue-600 px-4 py-3 text-center font-semibold text-blue-600 transition hover:bg-blue-50"
              >
                Lihat Detail
              </Link>

              {/* FORM TAMBAH KERANJANG */}
              <FormTambahKeranjang item={item} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
