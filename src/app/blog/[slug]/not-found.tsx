import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white mt-16 md:mt-20 lg:mt-24 flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Blog Post Not Found</h2>
                <p className="text-gray-600 mb-8">
                    The blog post you're looking for doesn't exist or has been moved.
                </p>
                <div className="space-x-4">
                    <Link
                        href="/blog"
                        className="bg-[#a5cd39] hover:bg-[#8fb82e] text-white px-6 py-3 rounded-md inline-block transition-colors"
                    >
                        View All Posts
                    </Link>
                    <Link
                        href="/"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-md inline-block transition-colors"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
