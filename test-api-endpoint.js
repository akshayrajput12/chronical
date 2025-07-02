// Test the event form submission API endpoint
const fetch = require('node-fetch');

async function testEventFormAPI() {
    console.log('Testing event form submission API...');
    
    const testData = {
        name: 'Test User',
        exhibition_name: 'Test Exhibition',
        company_name: 'Test Company',
        email: 'test@example.com',
        phone: '+1234567890',
        budget: '10000-50000',
        message: 'This is a test submission from the API test script.',
        attachment_url: '',
        attachment_filename: '',
        attachment_size: 0
    };

    try {
        const response = await fetch('http://localhost:3000/api/events/submissions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(testData)
        });

        const result = await response.json();

        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('✅ API test successful!');
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

testEventFormAPI();
