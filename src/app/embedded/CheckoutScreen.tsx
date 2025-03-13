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
                recipient={{
                    walletAddress: "EbRQbwu6pzkZ1DgY8YX5wWqk4tqdoGHXzTL8th1PmzqP",
                }}
                lineItems={{
                    tokenLocator: "solana:6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
                    executionParameters: {
                        mode: "exact-in",
                        amount: "1",
                        maxSlippageBps: "500",
                    },
                }}
                payment={
                    {
                        method: "checkoutcom-flow",
                        crypto: {
                            enabled: true,
                        },
                        fiat: {
                            enabled: true,
                            allowedMethods: {
                                card: true,
                                applePay: true,
                                googlePay: true,
                            },
                        },
                        receiptEmail: "veniamin+3000@paella.dev",
                    } as any
                }
                appearance={{
                    // fonts: [{ cssSrc: "https://fonts.googleapis.com/css2?family=Sigmar&display=swap" }],
                    // variables: {
                    //     fontFamily: "Sigmar",
                    //     colors: {
                    //         // borderPrimary: "#000000",
                    //         // textPrimary: "#000000",
                    //         // accent: "#0074D9",
                    //     },
                    // },
                    // rules: {
                    //     Input: {
                    //         borderRadius: "50px",
                    //         font: {
                    //             family: "Sigmar",
                    //             size: "16px",
                    //             weight: "400",
                    //         },
                    //         colors: {
                    //             text: "rgb(15, 255, 143)",
                    //             // background: "#000000",
                    //             border: "#000000",
                    //             boxShadow: "none",
                    //             placeholder: "#000000",
                    //         },
                    //         hover: {
                    //             colors: {
                    //                 border: "#000000",
                    //             },
                    //         },
                    //         focus: {
                    //             colors: {
                    //                 border: "rgb(15, 255, 143)",
                    //                 boxShadow: "rgba(0, 0, 0, 0.07)",
                    //             },
                    //         },
                    //     },
                    // },
                } as any}
            />
        </div>
    );
}

export default CheckoutScreen;
