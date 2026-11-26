import { NextResponse } from "next/server";
import { asAnon, isDatabaseConfigured } from "@/lib/server/db";

/**
 * Tarea diaria (Vercel Cron, ver vercel.json): una consulta mínima a la base de datos
 * para que el proyecto gratuito de Supabase no se pause por inactividad.
 * Solo responde a Vercel, que envía «Authorization: Bearer CRON_SECRET».
 */
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  if (!isDatabaseConfigured()) return NextResponse.json({ ok: true, db: false });
  const [{ n }] = await asAnon((tx) => tx<{ n: number }[]>`select count(*)::int as n from public.store_catalog`);
  return NextResponse.json({ ok: true, productos: n, at: new Date().toISOString() });
}
