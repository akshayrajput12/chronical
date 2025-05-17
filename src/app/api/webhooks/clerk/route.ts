import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your webhook secret
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');

  let evt: WebhookEvent;

  // Verify the webhook
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', {
      status: 400,
    });
  }

  // Get the event type
  const eventType = evt.type;

  // Create a Supabase client with admin privileges
  const supabase = createServiceClient();

  // Handle the event
  if (eventType === 'user.created') {
    // A new user was created in Clerk
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (email_addresses && email_addresses.length > 0) {
      const primaryEmail = email_addresses[0].email_address;
      const fullName = first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || last_name || null;

      // Insert the user into Supabase
      const { error } = await supabase
        .from('admin_users')
        .insert({
          clerk_id: id,
          email: primaryEmail,
          role: 'admin', // Default role
          full_name: fullName,
          avatar_url: image_url || null
        });

      if (error) {
        console.error('Error inserting user into Supabase:', error);
        return new Response('Error inserting user', {
          status: 500,
        });
      }
    }
  } else if (eventType === 'user.updated') {
    // User was updated in Clerk
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    if (email_addresses && email_addresses.length > 0) {
      const primaryEmail = email_addresses[0].email_address;
      const fullName = first_name && last_name
        ? `${first_name} ${last_name}`
        : first_name || last_name || null;

      // Update the user in Supabase
      const { error } = await supabase
        .from('admin_users')
        .update({
          email: primaryEmail,
          full_name: fullName,
          avatar_url: image_url || null
        })
        .eq('clerk_id', id);

      if (error) {
        console.error('Error updating user in Supabase:', error);
        return new Response('Error updating user', {
          status: 500,
        });
      }
    }
  } else if (eventType === 'user.deleted') {
    // User was deleted in Clerk
    const { id } = evt.data;

    // Delete the user from Supabase
    const { error } = await supabase
      .from('admin_users')
      .delete()
      .eq('clerk_id', id);

    if (error) {
      console.error('Error deleting user from Supabase:', error);
      return new Response('Error deleting user', {
        status: 500,
      });
    }
  }

  return new Response('Webhook received', {
    status: 200,
  });
}
