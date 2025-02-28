import type { EmbeddedCheckoutParams } from "@/app/Checkout";

export class HeadlessAPI {
	private baseUrl = "http://localhost:3000/api";
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

	async createOrder(embeddedCheckoutParameters: EmbeddedCheckoutParams) {
		const { walletRecipient, receiptEmail, amountUSD, maxSlippageBPS } =
			embeddedCheckoutParameters;
		const body = {
			recipient: {
				walletAddress: walletRecipient,
			},
			payment: {
				method: "checkoutcom-flow",
				receiptEmail: receiptEmail,
			},
			lineItems: {
				tokenLocator: "solana:6p6xgHyF7AeE6TZkSmFsko444wqoP15icUSqi2jfGiPN",
				executionParameters: {
					mode: "exact-in",
					amount: amountUSD,
					maxSlippageBps: maxSlippageBPS,
				},
			},
		};
		try {
			const response = await this.callApi("2022-06-09/orders", "POST", body);

			const parsed = await response.json();
			return parsed;
		} catch (error) {
			console.error("Error creating order:", error);
			throw error;
		}
	}

	async getOrder(orderId: string) {
		try {
			const response = await this.callApi(
				`2022-06-09/orders/${orderId}`,
				"GET",
				{},
			);
			const parsed = await response.json();
			return parsed;
		} catch (error) {
			console.error("Error getting order:", error);
			throw error;
		}
	}

	async refreshOrder(orderId: string, clientSecret: string) {
		try {
			const ancestorOrigins =
				typeof window !== "undefined" && window.location?.ancestorOrigins
					? Array.from(window.location.ancestorOrigins)
					: [];

			const response = await this.callApi(
				`2022-06-09/orders/${orderId}/refresh`,
				"POST",
				{},
				{
					authorization: `${clientSecret}`,
					"x-ancestor-origins": JSON.stringify(ancestorOrigins),
				},
			);
			const parsed = await response.json();
			return parsed;
		} catch (error) {
			console.error("Error refreshing quote:", error);
			throw error;
		}
	}

	private async callApi(
		path: string,
		method: string,
		body?: unknown,
		additionalHeaders: Record<string, string> = {},
	): Promise<Response> {
		const requestOptions: RequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				"x-api-key": this.apiKey,
				...additionalHeaders,
			},
		};

		if (method !== "GET" && body) {
			requestOptions.body = JSON.stringify(body);
		}

		return fetch(`${this.baseUrl}/${path}`, requestOptions);
	}
}
