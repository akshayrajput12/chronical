
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
  // Get the request body
  const payload = await req.json();
  
  // Verify the webhook signature (in a production app, you should implement this)
  // For Supabase webhooks, you would verify using the webhook secret
  // This is a simplified example
  
  // Get the event type
  const eventType = payload.type;
  
  // Create a Supabase client with admin privileges
  const supabase = createServiceClient();
  
  // Handle the event
  if (eventType === 'INSERT' && payload.table === 'auth.users') {
    // A new user was created in Supabase Auth
    const user = payload.record;
    
    if (user && user.email) {
      // Insert the user into the admin_users table
      const { error } = await supabase
        .from('admin_users')
        .insert({
          email: user.email,
          role: 'admin', // Default role
          full_name: null,
          avatar_url: null
        });
      
      if (error) {
        console.error('Error inserting user into admin_users:', error);
        return new Response('Error inserting user', {
          status: 500,
        });
      }
    }
  } else if (eventType === 'UPDATE' && payload.table === 'auth.users') {
    // User was updated in Supabase Auth
    const user = payload.record;
    
    if (user && user.email) {
      // Update the user in the admin_users table
      const { error } = await supabase
        .from('admin_users')
        .update({
          email: user.email,
        })
        .eq('email', user.email);
      
      if (error) {
        console.error('Error updating user in admin_users:', error);
        return new Response('Error updating user', {
          status: 500,
        });
      }
    }
  } else if (eventType === 'DELETE' && payload.table === 'auth.users') {
    // User was deleted in Supabase Auth
    const oldRecord = payload.old_record;
    
    if (oldRecord && oldRecord.email) {
      // Delete the user from the admin_users table
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('email', oldRecord.email);
      
      if (error) {
        console.error('Error deleting user from admin_users:', error);
        return new Response('Error deleting user', {
          status: 500,
        });
      }
    }
  }
  
  return new Response('Webhook received', {
    status: 200,
  });
}
