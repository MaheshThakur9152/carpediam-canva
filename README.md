# Carpe Diam Bombay

Fine jewellery brand web experience built with Astro, GSAP animations, and custom typography.

## Tech Stack

- **Framework**: [Astro 5](https://astro.build/) (Static Site Generation)
- **Animations**: [GSAP](https://greensock.com/gsap/)
- **Hosting / CDN**: Vercel

## Project Structure

```text
├── assets/raw/          # Source camera / unprocessed raw media
├── public/              # Optimized static assets (AVIF, SVG, fonts)
│   ├── fonts/           # Local web fonts
│   └── the edit/        # Gallery collection visuals
├── src/
│   ├── components/      # UI components & GSAP animation modules
│   ├── data/            # Navigation and carousel slide data
│   ├── layouts/         # Base layout with SEO & header/footer
│   ├── pages/           # Static routes (Home, The Edit, Passion, Contact)
│   └── styles/          # Global styles, variables, typography
└── tests/               # Playwright smoke test suite
```

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Build & Preview
```bash
npm run build
npm run preview
```

### Smoke Tests
```bash
npm test
```
