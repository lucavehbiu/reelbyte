#!/usr/bin/env python3
"""
Simple script to create placeholder icons for DealHawk extension
Requires: Pillow (pip install pillow)
"""

try:
    from PIL import Image, ImageDraw, ImageFont
    import os
except ImportError:
    print("Error: Pillow is required. Install with: pip install pillow")
    exit(1)

# Icon configuration
ICON_DIR = "icons"
BACKGROUND_COLOR = "#667eea"  # Purple-blue
TEXT_COLOR = "#ffffff"        # White

def create_placeholder_icon(size, filename):
    """Create a simple placeholder icon with text"""

    # Create image with background color
    img = Image.new('RGB', (size, size), BACKGROUND_COLOR)
    draw = ImageDraw.Draw(img)

    # Add text (hawk emoji or "DH" for DealHawk)
    text = "🦅" if size > 32 else "DH"

    try:
        # Try to use a default font
        font_size = size // 2
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", font_size)
    except:
        # Fallback to default font
        font = ImageFont.load_default()

    # Calculate text position (centered)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    position = ((size - text_width) // 2, (size - text_height) // 2)

    # Draw text
    draw.text(position, text, fill=TEXT_COLOR, font=font)

    # Save image
    filepath = os.path.join(ICON_DIR, filename)
    img.save(filepath, 'PNG')
    print(f"✓ Created {filepath} ({size}x{size})")

def main():
    # Create icons directory if it doesn't exist
    os.makedirs(ICON_DIR, exist_ok=True)

    print("Creating DealHawk placeholder icons...")
    print()

    # Create all three required sizes
    create_placeholder_icon(16, "icon16.png")
    create_placeholder_icon(48, "icon48.png")
    create_placeholder_icon(128, "icon128.png")

    print()
    print("✓ All icons created successfully!")
    print()
    print("Note: These are placeholder icons. For production, consider creating")
    print("professional icons with a proper hawk/eagle design.")

if __name__ == "__main__":
    main()
