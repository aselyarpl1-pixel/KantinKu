import Link from "next/link";
import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import AksiMenuDetail from "@/components/AksiMenuDetail";

// Menonaktifkan prerender instan untuk halaman ini
export const instant = false;

type Props = {
  params: Promise<{ id: string }>;
};

export default async function DetailMenu({ params }: Props) {
  const { id } = await params;

  const item = menu.find((data) => data.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10">
      <Link
        href="/menu"
        className="font-semibold text-blue-600 hover:underline"
      >
        ← Kembali ke Menu
      </Link>

      <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm md:p-10">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
          {item.kategori}
        </span>

        <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
          {item.nama}
        </h1>

        <p className="mt-4 text-2xl font-extrabold text-blue-600">
          {rupiah(item.harga)}
        </p>

        <p className="mt-3 text-gray-600">Stok tersedia: {item.stok}</p>

        <p className="mt-4 text-sm text-gray-500">
          {item.stok > 0
            ? "Menu tersedia dan dapat dipesan."
            : "Maaf, menu sedang habis."}
        </p>

        <AksiMenuDetail id={item.id} stok={item.stok} />
      </div>
    </main>
  );
}
