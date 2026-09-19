import os
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

ARTIFACT_DIR = r"C:\Users\ayoub\.gemini\antigravity\brain\9782a77e-cd41-4e03-84e7-0228a1f088b8"
TARGET_DIR = r"c:\Users\ayoub\OneDrive\Bureau\WA-parfun\wa-perfumes\public\images\perfumes\elegance"

os.makedirs(ARTIFACT_DIR, exist_ok=True)
os.makedirs(TARGET_DIR, exist_ok=True)

WIDTH, HEIGHT = 1024, 1024

# --- Color Constants (RGB) ---
GOLD_PRIMARY = (212, 175, 55)
GOLD_HIGH = (255, 223, 118)
GOLD_SHADOW = (130, 95, 20)
ROSE_GOLD = (219, 152, 140)
ROSE_GOLD_HIGH = (250, 200, 190)
ROSE_GOLD_SHADOW = (140, 75, 70)
SILVER_GOLD = (230, 220, 195)

def normalize(v):
    norm = np.linalg.norm(v, axis=-1, keepdims=True)
    norm[norm == 0] = 1.0
    return v / norm

# Metallic Shading Helper
def create_metallic_gradient(width, height, angle_deg=45, base_color=(212, 175, 55), light_color=(255, 240, 180), dark_color=(120, 85, 15)):
    ang = math.radians(angle_deg)
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    proj = xx * math.cos(ang) + yy * math.sin(ang)
    
    # Striped specular bands for realistic polished metal look
    pattern = 0.5 + 0.5 * np.sin(proj * math.pi * 3.5)
    pattern = np.power(pattern, 1.8)
    
    img = np.zeros((height, width, 3), dtype=np.float32)
    for c in range(3):
        low = dark_color[c]
        mid = base_color[c]
        high = light_color[c]
        channel = np.where(pattern < 0.5, low + (mid - low) * (pattern * 2), mid + (high - mid) * ((pattern - 0.5) * 2))
        img[:, :, c] = channel
    return np.clip(img, 0, 255).astype(np.uint8)

# Studio Background Setup
def render_studio_background(width, height, spot_center, spot_radius, spot_color_bgr, intensity=1.0):
    # Pure dark studio base #050505
    bg = np.full((height, width, 3), [5, 5, 5], dtype=np.float32)
    
    y, x = np.ogrid[:height, :width]
    dist = np.sqrt((x - spot_center[0])**2 + (y - spot_center[1])**2)
    glow = np.exp(-dist**2 / (2.0 * spot_radius**2)) * intensity
    
    for c in range(3):
        bg[:, :, c] += glow * spot_color_bgr[c]
        
    # Floor at y = 800
    floor_y = 800
    floor_dist = (np.arange(floor_y, height, dtype=np.float32) - floor_y) / float(height - floor_y)
    floor_dist = floor_dist[:, None]
    
    # Dark reflective obsidian floor with gradient sheen
    for c in range(3):
        floor_glow = glow[floor_y:, :] * spot_color_bgr[c] * 0.25 * (1.0 - floor_dist * 0.7)
        bg[floor_y:, :, c] = np.maximum(bg[floor_y:, :, c] * 0.6, floor_glow)
        
    # Horizon line highlight
    bg[floor_y-2:floor_y+2, :, :] += spot_color_bgr * 0.15
    
    return np.clip(bg, 0, 255).astype(np.uint8)

# ----------------------------------------------------
# BOTTLE GENERATOR FUNCTIONS
# ----------------------------------------------------

