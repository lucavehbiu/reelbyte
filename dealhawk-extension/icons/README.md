# DealHawk Icons

This directory should contain the following icon files:

- `icon16.png` - 16x16 pixels (toolbar icon)
- `icon48.png` - 48x48 pixels (extension management page)
- `icon128.png` - 128x128 pixels (Chrome Web Store)

## Creating Icons

### Quick Method (Solid Color Placeholders)

If you have ImageMagick installed:

```bash
convert -size 16x16 xc:#667eea icon16.png
convert -size 48x48 xc:#667eea icon48.png
convert -size 128x128 xc:#667eea icon128.png
```

### Design Guidelines

**Theme**: Hawk/Eagle (representing "DealHawk")

**Color Scheme**:
- Primary: #667eea (purple-blue gradient)
- Accent: #764ba2 (darker purple)
- Background: White or transparent

**Style**:
- Modern, minimalist
- Clear silhouette of a hawk/eagle
- Should be recognizable at 16x16 size

### Design Tools

- **Figma** (free, web-based)
- **Canva** (templates available)
- **Adobe Illustrator**
- **Photoshop**

### Alternative: Use Emoji

For quick testing, you can use the hawk emoji (🦅) as a temporary icon:
1. Take a screenshot of the emoji
2. Resize to 16x16, 48x48, 128x128
3. Save as PNG files

## Current Status

⚠️ **Icons are missing** - Extension will not load without these files.

Please create and add the icon files before installing the extension.
