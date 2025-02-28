import type { EmbeddedCheckoutParams } from "@/app/Checkout";
import { HeadlessAPI } from "@/app/utils/api/HeadlessAPI";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_KEY = process.env.CROSSMINT_SERVER_SIDE_KEY;

if (!API_KEY) {
	throw new Error("CROSSMINT_SERVER_SIDE_KEY is not set");
}

const headlessAPI = new HeadlessAPI(API_KEY);

export async function POST(request: NextRequest) {
	const embeddedCheckoutParameters = request.nextUrl.searchParams.get(
		"embeddedCheckoutParameters",
	);

	if (!embeddedCheckoutParameters) {
		return createErrorResponse("Embedded checkout parameters not provided");
	}

	try {
		const params = JSON.parse(
			embeddedCheckoutParameters,
		) as EmbeddedCheckoutParams;
		const validationError = validateCheckoutParams(params);

		if (validationError) {
			return createErrorResponse(validationError);
		}

		const order = await headlessAPI.createOrder(params);
		return NextResponse.json(order);
	} catch (error) {
		console.error("Error creating order:", error);
		return createErrorResponse("Invalid JSON in embeddedCheckoutParameters");
	}
}

export async function GET(request: NextRequest) {
	const orderId = request.nextUrl.searchParams.get("orderId");

	if (!orderId) {
		return createErrorResponse("Order ID not provided");
	}

	try {
		const order = await headlessAPI.getOrder(orderId);
		return NextResponse.json(order);
	} catch (error) {
		console.error("Error fetching order:", error);
		return createErrorResponse("Error fetching order", 500);
	}
}

function createErrorResponse(message: string, status = 400) {
	return NextResponse.json({ error: true, message }, { status });
}

function validateCheckoutParams(params: EmbeddedCheckoutParams): string | null {
	const { walletRecipient, amountUSD, receiptEmail, maxSlippageBPS } = params;

	if (!walletRecipient || !amountUSD || !receiptEmail || !maxSlippageBPS) {
		return "Missing required parameters. Required: walletRecipient, amountUSD, receiptEmail, maxSlippageBPS";
	}

	const amount = Number(amountUSD);
	if (Number.isNaN(amount) || amount <= 0) {
		return "Invalid amountUSD value. Must be a positive number";
	}

	const slippage = Number(maxSlippageBPS);
	if (Number.isNaN(slippage) || slippage < 0) {
		return "Invalid maxSlippageBPS value. Must be a non-negative number";
	}

	return null;
}