def generate_wa_elegance_01():
    """ 1. wa-elegance-01: A delicate teardrop-shaped blush pink glass bottle with a rose gold floral cap. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 420), 340, np.array([160, 110, 210], dtype=np.float32), 1.2)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 540
    
    # Glass Teardrop Body (Pointy top, wide rounded bottom)
    pts = []
    num_pts = 180
    for i in range(num_pts):
        t = i / num_pts * 2 * math.pi
        # Teardrop formula
        r = 180 * (1 - math.sin(t)) * 0.65 + 40
        x = cx + r * math.cos(t) * 1.15
        y = cy + r * math.sin(t) * 1.3 - 40
        pts.append((x, y))
        
    # Draw blush pink glass fill & refraction contour
    draw.polygon(pts, fill=(250, 195, 205, 215), outline=(255, 240, 245, 240))
    
    # Liquid Core (smaller inner teardrop)
    pts_in = []
    for i in range(num_pts):
        t = i / num_pts * 2 * math.pi
        r = 150 * (1 - math.sin(t)) * 0.62 + 30
        x = cx + r * math.cos(t) * 1.05
        y = cy + r * math.sin(t) * 1.2 - 25
        pts_in.append((x, y))
    draw.polygon(pts_in, fill=(235, 130, 160, 230))
    
    # Internal liquid caustic glow
    caustic = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(caustic)
    c_draw.ellipse([cx-90, cy-20, cx+90, cy+140], fill=(255, 210, 225, 140))
    caustic = caustic.filter(ImageFilter.GaussianBlur(15))
    draw_layer.alpha_composite(caustic)
    
    # Highlights (Left curving specular streak)
    glare = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glare)
    g_draw.arc([cx-170, cy-180, cx+140, cy+190], start=120, end=210, fill=(255, 255, 255, 210), width=18)
    g_draw.arc([cx-150, cy-160, cx+120, cy+170], start=130, end=200, fill=(255, 240, 250, 160), width=8)
    glare = glare.filter(ImageFilter.GaussianBlur(4))
    draw_layer.alpha_composite(glare)
    
    # Rose Gold Collar & Neck
    neck_w, neck_h = 60, 45
    draw.rectangle([cx-neck_w//2, cy-260, cx+neck_w//2, cy-215], fill=(219, 152, 140, 255), outline=(255, 220, 210, 255), width=2)
    draw.rectangle([cx-neck_w//2+10, cy-260, cx-neck_w//2+22, cy-215], fill=(255, 235, 225, 200))
    
    # Rose Gold Floral Cap (Sculpted Petals)
    cap_cx, cap_cy = cx, cy - 295
    for petal_i in range(12):
        angle = petal_i * (2 * math.pi / 12)
        px = cap_cx + math.cos(angle) * 48
        py = cap_cy + math.sin(angle) * 38
        draw.ellipse([px-28, py-28, px+28, py+28], fill=(219, 152, 140, 255), outline=(255, 220, 200, 255), width=2)
        draw.ellipse([px-14, py-14, px+14, py+14], fill=(250, 195, 185, 220))
    # Center jewel bud
    draw.ellipse([cap_cx-26, cap_cy-26, cap_cx+26, cap_cy+26], fill=(255, 215, 0, 255), outline=(255, 245, 200, 255), width=3)
    draw.ellipse([cap_cx-10, cap_cy-15, cap_cx+5, cap_cy], fill=(255, 255, 240, 220))
    
    # Rose Petals & Dust Particles
    np.random.seed(101)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(25):
        px = np.random.randint(100, WIDTH - 100)
        py = np.random.randint(120, HEIGHT - 180)
        pr = np.random.randint(10, 24)
        p_draw.ellipse([px, py, px+pr, py+int(pr*1.4)], fill=(240, 140, 170, np.random.randint(100, 180)))
    for _ in range(50):
        px = np.random.randint(60, WIDTH - 60)
        py = np.random.randint(60, HEIGHT - 100)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 220, 180, np.random.randint(120, 230)))
    p_layer = p_layer.filter(ImageFilter.GaussianBlur(1))
    draw_layer.alpha_composite(p_layer)
    
    # Floor Reflection
    return composite_with_reflection(canvas, draw_layer, cy - 295, cy + 220)

def generate_wa_elegance_02():
    """ 2. wa-elegance-02: A tall, slender crystalline bottle with a swirling light blue core and silver-gold accents. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 400), 320, np.array([230, 170, 70], dtype=np.float32), 1.25)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 510
    bw, bh = 220, 520
    
    left, top, right, bottom = cx - bw//2, cy - bh//2, cx + bw//2, cy + bh//2
    
    # Multi-faceted Crystal Body (Hexagonal / Diamond Cut Facets)
    outer_pts = [(left+40, top), (right-40, top), (right, top+80), (right, bottom-80), (right-40, bottom), (left+40, bottom), (left, bottom-80), (left, top+80)]
    draw.polygon(outer_pts, fill=(180, 230, 255, 210), outline=(240, 250, 255, 240), width=3)
    
    # Swirling Light Blue Liquid Core
    core_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(core_layer)
    for r_i in range(120, 10, -10):
        c_draw.ellipse([cx - r_i*0.6, cy - r_i*1.8 + 40, cx + r_i*0.6, cy + r_i*1.8 + 40], fill=(70, 170, 240, 25))
    
    # Internal Swirl Strands
    for sw in range(6):
        sw_pts = []
        for sy in range(top + 80, bottom - 80, 10):
            phase = (sy - top) * 0.02 + sw * 1.0
            sx = cx + math.sin(phase) * 35
            sw_pts.append((sx, sy))
        c_draw.line(sw_pts, fill=(150, 220, 255, 180), width=6)
    core_layer = core_layer.filter(ImageFilter.GaussianBlur(5))
    draw_layer.alpha_composite(core_layer)
    
    # Facet Lines (Geometric Crystal Refractions)
    draw.line([(left+40, top), (cx, top+100), (right-40, top)], fill=(255, 255, 255, 180), width=2)
    draw.line([(left, top+80), (cx, top+100), (right, top+80)], fill=(255, 255, 255, 180), width=2)
    draw.line([(cx, top+100), (cx, bottom-100)], fill=(255, 255, 255, 220), width=3)
    draw.line([(left+40, bottom), (cx, bottom-100), (right-40, bottom)], fill=(255, 255, 255, 180), width=2)
    
    # Highlights
    h_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    hd = ImageDraw.Draw(h_layer)
    hd.polygon([(left+10, top+80), (left+35, top+80), (left+35, bottom-80), (left+10, bottom-80)], fill=(255, 255, 255, 140))
    hd.polygon([(right-30, top+80), (right-15, top+80), (right-15, bottom-80), (right-30, bottom-80)], fill=(255, 255, 255, 90))
    h_layer = h_layer.filter(ImageFilter.GaussianBlur(3))
    draw_layer.alpha_composite(h_layer)
    
    # Silver-Gold Metallic Collar & Tall Cylinder Cap
    neck_top = top - 40
    draw.rectangle([cx-35, neck_top, cx+35, top], fill=(230, 220, 195, 255), outline=(255, 245, 220, 255), width=2)
    draw.rectangle([cx-15, neck_top, cx, top], fill=(255, 255, 245, 200))
    
    cap_top = neck_top - 120
    draw.rectangle([cx-40, cap_top, cx+40, neck_top], fill=(225, 215, 185, 255), outline=(255, 245, 210, 255), width=3)
    draw.rectangle([cx-25, cap_top+10, cx-10, neck_top-10], fill=(255, 255, 245, 210))
    draw.rectangle([cx+15, cap_top+10, cx+25, neck_top-10], fill=(255, 255, 245, 130))
    
    # Sparkle particles
    np.random.seed(102)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(60):
        px = np.random.randint(80, WIDTH - 80)
        py = np.random.randint(60, HEIGHT - 100)
        pr = np.random.randint(2, 5)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(200, 235, 255, np.random.randint(140, 240)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, cap_top, bottom)

