"use client";

import { useEffect, useState } from "react";
import { bacaFavorit, ubahFavorit } from "@/lib/favorit";

type Props = {
  id: number;
};

export default function TombolFavorit({ id }: Props) {
  const [aktif, setAktif] = useState(false);

  useEffect(() => {
    const perbarui = () => {
      setAktif(bacaFavorit().includes(id));
    };

    perbarui();

    window.addEventListener("favorit-berubah", perbarui);
    window.addEventListener("storage", perbarui);

    return () => {
      window.removeEventListener("favorit-berubah", perbarui);
      window.removeEventListener("storage", perbarui);
    };
  }, [id]);

  function klikFavorit() {
    ubahFavorit(id);
    setAktif(bacaFavorit().includes(id));
  }

  return (
    <button
      type="button"
      onClick={klikFavorit}
      className={`rounded-xl px-5 py-3 font-bold transition ${
        aktif
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {aktif ? "♥ Favorit" : "♡ Tambah favorit"}
    </button>
  );
}
