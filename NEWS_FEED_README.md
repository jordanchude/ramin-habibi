# News Feed Feature

This branch adds a personal news feed feature to the Ramin Habibi website.

## What's New

### Admin Features
- **Login Page** (`admin/login.html`): Secure authentication for admin access
- **Admin Dashboard** (`admin/dashboard.html`): Interface for creating and managing posts
  - Create text posts
  - Upload and post images
  - Share playlists (Spotify, Apple Music, etc.)
  - Post links with descriptions

### Public Features
- **News Feed Page** (`news-feed.html`): Public-facing feed displaying all posts
  - Posts organized by month
  - Current month displayed prominently
  - Previous months automatically archived
  - Responsive design matching website aesthetic

### Technical Implementation
- **Backend**: Supabase (authentication + database + storage)
- **Frontend**: Vanilla JavaScript with Supabase client
- **Design**: Matches existing website design principles

## Files Added

```
admin/
  ├── login.html          # Admin login page
  └── dashboard.html      # Admin dashboard for posting

news-feed.html            # Public news feed page

js/
  ├── auth.js            # Authentication and Supabase setup
  ├── dashboard.js       # Admin dashboard functionality
  └── news-feed.js       # Public feed display logic

NEWS_FEED_SETUP.md       # Complete setup instructions
```

## Files Modified

- `index.html`: Added "News Feed" link to navigation and footer

## Setup Required

Before using this feature, you must:

1. **Set up Supabase** (see `NEWS_FEED_SETUP.md` for detailed instructions)
   - Create a Supabase project
   - Set up database tables
   - Configure storage for images
   - Create admin user

2. **Configure JavaScript**
   - Update `js/auth.js` with your Supabase credentials:
     ```javascript
     const SUPABASE_URL = 'YOUR_SUPABASE_URL';
     const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
     ```

## How It Works

### Monthly Organization
- Each post is tagged with a `month_key` (format: `YYYY-MM`)
- Posts from the current month are shown first
- Previous months are automatically shown in an "archived" section
- Archiving happens automatically - no manual action needed

### Post Types
1. **Text**: Simple text-based posts
2. **Image**: Posts with uploaded images (stored in Supabase Storage)
3. **Link**: Posts with external links and descriptions
4. **Playlist**: Posts with playlist URLs (Spotify, Apple Music, etc.)

### Security
- Authentication required for admin access
- Row Level Security (RLS) policies protect the database
- Public can read posts, only authenticated users can create/edit/delete

## Design Principles

The news feed feature follows the existing website design:
- Same color scheme (light, dark, accent)
- Same typography (Playfair Display, EB Garamond, Cormorant Garamond)
- Same button styles and interactions
- Responsive design for mobile devices

## Next Steps

1. Follow the setup guide in `NEWS_FEED_SETUP.md`
2. Test the login and posting functionality
3. Customize the design if needed
4. Deploy to production

## Notes

- The feature is fully functional but requires Supabase setup
- All posts are stored in Supabase database
- Images are stored in Supabase Storage
- The feature works with static site hosting (no server required)

