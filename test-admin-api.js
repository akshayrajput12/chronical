// Test the admin API endpoint to see if it can fetch submissions
const fetch = require('node-fetch');

async function testAdminAPI() {
    console.log('Testing admin API endpoint...');
    
    try {
        const response = await fetch('http://localhost:3000/api/events/submissions?page=1&limit=10');
        
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));
        
        const data = await response.json();
        
        console.log('Response data:', JSON.stringify(data, null, 2));
        
        if (response.ok) {
            console.log('✅ API test successful!');
            console.log(`Found ${data.submissions?.length || 0} submissions`);
            console.log(`Total count: ${data.pagination?.total_count || 0}`);
        } else {
            console.log('❌ API test failed');
        }

    } catch (error) {
        console.error('Error testing API:', error);
    }
}

// Only run if the server is running
console.log('Make sure the Next.js development server is running (npm run dev)');
console.log('Then run this test script');

testAdminAPI();
