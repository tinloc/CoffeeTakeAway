from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import os

root = Path(r"C:\Users\nikla\OneDrive\Desktop\CoffeeTakeAway\FE\assets\images")
for folder in [
    "logo",
    "products",
    "categories",
    "category",
    "banner",
    "about",
    "users",
    "avatars",
]:
    (root / folder).mkdir(parents=True, exist_ok=True)


def add_text(draw, text, xy, color, size):
    font = None
    for candidate in [
        r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\calibri.ttf",
        r"C:\Windows\Fonts\tahoma.ttf",
    ]:
        if os.path.exists(candidate):
            font = ImageFont.truetype(candidate, size=size)
            break
    if font is None:
        font = ImageFont.load_default()
    draw.text(xy, text, fill=color, font=font)


def gradient(w, h, c1, c2):
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    for y in range(h):
        r = int(c1[0] + (c2[0] - c1[0]) * y / h)
        g = int(c1[1] + (c2[1] - c1[1]) * y / h)
        b = int(c1[2] + (c2[2] - c1[2]) * y / h)
        draw.line((0, y, w, y), fill=(r, g, b, 255))
    return img

# Create product thumbnails
product_specs = [
    ("espresso.jpg", "Espresso", "Coffee", (96, 63, 45), (156, 100, 70), (239, 180, 115)),
    ("americano.jpg", "Americano", "Coffee", (63, 88, 87), (112, 142, 137), (236, 201, 165)),
    ("latte.jpg", "Latte", "Coffee", (150, 92, 62), (195, 134, 92), (248, 220, 178)),
    ("cappuccino.jpg", "Cappuccino", "Coffee", (116, 82, 58), (181, 125, 89), (245, 210, 160)),
    ("mocha.jpg", "Mocha", "Coffee", (105, 69, 52), (144, 98, 79), (206, 154, 112)),
    ("tradao.jpg", "Trà Đào", "Tea", (232, 111, 95), (249, 183, 125), (255, 255, 255)),
    ("travai.jpg", "Trà Vải", "Tea", (203, 108, 151), (138, 80, 108), (255, 255, 255)),
    ("freeze.jpg", "Freeze", "Freeze", (95, 112, 146), (131, 170, 214), (255, 255, 255)),
    ("cake.jpg", "Tiramisu", "Cake", (139, 95, 69), (213, 155, 108), (255, 249, 240)),
    ("combo.jpg", "Combo", "Combo", (111, 90, 74), (175, 120, 88), (255, 230, 165)),
    ("coffee-latte.jpg", "Coffee Latte", "Best Seller", (95, 64, 44), (186, 136, 96), (245, 214, 177)),
]

for file_name, name, label, bg1, bg2, accent in product_specs:
    img = gradient(900, 900, bg1, bg2)
    d = ImageDraw.Draw(img)
    for i in range(16):
        x = 120 + (i * 45) % 600
        y = 120 + (i * 51) % 420
        r = 56
        d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, 35))
    d.rounded_rectangle((210, 430, 690, 760), radius=28, fill=(255, 255, 255, 210))
    d.rounded_rectangle((250, 350, 650, 430), radius=24, fill=(255, 255, 255, 230))
    d.arc((260, 300, 640, 430), 180, 360, fill=accent, width=10)
    for x in [330, 420, 510]:
        d.arc((x - 35, 180, x + 35, 320), 200, 350, fill=(255, 255, 255, 180), width=8)
    add_text(d, name, (100, 120), (255, 255, 255, 255), 66)
    add_text(d, label, (100, 202), accent, 26)
    add_text(d, "Bunny Coffee", (100, 790), (255, 255, 255, 220), 28)
    img.convert("RGB").save(root / "products" / file_name, format="JPEG", quality=95)

# Categories
for file_name, name, bg1, bg2 in [
    ("coffee.png", "Coffee", (108, 63, 43), (196, 130, 92)),
    ("tea.png", "Tea", (94, 148, 100), (177, 207, 155)),
    ("freeze.png", "Freeze", (97, 120, 180), (134, 181, 224)),
    ("cake.png", "Cake", (158, 99, 63), (207, 157, 109)),
    ("combo.png", "Combo", (104, 84, 68), (162, 118, 90)),
]:
    img = gradient(600, 600, bg1, bg2)
    d = ImageDraw.Draw(img)
    d.ellipse((120, 60, 480, 430), fill=(255, 255, 255, 130))
    d.rounded_rectangle((150, 260, 450, 440), radius=24, fill=(255, 255, 255, 220))
    d.rounded_rectangle((210, 180, 390, 270), radius=18, fill=(255, 255, 255, 230))
    for x in [220, 300, 380]:
        d.arc((x - 28, 80, x + 28, 220), 220, 340, fill=(255, 255, 255, 180), width=10)
    add_text(d, name, (210, 470), (255, 255, 255, 255), 36)
    img.save(root / "categories" / file_name, format="PNG")
    img.save(root / "category" / file_name, format="PNG")

