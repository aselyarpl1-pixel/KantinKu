import Link from "next/link";

export default function Home() {
  return (
    <section className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-10 text-center">
      <span className="mb-5 rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
        🍽️ Selamat Datang di KantinKu
      </span>

      <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-6xl">
        Lapar? Yuk, Cari Menu
        <span className="text-blue-600"> Favoritmu!</span>
      </h1>

      <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
        Nikmati berbagai pilihan makanan, minuman, dan camilan lezat dengan
        mudah. Temukan menu favoritmu hanya di KantinKu!
      </p>

      <Link
        href="/menu"
        className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
      >
        Jelajahi Menu →
      </Link>

      <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-4xl">🍛</div>
          <h2 className="mt-3 text-lg font-bold text-gray-800">Makanan</h2>
          <p className="mt-1 text-sm text-gray-500">Pilihan makanan lezat</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-4xl">🥤</div>
          <h2 className="mt-3 text-lg font-bold text-gray-800">Minuman</h2>
          <p className="mt-1 text-sm text-gray-500">Minuman segar pilihan</p>
        </div>

        <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="text-4xl">🍟</div>
          <h2 className="mt-3 text-lg font-bold text-gray-800">Camilan</h2>
          <p className="mt-1 text-sm text-gray-500">
            Camilan untuk menemani harimu
          </p>
        </div>
      </div>
    </section>
  );
}
