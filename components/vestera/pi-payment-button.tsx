"use client";

import { useState } from "react";
import { usePiAuth } from "@/contexts/pi-auth-context";
import { PRODUCT_CONFIG } from "@/lib/product-config";
import { Button, Card, PiMark } from "./ui";

const PRODUCT_ID = PRODUCT_CONFIG.PRODUCT_6aa2d8e3dc5c30a6ad6e066e;

type PaymentButtonProps = {
  purpose: "escrow" | "listing" | "checkout";
  className?: string;
  onVerified?: (paymentId: string, txid: string) => void;
};

export function PiPaymentButton({ purpose, className, onVerified }: PaymentButtonProps) {
  const { sdk, products, restoredPurchases } = usePiAuth();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const product = products?.find((item) => item.id === PRODUCT_ID);
  const quantity = restoredPurchases?.find((item) => item.productId === product?.slug)?.quantity ?? 0;

  const pay = async () => {
    if (!product || !sdk) {
      setMessage("Nigeria mat payment is not available yet. Please try again shortly.");
      return;
    }
    setBusy(true);
    setMessage(null);
    try {
      const result = await sdk.makePurchase(product.slug);
      if (!result.ok) throw new Error("Payment was not completed.");
      const response = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: result.productId, paymentId: result.paymentId, txid: result.txid, amount: product.price_in_pi }),
      });
      const verification = await response.json();
      if (!response.ok || !verification.verified) throw new Error("Payment verification could not be completed.");
      setMessage(`Payment confirmed. Reference ${result.txid.slice(0, 12)}…`);
      onVerified?.(result.paymentId, result.txid);
    } catch (error) {
      const code = (error as { code?: string })?.code;
      setMessage(code === "purchase_cancelled" ? "Payment cancelled." : code === "product_not_found" ? "Nigeria mat is unavailable." : "Payment could not be completed. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const label = purpose === "escrow" ? "Pay escrow deposit" : purpose === "listing" ? "Pay listing fee" : "Pay checkout total";
  return (
    <div className={className}>
      <Button variant="gold" className="w-full" disabled={busy || !product || !sdk} onClick={pay}>
        <PiMark /> {product ? `${label} · ${product.price_in_pi} Pi` : "Nigeria mat unavailable"}
      </Button>
      <p className="mt-1 text-center text-[11px] text-[var(--vst-faint-ink)]">
        {product ? `${product.name} · ${quantity > 0 ? `${quantity} restored` : "Pi Network payment"}` : "Product details are loading"}
      </p>
      {message ? <Card className="mt-2 p-2 text-center text-xs text-[var(--vst-muted-ink)]" role="status">{message}</Card> : null}
    </div>
  );
}

export function WalletConnectionButton() {
  const { login, isAuthenticated, username, isReady } = usePiAuth();
  const [status, setStatus] = useState<string | null>(null);

  const handleConnect = async () => {
    setStatus(null);
    try {
      await login();
      setStatus("Pi Wallet connected");
    } catch (err) {
      console.error(err);
      setStatus("Failed to connect Pi Wallet. Open in Pi Browser.");
    }
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle2 className="h-4 w-4" />
        <span>Connected as {username}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button onClick={handleConnect} disabled={!isReady} className="w-full">
        <Wallet className="mr-2 h-4 w-4" />
        Connect with Pi
      </Button>
      {status && <p className="text-xs text-muted-foreground">{status}</p>}
    </div>
  );
}

export function PiPaymentCard({ purpose }: { purpose: PaymentButtonProps["purpose"] }) {
  return <Card className="space-y-2 border-[var(--vst-gold)] bg-[var(--vst-gold-soft)] p-3"><p className="text-sm font-semibold text-[var(--vst-ink)]">Nigeria mat payment</p><PiPaymentButton purpose={purpose} /></Card>;
}
