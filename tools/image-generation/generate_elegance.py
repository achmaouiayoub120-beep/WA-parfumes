import os
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFilter

ARTIFACT_DIR = r"C:\Users\ayoub\.gemini\antigravity\brain\d4b4dee3-5544-408e-863c-4c0ac1b100c4"
TARGET_DIR = r"c:\Users\ayoub\OneDrive\Bureau\WA-parfun\public\images\perfumes\elegance"

os.makedirs(ARTIFACT_DIR, exist_ok=True)
os.makedirs(TARGET_DIR, exist_ok=True)

WIDTH, HEIGHT = 1024, 1024

def create_radial_spotlight(width, height, center, radius, color_bgr, intensity=1.0):
    y, x = np.ogrid[:height, :width]
    dist = np.sqrt((x - center[0])**2 + (y - center[1])**2)
    glow = np.exp(-dist**2 / (2 * radius**2)) * intensity
    spotlight = np.zeros((height, width, 3), dtype=np.float32)
    for c in range(3):
        spotlight[:, :, c] = glow * color_bgr[c]
    return spotlight

def generate_perfume_image(index, name, spec):
    print(f"Rendering [{index}/9] {name}...")
    
    # 1. Base Dark Background #050505 (BGR: 5, 5, 5)
    bg = np.full((HEIGHT, WIDTH, 3), [5, 5, 5], dtype=np.float32)
    
    # 2. Mood & Lighting
    glow_color = spec['glow_color'] # BGR
    spotlight = create_radial_spotlight(WIDTH, HEIGHT, (WIDTH//2, HEIGHT//2 - 60), 320, glow_color, intensity=spec['glow_intensity'])
    bg = np.clip(bg + spotlight, 0, 255)
    
    # Floor reflections / pedestal line at y=820
    floor_y = 800
    y_grid, x_grid = np.ogrid[:HEIGHT, :WIDTH]
    floor_mask = y_grid >= floor_y
    floor_grad = np.clip((y_grid - floor_y) / (HEIGHT - floor_y), 0, 1)
    
    # Subtle floor sheen
    floor_sheen = np.zeros((HEIGHT, WIDTH, 3), dtype=np.float32)
    for c in range(3):
        floor_sheen[:, :, c] = floor_grad * glow_color[c] * 0.15
    bg = np.clip(bg + floor_sheen * floor_mask, 0, 255)
    
    img_bgr = bg.astype(np.uint8)
    
    # Convert to PIL RGBA for precision vector & layer rendering
    canvas = Image.fromarray(cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)).convert("RGBA")
    draw_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(draw_layer)
    
    bottle_shape = spec['shape'] # 'classic', 'arched', 'faceted', 'oval'
    glass_rgb = spec['glass_rgb']
    liquid_rgb = spec['liquid_rgb']
    cap_type = spec['cap_type'] # 'gold_square', 'gold_crown', 'silver_cylinder', 'black_gold_cube', 'rose_gold_dome'
    accent_rgb = spec['accent_rgb']
    
    cx, cy = WIDTH // 2, HEIGHT // 2 + 40
    bw, bh = spec.get('bottle_size', (280, 420))
    left = cx - bw // 2
    top = cy - bh // 2
    right = cx + bw // 2
    bottom = cy + bh // 2
    
    # --- A. BOTTLE GLASS BODY ---
    if bottle_shape == 'arched':
        draw.rounded_rectangle([left, top, right, bottom], radius=60, fill=(*glass_rgb, 215), outline=(255, 255, 255, 180), width=3)
        draw.rounded_rectangle([left+14, top+40, right-14, bottom-14], radius=45, fill=(*liquid_rgb, 220))
    elif bottle_shape == 'faceted':
        # Emerald cut / faceted rectangle
        pts = [(left+40, top), (right-40, top), (right, top+40), (right, bottom-40), (right-40, bottom), (left+40, bottom), (left, bottom-40), (left, top+40)]
        draw.polygon(pts, fill=(*glass_rgb, 225), outline=(255, 255, 255, 200))
        pts_in = [(left+52, top+20), (right-52, top+20), (right-20, top+52), (right-20, bottom-52), (right-52, bottom-20), (left+52, bottom-20), (left+20, bottom-52), (left+20, top+52)]
        draw.polygon(pts_in, fill=(*liquid_rgb, 230))
    elif bottle_shape == 'oval':
        draw.ellipse([left, top, right, bottom], fill=(*glass_rgb, 220), outline=(255, 255, 255, 190), width=3)
        draw.ellipse([left+18, top+30, right-18, bottom-18], fill=(*liquid_rgb, 225))
    else: # 'classic' square/rectangular
        draw.rounded_rectangle([left, top, right, bottom], radius=25, fill=(*glass_rgb, 220), outline=(255, 255, 255, 190), width=3)
        draw.rounded_rectangle([left+16, top+35, right-16, bottom-16], radius=18, fill=(*liquid_rgb, 230))
    
    # --- B. GLASS SPECULAR HIGHLIGHTS & CAUSTICS ---
    highlight_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    h_draw = ImageDraw.Draw(highlight_layer)
    
    # Left edge vertical glare line
    h_draw.rectangle([left+8, top+15, left+22, bottom-15], fill=(255, 255, 255, 120))
    # Subtle right edge rim light
    h_draw.rectangle([right-18, top+15, right-10, bottom-15], fill=(255, 255, 255, 70))
    # Diagonal glass reflection
    h_draw.polygon([(left+30, top+20), (left+70, top+20), (left+40, bottom-40), (left+10, bottom-40)], fill=(255, 255, 255, 45))
    
    highlight_layer = highlight_layer.filter(ImageFilter.GaussianBlur(radius=3))
    draw_layer.alpha_composite(highlight_layer)
    
    # --- C. BOTTLE NECK & COLLAR ---
    neck_w, neck_h = 70, 50
    neck_left = cx - neck_w // 2
    neck_top = top - neck_h + 10
    neck_right = cx + neck_w // 2
    neck_bottom = top + 10
    
    draw.rectangle([neck_left, neck_top, neck_right, neck_bottom], fill=(*accent_rgb, 255), outline=(255, 240, 180, 255), width=2)
    # Metallic collar highlights
    draw.rectangle([neck_left+10, neck_top, neck_left+22, neck_bottom], fill=(255, 255, 230, 180))
    
    # --- D. METALLIC CAP ---
    cap_w, cap_h = spec.get('cap_size', (110, 110))
    cap_left = cx - cap_w // 2
    cap_top = neck_top - cap_h + 12
    cap_right = cx + cap_w // 2
    cap_bottom = neck_top + 12
    
    if cap_type == 'gold_crown' or cap_type == 'rose_gold_dome':
        draw.ellipse([cap_left, cap_top, cap_right, cap_bottom], fill=(*accent_rgb, 255), outline=(255, 245, 200, 255), width=3)
        # Metallic dome highlight
        draw.ellipse([cap_left+20, cap_top+15, cap_left+50, cap_top+45], fill=(255, 255, 240, 160))
    elif cap_type == 'black_gold_cube':
        # Black top with gold trim
        draw.rounded_rectangle([cap_left, cap_top, cap_right, cap_bottom], radius=12, fill=(20, 20, 25, 255), outline=(*accent_rgb, 255), width=4)
        draw.rectangle([cap_left+15, cap_top+10, cap_left+30, cap_bottom-10], fill=(255, 255, 255, 60))
    else: # standard rectangular gold/silver cap
        draw.rounded_rectangle([cap_left, cap_top, cap_right, cap_bottom], radius=14, fill=(*accent_rgb, 255), outline=(255, 245, 200, 255), width=3)
        # Polished sheen stripes
        draw.rectangle([cap_left+18, cap_top+5, cap_left+38, cap_bottom-5], fill=(255, 255, 240, 180))
        draw.rectangle([cap_right-30, cap_top+5, cap_right-20, cap_bottom-5], fill=(255, 255, 240, 90))

    # --- E. ATMOSPHERIC PARTICLES / PETALS / SPARKLES ---
    particle_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    p_draw = ImageDraw.Draw(particle_layer)
    np.random.seed(index * 42)
    
    if spec.get('rose_petals'):
        # Floating rose petals
        for _ in range(18):
            px = np.random.randint(80, WIDTH - 80)
            py = np.random.randint(100, HEIGHT - 150)
            pr = np.random.randint(12, 28)
            p_draw.ellipse([px, py, px+pr, py+int(pr*1.5)], fill=(235, 110, 140, np.random.randint(110, 190)))
    
    # Ambient golden/sparkle dust particles
    for _ in range(45):
        px = np.random.randint(50, WIDTH - 50)
        py = np.random.randint(50, HEIGHT - 80)
        pr = np.random.randint(2, 6)
        p_draw.ellipse([px, py, px+pr, py+pr], fill=(*accent_rgb, np.random.randint(80, 220)))
        
    particle_layer = particle_layer.filter(ImageFilter.GaussianBlur(radius=1.2))
    draw_layer.alpha_composite(particle_layer)
    
    # --- F. COMPOSITE & MIRROR FLOOR REFLECTION ---
    canvas.alpha_composite(draw_layer)
    
    # Create bottle reflection on obsidian floor below y=780
    ref_crop = draw_layer.crop((0, top - cap_h, WIDTH, bottom + 10))
    ref_flip = ref_crop.transpose(Image.FLIP_TOP_BOTTOM)
    ref_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ref_layer.paste(ref_flip, (0, bottom - 10))
    
    # Apply floor mask & blur to reflection
    ref_layer = ref_layer.filter(ImageFilter.GaussianBlur(radius=8))
    ref_np = np.array(ref_layer).astype(np.float32)
    
    # Fade reflection downwards
    fade_y = np.linspace(0.45, 0.0, HEIGHT - (bottom - 10)).clip(0, 1)
    for y_i in range(bottom - 10, HEIGHT):
        idx = y_i - (bottom - 10)
        if idx < len(fade_y):
            ref_np[y_i, :, 3] *= fade_y[idx]
        else:
            ref_np[y_i, :, 3] = 0
            
    ref_final = Image.fromarray(ref_np.astype(np.uint8))
    
    final_canvas = Image.new("RGBA", (WIDTH, HEIGHT), (5, 5, 5, 255))
    final_canvas.paste(canvas, (0, 0), canvas)
    final_canvas.paste(ref_final, (0, 0), ref_final)
    
    # Final Output RGB JPG
    final_jpg = final_canvas.convert("RGB")
    
    # Save to both Artifact and Target paths
    art_path = os.path.join(ARTIFACT_DIR, f"{name}.jpg")
    tgt_path = os.path.join(TARGET_DIR, f"{name}.jpg")
    
    final_jpg.save(art_path, "JPEG", quality=96)
    final_jpg.save(tgt_path, "JPEG", quality=96)
    
    print(f"Saved {name}.jpg to artifact and target directory.")

# 9 Perfume Specifications
SPECS = {
    'wa-elegance-01': {
        'glow_color': [75, 55, 125], # BGR warm pink
        'glow_intensity': 1.1,
        'shape': 'arched',
        'glass_rgb': (248, 200, 210),
        'liquid_rgb': (238, 140, 165),
        'cap_type': 'gold_square',
        'accent_rgb': (212, 175, 55), # Gold
        'rose_petals': True,
        'bottle_size': (300, 430),
        'cap_size': (115, 115)
    },
    'wa-elegance-02': {
        'glow_color': [135, 100, 30], # BGR cool azure blue
        'glow_intensity': 1.2,
        'shape': 'faceted',
        'glass_rgb': (170, 225, 250),
        'liquid_rgb': (100, 190, 240),
        'cap_type': 'silver_cylinder',
        'accent_rgb': (220, 230, 240), # Silver
        'bottle_size': (280, 420),
        'cap_size': (105, 110)
    },
    'wa-elegance-03': {
        'glow_color': [40, 110, 150], # BGR warm amber vanilla
        'glow_intensity': 1.0,
        'shape': 'classic',
        'glass_rgb': (255, 245, 220),
        'liquid_rgb': (240, 210, 150),
        'cap_type': 'gold_crown',
        'accent_rgb': (212, 175, 55),
        'bottle_size': (290, 410),
        'cap_size': (120, 120)
    },
    'wa-elegance-04': {
        'glow_color': [20, 20, 140], # BGR rouge red
        'glow_intensity': 1.3,
        'shape': 'faceted',
        'glass_rgb': (180, 20, 40),
        'liquid_rgb': (120, 5, 20),
        'cap_type': 'black_gold_cube',
        'accent_rgb': (212, 175, 55),
        'bottle_size': (310, 440),
        'cap_size': (110, 110)
    },
    'wa-elegance-05': {
        'glow_color': [50, 115, 155], # BGR warm coral golden
        'glow_intensity': 1.15,
        'shape': 'oval',
        'glass_rgb': (255, 140, 110),
        'liquid_rgb': (245, 100, 80),
        'cap_type': 'gold_square',
        'accent_rgb': (255, 215, 0),
        'bottle_size': (310, 410),
        'cap_size': (110, 110)
    },
    'wa-elegance-06': {
        'glow_color': [90, 90, 90], # BGR avant-garde studio light
        'glow_intensity': 0.9,
        'shape': 'faceted',
        'glass_rgb': (220, 220, 225),
        'liquid_rgb': (40, 40, 45),
        'cap_type': 'black_gold_cube',
        'accent_rgb': (212, 175, 55),
        'bottle_size': (280, 430),
        'cap_size': (115, 115)
    },
    'wa-elegance-07': {
        'glow_color': [60, 120, 160], # BGR champagne gold studio
        'glow_intensity': 1.2,
        'shape': 'arched',
        'glass_rgb': (245, 225, 185),
        'liquid_rgb': (225, 195, 130),
        'cap_type': 'gold_crown',
        'accent_rgb': (224, 169, 109), # Rose gold
        'bottle_size': (290, 420),
        'cap_size': (120, 120)
    },
    'wa-elegance-08': {
        'glow_color': [120, 140, 150], # BGR soft dreamy white glow
        'glow_intensity': 1.0,
        'shape': 'classic',
        'glass_rgb': (250, 248, 245),
        'liquid_rgb': (235, 230, 220),
        'cap_type': 'gold_square',
        'accent_rgb': (212, 175, 55),
        'bottle_size': (290, 420),
        'cap_size': (110, 110)
    },
    'wa-elegance-09': {
        'glow_color': [30, 80, 130], # BGR Parisian black & gold
        'glow_intensity': 1.25,
        'shape': 'classic',
        'glass_rgb': (30, 30, 35),
        'liquid_rgb': (15, 15, 20),
        'cap_type': 'black_gold_cube',
        'accent_rgb': (212, 175, 55),
        'bottle_size': (300, 430),
        'cap_size': (120, 120)
    }
}

if __name__ == "__main__":
    for i in range(1, 10):
        name = f"wa-elegance-0{i}"
        generate_perfume_image(i, name, SPECS[name])
    print("ALL 9 WA ELEGANCE PERFUME IMAGES SUCCESSFULLY GENERATED AND COPIED!")
