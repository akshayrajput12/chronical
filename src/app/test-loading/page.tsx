"use client";

import React, { useState, useEffect } from "react";
import { useComponentLoading } from "@/hooks/use-minimal-loading";
import { Button } from "@/components/ui/button";

export default function TestLoadingPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);

  // Test the useComponentLoading hook
  useComponentLoading(loading, "Testing component loading...");

  const simulateLoading = () => {
    setLoading(true);
    setData(null);
    
    // Simulate async operation
    setTimeout(() => {
      setData(`Data loaded at ${new Date().toLocaleTimeString()}`);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Loading Test Page
          </h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
            <div className="text-center">
              <p className="text-gray-600 mb-6">
                Test the loading functionality to ensure no infinite loops.
              </p>
              
              <Button
                onClick={simulateLoading}
                disabled={loading}
                className="bg-[#a5cd39] hover:bg-[#94b933] text-white"
              >
                {loading ? "Loading..." : "Start Loading Test"}
              </Button>
            </div>

            {data && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800">✅ {data}</p>
              </div>
            )}

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-blue-800">Test Status:</h3>
              <div className="space-y-2 text-blue-700">
                <div>Loading State: {loading ? "🔄 Loading" : "✅ Ready"}</div>
                <div>Data: {data ? "✅ Loaded" : "⏳ No data"}</div>
                <div>Hook Status: {loading ? "🔄 useComponentLoading active" : "✅ useComponentLoading idle"}</div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-yellow-800">Fixed Issues:</h3>
              <ul className="space-y-2 text-yellow-700">
                <li>✅ Removed infinite loop in useComponentLoading</li>
                <li>✅ Simplified dependency arrays</li>
                <li>✅ Disabled problematic route change effects</li>
                <li>✅ Removed conflicting page load listeners</li>
                <li>✅ Stable function references</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
