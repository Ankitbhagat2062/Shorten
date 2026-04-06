import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
    const deviceId = (await params).deviceId;
    const client = await clientPromise;
    const db = client.db('Shorten');
    const collection = db.collection('urls');
    const urlData = await collection.findOne({ deviceId: deviceId });

    if (!urlData) {
        return Response.json({ success: false, data: null, error: true, message: 'Data not found .Please create an shortUrl' });
    }
    return Response.json({ success: true, data: urlData });
}
