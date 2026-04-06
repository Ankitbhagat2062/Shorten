import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    const { originalUrl, shortenedUrl, deviceId } = await request.json();

    const client = await clientPromise;
    const db = client.db('Shorten');
    const collection = db.collection('urls');
    if (!originalUrl || !shortenedUrl) {
        return Response.json({ success: false, error: true, message: 'Both original and shortened URLs are required.' }, { status: 400 });
    }
    if (!deviceId) return Response.json({ success: false, error: true, message: 'DeviceId is required. Please set DeviceId' }, { status: 400 })
    const existingShortUrl = await collection.findOne({ "totalUrls.shortenedUrl": shortenedUrl });
    if (existingShortUrl) {
        return Response.json({ success: false, error: true, message: 'Shortened URL already exists. Please choose a different one.' }, { status: 400 });
    }
    // const date = new Date().toDateString() + " " + new Date().toTimeString();
    const urlinfo = { originalUrl, shortenedUrl, isActive: true, clicks: [], createdDate: new Date() }

    const existingUser = await collection.findOne({ deviceId: deviceId });
    if (existingUser) {
        const existingUrl = await collection.findOne({ "totalUrls.originalUrl": originalUrl, deviceId: deviceId })
        if (existingUrl) {
            await collection.updateOne(
                { _id: existingUrl._id, "totalUrls.originalUrl": originalUrl },
                { $set: { "totalUrls.$.shortenedUrl": shortenedUrl, "totalUrls.$.updatedAt": new Date() } }
            );
            return Response.json({ success: true, error: false, message: 'You have updated shortName for this url.' });
        }
        await collection.updateOne({ _id: existingUser._id }, { $push: { totalUrls: urlinfo } })
        return Response.json({ success: true, error: false, message: `Existing user created new Shortened URL successfully!` });
    }
    await collection.insertOne({ deviceId, totalUrls: [urlinfo] });
    return Response.json({ success: true, error: false, message: `Shortened URL created for the newuser successfully!` });
}
