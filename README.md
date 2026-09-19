# WA Perfumes (WA-parfun)

A modern, high-end e-commerce experience for luxury fragrance house **WA Perfumes**.

---

## Repository Structure

```
WA-parfun/
├── wa-perfumes/              # Main Next.js web application
│   ├── app/                  # App Router pages and layouts
│   ├── components/           # UI components, animations, and section layouts
│   ├── data/                 # Product and collection catalog definitions
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions and helpers
│   ├── providers/            # Context and animation providers
│   ├── public/               # Public static assets (images, fonts, icons)
│   └── store/                # State management stores (cart, UI)
│
├── tools/
│   └── image-generation/     # Python scripts for procedural product rendering
│       ├── generate_elegance.py
│       ├── render_wa_elegance.py
│       ├── image/            # Reference input images and assets
│       └── README.md         # Image generation tool documentation
│
└── README.md                 # Project overview and repository guide
```

- **`wa-perfumes/`**: Contains the Next.js full-stack web application featuring smooth animations, 3D/ambient lighting effects, interactive olfactory pyramid visualizations, scent discovery finder, cart management, and checkout.
- **`tools/image-generation/`**: Contains Python scripts and rendering pipelines for procedural product image generation and bottle asset rendering.

---

## Getting Started

### Running the Web Application

To run the Next.js development server locally:

```bash
cd wa-perfumes
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

```bash
cd wa-perfumes
npm run build
npm run start
```

### Image Generation Tools

For instructions on generating and rendering product imagery, refer to the [Image Generation Tools README](tools/image-generation/README.md).
