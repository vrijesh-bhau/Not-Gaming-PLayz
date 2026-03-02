# The Antigle - Gaming Website

A static, JSON-driven website for the gaming brand "The Antigle" by creator Mukund.

## Quick Links

- **Live Site**: [Deploy to Netlify to get your URL](#deploy-to-netlify)
- **YouTube Channel**: [@Notgamingplayz](https://youtube.com/@notgamingplayz)
- **Contact**: [jhamukund215@gmail.com](mailto:jhamukund215@gmail.com)

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [For Content Creators: Adding Content](#for-content-creators-adding-content)
   - [Adding a New Video](#adding-a-new-video)
   - [Adding a New Resource](#adding-a-new-resource)
   - [Adding a New Update/Blog Post](#adding-a-new-updateblog-post)
3. [Deploy to Netlify](#deploy-to-netlify)
4. [Theme Toggle & Local Storage](#theme-toggle--local-storage)
5. [Technical Notes](#technical-notes)

---

## Project Structure

```
the-antigle/
├── index.html              # Home page
├── videos.html             # Videos listing page
├── resources.html          # Resources/downloads page
├── updates.html            # Blog/updates page
├── about.html              # About page
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── style.css       # Main stylesheet
│   ├── js/
│   │   └── main.js         # Main JavaScript file
│   ├── images/             # All images (logos, thumbnails, avatars)
│   │   ├── website_logo.png
│   │   ├── youtube_avatar.png
│   │   └── ...
│   └── files/              # Downloadable files
│       └── ...
└── content/                # JSON data files (EDIT THESE!)
    ├── videos/
    │   └── index.json      # Video entries
    ├── resources/
    │   └── index.json      # Resource entries
    └── updates/
        └── index.json      # Blog post entries
```

---

## For Content Creators: Adding Content

> **No coding required!** You can add new content by editing JSON files directly on GitHub.

### Prerequisites

1. A GitHub account (free at [github.com](https://github.com))
2. Your repository pushed to GitHub

---

### Adding a New Video

**Step 1: Upload your thumbnail image**

1. Go to your GitHub repository
2. Navigate to `assets/images/`
3. Click **"Add file"** → **"Upload files"**
4. Drag and drop your thumbnail image (recommended: 1280x720px, JPG or PNG)
5. Click **"Commit changes"**
6. In the commit message box, type: `Add thumbnail for [video title]`
7. Click **"Commit changes"**

**Step 2: Add the video entry to the JSON**

1. Navigate to `content/videos/index.json`
2. Click the **pencil icon** (Edit this file)
3. Add a new entry after the last one (don't forget the comma after the previous entry!)

**Video Entry Template:**

```json
{
  "id": "your-video-slug",
  "title": "Your Video Title",
  "description": "A short description of your video (2-3 sentences).",
  "category": "minecraft",
  "thumbnail": "./assets/images/your-thumbnail.jpg",
  "youtube": "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  "date": "2024-01-25",
  "tags": ["tag1", "tag2", "tag3"]
}
```

**Category options:** `minecraft`, `tutorials`, `tips`

**Step 3: Commit your changes**

1. Scroll down to "Commit changes"
2. In the commit message box, type: `Add video: [Your Video Title]`
3. Click **"Commit changes"**

Your new video will appear on the Videos page within a few minutes!

---

### Adding a New Resource

**Step 1: Upload your files**

**For direct downloads:**
1. Go to `assets/files/`
2. Click **"Add file"** → **"Upload files"**
3. Upload your file (ZIP, PDF, etc.)
4. Commit with message: `Add file: [filename]`

**For external links:** Skip this step - you'll use a URL instead.

**Step 2: Upload thumbnail**

1. Go to `assets/images/`
2. Upload your resource thumbnail image
3. Commit with message: `Add thumbnail for [resource name]`

**Step 3: Add resource entry**

1. Navigate to `content/resources/index.json`
2. Click the **pencil icon**
3. Add a new entry:

**Resource Entry Template (Direct Download):**

```json
{
  "id": "your-resource-slug",
  "title": "Your Resource Name",
  "description": "Description of what this resource does and who it's for.",
  "category": "gaming",
  "thumbnail": "./assets/images/your-thumbnail.jpg",
  "file": "./assets/files/your-file.zip",
  "external_link": "",
  "download_type": "file",
  "youtube": "https://www.youtube.com/watch?v=VIDEO_ID",
  "date": "2024-01-25",
  "tags": ["tag1", "tag2"],
  "note": ""
}
```

**Resource Entry Template (External Link):**

```json
{
  "id": "your-resource-slug",
  "title": "Your Resource Name",
  "description": "Description of what this resource does.",
  "category": "tools",
  "thumbnail": "./assets/images/your-thumbnail.jpg",
  "file": "",
  "external_link": "https://example.com/download-page",
  "download_type": "external",
  "youtube": "",
  "date": "2024-01-25",
  "tags": ["tag1", "tag2"],
  "note": "This resource is hosted externally. Visit the original creator's page to download."
}
```

**Category options:** `gaming`, `tools`, `study`

**Step 4: Commit**

Commit message: `Add resource: [Your Resource Name]`

---

### Adding a New Update/Blog Post

1. Navigate to `content/updates/index.json`
2. Click the **pencil icon**
3. Add a new entry:

**Update Entry Template:**

```json
{
  "id": "your-post-slug",
  "title": "Your Post Title",
  "date": "2024-01-25",
  "summary": "A brief summary that appears on the updates list (1-2 sentences).",
  "content": "<p>Your post content in HTML format.</p><p>Use <strong>strong</strong> for bold and <em>em</em> for italic.</p><ul><li>List item 1</li><li>List item 2</li></ul>",
  "featured_image": "./assets/images/your-image.jpg"
}
```

**HTML Tips:**
- Use `<p>` for paragraphs
- Use `<strong>text</strong>` for bold
- Use `<em>text</em>` for italic
- Use `<h3>Heading</h3>` for subheadings
- Use `<ul><li>item</li></ul>` for bullet lists
- Use `<br>` for line breaks

**Step 4: Commit**

Commit message: `Add update: [Your Post Title]`

---

## Deploy to Netlify

### Option 1: Connect GitHub Repository (Recommended)

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `/` (root)
6. Click **"Deploy site"**

Netlify will automatically deploy your site and give you a URL like `https://your-site-name.netlify.app`

### Option 2: Manual Drag & Drop

1. Zip your entire project folder
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop your zip file onto the dashboard
4. Netlify will deploy instantly

### Custom Domain (Optional)

1. In Netlify dashboard, go to **Domain settings**
2. Click **"Add custom domain"**
3. Enter your domain name
4. Follow DNS configuration instructions

---

## Theme Toggle & Local Storage

### How the Theme Works

The website has two themes:
- **Dark** (default): Deep indigo background with neon accents
- **Light**: Clean white background for daytime browsing

### Switching Themes

1. Click the **moon/sun icon** in the top-right corner of the navbar
2. Your preference is saved automatically

### Resetting Theme

If your theme gets stuck or you want to reset:

**Option 1: Clear browser storage**
1. Press `F12` to open Developer Tools
2. Go to **Application** (Chrome) or **Storage** (Firefox)
3. Click **Local Storage** → your site URL
4. Find `antigle_theme` and delete it
5. Refresh the page

**Option 2: Use browser console**
1. Press `F12` to open Developer Tools
2. Click **Console**
3. Type: `localStorage.removeItem('antigle_theme')`
4. Press Enter
5. Refresh the page

---

## Technical Notes

### Features Implemented

✅ **Fully static** - No build steps required  
✅ **JSON-driven content** - Edit JSON to add content  
✅ **Dark/Light theme** - With localStorage persistence  
✅ **Mobile-first responsive** - Works on all devices  
✅ **Accessible** - ARIA labels, keyboard navigation, focus management  
✅ **Video modals** - YouTube embed with keyboard controls  
✅ **Search & filter** - Client-side filtering for videos/resources  
✅ **Download buttons** - Direct downloads and external links  
✅ **3-dot card menus** - Copy link, share, report options  
✅ **Lazy loading** - Images load as needed  
✅ **Session caching** - JSON data cached for performance  

### Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Known Limitations

1. **File size detection**: The website attempts to show file sizes via HEAD requests, but this may not work due to CORS restrictions on some servers. The feature gracefully degrades (no size shown) when unavailable.

2. **Search is client-side**: Search only works on already-loaded content. It searches titles and tags.

3. **No server-side features**: This is a purely static site. No comments, user accounts, or dynamic server features are available.

---

## Need Help?

- **Email**: [jhamukund215@gmail.com](mailto:jhamukund215@gmail.com)
- **YouTube**: [@Notgamingplayz](https://youtube.com/@notgamingplayz)

---

## License

© 2024 The Antigle. All rights reserved.

Created with ❤️ by Mukund
