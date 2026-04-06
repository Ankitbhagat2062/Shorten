import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
    try {
        const headersList = await headers();

        // 1. Check for 'x-forwarded-for' (Common for Vercel/proxies)
        // This header can be a comma-separated list; the first one is the client.
        const forwarded = headersList.get('x-forwarded-for');
        let ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
        if (ip && ip.includes(',')) {
            ip = ip.split(',')[0].trim();
        }

        // Handle IPv6 mapped IPv4 addresses
        if (ip && ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }
        // 2. Alternatively, check 'x-real-ip'
        let realIp = headersList.get('x-real-ip') || ip;
        if (realIp === '::1' || realIp === '127.0.0.1' || !realIp) {
            console.log("Localhost detected. Using a dummy IP for testing...");
            realIp = '10.179.80.171' || '27.34.68.179'; // Replace with any real IP to test your charts/data
        }
        console.log("Captured Client IP:", realIp);
        const response = await fetch(`https://api.ipstack.com/${realIp}?access_key=${process.env.ipstack_ACCESSKEY}`);
        const data = await response.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error("Server Proxy Error:", err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
