import KontrolKatalog from "@/components/KontrolKatalog";

export default function MenuPage() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Katalog Menu</h1>

        <p className="mt-2 text-gray-600">
          Pilih makanan dan minuman favoritmu.
        </p>
      </div>

      <KontrolKatalog />
    </section>
  );
}
