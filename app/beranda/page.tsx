import Link from "next/link";

export default function BerandaPage() {
  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">Selamat Datang di KantinKu</h1>

      <p className="text-gray-600">
        Temukan berbagai pilihan makanan, minuman, dan camilan favoritmu di
        KantinKu.
      </p>

      <Link
        href="/menu"
        className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Lihat Menu
      </Link>
    </section>
  );
}