def generate_wa_elegance_03():
    """ 3. wa-elegance-03: A soft, rounded warm vanilla-colored frosted glass bottle with a heavy gold sphere cap. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 440), 350, np.array([40, 120, 190], dtype=np.float32), 1.1)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 550
    rx, ry = 160, 190
    
    # Frosted Vanilla Glass Body (Soft oval with velvety matte look)
    draw.ellipse([cx-rx, cy-ry, cx+rx, cy+ry], fill=(255, 248, 230, 225), outline=(255, 252, 240, 240), width=4)
    
    # Soft inner liquid warmth
    draw.ellipse([cx-rx+20, cy-ry+25, cx+rx-20, cy+ry-20], fill=(245, 215, 155, 210))
    
    # Velvet Frosted Blur Overlay
    frost = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    fd = ImageDraw.Draw(frost)
    fd.ellipse([cx-rx+10, cy-ry+10, cx+rx-10, cy+ry-10], fill=(255, 250, 235, 90))
    frost = frost.filter(ImageFilter.GaussianBlur(12))
    draw_layer.alpha_composite(frost)
    
    # Soft Satin Specular Sheen
    sheen = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sheen)
    sd.ellipse([cx-rx+25, cy-ry+30, cx-20, cy+20], fill=(255, 255, 255, 110))
    sheen = sheen.filter(ImageFilter.GaussianBlur(18))
    draw_layer.alpha_composite(sheen)
    
    # Neck Collar (Gold)
    neck_w, neck_h = 75, 40
    neck_top = cy - ry - 25
    draw.rectangle([cx-neck_w//2, neck_top, cx+neck_w//2, cy-ry+15], fill=(212, 175, 55, 255), outline=(255, 235, 150, 255), width=2)
    draw.rectangle([cx-15, neck_top, cx, cy-ry+15], fill=(255, 245, 200, 210))
    
    # Heavy Gold Sphere Cap
    sphere_r = 75
    sp_cx, sp_cy = cx, neck_top - sphere_r + 10
    draw.ellipse([sp_cx-sphere_r, sp_cy-sphere_r, sp_cx+sphere_r, sp_cy+sphere_r], fill=(212, 175, 55, 255), outline=(255, 235, 140, 255), width=3)
    
    # Metallic Sphere Specular Highlights & 3D Shading
    sp_h = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    spd = ImageDraw.Draw(sp_h)
    spd.ellipse([sp_cx-sphere_r+20, sp_cy-sphere_r+15, sp_cx-10, sp_cy-10], fill=(255, 255, 230, 200))
    spd.ellipse([sp_cx-sphere_r+30, sp_cy-sphere_r+25, sp_cx-20, sp_cy-20], fill=(255, 255, 255, 240))
    sp_h = sp_h.filter(ImageFilter.GaussianBlur(5))
    draw_layer.alpha_composite(sp_h)
    
    # Floating Golden Dust
    np.random.seed(103)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(50):
        px = np.random.randint(80, WIDTH - 80)
        py = np.random.randint(80, HEIGHT - 100)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 215, 110, np.random.randint(110, 230)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, sp_cy - sphere_r, cy + ry)

def generate_wa_elegance_04():
    """ 4. wa-elegance-04: A dramatic deep red glass bottle with sweeping curves and a sharp gold stiletto-inspired cap. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 420), 330, np.array([20, 20, 160], dtype=np.float32), 1.3)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 530
    
    # Sweeping Curved Deep Red Glass Silhouette (Hourglass / S-Curve contour)
    pts_left = []
    pts_right = []
    top_y = cy - 210
    bot_y = cy + 210
    
    for y_i in range(top_y, bot_y + 1, 5):
        norm_y = (y_i - top_y) / (bot_y - top_y)
        # Sweeping curve equation
        w = 110 + 60 * math.sin(norm_y * math.pi) + 25 * math.cos(norm_y * math.pi * 2)
        pts_left.append((cx - w, y_i))
        pts_right.append((cx + w, y_i))
        
    bottle_poly = pts_left + pts_right[::-1]
    draw.polygon(bottle_poly, fill=(170, 10, 30, 235), outline=(230, 50, 70, 255), width=3)
    
    # Deep Ruby Liquid Core
    inner_poly = [(px + (15 if px < cx else -15), py) for px, py in bottle_poly]
    draw.polygon(inner_poly, fill=(110, 0, 15, 240))
    
    # Dramatic Rim Light & Glass Glare
    glare = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glare)
    gd.polygon(pts_left[:len(pts_left)//2] + [(px+22, py) for px, py in pts_left[:len(pts_left)//2][::-1]], fill=(255, 120, 140, 190))
    gd.polygon(pts_right[len(pts_right)//2:] + [(px-18, py) for px, py in pts_right[len(pts_right)//2:][::-1]], fill=(255, 100, 120, 140))
    glare = glare.filter(ImageFilter.GaussianBlur(4))
    draw_layer.alpha_composite(glare)
    
    # Gold Collar
    draw.rectangle([cx-35, top_y-25, cx+35, top_y], fill=(212, 175, 55, 255), outline=(255, 235, 150, 255), width=2)
    draw.rectangle([cx-15, top_y-25, cx-2, top_y], fill=(255, 245, 200, 220))
    
    # Sharp Gold Stiletto-inspired Cap (Tall tapered golden spire)
    spire_top = top_y - 210
    spire_pts = [(cx, spire_top), (cx+38, top_y-25), (cx-38, top_y-25)]
    draw.polygon(spire_pts, fill=(212, 175, 55, 255), outline=(255, 235, 150, 255), width=3)
    
    # Stiletto Sheen
    draw.polygon([(cx, spire_top), (cx-10, top_y-25), (cx-35, top_y-25)], fill=(255, 245, 200, 220))
    
    # Sparkles & Drama
    np.random.seed(104)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(45):
        px = np.random.randint(80, WIDTH - 80)
        py = np.random.randint(60, HEIGHT - 100)
        pr = np.random.randint(2, 5)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 180, 190, np.random.randint(120, 230)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, spire_top, bot_y)

def generate_wa_elegance_05():
    """ 5. wa-elegance-05: A vibrant coral-tinted asymmetrical glass bottle that looks like a polished gemstone, gold base. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 430), 340, np.array([60, 130, 230], dtype=np.float32), 1.2)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 510
    
    # Heavy Solid Gold Base / Pedestal Setting
    base_top = cy + 140
    base_bot = cy + 220
    draw.polygon([(cx-160, base_bot), (cx+160, base_bot), (cx+140, base_top), (cx-140, base_top)], fill=(212, 175, 55, 255), outline=(255, 235, 150, 255), width=3)
    draw.polygon([(cx-120, base_bot), (cx-60, base_bot), (cx-50, base_top), (cx-100, base_top)], fill=(255, 245, 190, 200))
    
    # Asymmetrical Gemstone Cut Silhouette
    gem_pts = [
        (cx - 30, cy - 200), # Top peak offset
        (cx + 120, cy - 140),
        (cx + 175, cy + 20),
        (cx + 130, base_top),
        (cx - 130, base_top),
        (cx - 180, cy + 40),
        (cx - 150, cy - 110)
    ]
    
    draw.polygon(gem_pts, fill=(255, 125, 95, 220), outline=(255, 190, 175, 240), width=3)
    
    # Coral Liquid Core Facets
    inner_gem = [(cx_i + (18 if cx_i < cx else -18), cy_i + (15 if cy_i < cy else -15)) for cx_i, cy_i in gem_pts]
    draw.polygon(inner_gem, fill=(245, 90, 70, 230))
    
    # Internal Gemstone Facet Lines & Light Refractions
    center_pt = (cx - 10, cy - 20)
    for p in gem_pts:
        draw.line([center_pt, p], fill=(255, 220, 210, 180), width=2)
        
    # Specular Highlights on Coral Facets
    facet_h = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    fd = ImageDraw.Draw(facet_h)
    fd.polygon([gem_pts[0], gem_pts[6], center_pt], fill=(255, 255, 255, 150))
    fd.polygon([gem_pts[5], gem_pts[6], center_pt], fill=(255, 230, 220, 100))
    facet_h = facet_h.filter(ImageFilter.GaussianBlur(3))
    draw_layer.alpha_composite(facet_h)
    
    # Gold Stopper Cap
    draw.polygon([(cx-45, cy-200), (cx-10, cy-270), (cx+25, cy-200)], fill=(212, 175, 55, 255), outline=(255, 235, 150, 255), width=3)
    draw.polygon([(cx-30, cy-200), (cx-10, cy-270), (cx-5, cy-200)], fill=(255, 245, 200, 210))
    
    # Coral ambient dust
    np.random.seed(105)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(50):
        px = np.random.randint(60, WIDTH - 60)
        py = np.random.randint(60, HEIGHT - 100)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 160, 130, np.random.randint(120, 230)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, cy - 270, base_bot)

def generate_wa_elegance_06():
    """ 6. wa-elegance-06: An avant-garde bottle featuring contrasting clear glass and dark marble textures, rose gold rings. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 420), 320, np.array([120, 120, 120], dtype=np.float32), 1.0)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 520
    bw, bh = 260, 440
    left, top, right, bottom = cx - bw//2, cy - bh//2, cx + bw//2, cy + bh//2
    
    # Split Architectural Block: Left Half Clear Glass, Right Half Dark Marble
    # Left Half: Clear Glass
    draw.rectangle([left, top, cx, bottom], fill=(230, 235, 240, 190), outline=(255, 255, 255, 230), width=3)
    # Right Half: Dark Marble Texture
    marble_img = np.full((bh, bw//2, 3), [25, 25, 30], dtype=np.uint8)
    # Marble white veins
    np.random.seed(106)
    for _ in range(12):
        vx = np.random.randint(0, bw//2)
        vy = np.random.randint(0, bh)
        cv2.line(marble_img, (vx, vy), (vx + np.random.randint(-40, 40), vy + np.random.randint(30, 80)), (180, 180, 190), np.random.randint(1, 3))
    marble_img = cv2.GaussianBlur(marble_img, (3, 3), 0)
    marble_pil = Image.fromarray(marble_img).convert("RGBA")
    
    draw_layer.paste(marble_pil, (cx, top))
    draw.rectangle([cx, top, right, bottom], outline=(200, 160, 150, 255), width=3)
    
    # Rose Gold Stacked Rings encircling the body joint & neck
    ring_ys = [cy - 120, cy, cy + 120]
    for ry in ring_ys:
        draw.ellipse([cx - 145, ry - 18, cx + 145, ry + 18], fill=(219, 152, 140, 255), outline=(255, 220, 200, 255), width=3)
        draw.ellipse([cx - 100, ry - 10, cx - 40, ry + 10], fill=(255, 235, 220, 200))
        
    # Glass Glass Glare on Left Side
    glare = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glare)
    gd.rectangle([left+12, top+15, left+30, bottom-15], fill=(255, 255, 255, 160))
    glare = glare.filter(ImageFilter.GaussianBlur(4))
    draw_layer.alpha_composite(glare)
    
    # Avant-garde Rose Gold Geometric Cap
    cap_top = top - 80
    draw.rectangle([cx-50, cap_top, cx+50, top], fill=(219, 152, 140, 255), outline=(255, 220, 200, 255), width=3)
    draw.rectangle([cx-25, cap_top+8, cx-10, top-8], fill=(255, 235, 225, 210))
    
    return composite_with_reflection(canvas, draw_layer, cap_top, bottom)

def generate_wa_elegance_07():
    """ 7. wa-elegance-07: A timeless champagne-gold glass bottle with a subtle hourglass silhouette, luxurious and heavy. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 410), 340, np.array([50, 120, 180], dtype=np.float32), 1.25)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 530
    
    # Hourglass Silhouette (Wide top & base, slender waist)
    pts_left = []
    pts_right = []
    top_y = cy - 200
    bot_y = cy + 220
    
    for y_i in range(top_y, bot_y + 1, 5):
        norm_y = (y_i - top_y) / (bot_y - top_y)
        w = 140 - 45 * math.sin(norm_y * math.pi) # Hourglass waist in middle
        pts_left.append((cx - w, y_i))
        pts_right.append((cx + w, y_i))
        
    poly = pts_left + pts_right[::-1]
    
    # Champagne-Gold Tinted Glass
    draw.polygon(poly, fill=(245, 220, 165, 225), outline=(255, 245, 200, 250), width=4)
    
    # Warm Golden Liquid Core
    inner_poly = [(px + (16 if px < cx else -16), py) for px, py in poly]
    draw.polygon(inner_poly, fill=(230, 190, 115, 235))
    
    # Thick Crystal Glass Base
    draw.polygon(pts_left[-10:] + pts_right[-10:][::-1], fill=(255, 240, 190, 240))
    
    # Specular Glare Lines along curves
    glare = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glare)
    gd.polygon(pts_left[:len(pts_left)//2] + [(px+20, py) for px, py in pts_left[:len(pts_left)//2][::-1]], fill=(255, 255, 240, 180))
    gd.polygon(pts_right[:len(pts_right)//2] + [(px-15, py) for px, py in pts_right[:len(pts_right)//2][::-1]], fill=(255, 255, 220, 120))
    glare = glare.filter(ImageFilter.GaussianBlur(3))
    draw_layer.alpha_composite(glare)
    
    # Fluted Gold Neck Collar & Sculpted Gold Crown Top
    draw.rectangle([cx-40, top_y-30, cx+40, top_y], fill=(212, 175, 55, 255), outline=(255, 240, 170, 255), width=2)
    
    cap_top = top_y - 120
    draw.ellipse([cx-55, cap_top, cx+55, top_y-25], fill=(212, 175, 55, 255), outline=(255, 240, 170, 255), width=3)
    draw.ellipse([cx-30, cap_top+12, cx-5, cap_top+45], fill=(255, 255, 220, 220))
    
    # Floating champagne sparkles
    np.random.seed(107)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(60):
        px = np.random.randint(70, WIDTH - 70)
        py = np.random.randint(60, HEIGHT - 90)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 230, 150, np.random.randint(130, 240)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, cap_top, bot_y)

def generate_wa_elegance_08():
    """ 8. wa-elegance-08: A dreamy creamy white porcelain-like bottle with intricate gold filigree wrapped around it. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 420), 340, np.array([120, 150, 170], dtype=np.float32), 1.1)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 530
    bw, bh = 270, 420
    left, top, right, bottom = cx - bw//2, cy - bh//2, cx + bw//2, cy + bh//2
    
    # Opaque Creamy White Porcelain Bottle Body
    draw.rounded_rectangle([left, top, right, bottom], radius=45, fill=(250, 247, 242, 255), outline=(255, 255, 255, 255), width=3)
    
    # Soft porcelain satin shading
    porc_s = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    pd = ImageDraw.Draw(porc_s)
    pd.rounded_rectangle([left+15, top+15, cx-20, bottom-15], radius=35, fill=(255, 255, 255, 120))
    pd.rounded_rectangle([cx+20, top+15, right-15, bottom-15], radius=35, fill=(225, 220, 212, 90))
    porc_s = porc_s.filter(ImageFilter.GaussianBlur(10))
    draw_layer.alpha_composite(porc_s)
    
    # Intricate Gold Filigree Wrapping (Lattice, vines, ornate scrolls)
    f_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    fd = ImageDraw.Draw(f_layer)
    
    np.random.seed(108)
    # Filigree lattice pattern across bottle
    for fy in range(top + 40, bottom - 40, 35):
        # Sweeping gold scroll arcs
        fd.arc([left+20, fy, right-20, fy+60], start=0, end=180, fill=(212, 175, 55, 240), width=4)
        fd.arc([left+20, fy-20, right-20, fy+40], start=180, end=360, fill=(212, 175, 55, 240), width=4)
        
    # Vertical ornate filigree pillars
    fd.line([(cx-60, top+20), (cx-60, bottom-20)], fill=(212, 175, 55, 230), width=3)
    fd.line([(cx+60, top+20), (cx+60, bottom-20)], fill=(212, 175, 55, 230), width=3)
    
    # Center WA Medallion filigree emblem
    fd.ellipse([cx-45, cy-45, cx+45, cy+45], fill=(212, 175, 55, 255), outline=(255, 235, 160, 255), width=3)
    fd.ellipse([cx-32, cy-32, cx+32, cy+32], fill=(250, 247, 242, 255))
    
    f_layer = f_layer.filter(ImageFilter.GaussianBlur(0.8))
    draw_layer.alpha_composite(f_layer)
    
    # Ornate Gold Filigree Cap
    cap_top = top - 90
    draw.rounded_rectangle([cx-45, cap_top, cx+45, top-10], radius=15, fill=(212, 175, 55, 255), outline=(255, 235, 160, 255), width=3)
    draw.ellipse([cx-25, cap_top+10, cx+25, cap_top+45], fill=(255, 245, 190, 220))
    
    # Ethereal floating gold dust
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(50):
        px = np.random.randint(60, WIDTH - 60)
        py = np.random.randint(60, HEIGHT - 100)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 225, 140, np.random.randint(120, 230)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, cap_top, bottom)

