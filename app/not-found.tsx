import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-6xl font-bold text-blue-600">404</h1>

      <h2 className="text-2xl font-bold">Menu Tidak Ditemukan</h2>

      <p className="text-gray-600">Maaf, menu yang kamu cari tidak tersedia.</p>

      <Link
        href="/menu"
        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Kembali ke Katalog
      </Link>
    </div>
  );
}
