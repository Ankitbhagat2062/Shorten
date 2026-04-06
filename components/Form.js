import { useUrlStore } from '@/store/useUrlStore';
import Link from 'next/link';
import React, { useState } from 'react'

const Form = ({button}) => {
    const { originalUrl, setOriginalUrl } = useUrlStore();
    const [shortenedResult, setShortenedResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { deviceId, currentShortenedUrl, setCurrentShortenedUrl } = useUrlStore();

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!originalUrl || !currentShortenedUrl) return;

        setLoading(true);
        setError(null);

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "deviceId": deviceId,
            "originalUrl": originalUrl,
            "shortenedUrl": currentShortenedUrl
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        try {
            const response = await fetch("http://localhost:3000/api/shorten", requestOptions);
            const result = await response.json();

            console.log(result);

            if (result.success) {
                setShortenedResult(`${process.env.NEXT_PUBLIC_BASE_URL}/${currentShortenedUrl}`);
            } else {
                setError(result.message);
                setShortenedResult(`${process.env.NEXT_PUBLIC_BASE_URL}/${result.shorturl}`);
            }
        } catch (err) {
            console.log('error', err);
            setError(err.message);
        }

        setLoading(false);
        setOriginalUrl('');
        setCurrentShortenedUrl('');
        console.log("SHORTENED RESULT:", shortenedResult);
    };

    return (
        <>
            {/* URL Shortening Form */}
            <div className="glass-card rounded-2xl p-8 max-w-2xl mx-auto animate-fade-in-up delay-200">
                {error &&
                    <h2 className='text-red-500'>{error}</h2>
                }
                <form onSubmit={handleShorten} className="space-y-4">
                    <div className="grid md:grid-cols-1 gap-4">
                        <div>
                            <label htmlFor="currentShortenedUrl" className="block text-white/80 text-sm font-medium mb-2">Short URL Name</label>
                            <input id="currentShortenedUrl"
                                name='currentShortenedUrl'
                                value={currentShortenedUrl ? currentShortenedUrl : ''}
                                onChange={(e) => setCurrentShortenedUrl(e.target.value)}
                                type="text"
                                placeholder="short-name"
                                className="input-glass"
                            />
                        </div>
                        <div>
                            <label htmlFor="originalUrl" className="block text-white/80 text-sm font-medium mb-2">Original URL</label>
                            <input id="originalUrl"
                                name='originalUrl'
                                value={originalUrl ? originalUrl : ''}
                                onChange={(e) => setOriginalUrl(e.target.value)}
                                type="url"
                                placeholder="https://yourwebsite.com/very/long/url"
                                className="input-glass"
                            />
                        </div>
                    </div>
                    <button disabled={loading}
                        type="submit"
                        className="btn-primary disabled:opacity-50 py-2 px-4 mt-4 animate-pulse-glow"
                    >
                        {loading ? `${button}ing...` : `${button} URL`}
                    </button>
                </form>

                {shortenedResult && (
                    <div className="mt-6 p-4 bg-green-500 border border-green-200 rounded-md">
                        <p className="text-green-800 font-medium py-2">Your shortened URL:</p>
                        <Link
                            href={shortenedResult}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 bg-amber-50/0 hover:underline break-all"
                        >
                            {shortenedResult}
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

export default Form
