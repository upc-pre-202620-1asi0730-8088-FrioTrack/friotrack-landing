# FríoTrack — Landing Page

Static Landing Page (HTML5 + CSS3 + vanilla JavaScript) for **FríoTrack**, a cold-chain
monitoring and traceability product for small perishable-goods businesses (bodegas,
minimarkets, restaurants, pharmacies) and their last-mile couriers in Lima, Peru.

Developed by team **BlackStartup** for the course *1ASI0730 Aplicaciones Web* (UPC, NRC 8088).
Full project report: https://github.com/upc-pre-202620-1asi0730-8088-FrioTrack/report

## Structure

```
landing-page/
├── index.html      # Main page (Hero, Problem, How it works, Segments, Pricing, Contact)
├── terms.html       # Terms of Service (draft — team must review, see file for TODO)
├── css/
│   └── styles.css   # Design tokens + responsive styles (mobile-first)
└── js/
    └── main.js       # Mobile nav toggle, EN/ES i18n toggle, contact form validation
```

## Running locally

No build step required — it's plain HTML/CSS/JS. Just open `index.html` in a browser,
or serve the folder with any static server, e.g.:

```bash
npx serve .
```

## Deploying to GitHub Pages

1. Go to **Settings → Pages** in this repository and set **Source** to the `main` branch,
   root folder.
2. The site will be published at
   `https://upc-pre-202620-1asi0730-8088-friotrack.github.io/friotrack-landing/`.

## Suggested Git workflow (GitFlow + Conventional Commits)

```bash
git clone https://github.com/upc-pre-202620-1asi0730-8088-FrioTrack/friotrack-landing.git
cd friotrack-landing
git checkout -b develop
git checkout -b feature/landing-a11y-tweak
# ...edit files...
git add .
git commit -m "feat: improve accessibility of hero section"
git checkout develop
git merge --no-ff feature/landing-a11y-tweak
git checkout main
git merge --no-ff develop
git tag v1.0.1
git push origin main develop --tags
```

> Split future changes across feature branches per team member so the commit
> history reflects everyone's contribution, as required by the assignment rubric.

## Notes / TODO for the team

- [ ] Replace the draft copy/pricing with content validated through real interviews (see report §2.2).
- [ ] Export a matching hi-fi mock-up from Figma for the report (§4.3.2).
- [ ] Review and finalize `terms.html`.
- [ ] Wire the contact form to a real endpoint once the RESTful API exists (later sprint).
