"use client";

export default function FontTestPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-rubik font-bold text-gray-900 mb-4">
            Font Test Page - Typography Verification
          </h1>
          <p className="text-lg font-noto-kufi-arabic text-gray-600">
            This page tests all fonts to ensure Noto Kufi Arabic is working properly
          </p>
        </div>

        {/* Font Hierarchy Test */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
            Font Hierarchy Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-rubik font-bold text-blue-600">
                H1 - Rubik Font (Main Headlines)
              </h1>
            </div>
            
            <div>
              <h2 className="text-2xl font-rubik font-bold text-blue-600">
                H2 - Rubik Font (Main Headlines)
              </h2>
            </div>
            
            <div>
              <h3 className="text-xl font-markazi font-semibold text-green-600">
                H3 - Markazi Text Font (Elegant Subheadings)
              </h3>
            </div>
            
            <div>
              <h4 className="text-lg font-markazi font-semibold text-green-600">
                H4 - Markazi Text Font (Elegant Subheadings)
              </h4>
            </div>
            
            <div>
              <p className="text-base font-noto-kufi-arabic text-gray-700">
                Paragraph - Noto Kufi Arabic Font (Body Text) - This should display in Noto Kufi Arabic font
              </p>
            </div>
            
            <div>
              <span className="text-base font-noto-kufi-arabic text-gray-700">
                Span - Noto Kufi Arabic Font (Body Text) - This should display in Noto Kufi Arabic font
              </span>
            </div>
          </div>
        </div>

        {/* Class Test */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h2 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
            CSS Class Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-rubik text-lg text-blue-600">
                .font-rubik - This text uses Rubik font
              </p>
            </div>
            
            <div>
              <p className="font-markazi text-lg text-green-600">
                .font-markazi - This text uses Markazi Text font
              </p>
            </div>
            
            <div>
              <p className="font-noto-kufi-arabic text-lg text-purple-600">
                .font-noto-kufi-arabic - This text uses Noto Kufi Arabic font
              </p>
            </div>
            
            <div>
              <p className="font-nunito text-lg text-red-600">
                .font-nunito - This should now display in Noto Kufi Arabic (mapped)
              </p>
            </div>
          </div>
        </div>

        {/* Arabic Text Test */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h2 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
            Arabic Text Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <p className="font-noto-kufi-arabic text-lg text-gray-700" dir="rtl">
                مرحبا بكم في موقعنا - هذا النص باللغة العربية
              </p>
            </div>
            
            <div>
              <p className="arabic-text text-lg text-gray-700">
                النص العربي يجب أن يظهر بخط Noto Kufi Arabic
              </p>
            </div>
          </div>
        </div>

        {/* Navigation and Form Elements Test */}
        <div className="bg-yellow-50 p-6 rounded-lg">
          <h2 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
            Navigation & Form Elements Test
          </h2>
          
          <div className="space-y-4">
            <nav className="bg-white p-4 rounded border">
              <a href="#" className="text-blue-600 hover:text-blue-800 mr-4">
                Navigation Link 1
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-800 mr-4">
                Navigation Link 2
              </a>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Navigation Button
              </button>
            </nav>
            
            <div className="space-y-2">
              <label className="block text-gray-700">
                Form Label (should use Noto Kufi Arabic)
              </label>
              <input 
                type="text" 
                placeholder="Input placeholder text"
                className="w-full p-2 border rounded"
              />
              <textarea 
                placeholder="Textarea placeholder text"
                className="w-full p-2 border rounded h-20"
              ></textarea>
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Submit Button
              </button>
            </div>
          </div>
        </div>

        {/* Font Loading Status */}
        <div className="bg-red-50 p-6 rounded-lg">
          <h2 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
            Font Loading Status
          </h2>
          
          <div className="space-y-2">
            <p className="font-noto-kufi-arabic text-gray-700">
              ✅ If you can see this text clearly, Noto Kufi Arabic is loaded successfully
            </p>
            <p className="font-noto-kufi-arabic text-gray-700">
              ✅ All body text should now use Noto Kufi Arabic instead of Nunito
            </p>
            <p className="font-noto-kufi-arabic text-gray-700">
              ✅ Check browser developer tools to confirm font family
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-rubik font-bold text-gray-900 mb-4">
            Testing Instructions
          </h2>
          
          <div className="space-y-2">
            <p className="font-noto-kufi-arabic text-gray-700">
              1. Open browser developer tools (F12)
            </p>
            <p className="font-noto-kufi-arabic text-gray-700">
              2. Inspect any paragraph or span element
            </p>
            <p className="font-noto-kufi-arabic text-gray-700">
              3. Check computed styles - font-family should show "Noto Kufi Arabic"
            </p>
            <p className="font-noto-kufi-arabic text-gray-700">
              4. Verify that NO elements show "Nunito" in computed styles
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
