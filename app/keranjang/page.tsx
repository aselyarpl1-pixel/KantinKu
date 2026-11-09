"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { menu, rupiah } from "@/data/menu";
import { simpanKeranjang, type ItemKeranjang } from "@/lib/keranjang";

type Pesanan = {
  id: number;
  tanggal: string;
  nama: string;
  kelas: string;
  caraAmbil: string;
  metodePembayaran: string;
  items: {
    nama: string;
    jumlah: number;
    harga: number;
    subtotal: number;
  }[];
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

function berlangganan(callback: () => void) {
  window.addEventListener("keranjang-berubah", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("keranjang-berubah", callback);
    window.removeEventListener("storage", callback);
  };
}

function ambilDataKeranjang() {
  return localStorage.getItem("keranjang") || "[]";
}

function ambilDataServer() {
  return "[]";
}

export default function KeranjangPage() {
  const dataKeranjang = useSyncExternalStore(
    berlangganan,
    ambilDataKeranjang,
    ambilDataServer,
  );

  let keranjang: ItemKeranjang[] = [];

  try {
    keranjang = JSON.parse(dataKeranjang);
  } catch {
    keranjang = [];
  }

  const [kodePromo, setKodePromo] = useState("");
  const [promoAktif, setPromoAktif] = useState(false);
  const [pesanPromo, setPesanPromo] = useState("");

  const [caraAmbil, setCaraAmbil] = useState("sendiri");
  const [nama, setNama] = useState("");
  const [kelas, setKelas] = useState("");

  const [pesan, setPesan] = useState("");
  const [pesananPembayaran, setPesananPembayaran] = useState<Pesanan | null>(
    null,
  );

  const [metodePembayaran, setMetodePembayaran] = useState("QRIS");
  const [struk, setStruk] = useState<Pesanan | null>(null);

  // Memperbarui data keranjang
  function perbarui(data: ItemKeranjang[]) {
    simpanKeranjang(data);
    setPesananPembayaran(null);
    setPesan("");
  }

  // Menambah jumlah barang
  function tambah(id: number) {
    const data = keranjang.map((item) => {
      if (item.id !== id) return item;

      const menuDipilih = menu.find((m) => m.id === id);

      if (!menuDipilih || item.jumlah >= menuDipilih.stok) {
        return item;
      }

      return {
        ...item,
        jumlah: item.jumlah + 1,
      };
    });

    perbarui(data);
  }

  // Mengurangi jumlah barang
  function kurang(id: number) {
    const data = keranjang.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          jumlah: Math.max(1, item.jumlah - 1),
        };
      }

      return item;
    });

    perbarui(data);
  }

  // Menghapus barang dari keranjang
  function hapus(id: number) {
    perbarui(keranjang.filter((item) => item.id !== id));
  }

  // Mengambil data menu dari keranjang
  const daftar = keranjang
    .map((item) => {
      const dataMenu = menu.find((m) => m.id === item.id);

      return dataMenu
        ? {
            ...dataMenu,
            jumlah: item.jumlah,
            subtotal: dataMenu.harga * item.jumlah,
          }
        : null;
    })
    .filter((item) => item !== null);

  // Menghitung subtotal
  const subtotal = daftar.reduce((total, item) => total + item.subtotal, 0);

  // Menghitung diskon promo
  const diskon =
    promoAktif && subtotal >= 20000 ? Math.round(subtotal * 0.1) : 0;

  // Menghitung ongkir dan total
  const ongkir = caraAmbil === "antar" ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  // Menggunakan kode promo
  function pakaiPromo() {
    if (kodePromo.trim().toUpperCase() !== "HEMAT10") {
      setPromoAktif(false);
      setPesanPromo("Kode promo tidak dikenal.");
      return;
    }

    if (subtotal < 20000) {
      setPromoAktif(false);
      setPesanPromo("Promo HEMAT10 butuh belanja minimal Rp 20.000.");
      return;
    }

    setPromoAktif(true);
    setPesanPromo("Promo HEMAT10 dipakai: diskon 10%.");
  }

  // Tahap 1: Membuka card pembayaran
  function pesanSekarang(idPesanan: number, tanggalPesanan: string) {
    setPesan("");

    if (nama.trim().length < 3) {
      setPesan("Nama pemesan minimal 3 huruf.");
      return;
    }

    if (caraAmbil === "antar" && kelas.trim().length < 3) {
      setPesan("Kelas wajib diisi minimal 3 karakter.");
      return;
    }

    if (daftar.length === 0) {
      setPesan("Keranjang masih kosong.");
      return;
    }

    const pesanan: Pesanan = {
      id: idPesanan,
      tanggal: tanggalPesanan,
      nama: nama.trim(),
      kelas: caraAmbil === "antar" ? kelas.trim() : "-",
      caraAmbil,
      metodePembayaran,
      items: daftar.map((item) => ({
        nama: item.nama,
        jumlah: item.jumlah,
        harga: item.harga,
        subtotal: item.subtotal,
      })),
      subtotal,
      diskon,
      ongkir,
      total,
    };

    setPesananPembayaran(pesanan);
  }

  // Tahap 2: Konfirmasi pembayaran
  function konfirmasiPembayaran() {
    if (!pesananPembayaran) return;

    const pesanan: Pesanan = {
      ...pesananPembayaran,
      metodePembayaran,
    };

    let riwayat: Pesanan[] = [];

    try {
      riwayat = JSON.parse(localStorage.getItem("riwayat") || "[]");
    } catch {
      riwayat = [];
    }

    // Menyimpan pesanan ke riwayat
    localStorage.setItem("riwayat", JSON.stringify([pesanan, ...riwayat]));

    // Memberi tahu halaman riwayat bahwa data berubah
    window.dispatchEvent(new Event("riwayat-berubah"));

    // Mengosongkan keranjang secara otomatis
    // Event keranjang-berubah akan memperbarui tampilan
    simpanKeranjang([]);

    // Menutup card pembayaran
    setPesananPembayaran(null);

    // Menampilkan struk pembayaran
    setStruk(pesanan);

    // Mengatur ulang formulir
    setKodePromo("");
    setPromoAktif(false);
    setPesanPromo("");
    setNama("");
    setKelas("");
    setCaraAmbil("sendiri");
    setMetodePembayaran("QRIS");
  }

  return (
    <section className="mx-auto min-h-screen max-w-5xl bg-slate-50 px-4 py-10">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
          🛒 KantinKu
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-slate-900 md:text-4xl">
          Keranjang Belanja
        </h1>

        <p className="mt-2 text-slate-500">
          Periksa pesananmu sebelum melakukan pembayaran.
        </p>
      </div>

      {/* STRUK BERHASIL */}
      {struk && (
        <div className="mx-auto mb-8 max-w-2xl rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl">✅</span>
            </div>

            <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
              Terima kasih, {struk.nama}!
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pesananmu berhasil diproses.
            </p>
          </div>

          {/* GARIS PUTUS-PUTUS */}
          <div className="my-6 border-t-2 border-dashed border-slate-200" />

          {/* DAFTAR MENU */}
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Detail Pesanan
            </p>

            {struk.items.map((item, index) => (
              <div key={index} className="flex justify-between gap-3 text-sm">
                <span className="text-slate-700">
                  {item.nama} x{item.jumlah}
                </span>
                <span className="font-semibold text-slate-900">
                  {rupiah(item.subtotal)}
                </span>
              </div>
            ))}
          </div>

          {/* GARIS PUTUS-PUTUS */}
          <div className="my-6 border-t-2 border-dashed border-slate-200" />

          {/* RINGKASAN */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal</span>
              <span className="font-semibold text-slate-900">
                {rupiah(struk.subtotal)}
              </span>
            </div>

            {struk.diskon > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Diskon</span>
                <span className="font-semibold">-{rupiah(struk.diskon)}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-slate-500">Pengambilan</span>
              <span className="font-semibold text-slate-900">
                {struk.caraAmbil === "antar"
                  ? `Antar ke ${struk.kelas} (${rupiah(struk.ongkir)})`
                  : "Diambil sendiri di kantin"}
              </span>
            </div>

            <div className="flex justify-between border-t border-slate-200 pt-3 text-lg font-extrabold">
              <span className="text-slate-900">Total bayar</span>
              <span className="text-green-600">{rupiah(struk.total)}</span>
            </div>
          </div>

          <Link
            href="/riwayat"
            className="mt-6 block rounded-xl bg-green-600 px-5 py-3 text-center font-bold text-white transition hover:bg-green-700"
          >
            Lihat Riwayat Pesanan →
          </Link>
        </div>
      )}

      {/* KERANJANG KOSONG */}
      {daftar.length === 0 ? (
        !struk && (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-4 text-xl font-bold text-slate-900">
              Keranjang masih kosong.
            </h2>

            <p className="mt-2 text-slate-500">
              Silakan pilih menu terlebih dahulu.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Lihat Menu
            </Link>
          </div>
        )
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* DAFTAR BARANG */}
          <div className="space-y-4 lg:col-span-2">
            {daftar.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-slate-900">
                      {item.nama}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {rupiah(item.harga)} / porsi
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Stok: {item.stok}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => kurang(item.id)}
                        disabled={item.jumlah <= 1}
                        className="size-9 rounded-lg bg-slate-200 font-bold text-slate-700 transition hover:bg-slate-300 disabled:opacity-40"
                      >
                        -
                      </button>

                      <span className="min-w-8 text-center font-bold text-slate-900">
                        {item.jumlah}
                      </span>

                      <button
                        type="button"
                        onClick={() => tambah(item.id)}
                        disabled={item.jumlah >= item.stok}
                        className="size-9 rounded-lg bg-blue-600 font-bold text-white transition hover:bg-blue-700 disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-blue-600">
                        {rupiah(item.subtotal)}
                      </span>

                      <button
                        type="button"
                        onClick={() => hapus(item.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-200"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RINGKASAN PESANAN */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Ringkasan Pesanan
            </h2>

            {/* PROMO */}
            <div className="mt-5">
              <label className="mb-2 block font-semibold">Kode Promo</label>

              <div className="flex gap-2">
                <input
                  value={kodePromo}
                  onChange={(e) => setKodePromo(e.target.value)}
                  placeholder="Masukkan kode promo"
                  className="min-w-0 flex-1 rounded-lg border border-slate-300 p-3"
                />

                <button
                  type="button"
                  onClick={pakaiPromo}
                  className="rounded-lg bg-blue-600 px-4 font-semibold text-white hover:bg-blue-700"
                >
                  Pakai
                </button>
              </div>

              {pesanPromo && (
                <p className="mt-2 text-sm text-blue-600">{pesanPromo}</p>
              )}
            </div>

            {/* CARA AMBIL */}
            <div className="mt-6">
              <p className="mb-3 font-semibold">Cara Ambil</p>

              <label className="mb-3 flex items-center gap-2">
                <input
                  type="radio"
                  name="caraAmbil"
                  checked={caraAmbil === "sendiri"}
                  onChange={() => setCaraAmbil("sendiri")}
                />
                Ambil sendiri
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="caraAmbil"
                  checked={caraAmbil === "antar"}
                  onChange={() => setCaraAmbil("antar")}
                />
                Diantar (+Rp 2.000)
              </label>

              {caraAmbil === "antar" && (
                <div className="mt-4">
                  <label className="mb-2 block font-semibold">Kelas</label>

                  <input
                    value={kelas}
                    onChange={(e) => setKelas(e.target.value)}
                    placeholder="Contoh: XII RPL 1"
                    className="w-full rounded-lg border border-slate-300 p-3"
                  />
                </div>
              )}
            </div>

            {/* NAMA PEMESAN */}
            <div className="mt-6">
              <label className="mb-2 block font-semibold">Nama Pemesan</label>

              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama"
                className="w-full rounded-lg border border-slate-300 p-3"
              />
            </div>

            {/* TOTAL */}
            <div className="mt-6 space-y-3 border-t border-slate-200 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{rupiah(subtotal)}</span>
              </div>

              {diskon > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon</span>
                  <span>-{rupiah(diskon)}</span>
                </div>
              )}

              {caraAmbil === "antar" && (
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span>{rupiah(ongkir)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-slate-200 pt-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">{rupiah(total)}</span>
              </div>
            </div>

            {pesan && (
              <p className="mt-4 text-sm font-semibold text-red-600">{pesan}</p>
            )}

            {/* TOMBOL PESAN SEKARANG */}
            <button
              type="button"
              onClick={() =>
                pesanSekarang(Date.now(), new Date().toLocaleString("id-ID"))
              }
              className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
            >
              Pesan Sekarang
            </button>
          </div>
        </div>
      )}

      {/* CARD PEMBAYARAN */}
      {pesananPembayaran && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-4">
          <div className="my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-6">
            {/* HEADER PEMBAYARAN */}
            <div className="relative text-center">
              <button
                type="button"
                onClick={() => setPesananPembayaran(null)}
                className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Tutup"
              >
                ✕
              </button>

              <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
                💳
              </div>

              <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
                Pembayaran
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Periksa pesanan dan pilih metode pembayaran.
              </p>
            </div>

            {/* TOTAL BAYAR */}
            <div className="mt-5 rounded-2xl bg-blue-50 p-4 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Total Pembayaran
              </p>

              <p className="mt-1 text-3xl font-black text-blue-700">
                {rupiah(pesananPembayaran.total)}
              </p>
            </div>

            {/* DETAIL PESANAN */}
            <div className="mt-5 space-y-2 rounded-2xl border border-slate-200 p-4">
              {pesananPembayaran.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span className="text-slate-600">
                    {item.nama} x{item.jumlah}
                  </span>
                  <span className="font-semibold text-slate-900">
                    {rupiah(item.subtotal)}
                  </span>
                </div>
              ))}

              <div className="space-y-1.5 border-t border-slate-200 pt-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {rupiah(pesananPembayaran.subtotal)}
                  </span>
                </div>

                {pesananPembayaran.diskon > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon</span>
                    <span className="font-semibold">
                      -{rupiah(pesananPembayaran.diskon)}
                    </span>
                  </div>
                )}

                {pesananPembayaran.ongkir > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ongkir</span>
                    <span className="font-semibold text-slate-900">
                      {rupiah(pesananPembayaran.ongkir)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="mt-5">
              <h3 className="mb-2 text-sm font-bold text-slate-900">
                Pilih Metode Pembayaran
              </h3>

              <div className="space-y-2">
                {[
                  {
                    nama: "QRIS",
                    ikon: "📱",
                    deskripsi: "Pembayaran melalui QRIS",
                  },
                  {
                    nama: "Transfer Bank",
                    ikon: "🏦",
                    deskripsi: "Transfer melalui bank",
                  },
                  {
                    nama: "Tunai",
                    ikon: "💵",
                    deskripsi: "Bayar langsung di kantin",
                  },
                ].map((metode) => (
                  <label
                    key={metode.nama}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-3 transition ${
                      metodePembayaran === metode.nama
                        ? "border-blue-500 bg-blue-50"
                        : "border-slate-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodePembayaran"
                      value={metode.nama}
                      checked={metodePembayaran === metode.nama}
                      onChange={() => setMetodePembayaran(metode.nama)}
                      className="sr-only"
                    />

                    <span className="text-2xl">{metode.ikon}</span>

                    <span className="flex-1">
                      <span className="block text-sm font-bold text-slate-900">
                        {metode.nama}
                      </span>

                      <span className="text-xs text-slate-500">
                        {metode.deskripsi}
                      </span>
                    </span>

                    <span
                      className={`flex size-5 items-center justify-center rounded-full border-2 transition ${
                        metodePembayaran === metode.nama
                          ? "border-blue-600 bg-blue-600"
                          : "border-slate-300"
                      }`}
                    >
                      {metodePembayaran === metode.nama && (
                        <span className="size-2 rounded-full bg-white" />
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* INFO PEMESAN */}
            <div className="mt-5 space-y-1.5 rounded-2xl bg-slate-50 p-4 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Nama pemesan</span>
                <span className="text-right font-semibold text-slate-900">
                  {pesananPembayaran.nama}
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Pengambilan</span>
                <span className="text-right font-semibold text-slate-900">
                  {pesananPembayaran.caraAmbil === "antar"
                    ? `Antar ke ${pesananPembayaran.kelas}`
                    : "Ambil sendiri"}
                </span>
              </div>
            </div>

            {/* KONFIRMASI PEMBAYARAN */}
            <button
              type="button"
              onClick={konfirmasiPembayaran}
              className="mt-5 w-full rounded-xl bg-green-600 px-4 py-3.5 text-sm font-bold text-white shadow transition hover:bg-green-700"
            >
              Konfirmasi Pembayaran
            </button>

            {/* KEMBALI */}
            <button
              type="button"
              onClick={() => setPesananPembayaran(null)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
            >
              Kembali ke Keranjang
            </button>

            <p className="mt-3 text-center text-[10px] text-slate-400">
              Simulasi pembayaran untuk aplikasi KantinKu. Tidak ada transaksi
              uang sungguhan.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
