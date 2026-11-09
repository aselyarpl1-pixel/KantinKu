import KontrolKatalog from "@/components/KontrolKatalog";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
            Pilihan KantinKu
          </span>

          <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Katalog <span className="text-blue-600">Menu</span>
          </h1>

          <p className="mt-4 text-base text-slate-600 md:text-lg">
            Temukan berbagai pilihan makanan, minuman, dan camilan favoritmu
            dengan mudah.
          </p>
        </div>

        <KontrolKatalog />
      </div>
    </main>
  );
}
