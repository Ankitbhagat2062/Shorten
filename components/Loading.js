import React from 'react'

const Loading = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading...</p>
            </div>
        </div>
    )
}

export default Loading