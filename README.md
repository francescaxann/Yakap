<p align="right"><a id="readme-top"></a></p>

<div align="center">
  <img src="public/assets/sticker.webp" alt="Yakap's CSG Bot mascot" width="112">
  <h1>Yakap</h1>
  <p>A wellbeing space for De La Salle University students, built for the Computer Studies Government.</p>
  <a href="https://github.com/francescaxann/Yakap/issues">Report a bug</a>
  ·
  <a href="https://github.com/francescaxann/Yakap/issues">Request a feature</a>
</div>

<details>
  <summary>Table of contents</summary>

- [About the Project](#about-the-project)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Acknowledgments](#acknowledgments)

</details>

## About the Project

Yakap is a wellbeing space by the Computer Studies Government at De La Salle University. It brings together a welcome message, letters of hope, affirmations, campus support contacts, and the COSCA donation drive.

### Built With

- [Next.js App Router](https://nextjs.org/docs/app) and [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)

## Getting Started

Use Node.js 24 or later and npm.

```sh
npm ci
npm run dev
```

Open [Yakap on localhost](http://localhost:3000). For a production build, run `npm run build` followed by `npm start`. Set `BETTER_AUTH_URL` to the deployed origin for canonical URLs and the sitemap.

## Usage

| Route | What you can do |
| --- | --- |
| `/` or `/video` | View the CSG welcome page |
| `/letters` | Read the original sample letters |
| `/cookie` | Open the CSG Bot cookie for a reminder |
| `/resources` | Find campus support contacts |
| `/cosca` | View the COSCA donation drive page |
| `/sitemap.xml` | View the public canonical page URLs |

## Project Structure

- `src/app` owns routes and the shared layout.
- `src/modules` contains the public content by feature.
- `src/shared/ui` contains shared shadcn components.

Run `npm run lint` and `npm run build` before submitting changes.

## Acknowledgments

- The Computer Studies Government and De La Salle University.
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) for accessibility guidance.

<p align="right"><a href="#readme-top">Back to top</a></p>
