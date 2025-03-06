"use client"

import {
    CrossmintCheckoutProvider,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    CrossmintHostedCheckout,
    CrossmintProvider,
} from "@crossmint/client-sdk-react-ui";
import { useState } from "react";
import CheckoutScreen from "./CheckoutScreen";

function EmbeddedCheckout() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [orderIdentifier, setOrderIdentifier] = useState<string | undefined>(undefined);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function onEvent(event: { type: string; payload: any }) {
        console.log("Event received:", event.type);
        switch (event.type) {
            case "quote:status.changed": {
                const { quote } = event.payload;
                console.log("quote", quote);
                break;
            }
            case "payment:preparation.succeeded": {
                const { totalQuote } = event.payload;
                console.log("totalQuote", totalQuote);
                break;
            }
            case "payment:process.started": {
                console.log("payment:process.started");
                break;
            }
            case "payment:process.succeeded": {
                const { orderIdentifier } = event.payload;
                setOrderIdentifier(orderIdentifier);
                console.log("orderIdentifier", orderIdentifier);
                break;
            }
            case "payment:preparation.failed": {
                console.log("payment:preparation.failed", event.payload);
                break;
            }
            case "payment:process.rejected": {
                console.log("payment:process.rejected", event.payload);
                break;
            }
            case "payments:collection.unverified": {
                console.log("payments:collection.unverified", event.payload);
                break;
            }
            default:
                break;
        }
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <div style={{ width: "600px" }}>
                <CrossmintProvider
                    overrideBaseUrl="https://lat-mountain-russia-mae.trycloudflare.com"
                    apiKey="ck_development_2zbYiJ39eV3VQyGSWFamDE1ktGD4VPpdAjwAW3PA2nnMojQFafT97LUMXiKyy2HThsAkHD7xbiHbgSgB9f3aJQNR6rasHJkveMPaHWg6MzAgrjfDGeGG13AfmaJ3k2D61Bf28VXA6DKn7h1vdBwsRa3e1EM7cgAweRzfxDFvBLff3CG2wdZ6f9ffn9SGpkZdD6yCU8fvGYN2q1JhmMdTto4"
                >
                    <CrossmintCheckoutProvider>
                        <CheckoutScreen />
                    </CrossmintCheckoutProvider>
                </CrossmintProvider>
            </div>
        </div>
    );
}

export default EmbeddedCheckout;
