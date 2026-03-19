---
name: patina-image-presentation
description: Refine how PÁTINA product and editorial images are presented. Use when adjusting image fit, crop behavior, zoom level, image hierarchy, consistency across sections, or the integration of context, detail, and process imagery while preserving real cup shape and painted detail.
---

# Patina Image Presentation

Read `AGENTS.md` before making changes.

Treat every image decision as part of the product presentation. The goal is to make the work feel refined and editorial while preserving the real object faithfully.

## Priorities

- Preserve the true cup shape, painted artwork, and proportions.
- Keep image fit and cropping intentional and consistent.
- Avoid excessive zoom, distortion, or framing that makes the object feel inaccurate.
- Build clear hierarchy between hero, product, context, detail, and process imagery.
- Make image-heavy sections feel composed rather than crowded.

## Preferred Moves

- Adjust aspect ratios, object positioning, and container sizing to better support the glass silhouette.
- Use context images to widen the mood, detail images to show brushwork, and process images to support the handcrafted story.
- Keep transitions between image types calm and deliberate.
- Align related images through shared radius, spacing, and visual weight.
- Let the strongest product image lead each section.
- Keep any captions, labels, or supporting lines around images customer-facing and editorial.

## Avoid

- Over-zooming product images until shape or painted detail becomes misleading.
- Cropping out rims, stems, or hand-painted motifs without a clear reason.
- Mixing image treatments that make sections feel unrelated.
- Using decorative overlays that compete with the object.
- Leaving literal directions, placeholders, or internal notes visible near the imagery.

## Project Notes

- Hero image treatment starts in `app/page.tsx`.
- Product image behavior lives in `app/_components/catalogue-browser.tsx`.
- Context, detail, and process imagery live in `app/_components/editorial-sections.tsx`.
- Any image adjustment should respect the current editorial tone of the site.

## Validation

- Review image crops on mobile and desktop.
- Check that cup proportions and artwork remain believable and intact.
- Compare neighboring image blocks for consistency of weight and treatment.
- Run `npm.cmd run lint` if code changed.
