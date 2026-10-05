import { NextResponse } from "next/server";
import { PRODUCT_CONFIG } from "@/lib/product-config";

const EXPECTED_AMOUNT = 0.5;
const PRODUCT_ID = PRODUCT_CONFIG.PRODUCT_6aa2d8e3dc5c30a6ad6e066e;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { productId?: unknown; paymentId?: unknown; txid?: unknown; amount?: unknown } | null;
  if (body?.productId !== PRODUCT_ID || body.amount !== EXPECTED_AMOUNT || typeof body.paymentId !== "string" || typeof body.txid !== "string" || !body.paymentId || !body.txid) {
    return NextResponse.json({ verified: false, error: "Invalid Nigeria mat payment" }, { status: 400 });
  }
  return NextResponse.json({ verified: true, productId: PRODUCT_ID, paymentId: body.paymentId, txid: body.txid, amount: EXPECTED_AMOUNT });
}
