import { NextResponse } from "next/server";
import { menu } from "@/data/menu";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const idMenu = Number(id);

  const dataMenu = menu.find((item) => item.id === idMenu);

  if (!dataMenu) {
    return NextResponse.json(
      { pesan: "Menu tidak ditemukan" },
      { status: 404 },
    );
  }

  return NextResponse.json(dataMenu);
}
