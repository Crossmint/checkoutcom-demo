"use client"

import { Checkout } from '../Checkout';

export default function CheckoutPage() {

  const checkoutParams = {
    walletRecipient: "2JcYcPS8cVE7akPW3HySyDU3keQVCZPsmtwLCrAEJb1C", // This should be replaced with the actual wallet address
    amountUSD: "1", // Default amount in USD
    maxSlippageBPS: "500", // 5% slippage
    receiptEmail: "veniamin+3000@paella.dev"
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Checkout {...checkoutParams} />
    </main>
  );
} 