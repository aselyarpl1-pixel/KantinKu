import KontrolKatalog from "@/components/KontrolKatalog";

export default function MenuPage() {
  return (
    <section className="mx-auto min-h-[75vh] max-w-6xl space-y-8 px-4 py-8">
      {/* Header */}
      <div className="text-center">
        <span className="inline-block rounded-full bg-blue-100 px-5 py-2 text-sm font-semibold text-blue-700">
          🍽️ Pilihan KantinKu
        </span>

        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
          Katalog <span className="text-blue-600">Menu</span>
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Temukan berbagai pilihan makanan, minuman, dan camilan favoritmu
          dengan mudah.
        </p>
      </div>

      {/* Katalog */}
      <KontrolKatalog />
    </section>
  );
}
