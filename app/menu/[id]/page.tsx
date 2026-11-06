import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { menu, rupiah } from "@/data/menu";

async function DetailMenuContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = menu.find((data) => data.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <section className="max-w-2xl space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Detail Menu</h1>

        <p className="mt-2 text-gray-600">Informasi lengkap menu KantinKu.</p>
      </div>

      <div className="space-y-4 rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">{item.nama}</h2>

        <p>
          <strong>Kategori:</strong> {item.kategori}
        </p>

        <p>
          <strong>Harga:</strong> {rupiah(item.harga)}
        </p>

        <p>
          <strong>Stok:</strong> {item.stok === 0 ? "Habis" : item.stok}
        </p>

        <Link
          href="/menu"
          className="inline-block rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Kembali ke Menu
        </Link>
      </div>
    </section>
  );
}

export default function DetailMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={<p className="p-5 text-gray-500">Memuat detail menu...</p>}
    >
      <DetailMenuContent params={params} />
    </Suspense>
  );
}
