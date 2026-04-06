import clientPromise from "@/lib/mongodb";

export async function POST(request) {
    try {
        // Check if request has a body
        const contentType = request.headers.get("Content-Type");
        if (!contentType || !contentType.includes("application/json")) {
            return Response.json({ success: false, error: true, message: "Content-Type must be application/json" }, { status: 400 });
        }

        // Parse the body
        let body;
        try {
            body = await request.json();
        } catch (parseError) {
            return Response.json({ success: false, error: true, message: "Invalid JSON in request body" }, { status: 400 });
        }

        const { shortenedUrl, location, device, timestamp, userId, referer, platform } = body;

        // Validate required fields
        if (!shortenedUrl || !timestamp) {
            return Response.json({ success: false, error: true, message: "Missing required fields: shortenedUrl and timestamp" }, { status: 400 });
        }

        console.log("Received data:", { shortenedUrl, location, device, timestamp, userId, referer, platform });

        const client = await clientPromise;
        const db = client.db('Shorten');
        const collection = db.collection('urls');
        const visit = { location, device, timestamp: new Date(timestamp), referer, platform }

        // Check if user exists in the nested clicks array for the specific shortenedUrl
        let existingUser = await collection.findOne({
            "totalUrls": {
                $elemMatch: {
                    "shortenedUrl": shortenedUrl,
                    "clicks.userId": userId
                }
            }
        });

        if (existingUser) {
            console.log("Updating existing user visit...");
            // Use arrayFilters to update the nested array element
            const result = await collection.updateOne(
                { "totalUrls.shortenedUrl": shortenedUrl },
                {
                    $push: {
                        "totalUrls.$[url].clicks.$[click].visits": visit
                    }
                },
                {
                    arrayFilters: [
                        { "url.shortenedUrl": shortenedUrl },
                        { "click.userId": userId }
                    ]
                }
            );
            console.log("Update result:", result.matchedCount);
            console.log("userid found - returning success",location);
            return Response.json({ success: true, error: true, message: "New visit of same user added successfully" });
        }

        console.log("Adding new user...");
        const result = await collection.updateOne(
            { "totalUrls.shortenedUrl": shortenedUrl },
            { $push: { "totalUrls.$.clicks": { userId, visits: [visit] } } }
        );
        console.log("Update result:", result.matchedCount);

        return Response.json({ success: true, error: true, message: "Users data updated successfully" });
    } catch (error) {
        console.error("=== ERROR IN TRACK API ===");
        console.error("Error:", error.message);
        // console.error("Stack:", error.stack);
        return Response.json({ success: false, error: true, message: error.message }, { status: 500 });
    }
}