# Banner / about / user / avatar images
for file_name, label, bg1, bg2 in [
    ("hero-coffee.png", "Coffee", (115, 80, 58), (220, 163, 110)),
    ("promotion-coffee.png", "Coffee Sale", (104, 68, 52), (198, 126, 92)),
    ("promotion-tea.png", "Tea Time", (116, 147, 96), (189, 213, 162)),
    ("deal.png", "Deal", (116, 81, 64), (214, 164, 117)),
    ("about-coffee.jpg", "About Bunny", (123, 85, 70), (197, 151, 118)),
    ("user-1.jpg", "User 1", (83, 54, 46), (167, 120, 94)),
    ("user-2.jpg", "User 2", (99, 124, 146), (165, 190, 211)),
    ("user-3.jpg", "User 3", (130, 86, 71), (214, 147, 119)),
    ("default.png", "Avatar", (130, 89, 69), (191, 145, 112)),
]:
    img = gradient(900, 700, bg1, bg2)
    d = ImageDraw.Draw(img)
    d.ellipse((190, 90, 710, 610), fill=(255, 255, 255, 120))
    d.rounded_rectangle((240, 300, 660, 540), radius=28, fill=(255, 255, 255, 190))
    for x in [310, 450, 590]:
        d.arc((x - 26, 150, x + 26, 300), 190, 340, fill=(255, 255, 255, 170), width=9)
    add_text(d, label, (320, 560), (255, 255, 255, 255), 32)
    if file_name.endswith(".jpg") and file_name == "about-coffee.jpg":
        img.convert("RGB").save(root / "about" / file_name, format="JPEG", quality=92)
    elif file_name.endswith(".jpg"):
        img.convert("RGB").save(root / "users" / file_name, format="JPEG", quality=90)
    elif file_name == "default.png":
        img.save(root / "avatars" / file_name, format="PNG")
    else:
        img.save(root / "banner" / file_name, format="PNG")

# Logo and favicon
logo = gradient(512, 512, (112, 78, 55), (214, 163, 115))
d = ImageDraw.Draw(logo)
d.ellipse((110, 70, 400, 400), fill=(255, 255, 255, 180))
d.ellipse((140, 110, 370, 350), fill=(112, 78, 55, 210))
d.arc((150, 130, 360, 340), 220, 340, fill=(255, 255, 255, 200), width=8)
for x in [180, 332]:
    d.polygon([(x, 110), (x + 35, 20), (x + 70, 110)], fill=(255, 255, 255, 210))
add_text(d, "B", (223, 205), (255, 255, 255, 255), 120)
logo.save(root / "logo" / "logo.png", format="PNG")

favicon = Image.new("RGBA", (128, 128), (0, 0, 0, 0))
d = ImageDraw.Draw(favicon)
d.rounded_rectangle((18, 18, 110, 110), radius=22, fill=(112, 78, 55, 255))
d.arc((38, 30, 90, 82), 200, 340, fill=(255, 255, 255, 220), width=10)
for x in [40, 88]:
    d.polygon([(x, 24), (x + 12, 8), (x + 24, 24)], fill=(255, 255, 255, 210))
favicon.save(root / "logo" / "favicon.png", format="PNG")

# Placeholder SVG files
placeholder_svg = '''
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#f3ede7"/>
      <stop offset="100%" stop-color="#ffffff"/>
    </linearGradient>
  </defs>
  <rect width="900" height="900" fill="url(#bg)"/>
  <circle cx="450" cy="450" r="260" fill="#e7d4b8" opacity="0.5"/>
  <rect x="180" y="430" width="540" height="300" rx="26" fill="#8d684d" fill-opacity="0.9"/>
  <rect x="250" y="350" width="400" height="80" rx="18" fill="#fff" fill-opacity="0.9"/>
  <path d="M333 245 C325 180, 390 160, 408 215" stroke="#f0d7a5" stroke-width="10" fill="none"/>
  <path d="M450 245 C442 180, 510 160, 527 215" stroke="#f0d7a5" stroke-width="10" fill="none"/>
  <path d="M567 245 C559 180, 624 160, 642 215" stroke="#f0d7a5" stroke-width="10" fill="none"/>
  <text x="450" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" fill="#4e352a" font-weight="700">Bunny</text>
  <text x="450" y="790" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="#4e352a">Demo image</text>
</svg>
'''
(root / "products" / "placeholder.svg").write_text(placeholder_svg, encoding="utf-8")
(root / "categories" / "placeholder.svg").write_text(placeholder_svg, encoding="utf-8")

required = [
    "logo/logo.png",
    "logo/favicon.png",
    "products/espresso.jpg",
    "products/americano.jpg",
    "products/latte.jpg",
    "products/cappuccino.jpg",
    "products/mocha.jpg",
    "products/tradao.jpg",
    "products/travai.jpg",
    "products/freeze.jpg",
    "products/cake.jpg",
    "products/combo.jpg",
    "products/coffee-latte.jpg",
    "products/placeholder.svg",
    "categories/coffee.png",
    "categories/tea.png",
    "categories/freeze.png",
    "categories/cake.png",
    "categories/combo.png",
    "categories/placeholder.svg",
    "banner/hero-coffee.png",
    "banner/promotion-coffee.png",
    "banner/promotion-tea.png",
    "banner/deal.png",
    "about/about-coffee.jpg",
    "users/user-1.jpg",
    "users/user-2.jpg",
    "users/user-3.jpg",
    "avatars/default.png",
]
for rel in required:
    p = root / rel
    if not p.exists():
        raise FileNotFoundError(f"Missing asset: {p}")

print("Generated demo assets successfully.")
print("Total files:", len(list(root.rglob('*'))))
