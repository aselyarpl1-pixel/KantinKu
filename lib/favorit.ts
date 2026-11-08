export function bacaFavorit(): number[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(localStorage.getItem("favorit") || "[]");
  } catch {
    return [];
  }
}

export function simpanFavorit(data: number[]) {
  localStorage.setItem("favorit", JSON.stringify(data));

  window.dispatchEvent(new Event("favorit-berubah"));
}

export function ubahFavorit(id: number) {
  const favorit = bacaFavorit();

  const dataBaru = favorit.includes(id)
    ? favorit.filter((item) => item !== id)
    : [...favorit, id];

  simpanFavorit(dataBaru);
}
