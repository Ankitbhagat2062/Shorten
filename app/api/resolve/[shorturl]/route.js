import clientPromise from "@/lib/mongodb";

export async function GET(request, { params }) {
    const shortenedUrl = (await params).shorturl;
    const client = await clientPromise;
    const db = client.db('Shorten');
    const collection = db.collection('urls');
    const urlData = await collection.findOne({ "totalUrls.shortenedUrl": shortenedUrl });

    if (!urlData) {
        return Response.json({ success: false, error: true, message: 'URL not found' });
    }

    const urlIndex = urlData.totalUrls.findIndex(url => url.shortenedUrl === shortenedUrl);
    if (urlIndex === -1) {
        return Response.json({ success: false, error: true, message: 'URL not found' });
    }

    return Response.json({ success: true, originalUrl: urlData.totalUrls[urlIndex].originalUrl });
}
