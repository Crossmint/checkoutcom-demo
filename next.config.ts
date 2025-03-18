import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	async headers() {
		return [
			{
				source: "/:path*",
				headers: [
					{
						key: "Content-Security-Policy",
						value: `
							default-src 'self';
							connect-src 'self' https://*.checkout.com https://checkout.com;
							frame-src 'self' https://*.checkout.com https://checkout.com;
							script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.checkout.com https://checkout.com;
							img-src 'self' https://*.checkout.com https://checkout.com data:;
							style-src 'self' 'unsafe-inline';
							form-action 'self' https://*.checkout.com https://checkout.com;
						`
							.replace(/\s+/g, " ")
							.trim(),
					},
				],
			},
		];
	},
};

export default nextConfig;
