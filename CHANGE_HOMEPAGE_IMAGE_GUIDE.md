# How to Change Homepage Hero Image

## Current Image Location

**File:** `/frontend/customer-website/app/page.jsx`
**Line:** 18

## Current Code:
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80')`,
```

## Options to Change Image

### Option 1: Use Different Unsplash Image (Easiest)

Visit https://unsplash.com and search for sarees, textiles, or Indian wear.

**Popular Searches:**
- "indian saree"
- "silk saree"
- "handloom textile"
- "traditional indian wear"
- "kantha embroidery"

**Steps:**
1. Find image you like
2. Right-click → Copy image URL
3. Replace the URL in line 18

**Example:**
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-YOUR-NEW-IMAGE-ID?w=1920&q=80')`,
```

### Option 2: Upload Your Own Image

**Step 1:** Create images folder
```bash
mkdir -p /Users/divyanshurathore/shopall/frontend/customer-website/public/images
```

**Step 2:** Add your image
```bash
# Copy your image to:
/Users/divyanshurathore/shopall/frontend/customer-website/public/images/hero-saree.jpg
```

**Step 3:** Update code (line 18)
```javascript
backgroundImage: `url('/images/hero-saree.jpg')`,
```

### Option 3: Use Cloudinary (Professional)

If you have product images on Cloudinary:

```javascript
backgroundImage: `url('https://res.cloudinary.com/YOUR-CLOUD-NAME/image/upload/YOUR-IMAGE-ID.jpg')`,
```

## Recommended Saree Images (Unsplash)

Here are some beautiful Indian textile images you can use:

### 1. Purple & Gold Saree (Current)
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80')`,
```

### 2. Red Silk Saree
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1583391733981-5edd8e1b1b05?w=1920&q=80')`,
```

### 3. Orange Banarasi Saree
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1920&q=80')`,
```

### 4. Green Silk Saree
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80')`,
```

### 5. Traditional Textile Pattern
```javascript
backgroundImage: `url('https://images.unsplash.com/photo-1544376936-162f26e7e086?w=1920&q=80')`,
```

## How to Change (Step by Step)

### Method 1: Simple URL Replace

1. **Open file:**
   ```
   /Users/divyanshurathore/shopall/frontend/customer-website/app/page.jsx
   ```

2. **Find line 18:**
   ```javascript
   backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80')`,
   ```

3. **Replace URL with new one:**
   ```javascript
   backgroundImage: `url('YOUR-NEW-IMAGE-URL')`,
   ```

4. **Save file**

5. **Refresh browser** (Cmd+R or Ctrl+R)

### Method 2: Use Local Image

1. **Save your image as:**
   ```
   /frontend/customer-website/public/images/hero.jpg
   ```

2. **Update line 18:**
   ```javascript
   backgroundImage: `url('/images/hero.jpg')`,
   ```

3. **Save and refresh**

## Image Requirements

For best results:

- **Format:** JPG or PNG
- **Resolution:** 1920x1080px or higher
- **Orientation:** Landscape (horizontal)
- **File size:** Under 500KB (compress if needed)
- **Subject:** Saree or textile centered
- **Colors:** Rich, vibrant colors work best

## Test Different Images

You can quickly test different images by changing the URL:

```javascript
// Try these one by one:
backgroundImage: `url('https://images.unsplash.com/photo-1583391733981-5edd8e1b1b05?w=1920&q=80')`, // Red
backgroundImage: `url('https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=1920&q=80')`, // Orange
backgroundImage: `url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1920&q=80')`, // Purple
```

## Adjust Overlay Darkness

If image is too bright or too dark, adjust line 25:

```javascript
// Current (40% dark)
<div className="absolute inset-0 bg-black/40"></div>

// Darker (60% dark)
<div className="absolute inset-0 bg-black/60"></div>

// Lighter (20% dark)
<div className="absolute inset-0 bg-black/20"></div>

// Brown tint
<div className="absolute inset-0 bg-brown-900/50"></div>
```

## Change Text Colors

If image colors clash with text (lines 31-36):

```javascript
// Current
<span className="text-white">Timeless </span>
<span className="text-beige-200">Handloom</span>

// Alternative 1: All white
<span className="text-white">Timeless Handloom Heritage</span>

// Alternative 2: Gold accent
<span className="text-white">Timeless </span>
<span className="text-yellow-400">Handloom</span>

// Alternative 3: Brown theme
<span className="text-beige-100">Timeless </span>
<span className="text-beige-300">Handloom</span>
```

## Quick Edit Command

Run this to open the file directly:
```bash
code /Users/divyanshurathore/shopall/frontend/customer-website/app/page.jsx
```

Or with cursor at line 18:
```bash
code -g /Users/divyanshurathore/shopall/frontend/customer-website/app/page.jsx:18
```

## Pro Tips

### 1. Use High Quality Images
- Resolution: At least 1920px wide
- Aspect ratio: 16:9 or wider
- Clear focus on saree/textile

### 2. Consider Brand Colors
- Your brand uses brown/beige tones
- Choose images with warm colors
- Avoid overly bright or cool tones

### 3. Subject Placement
- Main subject should be centered
- Leave space for text overlay
- Avoid busy backgrounds

### 4. Mobile Responsiveness
- Test on mobile after changing
- Image should look good cropped
- Text should remain readable

## After Changing

1. **Save file** (Cmd+S or Ctrl+S)
2. **Refresh browser** (Cmd+R or Ctrl+R)
3. **Check mobile view** (Cmd+Option+I → Toggle device)
4. **Adjust overlay if needed** (line 25)
5. **Test text readability** (should be clear)

## Troubleshooting

### Image Not Showing?
- Check URL is correct
- Check file path is correct
- Clear browser cache (Cmd+Shift+R)
- Check image file exists

### Image Looks Stretched?
Change line 19:
```javascript
backgroundSize: 'cover',  // Current (fills screen)
backgroundSize: 'contain',  // Shows full image
```

### Image Position Wrong?
Change line 20:
```javascript
backgroundPosition: 'center',  // Current
backgroundPosition: 'top',  // Focus on top
backgroundPosition: 'bottom',  // Focus on bottom
```

### Text Not Readable?
Increase overlay darkness (line 25):
```javascript
<div className="absolute inset-0 bg-black/60"></div>  // Darker
```

## Summary

**Current Image:** Purple & gold saree (Unsplash)
**Location:** Line 18 of `/app/page.jsx`
**Quick Change:** Replace URL with new image URL
**Recommended:** Use high-res saree images (1920px+)

---

**File to Edit:** `/frontend/customer-website/app/page.jsx`
**Line to Change:** 18
**What to Change:** The URL inside `backgroundImage: url('...')`
