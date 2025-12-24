# News Feed Setup Guide

This guide will help you set up the personal news feed feature for the Ramin Habibi website.

## Overview

The news feed feature allows you to:
- Login to an admin dashboard
- Post images, playlists, links, and text updates
- Automatically organize posts by month
- Automatically archive previous months when a new month starts

## Prerequisites

1. A Supabase account (free tier is sufficient)
2. Basic knowledge of SQL

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in your project details:
   - Name: `ramin-habibi-news-feed` (or any name you prefer)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose closest to you
4. Wait for the project to be created (takes ~2 minutes)

## Step 2: Set Up Database Tables

1. In your Supabase project, go to the SQL Editor
2. Run the following SQL to create the posts table:

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  type TEXT NOT NULL CHECK (type IN ('text', 'image', 'playlist', 'link')),
  image_url TEXT,
  link_url TEXT,
  playlist_url TEXT,
  month_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_posts_month_key ON posts(month_key);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy: Anyone can read posts (public feed)
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  USING (true);

-- Create policy: Only authenticated users can insert posts
CREATE POLICY "Authenticated users can insert posts"
  ON posts FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Create policy: Only authenticated users can update posts
CREATE POLICY "Authenticated users can update posts"
  ON posts FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create policy: Only authenticated users can delete posts
CREATE POLICY "Authenticated users can delete posts"
  ON posts FOR DELETE
  USING (auth.role() = 'authenticated');
```

## Step 3: Set Up Storage Bucket for Images

1. In Supabase, go to Storage
2. Click "Create a new bucket"
3. Name it: `post-images`
4. Make it **Public** (so images can be displayed)
5. Click "Create bucket"
6. Go to Policies tab for the bucket
7. Add the following policies:

```sql
-- Allow public to read images
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'post-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'post-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated users can delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'post-images' AND auth.role() = 'authenticated');
```

## Step 4: Configure Authentication

1. In Supabase, go to Authentication > Settings
2. Under "Site URL", enter your website URL (e.g., `https://raminhabibi.com`)
3. Under "Redirect URLs", add:
   - `https://raminhabibi.com/admin/dashboard.html`
   - `http://localhost:8000/admin/dashboard.html` (for local development)
4. Save changes

## Step 5: Create Admin User

1. Go to Authentication > Users
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: Your admin email
   - Password: Choose a strong password
   - Auto Confirm User: **ON** (so you don't need email verification)
4. Click "Create user"
5. Save these credentials - you'll use them to login!

## Step 6: Update JavaScript Configuration

1. In Supabase, go to Settings > API
2. Copy your:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string under "Project API keys")

3. Open `js/auth.js` in your project
4. Replace the placeholder values:

```javascript
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## Step 7: Test the Setup

1. Open `admin/login.html` in your browser
2. Login with the credentials you created
3. You should be redirected to the dashboard
4. Try creating a test post
5. Visit `news-feed.html` to see your post

## How It Works

### Monthly Organization
- Each post is automatically assigned a `month_key` (format: `YYYY-MM`) based on its creation date
- The current month's posts are displayed prominently
- Previous months are automatically archived and shown below

### Post Types
- **Text**: Simple text posts
- **Image**: Posts with images (uploaded to Supabase Storage)
- **Link**: Posts with external links
- **Playlist**: Posts with playlist URLs (Spotify, Apple Music, etc.)

### Automatic Archiving
- When a new month starts, posts from previous months are automatically shown in the "archived" section
- This happens automatically based on the `month_key` field

## Troubleshooting

### Can't login
- Check that your Supabase URL and anon key are correct in `js/auth.js`
- Verify the user exists in Supabase Authentication > Users
- Check browser console for errors

### Images not uploading
- Verify the `post-images` bucket exists and is public
- Check that storage policies are set correctly
- Check browser console for errors

### Posts not showing
- Check that the `posts` table exists
- Verify Row Level Security policies are set correctly
- Check browser console for errors

## Security Notes

- The `anon` key is safe to use in client-side code (it's public)
- Row Level Security ensures only authenticated users can create/edit/delete posts
- Anyone can read posts (for the public feed)
- Consider adding rate limiting in production

## Next Steps

1. Customize the design to match your brand
2. Add more post types if needed
3. Set up email notifications for new posts (optional)
4. Add analytics to track feed views (optional)

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase logs (Dashboard > Logs)
3. Verify all configuration steps were completed

