import Link from "next/link";
import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import AksiMenuDetail from "@/components/AksiMenuDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DetailMenu({ params }: Props) {
  const { id } = await params;

  const item = menu.find((data) => data.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      <Link
        href="/menu"
        className="inline-block rounded-xl bg-gray-100 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
      >
        ← Kembali ke Menu
      </Link>

      <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
          {item.kategori}
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-gray-900">
          {item.nama}
        </h1>

        <p className="mt-4 text-2xl font-extrabold text-blue-600">
          {rupiah(item.harga)}
        </p>

        <div className="mt-6 rounded-2xl bg-gray-50 p-5">
          <p className="text-sm text-gray-500">Stok tersedia</p>

          <p
            className={`mt-2 text-xl font-bold ${
              item.stok > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {item.stok > 0 ? `${item.stok} tersedia` : "Stok habis"}
          </p>
        </div>

        <AksiMenuDetail id={item.id} stok={item.stok} />
      </div>
    </main>
  );
}
