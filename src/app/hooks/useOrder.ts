"use client";

import { useState, useCallback, useEffect } from 'react';

interface Order {
    clientSecret: string;
    orderId: string;
    payment: {
      preparation: {
        checkoutcomPaymentSession: any;
        checkoutcomPublicKey: string;
      };
    };
}

type DeliveryStatus = 'awaiting-payment' | 'in-progress' | 'failed' | 'completed';

interface OrderStatus {
  orderId: string;
  status: string;
  deliveryStatus: DeliveryStatus;
}

interface CreateOrderParams {
  walletRecipient: string;
  amountUSD: string;
  receiptEmail: string;
  maxSlippageBPS: string;
}

const POLLING_INTERVAL = 25000; // 25 seconds

const isValidDeliveryStatus = (status: string): status is DeliveryStatus => {
  return ['awaiting-payment', 'in-progress', 'failed', 'completed'].includes(status);
};

export function useOrder() {
  const [order, setOrder] = useState<Order | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const getOrderStatus = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`/api/headless?orderId=${orderId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order status");
      }

      const orderData = await response.json();
      const deliveryStatus = orderData.order.lineItems?.[0]?.delivery?.status;
      
      if (!isValidDeliveryStatus(deliveryStatus)) {
        throw new Error(`Invalid delivery status: ${deliveryStatus}`);
      }

      setOrderStatus({
        orderId,
        status: orderData.order.phase,
        deliveryStatus
      });

      return deliveryStatus;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch order status");
      setError(error);
      return null;
    }
  }, []);

  const createOrder = useCallback(async (params: CreateOrderParams) => {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append("embeddedCheckoutParameters", JSON.stringify(params));

      const response = await fetch(`/api/headless?${searchParams.toString()}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const newOrder = await response.json();
      console.log("API Response:", newOrder); // Debug log to see full response structure
      
      const deliveryStatus = newOrder.order.lineItems?.[0]?.delivery?.status;
      
      if (!isValidDeliveryStatus(deliveryStatus)) {
        throw new Error(`Invalid delivery status: ${deliveryStatus}`);
      }

      const order = {
        clientSecret: newOrder.clientSecret, // Changed back to newOrder.clientSecret
        orderId: newOrder.order.orderId,
        payment: newOrder.order.payment,
      }

      console.log("Created order with:", {
        orderId: order.orderId,
        clientSecret: order.clientSecret,
        fullOrder: order, // Debug log to see full order object
      });

      setOrder(order);
      setOrderStatus({
        orderId: order.orderId,
        status: newOrder.order.phase,
        deliveryStatus
      });
      setError(null);
      setIsPolling(true);
      return order;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error occurred");
      setError(error);
      throw error;
    }
  }, []);

  const refreshOrder = useCallback(async (orderId: string, clientSecret: string) => {
    try {
      const response = await fetch(`/api/headless/refresh?orderId=${orderId}&clientSecret=${clientSecret}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to refresh order");
      }

      const refreshedOrder = await response.json();
      const deliveryStatus = refreshedOrder.lineItems?.[0]?.delivery?.status;
      
      if (!isValidDeliveryStatus(deliveryStatus)) {
        throw new Error(`Invalid delivery status: ${deliveryStatus}`);
      }

      setOrderStatus({
        orderId,
        status: refreshedOrder.phase,
        deliveryStatus
      });

      return deliveryStatus;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to refresh order");
      setError(error);
      return null;
    }
  }, []);

  useEffect(() => {
    let pollInterval: NodeJS.Timeout | null = null;

    console.log("Polling effect triggered with:", {
      isPolling,
      orderId: order?.orderId,
      clientSecret: order?.clientSecret,
    });

    if (isPolling && order?.orderId && order?.clientSecret) {
      console.log("Starting polling interval");
      pollInterval = setInterval(async () => {
        console.log("Polling: refreshing order", order.orderId);
        const status = await refreshOrder(order.orderId, order.clientSecret);
        console.log("Polling: received status", status);
        
        if (status === 'failed' || status === 'completed') {
          console.log("Polling: stopping due to final status", status);
          setIsPolling(false);
        }
      }, POLLING_INTERVAL);

      // Immediate first refresh
      refreshOrder(order.orderId, order.clientSecret).then(status => {
        console.log("Initial refresh status:", status);
      });
    }

    return () => {
      if (pollInterval) {
        console.log("Cleaning up polling interval");
        clearInterval(pollInterval);
      }
    };
  }, [isPolling, order?.orderId, order?.clientSecret, refreshOrder]);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  return {
    order,
    orderStatus,
    error,
    createOrder,
    setOrder,
    stopPolling,
    isPolling
  };
} 