import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { menu, rupiah } from "@/data/menu";
import FormTambahKeranjang from "@/components/FormTambahKeranjang";
import TombolFavorit from "@/components/TombolFavorit";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function DetailMenuContent({ params }: Props) {
  const { id } = await params;

  const item = menu.find((data) => data.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Tombol kembali */}
        <Link
          href="/menu"
          className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
        >
          ← Kembali ke Menu
        </Link>

        {/* Card detail menu */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          {/* Bagian atas tanpa ikon atau gambar */}
          <div className="h-56 bg-linear-to-br from-blue-50 via-blue-50 to-blue-100 md:h-72" />

          {/* Informasi menu */}
          <div className="p-6 md:p-10">
            <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              {item.kategori}
            </span>

            <h1 className="mt-5 text-3xl font-extrabold text-slate-900 md:text-4xl">
              {item.nama}
            </h1>

            <p className="mt-4 text-3xl font-extrabold text-blue-600">
              {rupiah(item.harga)}
            </p>

            {/* Informasi stok */}
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Ketersediaan Stok
              </p>

              <p
                className={`mt-2 text-xl font-bold ${
                  item.stok > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {item.stok > 0 ? `${item.stok} tersedia` : "Stok habis"}
              </p>
            </div>

            {/* Aksi menu */}
            <div className="mt-8">
              <FormTambahKeranjang item={item} />

              <div className="mt-4">
                <TombolFavorit id={item.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function DetailMenu({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 p-10 text-center font-semibold text-slate-600">
          Memuat detail menu...
        </div>
      }
    >
      <DetailMenuContent params={params} />
    </Suspense>
  );
}
