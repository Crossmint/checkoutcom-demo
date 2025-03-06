"use client"


import {
    CrossmintEmbeddedCheckout,
    useCrossmintCheckout,
} from "@crossmint/client-sdk-react-ui";
import React from "react";
import { useEffect } from "react";

function CheckoutScreen() {
    const { order } = useCrossmintCheckout();

    useEffect(() => {
        console.log("CheckoutScreen rendered");
        console.log("Order:", order);
    }, [order]);

    return (
        <div className="w-full h-screen bg-white">
            <h1 className="text-2xl font-bold text-center p-4">Checkout Demo</h1>
            <CrossmintEmbeddedCheckout
                // lineItems={{
                //   collectionLocator: `crossmint:7d214d4a-7bb1-49a1-b196-307a7849a6d0`,

                //   callData: {},
                // }}
                // recipient={{
                //   email: "veniamin+3000@paella.dev",
                // }}
                recipient={{
                    email: "veniamin+3000@paella.dev",
                }}
                lineItems={{
                    collectionLocator: "crossmint:eb280fb8-187f-456c-9831-34ce74e4e80f",
                    callData: {
                        quantity: "1",
                    },
                    executionParameters: {
                        mode: "exact-in",
                    },
                } as any}
                payment={
                    {
                        method: "checkoutcom-flow",
                        crypto: {
                            enabled: true,
                        },
                        fiat: {
                            enabled: true,
                            allowedMethods: {
                                card: true, // Enable/disable credit cards
                                applePay: true, // Enable/disable Apple Pay
                                googlePay: true, // Enable/disable Google Pay
                            },
                        },
                        receiptEmail: "veniamin+3000@paella.dev",
                    } as any
                }
            />
        </div>
    );
}

export default CheckoutScreen;
