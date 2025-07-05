/**
 * Test script for Web3Forms integration
 * Run this to test if the email notifications are working
 */

async function testWeb3FormsIntegration() {
    console.log('🚀 Testing Web3Forms Integration...\n');

    // Test data for different form types
    const testForms = [
        {
            name: 'Contact Form Test',
            data: {
                name: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                company_name: 'Test Company',
                message: '[CONTACT FORM] This is a test contact form submission',
                agreed_to_terms: true
            }
        },
        {
            name: 'Booth Requirements Test',
            data: {
                name: 'Jane Smith',
                exhibition_name: 'Dubai Expo 2024',
                company_name: 'Smith Exhibitions',
                email: 'jane.smith@example.com',
                phone: '+9876543210',
                budget: '10000-20000',
                message: '[BOOTH REQUIREMENTS] This is a test booth requirements submission',
                agreed_to_terms: true
            }
        },
        {
            name: 'Event Inquiry Test',
            data: {
                name: 'Bob Johnson',
                exhibition_name: 'Tech Conference',
                company_name: 'Johnson Tech',
                email: 'bob.johnson@example.com',
                phone: '+1122334455',
                budget: '5000-10000',
                message: '[EVENT INQUIRY] Event ID: test-event-123 - This is a test event inquiry submission',
                agreed_to_terms: true
            }
        },
        {
            name: 'Quotation Request Test',
            data: {
                name: 'Alice Brown',
                exhibition_name: 'Business Summit',
                company_name: 'Brown Business',
                email: 'alice.brown@example.com',
                phone: '+5566778899',
                budget: '20000-50000',
                message: '[QUOTATION REQUEST] This is a test quotation request submission',
                agreed_to_terms: true
            }
        }
    ];

    for (const testForm of testForms) {
        console.log(`📧 Testing ${testForm.name}...`);
        
        try {
            const response = await fetch('http://localhost:3000/api/contact/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'http://localhost:3000'
                },
                body: JSON.stringify(testForm.data)
            });

            const result = await response.json();

            if (response.ok && result.success) {
                console.log(`✅ ${testForm.name} submitted successfully`);
                console.log(`   📝 Submission ID: ${result.data?.id}`);
                console.log(`   📧 Email notification should be sent\n`);
            } else {
                console.log(`❌ ${testForm.name} failed:`);
                console.log(`   Error: ${result.error}\n`);
            }

        } catch (error) {
            console.log(`❌ ${testForm.name} failed with error:`);
            console.log(`   ${error.message}\n`);
        }

        // Wait 2 seconds between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('🏁 Test completed!');
    console.log('\n📧 Check your email inbox for beautifully formatted notifications');
    console.log('🌟 Emails now feature attractive formatting with emojis and sections');
    console.log('🔒 IP addresses are not included for privacy protection');
    console.log('\n💡 If you don\'t receive emails, check:');
    console.log('   1. Web3Forms API key is correct');
    console.log('   2. Your email address is configured in Web3Forms dashboard');
    console.log('   3. Check spam/junk folder');
    console.log('   4. Web3Forms service logs for errors');
}

// Only run if server is available
console.log('🔧 Make sure your Next.js development server is running (npm run dev)');
console.log('🌐 Server should be available at http://localhost:3000\n');

testWeb3FormsIntegration().catch(console.error);
