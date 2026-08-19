# Team Kily Portfolio

The source code for the [Team Kily portfolio](https://team-kily.de) — a bilingual, interactive website for presenting digital work, creative development, and current game projects.

The site combines a section-based portfolio with real-time 3D, motion, responsive layouts, and accessible German and English routes.

## Features

- Responsive single-page portfolio with section navigation and scroll snapping
- German and English content with localized URLs
- Interactive, Draco-compressed 3D squirrel rendered with Three.js
- Animated project presentation with optimized local media
- Dedicated game-development section
- Contact form with validation, basic abuse protection, and Resend delivery
- Localized imprint and privacy pages
- SEO metadata, structured data, Open Graph image, sitemap, and robots.txt

## Tech stack

- [Svelte 5](https://svelte.dev/)
- [SvelteKit](https://svelte.dev/docs/kit)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Three.js](https://threejs.org/)
- [Resend](https://resend.com/) for contact emails
- [Vercel](https://vercel.com/) for deployment

## Getting started

### Prerequisites

- A current Node.js LTS release
- npm

### Installation

```bash
git clone git@github.com:team-kily/portfolio.git
cd portfolio
npm install
cp .env.example .env
npm run dev
```

The development server will print the local URL in the terminal.

## Environment variables

The contact endpoint requires the following server-side variables:

| Variable             | Description                                       |
| -------------------- | ------------------------------------------------- |
| `RESEND_API_KEY`     | API key used to send emails through Resend        |
| `CONTACT_TO_EMAIL`   | Address that receives portfolio enquiries         |
| `CONTACT_FROM_EMAIL` | Verified sender identity used for outgoing emails |

Use [.env.example](./.env.example) as a template. Never commit real API keys or production secrets.

The rest of the website can be developed without email credentials, but contact-form submissions will return a service-unavailable response.

## Available scripts

| Command               | Purpose                                |
| --------------------- | -------------------------------------- |
| `npm run dev`         | Start the Vite development server      |
| `npm run build`       | Create a production build              |
| `npm run preview`     | Preview the production build locally   |
| `npm run check`       | Run Svelte diagnostics and type checks |
| `npm run check:watch` | Run Svelte diagnostics in watch mode   |
| `npm run lint`        | Check formatting and ESLint rules      |
| `npm run format`      | Format the repository with Prettier    |

## Project structure

```text
src/
├── lib/
│   ├── components/     # Landing page, navigation, legal, and shared UI
│   ├── config/         # Navigation and localized route configuration
│   └── i18n/           # Translation state and content
└── routes/
    ├── api/contact/    # Server-side contact form endpoint
    ├── en/             # English routes
    ├── impressum/      # German legal notice
    └── datenschutz/    # German privacy page

static/
├── draco/              # Draco decoder assets
├── fonts/              # Self-hosted typefaces
├── images/             # Image and social-sharing assets
├── models/             # Compressed 3D assets
└── videos/             # Optimized project media
```

## Deployment

The project uses `@sveltejs/adapter-vercel` and is configured for deployment on Vercel. Add the three contact-form environment variables to the Vercel project before deploying.

For a production check locally:

```bash
npm run check
npm run build
npm run preview
```

## Contributing

This repository primarily contains the public source for the Team Kily portfolio and is not currently maintained as a general-purpose template. Bug reports and constructive feedback are welcome through [GitHub Issues](https://github.com/team-kily/portfolio/issues).

## License

No open-source license has been added to this repository. Unless stated otherwise, the source code, design, text, media, and other assets remain the property of their respective copyright holders and may not be reused without permission.
