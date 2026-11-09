"use client";

import { useEffect, useState } from "react";
import { rupiah } from "@/data/menu";

type ItemPesanan = {
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
};

type Pesanan = {
  id: number;
  tanggal: string;
  nama: string;
  kelas: string;
  caraAmbil: string;
  metodePembayaran: string;
  items: ItemPesanan[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

function bacaRiwayat(): Pesanan[] {
  try {
    return JSON.parse(localStorage.getItem("riwayat") || "[]");
  } catch {
    return [];
  }
}

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<Pesanan[]>([]);

  useEffect(() => {
    const perbarui = () => {
      const data = bacaRiwayat();
      data.sort((a, b) => b.id - a.id);
      setRiwayat(data);
    };

    perbarui();

    window.addEventListener("riwayat-berubah", perbarui);
    window.addEventListener("storage", perbarui);

    return () => {
      window.removeEventListener("riwayat-berubah", perbarui);
      window.removeEventListener("storage", perbarui);
    };
  }, []);

  // Menghapus seluruh riwayat dengan konfirmasi
  function hapusRiwayat() {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus semua riwayat pesanan?",
    );

    if (!yakin) return;

    localStorage.removeItem("riwayat");
    setRiwayat([]);

    window.dispatchEvent(new Event("riwayat-berubah"));
  }

  const totalBelanja = riwayat.reduce(
    (total, pesanan) => total + (pesanan.total || 0),
    0,
  );

  const jumlahMenu = riwayat.reduce(
    (total, pesanan) =>
      total +
      (pesanan.items || []).reduce((jumlah, item) => jumlah + item.jumlah, 0),
    0,
  );

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-slate-50 px-4 py-10">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Riwayat Pesanan
        </h1>

        <p className="mt-2 text-slate-500">
          Daftar pesanan yang pernah kamu buat.
        </p>
      </div>

      {/* RINGKASAN */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Pesanan</p>
          <h2 className="mt-2 text-2xl font-extrabold text-blue-600">
            {riwayat.length}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Jumlah Menu</p>
          <h2 className="mt-2 text-2xl font-extrabold text-blue-600">
            {jumlahMenu}
          </h2>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Belanja</p>
          <h2 className="mt-2 text-2xl font-extrabold text-green-600">
            {rupiah(totalBelanja)}
          </h2>
        </div>
      </div>

      {/* TOMBOL HAPUS RIWAYAT */}
      {riwayat.length > 0 && (
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            onClick={hapusRiwayat}
            className="rounded-xl bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
          >
            🗑 Hapus Riwayat
          </button>
        </div>
      )}

      {/* DAFTAR RIWAYAT */}
      {riwayat.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="text-5xl">📋</div>

          <h2 className="mt-4 text-xl font-bold text-slate-800">
            Belum ada pesanan.
          </h2>

          <p className="mt-2 text-slate-500">
            Pesanan yang sudah dibuat akan muncul di sini.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {riwayat.map((pesanan) => (
            <div
              key={pesanan.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-2 border-b border-slate-200 pb-4 sm:flex-row">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Pesanan #{pesanan.id}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {pesanan.tanggal}
                  </p>
                </div>

                <span className="h-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                  Pesanan Berhasil
                </span>
              </div>

              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <p>
                  Nama: <strong>{pesanan.nama}</strong>
                </p>

                <p>
                  Kelas: <strong>{pesanan.kelas || "-"}</strong>
                </p>

                <p>
                  Pengambilan:{" "}
                  <strong>
                    {pesanan.caraAmbil === "antar"
                      ? "Diantar"
                      : "Ambil sendiri"}
                  </strong>
                </p>

                <p>
                  Pembayaran: <strong>{pesanan.metodePembayaran || "-"}</strong>
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4">
                <h3 className="mb-3 font-bold text-slate-900">Detail Menu</h3>

                {(pesanan.items || []).map((item, index) => (
                  <div
                    key={`${pesanan.id}-${index}`}
                    className="flex justify-between gap-3 py-2 text-sm"
                  >
                    <span className="text-slate-600">
                      {item.nama} x{item.jumlah}
                    </span>

                    <span className="font-semibold text-slate-800">
                      {rupiah(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span>{rupiah(pesanan.subtotal || 0)}</span>
                </div>

                {(pesanan.diskon || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span>-{rupiah(pesanan.diskon)}</span>
                  </div>
                )}

                {(pesanan.ongkir || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Ongkir</span>
                    <span>{rupiah(pesanan.ongkir)}</span>
                  </div>
                )}

                <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-extrabold">
                  <span>Total</span>
                  <span className="text-blue-600">{rupiah(pesanan.total)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
