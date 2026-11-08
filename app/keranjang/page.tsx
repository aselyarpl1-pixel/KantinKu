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
      setPesanPromo("Promo HEMAT10 membutuhkan belanja minimal Rp 20.000.");
      return;
    }

    setPromoAktif(true);
    setPesanPromo("Promo HEMAT10 berhasil digunakan!");
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
    <section className="mx-auto min-h-screen max-w-5xl px-4 py-10">
      {/* HEADER */}
      <div className="mb-8 text-center">
        <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
          🛒 KantinKu
        </span>

        <h1 className="mt-5 text-3xl font-extrabold text-gray-900 md:text-4xl">
          Keranjang Belanja
        </h1>

        <p className="mt-2 text-gray-500">
          Periksa pesananmu sebelum melakukan pembayaran.
        </p>
      </div>

      {/* STRUK BERHASIL */}
      {struk && (
        <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-6">
          <div className="text-center">
            <span className="text-5xl">✅</span>

            <h2 className="mt-3 text-2xl font-extrabold text-green-700">
              Pesanan Berhasil!
            </h2>

            <p className="mt-2 text-gray-600">Terima kasih, {struk.nama}.</p>
          </div>

          <div className="mt-5 space-y-2 border-t border-green-200 pt-4">
            {struk.items.map((item, index) => (
              <div key={index} className="flex justify-between gap-3">
                <span>
                  {item.nama} x{item.jumlah}
                </span>

                <span className="font-semibold">{rupiah(item.subtotal)}</span>
              </div>
            ))}

            <div className="border-t border-green-200 pt-3">
              <p>Metode pembayaran: {struk.metodePembayaran}</p>

              <p className="mt-2 text-xl font-extrabold text-green-700">
                Total: {rupiah(struk.total)}
              </p>
            </div>
          </div>

          <Link
            href="/riwayat"
            className="mt-5 block rounded-xl bg-green-600 px-5 py-3 text-center font-bold text-white hover:bg-green-700"
          >
            Lihat Riwayat Pesanan →
          </Link>
        </div>
      )}

      {/* KERANJANG KOSONG */}
      {daftar.length === 0 ? (
        !struk && (
          <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="text-6xl">🛒</div>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              Keranjang Masih Kosong
            </h2>

            <p className="mt-2 text-gray-500">
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
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">
                      {item.nama}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      {rupiah(item.harga)} / item
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Stok: {item.stok}
                    </p>

                    <p className="mt-3 font-bold text-blue-600">
                      {rupiah(item.subtotal)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => kurang(item.id)}
                      disabled={item.jumlah <= 1}
                      className="size-9 rounded-lg bg-gray-200 font-bold disabled:opacity-40"
                    >
                      -
                    </button>

                    <span className="min-w-8 text-center font-bold">
                      {item.jumlah}
                    </span>

                    <button
                      type="button"
                      onClick={() => tambah(item.id)}
                      disabled={item.jumlah >= item.stok}
                      className="size-9 rounded-lg bg-blue-600 font-bold text-white disabled:opacity-40"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      onClick={() => hapus(item.id)}
                      className="ml-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RINGKASAN PESANAN */}
          <div className="h-fit rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800">
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
                  className="min-w-0 flex-1 rounded-lg border border-gray-300 p-3"
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
                    className="w-full rounded-lg border border-gray-300 p-3"
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
                className="w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            {/* TOTAL */}
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-5">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{rupiah(subtotal)}</span>
              </div>

              {diskon > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Diskon 10%</span>
                  <span>-{rupiah(diskon)}</span>
                </div>
              )}

              {caraAmbil === "antar" && (
                <div className="flex justify-between">
                  <span>Ongkir</span>
                  <span>{rupiah(ongkir)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
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
          <div className="my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-5">
            {/* HEADER PEMBAYARAN */}
            <div className="text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-blue-100 text-2xl">
                💳
              </div>

              <h2 className="mt-2 text-xl font-extrabold text-gray-900">
                Pembayaran
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Periksa total pesanan dan pilih metode pembayaran.
              </p>
            </div>

            {/* TOTAL BAYAR */}
            <div className="mt-4 rounded-xl bg-blue-50 p-3 text-center">
              <p className="text-xs font-semibold text-gray-500">
                Total Pembayaran
              </p>

              <p className="mt-1 text-2xl font-black text-blue-700">
                {rupiah(pesananPembayaran.total)}
              </p>
            </div>

            {/* METODE PEMBAYARAN */}
            <div className="mt-4">
              <h3 className="mb-2 text-sm font-bold text-gray-800">
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
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 transition ${
                      metodePembayaran === metode.nama
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="metodePembayaran"
                      value={metode.nama}
                      checked={metodePembayaran === metode.nama}
                      onChange={() => setMetodePembayaran(metode.nama)}
                    />

                    <span className="text-xl">{metode.ikon}</span>

                    <span className="flex-1">
                      <span className="block text-sm font-bold text-gray-800">
                        {metode.nama}
                      </span>

                      <span className="text-xs text-gray-500">
                        {metode.deskripsi}
                      </span>
                    </span>

                    {metodePembayaran === metode.nama && (
                      <span className="font-bold text-blue-600">✓</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* RINGKASAN PEMBAYARAN */}
            <div className="mt-4 space-y-2 border-t border-gray-200 pt-3 text-xs">
              <div className="flex justify-between gap-3">
                <span>Nama pemesan</span>
                <span className="text-right font-semibold">
                  {pesananPembayaran.nama}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Jumlah jenis menu</span>
                <span className="font-semibold">
                  {pesananPembayaran.items.length} menu
                </span>
              </div>

              <div className="flex justify-between gap-3">
                <span>Cara pengambilan</span>
                <span className="text-right font-semibold">
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
              className="mt-4 w-full rounded-lg bg-green-600 px-4 py-3 text-sm font-bold text-white shadow transition hover:bg-green-700"
            >
              Konfirmasi Pembayaran
            </button>

            {/* KEMBALI */}
            <button
              type="button"
              onClick={() => setPesananPembayaran(null)}
              className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-100"
            >
              Kembali ke Keranjang
            </button>

            <p className="mt-3 text-center text-[10px] text-gray-400">
              Simulasi pembayaran untuk aplikasi KantinKu. Tidak ada transaksi
              uang sungguhan.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
