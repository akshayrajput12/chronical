/**
 * Test script for Dashboard API
 * Run this to test if the dynamic dashboard is working
 */

async function testDashboardAPI() {
    console.log('🚀 Testing Dashboard API...\n');

    try {
        const response = await fetch('http://localhost:3000/api/admin/dashboard');
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            console.log('❌ API request failed');
            return;
        }

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Dashboard API working successfully!\n');
            
            const stats = result.data;
            
            console.log('📊 Dashboard Statistics:');
            console.log(`   📄 Total Pages: ${stats.totalPages}`);
            console.log(`   📅 Total Events: ${stats.totalEvents} (${stats.publishedEvents} published)`);
            console.log(`   📝 Total Blog Posts: ${stats.totalBlogPosts} (${stats.publishedBlogs} published)`);
            console.log(`   🏙️  Total Cities: ${stats.totalCities}`);
            console.log(`   📧 Total Form Submissions: ${stats.totalFormSubmissions} (${stats.newSubmissionsToday} today)`);
            
            console.log('\n🔄 Recent Activity:');
            if (stats.recentActivity.length > 0) {
                stats.recentActivity.slice(0, 5).forEach((activity, index) => {
                    const icon = {
                        'event': '📅',
                        'blog': '📝',
                        'city': '🏙️',
                        'form': '📧'
                    }[activity.type] || '📄';
                    
                    console.log(`   ${icon} ${activity.title} (${activity.status})`);
                });
            } else {
                console.log('   No recent activity found');
            }
            
            console.log('\n🎯 Dashboard is ready to use!');
            console.log('   Visit: http://localhost:3000/admin');
            
        } else {
            console.log('❌ API returned error:', result.error);
        }

    } catch (error) {
        console.log('❌ Test failed with error:', error.message);
    }
}

// Only run if server is available
console.log('🔧 Make sure your Next.js development server is running (npm run dev)');
console.log('🌐 Server should be available at http://localhost:3000\n');

testDashboardAPI().catch(console.error);
