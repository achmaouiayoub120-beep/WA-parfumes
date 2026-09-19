# WA Perfumes — Image Generation Tools

This directory contains Python scripts and assets for procedural rendering and synthetic product image generation for the **WA Perfumes** brand (specifically the Elegance collection).

## Directory Contents

| Path | Description |
| --- | --- |
| `generate_elegance.py` | Python script generating procedural product images for the Elegance collection using OpenCV, NumPy, and PIL. |
| `render_wa_elegance.py` | High-fidelity studio renderer with custom metallic shading, specular highlights, radial spotlights, and glass refractions. |
| `image/` | Source images, reference renders, and generated perfume asset inputs. |
| `test.jpg`, `test_perfume.jpg`, `test_render_01.jpg` | Test render outputs and quality inspection samples. |

## Prerequisites

Ensure you have Python 3.10+ installed along with the required image processing libraries:

```bash
pip install numpy opencv-python pillow
```

## Usage

Run the generation or rendering scripts directly from this directory:

```bash
# Generate base bottle renders
python generate_elegance.py

# Run advanced studio render pipeline
python render_wa_elegance.py
```

Generated images can be inspected here or are output directly to the web app's asset directories.
