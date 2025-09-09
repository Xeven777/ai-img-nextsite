# 🤖 AI Image Generator 🖼️

A modern Next.js application for generating stunning AI images using multiple state-of-the-art image generation models. Built with TypeScript, Tailwind CSS, and shadcn/ui components.

## ✨ Features

- **6 AI Models**: Choose from Flux Schnell, Lucid Origin, Phoenix, Stable Diffusion variants, and Dreamshaper
- **Advanced Parameters**: Full control over generation with collapsible advanced settings
- **Model-Specific Optimization**: Automatic parameter adjustment based on selected model
- **Negative Prompts**: Exclude unwanted elements (supported models)
- **Custom Dimensions**: Adjustable width and height (256-2048px)
- **Seed Control**: Reproducible generations with custom seeds
- **Real-time Generation**: Fast image generation with performance tracking
- **Rate Limiting**: Built-in rate limiting to prevent API abuse
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Dark Theme**: Elegant dark mode interface
- **Image Gallery**: View previously generated images

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Bun package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/Xeven777/ai-img-nextsite.git
cd ai-img-nextsite

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🎨 Available Models

| Model Name                     | Query Parameter  | Description                      | Rate Limit     |
| ------------------------------ | ---------------- | -------------------------------- | -------------- |
| **Flux Schnell**               | `flux-schnell`   | Most realistic and best model 🔥 | 4/min, 10/hour |
| **Lucid Origin**               | `lucid-origin`   | High quality artistic images 🌟  | 4/min, 10/hour |
| **Phoenix**                    | `phoenix`        | Creative generation 🔥           | 4/min, 10/hour |
| **Stable Diffusion Lightning** | `sdxl-lightning` | Fastest generation ⚡            | 8/min, 25/hour |
| **Stable Diffusion Base**      | `sdxl`           | Good for all around use ✨       | 8/min, 25/hour |
| **Dreamshaper**                | `dreamshaper`    | Low Quality😇                    | 8/min, 25/hour |

## 🔧 API Reference

### Base Endpoint

```
/img
```

### Parameters

#### Basic Parameters

| Parameter  | Type   | Description                   | Default                                               | Range            |
| ---------- | ------ | ----------------------------- | ----------------------------------------------------- | ---------------- |
| `prompt`   | string | Image description             | "Cyberpunk Dinosaur robot, modern, 3D render, 8K, HD" | -                |
| `model`    | string | AI model to use               | `flux-schnell`                                        | See models table |
| `guidance` | number | Guidance scale for generation | `7.5`                                                 | Model-dependent  |
| `strength` | number | Generation strength           | `1.0`                                                 | 0.2 - 2.0        |

#### Advanced Parameters

| Parameter         | Type   | Description                     | Default         | Range/Notes                                         |
| ----------------- | ------ | ------------------------------- | --------------- | --------------------------------------------------- |
| `negative_prompt` | string | What to exclude from image      | -               | Supported: SDXL, Lightning, Dreamshaper, Phoenix    |
| `width`           | number | Image width in pixels           | `1024`          | 256 - 2048 (step: 64)                               |
| `height`          | number | Image height in pixels          | `1024`          | 256 - 2048 (step: 64)                               |
| `steps`           | number | Number of diffusion steps       | Model-dependent | Flux: 1-8, Lucid: 1-40, Phoenix: 1-50, Others: 1-20 |
| `seed`            | number | Random seed for reproducibility | Random          | Any positive integer                                |

#### Model-Specific Defaults

| Model          | Default Steps | Default Guidance | Supported Negative Prompt |
| -------------- | ------------- | ---------------- | ------------------------- |
| Flux Schnell   | 4             | 7.5              | ❌                        |
| Lucid Origin   | 30            | 4.5              | ❌                        |
| Phoenix        | 25            | 2.0              | ✅                        |
| SDXL Lightning | 15            | 7.5              | ✅                        |
| SDXL Base      | 20            | 7.5              | ✅                        |
| Dreamshaper    | 20            | 7.5              | ✅                        |

### Example API Calls

#### Basic Request

```
GET /img?prompt=Cyberpunk landscape with neon cities
```

#### Advanced Request

```
GET /img?prompt=Fantasy castle&model=lucid-origin&guidance=6&strength=1.2&width=1500&height=1500&steps=35
```

#### With Negative Prompt

```
GET /img?prompt=Beautiful landscape&model=phoenix&guidance=3&negative_prompt=blurry,low quality&width=1536&height=1536&steps=30&seed=12345
```

#### cURL Examples

```bash
# Basic generation
curl -X GET "http://localhost:3000/img?prompt=Fantasy%20castle" --output image.png

# With advanced parameters
curl -X GET "http://localhost:3000/img?prompt=Futuristic%20robot&model=phoenix&guidance=3&negative_prompt=blurry,low%20quality&width=1024&height=1024&steps=25&seed=42" --output robot.png

# High resolution with Lucid Origin
curl -X GET "http://localhost:3000/img?prompt=Mystical%20forest&model=lucid-origin&guidance=6&width=1500&height=1500&steps=35" --output forest.png
```

## ⚡ Rate Limiting

The application implements client-side rate limiting to prevent API abuse:

- **Premium Models** (Flux Schnell, Lucid Origin, Phoenix): 4 requests/minute, 10 requests/hour
- **Standard Models** (SDXL Lightning, SDXL Base, Dreamshaper): 8 requests/minute, 25 requests/hour

Rate limits are tracked per model and stored in localStorage.

## 🛠️ Development

### Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles and CSS variables
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── generator.tsx        # Main image generation component
│   ├── Pics.tsx            # Image gallery component
│   ├── Clarity.tsx         # Analytics component
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── slider.tsx
│       ├── select.tsx
│       └── ...
└── lib/
    └── utils.ts            # Utility functions
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: GSAP, Lenis
- **Package Manager**: Bun
- **Deployment**: Netlify

### Available Scripts

```bash
# Development
bun dev          # Start development server with Turbo

# Production
bun build        # Build for production
bun start        # Start production server

# Code Quality
bun lint         # Run ESLint
```

### Environment Variables

Create a `.env.local` file for local development:

```env
NEXT_PUBLIC_URL=your-production-api-url
```

## 🎨 Example Generations

### By Flux Schnell

![Flux Example](./pics/imgflux.jpg)

### By Stable Diffusion Base

![SD Base Example](./pics/img-sdbase.png)

### By Stable Diffusion Lightning

![SD Lightning Example](./pics/img-sdxll.jpg)

### By Dreamshaper

![Dreamshaper Example](./pics/imgdream.png)

## 🚀 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Set build command: `bun build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

Made with ❤️ by [Anish](http://anish7.me/)

---

**Note**: This is a frontend application that requires a backend API for image generation. Make sure to configure the appropriate API endpoint in your environment variables.
