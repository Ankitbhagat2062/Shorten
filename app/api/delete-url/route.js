import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function DELETE(request) {
    const { shortUrl, deviceId, originalUrl } = await request.json()
    const client = await clientPromise;
    const db = client.db('Shorten');
    const collection = db.collection('urls')
    
    let existingUrl = await collection.findOne({ 
        deviceId: deviceId, 
        totalUrls: { $elemMatch: { shortenedUrl: shortUrl, originalUrl: originalUrl } } 
    })
    
    console.log('existingUrl:', !!existingUrl);
    
    if (!existingUrl) {
        console.log('Url does not exist')
        return NextResponse.json({ success: false, error: true, message: 'Your requested url does not exist' })
    }
    
    // Delete the URL from the totalUrls array
    await collection.updateOne(
        { deviceId: deviceId },
        { $pull: { totalUrls: { shortenedUrl: shortUrl, originalUrl: originalUrl } } }
    )
    
    console.log('Url deleted successfully ');
    return NextResponse.json({ success: true, error: false, message: "Your shortened url deleted successfully" })
}
