import { randomInt } from 'crypto';
import { sendMail } from "@/lib/mailService";
import clientPromise from "@/lib/mongodb";
import { NextResponse } from 'next/server';

export async function POST(req) {
    const { email, deviceId } = await req.json();
    const otp = randomInt(100000, 999999).toString();
    const client = await clientPromise;
    const db = client.db('Shorten');
    const collection = db.collection('urls');
    try {
        //     // 2. Send the OTP via email
        const existingDevice = await collection.findOne({ deviceId: deviceId });
        const result = await sendMail("Your OTP Code", email, `Your OTP is ${otp}`);
        console.log(result)
        if (!result.success) {
            return NextResponse.json({ message: result.message, error: result.error, success: result.success }, { status: 400 });
        }
        if (existingDevice) {
            await collection.updateOne({ deviceId: deviceId }, { $set: { email, verificationCode: otp, verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000) } });
            return NextResponse.json({ message: "OTP sent and saved to cloud successfully!", otp });
        }
        await collection.insertOne({ email, deviceId, verificationCode: otp, verificationCodeExpiry: new Date(Date.now() + 10 * 60 * 1000) });
        return NextResponse.json({ message: "OTP sent successfully!", otp });
    } catch (err) {
        return NextResponse.json({ message: err.message, error: true, success: false }, { status: 400 });
    }
};

