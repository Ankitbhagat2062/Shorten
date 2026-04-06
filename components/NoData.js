import { AnalyticsIcon, PlusIcon } from '@/lib/icons'
import Link from 'next/link'
import React from 'react'

const NoData = () => {
    return (
        <main className="ml-10 w-full flex items-center justify-center min-h-screen">
            <div className="text-center p-8 animate-fade-in-up">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-linear-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <AnalyticsIcon className="w-12 h-12 text-white" />
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white mb-3">
                    No Analytics Data Yet
                </h2>

                {/* Description */}
                <p className="text-white/60 text-lg mb-8 max-w-md mx-auto">
                    Create your first short URL to start tracking clicks and see your analytics here.
                </p>

                {/* CTA Button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 sm:text-sm text-xs p-2 sm:px-8 sm:py-4 bg-linear-to-r from-[#667eea] to-[#764ba2] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-purple-500/40 transition-all duration-300 transform hover:scale-105"
                >
                    <PlusIcon className="w-5 h-5" />
                    Create Your First Short URL
                </Link>

                {/* Decorative elements */}
                <div className="mt-12 flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                </div>
            </div>
        </main>
    )
}

export default NoData