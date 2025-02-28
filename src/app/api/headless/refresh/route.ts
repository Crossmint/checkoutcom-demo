import { HeadlessAPI } from "@/app/utils/api/HeadlessAPI";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const API_KEY = process.env.CROSSMINT_SERVER_SIDE_KEY;

if (!API_KEY) {
	throw new Error("CROSSMINT_SERVER_SIDE_KEY is not set");
}

const headlessAPI = new HeadlessAPI(API_KEY);

export async function POST(request: NextRequest) {
	const orderId = request.nextUrl.searchParams.get("orderId");
	const clientSecret = request.nextUrl.searchParams.get("clientSecret");

	if (!orderId || !clientSecret) {
		return createErrorResponse("Order ID or client secret not provided");
	}

	try {
		const order = await headlessAPI.refreshOrder(orderId, clientSecret);
		return NextResponse.json(order);
	} catch (error) {
		console.error("Error refreshing order:", error);
		return createErrorResponse("Error refreshing order", 500);
	}
}

function createErrorResponse(message: string, status = 400) {
	return NextResponse.json({ error: true, message }, { status });
}
