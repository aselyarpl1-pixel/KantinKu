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

  const habis = item.stok <= 0;

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 md:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Tombol kembali */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50"
        >
          <span aria-hidden>←</span> Kembali ke Menu
        </Link>

        {/* Card detail menu */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="flex items-start justify-between gap-3">
            <span className="inline-block w-fit rounded-full bg-blue-100 px-4 py-1.5 text-sm font-bold text-blue-700">
              {item.kategori}
            </span>

            {habis && (
              <span className="rounded-full bg-red-500 px-4 py-1.5 text-sm font-bold text-white shadow">
                Habis
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
            {item.nama}
          </h1>

          <p className="mt-3 text-3xl font-extrabold text-blue-600">
            {rupiah(item.harga)}
          </p>

          {/* Informasi stok */}
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                Stok Tersedia
              </span>
              <span
                className={`text-lg font-bold ${
                  habis ? "text-red-600" : "text-green-600"
                }`}
              >
                {habis ? "Habis" : `${item.stok} porsi`}
              </span>
            </div>
          </div>

          {/* Aksi menu */}
          <div className="mt-6">
            <FormTambahKeranjang item={item} />

            <div className="mt-4">
              <TombolFavorit id={item.id} />
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
