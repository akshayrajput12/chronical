import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const BlogNotFound = () => {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md mx-auto text-center">
                <div className="mb-8">
                    <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                    <h2 className="text-2xl font-serif text-gray-900 mb-4">
                        Blog Post Not Found
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
                    </p>
                </div>
                
                <div className="space-y-4">
                    <Link href="/blog">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full">
                            Back to Blog
                        </Button>
                    </Link>
                    
                    <div>
                        <Link 
                            href="/" 
                            className="text-gray-500 hover:text-gray-700 text-sm transition-colors duration-300"
                        >
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogNotFound;