def generate_wa_elegance_09():
    """ 9. wa-elegance-09: An iconic, sculptural black and gold bottle with fluid, elegant lines, exuding Parisian luxury. """
    bg_bgr = render_studio_background(WIDTH, HEIGHT, (512, 410), 340, np.array([30, 90, 160], dtype=np.float32), 1.3)
    canvas = Image.fromarray(cv2.cvtColor(bg_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    cx, cy = 512, 530
    
    # Fluid Sculptural Body (High-Gloss Piano Black)
    top_y = cy - 210
    bot_y = cy + 220
    
    pts_left = []
    pts_right = []
    for y_i in range(top_y, bot_y + 1, 5):
        norm_y = (y_i - top_y) / (bot_y - top_y)
        # Fluid twist curve
        w = 135 + 40 * math.sin(norm_y * math.pi * 1.5)
        offset = 25 * math.sin(norm_y * math.pi * 2)
        pts_left.append((cx - w + offset, y_i))
        pts_right.append((cx + w + offset, y_i))
        
    poly = pts_left + pts_right[::-1]
    draw.polygon(poly, fill=(18, 18, 22, 255), outline=(60, 60, 70, 255), width=3)
    
    # Fluid Polished Gold Ribbon Wrapping around Black Body
    ribbon = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    rd = ImageDraw.Draw(ribbon)
    
    for ry in range(top_y + 30, bot_y - 30, 70):
        rd.arc([cx - 150, ry, cx + 150, ry + 80], start=30, end=210, fill=(212, 175, 55, 255), width=18)
        rd.arc([cx - 150, ry + 5, cx + 150, ry + 85], start=35, end=205, fill=(255, 245, 190, 220), width=6)
        
    draw_layer.alpha_composite(ribbon)
    
    # High-Gloss Piano Reflection & Studio Rim Lights
    glare = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glare)
    gd.polygon(pts_left[:len(pts_left)//2] + [(px+25, py) for px, py in pts_left[:len(pts_left)//2][::-1]], fill=(255, 255, 255, 190))
    gd.polygon(pts_right[len(pts_right)//2:] + [(px-20, py) for px, py in pts_right[len(pts_right)//2:][::-1]], fill=(255, 220, 150, 140))
    glare = glare.filter(ImageFilter.GaussianBlur(4))
    draw_layer.alpha_composite(glare)
    
    # Sculptural Gold & Black Cap
    cap_top = top_y - 110
    draw.rounded_rectangle([cx-45, cap_top, cx+45, top_y-10], radius=12, fill=(20, 20, 24, 255), outline=(212, 175, 55, 255), width=4)
    draw.rectangle([cx-15, cap_top+8, cx+15, top_y-18], fill=(212, 175, 55, 255))
    draw.rectangle([cx-5, cap_top+8, cx+5, top_y-18], fill=(255, 245, 200, 230))
    
    # Parisian Luxury Golden Sparkle Atmosphere
    np.random.seed(109)
    p_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(p_layer)
    for _ in range(65):
        px = np.random.randint(60, WIDTH - 60)
        py = np.random.randint(50, HEIGHT - 90)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(255, 215, 110, np.random.randint(130, 250)))
    draw_layer.alpha_composite(p_layer)
    
    return composite_with_reflection(canvas, draw_layer, cap_top, bot_y)

# Composite Bottle onto Obsidian Mirror Floor
def composite_with_reflection(canvas, bottle_layer, bottle_top, bottle_bottom):
    # Crop bottle for reflection
    crop_h = int(bottle_bottom - bottle_top)
    crop_y = max(0, int(bottle_top))
    crop_b = min(HEIGHT, int(bottle_bottom + 10))
    
    ref_crop = bottle_layer.crop((0, crop_y, WIDTH, crop_b))
    ref_flip = ref_crop.transpose(Image.FLIP_TOP_BOTTOM)
    
    ref_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ref_layer.paste(ref_flip, (0, int(bottle_bottom - 5)))
    
    # Soft reflection blur
    ref_layer = ref_layer.filter(ImageFilter.GaussianBlur(7))
    
    # Gradient fade downwards on floor
    ref_np = np.array(ref_layer).astype(np.float32)
    start_y = int(bottle_bottom - 5)
    
    for y_i in range(start_y, HEIGHT):
        dist = (y_i - start_y) / float(max(1, HEIGHT - start_y))
        alpha_mult = max(0.0, 0.45 * (1.0 - dist * 1.2))
        ref_np[y_i, :, 3] *= alpha_mult
        
    ref_final = Image.fromarray(ref_np.astype(np.uint8))
    
    final_canvas = Image.new("RGBA", (WIDTH, HEIGHT), (5, 5, 5, 255))
    final_canvas.paste(canvas, (0, 0), canvas)
    final_canvas.paste(ref_final, (0, 0), ref_final)
    final_canvas.paste(bottle_layer, (0, 0), bottle_layer)
    
    return final_canvas.convert("RGB")

GENERATORS = {
    'wa-elegance-01': generate_wa_elegance_01,
    'wa-elegance-02': generate_wa_elegance_02,
    'wa-elegance-03': generate_wa_elegance_03,
    'wa-elegance-04': generate_wa_elegance_04,
    'wa-elegance-05': generate_wa_elegance_05,
    'wa-elegance-06': generate_wa_elegance_06,
    'wa-elegance-07': generate_wa_elegance_07,
    'wa-elegance-08': generate_wa_elegance_08,
    'wa-elegance-09': generate_wa_elegance_09,
}

if __name__ == "__main__":
    for i in range(1, 10):
        name = f"wa-elegance-0{i}"
        print(f"Rendering photorealistic luxury image [{i}/9]: {name}...")
        img = GENERATORS[name]()
        
        art_path = os.path.join(ARTIFACT_DIR, f"{name}.jpg")
        tgt_path = os.path.join(TARGET_DIR, f"{name}.jpg")
        
        img.save(art_path, "JPEG", quality=96)
        img.save(tgt_path, "JPEG", quality=96)
        print(f"  -> Saved {art_path}")
        print(f"  -> Saved {tgt_path}")
        
    print("\nSUCCESS: All 9 WA Elegance luxury perfume images generated and copied successfully!")
