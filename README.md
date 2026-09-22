# NOMAD Build

**Concept Corporate / Construction Website** — a B-T-B-N Web portfolio project.

A Mongolian-language site for a fictional construction and interior company, presenting services, completed work and an enquiry flow.

This is a self-directed concept project built to demonstrate design and front-end work. The brand is fictional and is not a real company or paying client. There is no backend, payment, login or real booking — forms and dialogs are demonstrations only.

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Playwright (tests)
- Oxlint

## Key features

- Category filters across the project showcase
- Project detail dialogs with focus trapping
- Validated quote form (local demo only — nothing is sent)
- Mobile menu with quote call-to-action
- Reduced-motion support

## Local development

```sh
cd Construction
npm install
npm run dev -- --host 127.0.0.1 --port 5175
```

- `npm run lint` — Oxlint
- `npm run build` — TypeScript and Vite production output in `dist/`
- `npm test` — Playwright Chromium tests; test server starts on port 4175.
- `npm run preview -- --port 4175` — inspect the production build.

If Chromium is not installed locally, run `npx playwright install chromium` before browser tests.

## Editing

- `src/data.ts`: service/project data, process, principles, testimonials and example contact details.
- `src/App.tsx`: page sections and Mongolian copy.
- `src/components.tsx`: shared UI, mobile navigation, accessible native project dialog and contact form.
- `src/index.css`: type scale, color palette, grid layouts and responsive rules.
- `public/images/`: locally hosted optimized JPEGs.
- `tests/landing.spec.ts`: responsive layouts, navigation, filters, dialogs, form validation and automated accessibility checks.

All sections have anchor links. Project filters and detail dialogs work locally. Service and project quote links preselect the corresponding service while preserving the other entered fields.

The form validates a name, an 8-digit Mongolian phone number (optional +976 prefix), a service and a description; email is optional and validated if supplied. It intentionally does not send or persist data. Successful validation explicitly explains that no request was sent. There is no backend, analytics, payment or authentication.

## Fictional content

NOMAD Build, its statistics, project names, locations, customer reviews, phone and office address are demonstration content. Photos are stock imagery, not documentation of those fictional projects. The email uses the reserved `.example` domain. Social links open their platform homepages; they do not claim to be company accounts. Replace these before publishing as a real business.

## Assets

Manrope fonts are served locally from the fontsource package (OFL). Photos are downloaded from Unsplash and resized/compressed for this demo:

- Architecture: https://images.unsplash.com/photo-1487958449943-2429e8be8625
- Residence: https://images.unsplash.com/photo-1600210492486-724fe5c67fb0
- Office: https://images.unsplash.com/photo-1497366754035-f200968a6e72
- House: https://images.unsplash.com/photo-1600585154340-be6161a56a0c
- Restaurant: https://images.unsplash.com/photo-1517248135467-4c7edcad34c4
- Planning: https://images.unsplash.com/photo-1503387762-592deb58ef4e

No runtime third-party asset requests are needed. Below-the-fold images are lazy loaded; the hero is preloaded. Animations use CSS and IntersectionObserver with reduced-motion support. No animation library is installed.

The sibling Coffee-shop and Beauty-salon projects are independent and unchanged.
