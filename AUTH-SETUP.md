# Authentication and Database Setup Guide

This guide will walk you through setting up authentication with Clerk and database integration with Supabase for the Chronicle Exhibits admin panel.

## Prerequisites

- A Clerk account (https://clerk.dev)
- A Supabase account (https://supabase.com)
- Node.js and npm installed

## Step 1: Set Up Clerk Authentication

1. Create a new Clerk application:
   - Go to https://dashboard.clerk.dev/
   - Sign up or log in
   - Create a new application
   - Choose "Next.js" as your framework

2. Configure your Clerk application:
   - In the Clerk dashboard, go to "API Keys"
   - Copy your "Publishable Key" and "Secret Key"
   - Go to "JWT Templates" and create a new template with the following claims:
     ```json
     {
       "metadata": {
         "role": "{{user.public_metadata.role}}"
       }
     }
     ```

3. Set up Clerk webhooks:
   - In the Clerk dashboard, go to "Webhooks"
   - Create a new webhook with the following settings:
     - URL: `https://your-domain.com/api/webhooks/clerk`
     - Events: `user.created`, `user.updated`, `user.deleted`
   - Copy the "Signing Secret" for use in your environment variables

## Step 2: Set Up Supabase Database

1. Create a new Supabase project:
   - Go to https://app.supabase.com/
   - Sign up or log in
   - Create a new project
   - Choose a name and password for your project

2. Set up the admin_users table:
   - Go to the "SQL Editor" in your Supabase dashboard
   - Create a new query
   - Copy and paste the contents of `supabase-schema.sql` into the editor
   - Run the query to create the admin_users table and policies
   - This will create a table to store user information synced from Clerk

3. Get your Supabase credentials:
   - Go to "Project Settings" > "API"
   - Copy your "Project URL" and "anon" key
   - Also copy your "service_role" key (keep this secret!)

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

```
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/admin
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/admin
CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# MongoDB (existing)
MONGODB_URI=your_mongodb_uri
```

## Step 4: Run the Application

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000/login`

## Step 5: Create an Admin User

1. Go to `http://localhost:3000/signup`
2. Create a new user account
3. After signing up, you'll be redirected to the admin dashboard

## Step 6: Set Up Admin Role in Clerk

1. Go to the Clerk dashboard
2. Navigate to "Users"
3. Find your user
4. Click on "Metadata"
5. Add the following public metadata:
   ```json
   {
     "role": "admin"
   }
   ```
6. Save the changes

## Troubleshooting

- If you encounter issues with authentication, check your Clerk configuration and environment variables.
- If you have problems with the database, verify your Supabase credentials and check that the tables were created correctly.
- For webhook issues, make sure your webhook URL is accessible and the signing secret is correct.

## Additional Resources

- [Clerk Documentation](https://clerk.dev/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
