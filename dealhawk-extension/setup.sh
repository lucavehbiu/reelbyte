#!/bin/bash
# DealHawk Extension Setup Script

set -e

echo "🦅 DealHawk Extension Setup"
echo "=============================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found"
    echo "Please run this script from the dealhawk-extension directory"
    exit 1
fi

# Create icons directory
mkdir -p icons

# Check if ImageMagick is available
if command -v convert &> /dev/null; then
    echo "✓ ImageMagick found, creating placeholder icons..."
    convert -size 16x16 xc:#667eea icons/icon16.png
    convert -size 48x48 xc:#667eea icons/icon48.png
    convert -size 128x128 xc:#667eea icons/icon128.png
    echo "✓ Icons created successfully"
else
    echo "⚠️  ImageMagick not found, creating minimal placeholder icons..."

    # Create minimal 1x1 PNG files as placeholders (base64 encoded)
    # This is a valid 1x1 transparent PNG
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icons/icon16.png
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icons/icon48.png
    echo "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==" | base64 -d > icons/icon128.png

    echo "✓ Minimal placeholder icons created"
    echo ""
    echo "⚠️  WARNING: These are 1x1 pixel placeholders!"
    echo "For better icons, install ImageMagick: sudo apt-get install imagemagick"
    echo "Or create proper icons manually and place them in the icons/ directory"
fi

echo ""
echo "=============================="
echo "✅ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Open Chrome and go to: chrome://extensions/"
echo "2. Enable 'Developer mode' (toggle in top right)"
echo "3. Click 'Load unpacked'"
echo "4. Select this directory: $(pwd)"
echo "5. Pin the extension to your toolbar"
echo ""
echo "The extension will start scanning in 1 minute."
echo "Open the popup to see opportunities!"
echo ""
