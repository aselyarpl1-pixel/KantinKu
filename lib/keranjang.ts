export type ItemKeranjang = {
  id: number;
  jumlah: number;
};

export function bacaKeranjang(): ItemKeranjang[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("keranjang") || "[]");
  } catch {
    return [];
  }
}

export function simpanKeranjang(data: ItemKeranjang[]) {
  localStorage.setItem("keranjang", JSON.stringify(data));

  window.dispatchEvent(new Event("keranjang-berubah"));
}

export function bacaJumlahKeranjang(): number {
  return bacaKeranjang().reduce((total, item) => total + item.jumlah, 0);
}
