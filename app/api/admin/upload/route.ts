import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const BUCKET = "content";

export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const cookie = req.cookies.get("admin_tok")?.value;
    if (!cookie) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const creator = (formData.get("creator") as string) ?? "misc";

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${creator}/${Date.now()}.${ext}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(path, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET)
      .getPublicUrl((data as { path: string }).path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error("[admin/upload]", err);
    return NextResponse.json({ error: "Erro interno no upload." }, { status: 500 });
  }
}
