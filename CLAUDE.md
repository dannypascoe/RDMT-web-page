# CLAUDE.md — Web Development Rules

## Philosophy
- Build the simplest solution that satisfies the request.
- Prefer HTML + Tailwind CSS (CDN) + vanilla JavaScript for the first version of any project.
- Escalate to Vite only when the project outgrows a simple static site (multiple pages, build tooling needed).
- Escalate to React only when shared state or reusable components clearly justify it.
- Escalate to Next.js only for production apps that need auth, persistence, APIs, SSR/SSG, routing, or real deployment.

## Skills to Invoke
- **Always invoke the `frontend-design` skill** before writing any frontend/UI code, every session, no exceptions.
- **Also invoke the `ui-ux-pro-max` skill** (installed at `.claude/skills/ui-ux-pro-max/` — see the root `README.md` for one-time setup) before starting a design. Use its search tooling to pull UI style, color palette, typography, and UX-guideline suggestions relevant to this project's type before making layout/style decisions.
- **Also invoke the `transitions.dev` skill** before implementing any animation, transition, or micro-interaction (scroll reveals, hover states, section/page transitions). Use its transition library as reference instead of writing animation CSS/JS from scratch.
- If the skills suggest conflicting directions, prioritize matching any reference image or `brand_assets/` content first; use the skills to fill gaps, not to override explicit brand material.

## Project Context — Check These Folders First
Before designing anything, check:
- `business_info/` — business description, target audience, tone of voice, key messages/copy guidelines.
- `brand_assets/` — logos, photos, and a defined color palette/fonts. If a palette or logo exists here, use those exact values — never invent brand colors.
- `inspiration/` — reference designs, competitor screenshots, or mood-board notes.

If any of these folders is empty for a given project, design from scratch with high craft (see guardrails below) instead of inventing brand details.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Use placeholder content (`https://placehold.co/` for images, generic copy) unless real content already exists in `business_info/`/`brand_assets/`. Do not improve or add to the design.
- If no reference image: design from scratch with high craft.
- Do not add sections, features, or content that weren't requested or shown in the reference.

## Default Tech Stack (v1 of any project)
- HTML5, semantic markup.
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`.
- Vanilla JavaScript.
- A single `index.html` for very small projects; split HTML/CSS/JS into separate files once the project grows past one page or ~150 lines.

## Design Guardrails (Anti-Generic)
- **Colors:** never use default Tailwind palette colors (indigo-500, blue-600, sky-500, violet-500, etc.) as the primary color. Define a custom brand color (from `brand_assets/` if available) and derive tints/shades from it.
- **Typography:** never use the same font family for headings and body text. Pair a distinct display/serif font with a clean sans-serif body font. Apply tight tracking (-0.02em to -0.03em) on large headings and generous line-height (1.6–1.8) on body copy.
- **Shadows:** never use a flat `shadow-md`/`shadow-lg` alone. Layer 2–3 box-shadows with a subtle brand-color tint and low opacity.
- **Gradients & texture:** when using gradients, layer at least two rather than one flat one; consider a subtle SVG noise overlay on large hero sections for depth.
- **Animations:** only animate `transform` and `opacity`. Never use `transition-all`. Prefer a slight spring/overshoot easing over linear or plain ease.
- **Interactive states:** every clickable or focusable element needs hover, focus-visible, and active states — no exceptions.
- **Images:** apply a gradient overlay or duotone/color treatment (e.g. `mix-blend-multiply`) to photos rather than using them raw, unless it's a product photo or logo that must stay unaltered.
- **Spacing:** use a consistent spacing scale (e.g. 4/8/12/16/24/32/48/64px) — no arbitrary one-off values.
- **Depth:** define a clear elevation system (base surface → elevated cards → floating elements like modals/tooltips), each with its own shadow/z-index step.

## Local Server & Screenshot Workflow
- Never screenshot a `file:///` URL — always serve on localhost first.
- Start the dev server in the background: `npm run serve` (runs `scripts/serve.mjs`, serves the project root at `http://localhost:3000`). If it's already running, don't start a second instance.
- Take a screenshot: `npm run screenshot -- http://localhost:3000 [label]`. Screenshots save to `temporary-screenshots/screenshot-N[-label].png` (auto-incremented, never overwritten).
- After screenshotting, read the PNG with the Read tool to see and analyze it directly.
- Do at least 2 comparison rounds against the reference (or against the design goals if there's no reference). Stop only when no visible differences remain, or the user says so.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px". Check spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, and image sizing.

## Code Quality
- Prefer semantic HTML.
- Keep code modular and readable; use descriptive names.
- Avoid unnecessary dependencies; don't overengineer.
- Reuse components instead of duplicating markup.
- Remove unused code before finishing.

## Responsive
- Mobile-first.
- Test desktop, tablet, and mobile layouts.
- Avoid horizontal scrolling; keep spacing consistent across breakpoints.

## Accessibility
- Semantic HTML and meaningful alt text.
- Keyboard navigation must work.
- Label form controls correctly.
- Sufficient color contrast (the `ui-ux-pro-max` skill can check this).

## Before Finishing, Verify
- No console errors.
- Responsive layout works at all breakpoints.
- Interactions work as expected.
- Accessible markup.
- Clean code, no unused CSS/JS.
- At least 2 screenshot-comparison rounds completed.

## Communication
- Explain important technical decisions briefly (e.g. why escalating to React).
- Recommend the simplest approach first.
- Ask for clarification only when it materially changes the implementation.
- Deliver a working solution before suggesting optional enhancements.

## Hard Rules
- Do not "improve" a reference design — match it.
- Do not invent brand colors, logos, or copy when real ones exist in `brand_assets/`/`business_info/`.
- Do not stop after one screenshot pass.
- Do not use `transition-all`.
- Do not use default Tailwind blue/indigo/violet as the primary color.
