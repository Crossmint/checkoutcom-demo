"use client"

import { useEffect, useState } from 'react';
import Script from 'next/script';
import Image from 'next/image';
import { useOrder } from './hooks/useOrder';
import { Spinner } from './components/ui/Spinner';

export interface EmbeddedCheckoutParams {
    walletRecipient: string;
    amountUSD: string;
    maxSlippageBPS: string;
    receiptEmail: string;
}

export function Checkout(embeddedCheckoutParameters: EmbeddedCheckoutParams) {

    const { createOrder, order } = useOrder();
    const [isCheckoutReady, setIsCheckoutReady] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [scriptError, setScriptError] = useState<string | null>(null);

    useEffect(() => {
        async function initiateOrder() {
            try {
                await createOrder(embeddedCheckoutParameters);
            } catch (error) {
                console.error("Failed to create order:", error);
                setScriptError("Failed to create order. Please try again.");
            }
        }

        initiateOrder();
    }, [embeddedCheckoutParameters, createOrder]);

    useEffect(() => {
        if (!order || !isScriptLoaded) return;

        console.log("order", order);

        const initializeCheckout = async () => {
            try {
                if (typeof window.CheckoutWebComponents !== 'function') {
                    setScriptError('CheckoutWebComponents not loaded properly. Please refresh the page.');
                    return;
                }

                const checkout = await window.CheckoutWebComponents({
                    appearance: {
                        colorBorder: "#FFFFFF",
                        colorAction: '#060735',
                        borderRadius: ["8px", "50px"],
                    },
                    publicKey: order.payment.preparation.checkoutcomPublicKey,
                    environment: "sandbox",
                    locale: "en-US",
                    paymentSession: order.payment.preparation.checkoutcomPaymentSession,
                    onReady: () => {
                        console.log("Flow is ready");
                        setIsCheckoutReady(true);
                    },
                    onPaymentCompleted: (component: unknown, paymentResponse: { id: string }) => {
                        console.log("Payment completed with ID:", paymentResponse.id);
                    },
                    onChange: (component: { type: string, isValid: () => boolean }) => {
                        console.log(`Component ${component.type} validity changed:`, component.isValid());
                    },
                    onError: (component: { type: string }, error: Error) => {
                        console.error("Payment error:", error, "Component:", component.type);
                        setScriptError(`Payment error: ${error.message}`);
                    },
                });

                const flowComponent = checkout.create("googlepay");

                // Check if card component is available before mounting
                const isAvailable = await flowComponent.isAvailable();
                if (!isAvailable) {
                    setScriptError('Card payment is not available in your region');
                    return;
                }

                const container = document.getElementById("flow-container");
                if (container) {
                    flowComponent.mount(container);
                } else {
                    setScriptError('Could not find flow container element');
                }
            } catch (error) {
                console.error("Error initializing checkout:", error);
                setScriptError(`Error initializing checkout: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        };

        initializeCheckout();
    }, [order, isScriptLoaded]);

    if (!order || scriptError) {
        return (
            <div className="w-full max-w-[400px] sm:max-w-[600px] md:max-w-[800px] mx-auto px-6 md:px-10">
                <div className="bg-white p-6 md:p-10 rounded-lg">
                    <div className="flex flex-col items-center justify-center py-10">
                        {scriptError ? (
                            <div className="text-red-500 text-center">
                                <p>{scriptError}</p>
                                <button
                                    type="button"
                                    onClick={() => window.location.reload()}
                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Retry
                                </button>
                            </div>
                        ) : (
                            <>
                                <Spinner size="large" />
                                <p className="text-muted-foreground mt-4">Loading checkout...</p>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-[400px] sm:max-w-[600px] md:max-w-[800px] mx-auto px-6 md:px-10">
            <div className="bg-white p-6 md:p-10 rounded-lg">
                <Script
                    src="https://checkout-web-components.checkout.com/index.js"
                    strategy="afterInteractive"
                    onLoad={() => {
                        console.log("Checkout.com script loaded");
                        setIsScriptLoaded(true);
                    }}
                    onError={(e) => {
                        console.error("Error loading Checkout.com script:", e);
                        setScriptError("Failed to load Checkout.com script. Please refresh the page.");
                    }}
                />
                <div className="flex-grow">
                    <div id="flow-container" className="w-full" />
                </div>
                {isCheckoutReady && (
                    <div className="text-center mt-4 text-sm" style={{ color: 'rgb(102, 102, 102)' }}>
                        <p>By continuing, you accept <Image src="/crossmint_logo.svg" alt="Crossmint" width={16} height={16} className="inline-block mx-1" /> <a href="https://www.crossmint.com/legal/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-800">Crossmint&apos;s terms</a></p>
                    </div>
                )}
            </div>
        </div>
    );
}

declare global {
    interface Window {
        CheckoutWebComponents: (config: unknown) => {
            create: (type: string) => {
                mount: (element: HTMLElement) => void;
                isAvailable: () => Promise<boolean>;
            };
        };
    }
}