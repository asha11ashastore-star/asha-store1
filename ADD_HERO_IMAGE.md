# ✅ Hero Image Setup - Complete!

## What I Did:

1. ✅ Created `/public/images/` folder
2. ✅ Updated homepage to use your new image
3. ✅ Adjusted overlay for better visibility (30% instead of 40%)

## What You Need to Do:

### Save Your Beautiful Bridal Saree Image

**Step 1: Locate the Image**
- The red bridal saree image you just uploaded
- Find it in your Downloads or wherever you saved it

**Step 2: Save to Project**

**Option A - Using Finder (Mac):**
```
1. Open Finder
2. Navigate to: /Users/divyanshurathore/shopall/frontend/customer-website/public/images/
3. Drag your image file there
4. Rename it to: hero-saree.jpg
```

**Option B - Using VS Code:**
```
1. In VS Code, expand: frontend/customer-website/public/images/
2. Right-click on "images" folder → Reveal in Finder
3. Copy your image into this folder
4. Rename to: hero-saree.jpg
```

**Option C - Using Terminal:**
```bash
# If your image is in Downloads:
cp ~/Downloads/your-image-name.jpg /Users/divyanshurathore/shopall/frontend/customer-website/public/images/hero-saree.jpg
```

**Step 3: Verify**
```bash
# Check if image exists:
ls -lh /Users/divyanshurathore/shopall/frontend/customer-website/public/images/hero-saree.jpg
```

**Step 4: Refresh Browser**
```
1. Go to: http://localhost:3001
2. Press Cmd+Shift+R (hard refresh)
3. See your beautiful bridal saree image!
```

## Image Details:

**Your Image:**
- Beautiful red/maroon bridal saree
- Gold embroidery and details
- Professional photography
- Red gradient background
- Model wearing traditional jewelry

**Perfect for:**
- ✅ Homepage hero banner
- ✅ Bridal collection showcase
- ✅ Premium brand image
- ✅ Traditional Indian wear

## What Changed in Code:

### Before:
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80')`,
// Overlay: bg-black/40 (40% dark)
```

### After:
```javascript
backgroundImage: `url('/images/hero-saree.jpg')`,
// Overlay: bg-black/30 (30% dark - lighter for red background)
```

## Why the Lighter Overlay?

Your image has a rich red background, so I reduced the overlay from 40% to 30% to:
- Keep the red color vibrant
- Maintain brand consistency (red & gold)
- Ensure text is still readable
- Highlight the beautiful saree details

## If Text is Hard to Read:

You can adjust the overlay darkness in `/app/page.jsx` line 25:

```javascript
// Current (30% dark)
<div className="absolute inset-0 bg-black/30"></div>

// Darker (50% dark)
<div className="absolute inset-0 bg-black/50"></div>

// Lighter (20% dark)
<div className="absolute inset-0 bg-black/20"></div>
```

## Quick Commands:

### Check if image is there:
```bash
ls -lh /Users/divyanshurathore/shopall/frontend/customer-website/public/images/
```

### View image in Finder:
```bash
open /Users/divyanshurathore/shopall/frontend/customer-website/public/images/
```

### Restart Next.js (if image doesn't show):
```bash
cd /Users/divyanshurathore/shopall/frontend/customer-website
npm run dev
```

## Troubleshooting:

### Image Not Showing?
1. Check filename is exactly: `hero-saree.jpg` (lowercase, with dash)
2. Check it's in the right folder: `/public/images/`
3. Hard refresh browser: Cmd+Shift+R
4. Check browser console for errors (F12)

### Image Looks Wrong?
- **Too zoomed in?** Change `backgroundSize: 'contain'`
- **Wrong position?** Change `backgroundPosition: 'top'` or `'bottom'`
- **Too bright?** Increase overlay: `bg-black/50`

### Still Using Old Image?
```bash
# Clear Next.js cache
rm -rf /Users/divyanshurathore/shopall/frontend/customer-website/.next
cd /Users/divyanshurathore/shopall/frontend/customer-website
npm run dev
```

## File Locations:

**Image should be saved at:**
```
/Users/divyanshurathore/shopall/frontend/customer-website/public/images/hero-saree.jpg
```

**Code updated in:**
```
/Users/divyanshurathore/shopall/frontend/customer-website/app/page.jsx (line 18)
```

## Next Steps:

1. ✅ Save your image as `hero-saree.jpg` in `/public/images/`
2. ✅ Refresh browser at http://localhost:3001
3. ✅ Enjoy your beautiful new homepage!

**The image will appear as a full-screen hero banner with your brand text overlay.**

---

**Status:** ⏳ Waiting for image file
**Filename:** hero-saree.jpg
**Location:** /public/images/
**Size Recommended:** < 500KB (compress if needed)
