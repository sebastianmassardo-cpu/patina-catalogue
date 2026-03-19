---
name: patina-ui-polish
description: Refine the PÁTINA website visually while preserving its existing editorial direction. Use when improving spacing, visual hierarchy, premium feel, awkward emptiness, section balance, desktop/mobile layout issues, or subtle presentation polish in pages and components.
---

# Patina UI Polish

Read `AGENTS.md` before making changes.

Inspect the current section before editing. Match the site's existing cues: muted earth tones, serif-led hierarchy, rounded image containers, soft gradients, restrained shadows, and calm spacing.

Prefer a few high-impact refinements over a redesign. Improve rhythm, proportion, and emphasis without making the page feel busier.

## Focus Areas

- Tighten spacing so sections breathe without drifting apart.
- Strengthen hierarchy with size, width, rhythm, and alignment before adding new elements.
- Reduce awkward emptiness with better composition, image balance, or content width adjustments instead of filler decoration.
- Preserve the current visual language unless the user explicitly asks for a new direction.
- Keep desktop and mobile equally intentional. Check stacking order, image height, text width, and CTA placement at both sizes.

## Preferred Moves

- Rebalance padding, gaps, and max widths to improve rhythm.
- Clarify entry points with cleaner section headers, quieter supporting text, and better visual grouping.
- Use subtle layering, border treatment, and shadow changes to add polish without noise.
- Improve asymmetrical layouts so they feel deliberate rather than accidental.
- Let imagery lead when the photography is strong.
- Treat any visible text added during polish as finished customer-facing copy, not interface instructions.

## Avoid

- Adding generic marketing sections, badges, counters, or decorative clutter.
- Overusing gradients, blur, motion, or accent colors.
- Turning empty space into crowded space.
- Breaking established typography and tone for one isolated section.
- Leaving literal instructions, placeholders, or AI-sounding helper text visible in the design.

## Project Notes

- Start with `app/page.tsx` for page composition.
- Check `app/_components/editorial-sections.tsx`, `app/_components/catalogue-browser.tsx`, and `app/_components/pricing-summary.tsx` for section-level polish work.
- Respect the current editorial product photography and handcrafted identity.

## Validation

- Compare the edited section against adjacent sections so the page still feels cohesive.
- Check mobile and desktop layouts after any spacing or composition change.
- Run `npm.cmd run lint` if code changed.
