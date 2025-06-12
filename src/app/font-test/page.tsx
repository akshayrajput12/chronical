import React from 'react';

const FontTestPage = () => {
  return (
    <div className="min-h-screen bg-white py-8 md:py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl mb-4">Font Hierarchy Test Page</h1>
          <p className="text-lg text-gray-600">
            This page tests the font hierarchy implementation for all pages except home page.
          </p>
        </div>

        {/* Font Hierarchy Examples */}
        <div className="space-y-12">
          {/* Heading Fonts Section */}
          <section className="border-b pb-8">
            <h2 className="text-3xl mb-6">Heading Fonts (Rubik Light for H1/H2)</h2>
            
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl">H1: This should be Rubik Light (300)</h1>
                <p className="text-sm text-gray-500 mt-1">Expected: Rubik font, weight 300 (light)</p>
              </div>
              
              <div>
                <h2 className="text-3xl">H2: This should be Rubik Light (300)</h2>
                <p className="text-sm text-gray-500 mt-1">Expected: Rubik font, weight 300 (light)</p>
              </div>
            </div>
          </section>

          {/* Subheading Fonts Section */}
          <section className="border-b pb-8">
            <h2 className="text-3xl mb-6">Subheading Fonts (Markazi Medium Bold for H3-H6)</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl">H3: This should be Markazi Medium Bold (600)</h3>
                <p className="text-sm text-gray-500 mt-1">Expected: Markazi Text font, weight 600 (medium bold)</p>
              </div>
              
              <div>
                <h4 className="text-xl">H4: This should be Markazi Medium Bold (600)</h4>
                <p className="text-sm text-gray-500 mt-1">Expected: Markazi Text font, weight 600 (medium bold)</p>
              </div>
              
              <div>
                <h5 className="text-lg">H5: This should be Markazi Medium Bold (600)</h5>
                <p className="text-sm text-gray-500 mt-1">Expected: Markazi Text font, weight 600 (medium bold)</p>
              </div>
              
              <div>
                <h6 className="text-base">H6: This should be Markazi Medium Bold (600)</h6>
                <p className="text-sm text-gray-500 mt-1">Expected: Markazi Text font, weight 600 (medium bold)</p>
              </div>
            </div>
          </section>

          {/* Body Text Section */}
          <section className="border-b pb-8">
            <h2 className="text-3xl mb-6">Body Text (Noto Kufi Arabic)</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-base">
                  This paragraph should use Noto Kufi Arabic font with normal weight (400). 
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="text-sm text-gray-500 mt-1">Expected: Noto Kufi Arabic font, weight 400 (normal)</p>
              </div>
              
              <div>
                <span className="text-base block">
                  This span element should also use Noto Kufi Arabic font. 
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco.
                </span>
                <p className="text-sm text-gray-500 mt-1">Expected: Noto Kufi Arabic font, weight 400 (normal)</p>
              </div>
              
              <div>
                <div className="text-base">
                  This div element should use Noto Kufi Arabic font as well.
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.
                </div>
                <p className="text-sm text-gray-500 mt-1">Expected: Noto Kufi Arabic font, weight 400 (normal)</p>
              </div>
            </div>
          </section>

          {/* Mixed Content Section */}
          <section>
            <h2 className="text-3xl mb-6">Mixed Content Example</h2>
            
            <div className="prose max-w-none">
              <h1>Main Article Title (H1 - Rubik Light)</h1>
              <h2>Article Subtitle (H2 - Rubik Light)</h2>
              
              <p>
                This is the article introduction paragraph using Noto Kufi Arabic. 
                It should have normal weight and be easily readable.
              </p>
              
              <h3>Section Heading (H3 - Markazi Medium Bold)</h3>
              <p>
                Another paragraph of body text. This demonstrates how the different 
                font weights and families work together to create a cohesive typography hierarchy.
              </p>
              
              <h4>Subsection Heading (H4 - Markazi Medium Bold)</h4>
              <p>
                Final paragraph showing the complete font hierarchy in action. 
                The contrast between light headings, bold subheadings, and normal body text 
                should create a clear visual hierarchy.
              </p>
            </div>
          </section>

          {/* Test Instructions */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl mb-4">Testing Instructions</h2>
            <div className="space-y-2 text-sm">
              <p><strong>1.</strong> Navigate to the home page (/) - fonts should remain unchanged</p>
              <p><strong>2.</strong> Return to this page - fonts should follow the new hierarchy</p>
              <p><strong>3.</strong> Check other pages (about, contact, etc.) - should use new hierarchy</p>
              <p><strong>4.</strong> Inspect elements to verify font-family and font-weight values</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FontTestPage;
