---
name: patina-catalog-structure
description: Organize and refine the structure of the PÁTINA catalogue experience. Use when improving product grids, collection sections, section composition, text-image balance, catalogue flow, or consistency across catalog surfaces while keeping the experience curated, premium, and uncluttered.
---

# Patina Catalog Structure

Read `AGENTS.md` before making changes.

Treat the catalogue as a curated sequence of handcrafted objects and editorial sections, not as a generic storefront.

## Focus

- Improve how catalog sections are ordered, grouped, and composed.
- Keep a calm balance between text and imagery.
- Make product grids easy to scan without feeling dense or repetitive.
- Preserve consistency across collections, cards, and supporting sections.
- Reduce clutter before adding new structure.

## Preferred Moves

- Rework section rhythm so each block has a clear role.
- Use collection labels, headings, and small transitions to guide browsing without over-explaining.
- Balance grids and text blocks so neither overwhelms the other.
- Keep filters, labels, and pricing surfaces integrated into the catalog flow rather than feeling bolted on.
- Favor clear grouping and repetition patterns over one-off layout tricks.
- Make menus, labels, and support lines read like finished customer-facing copy.

## Avoid

- Turning the catalogue into a busy ecommerce dashboard.
- Repeating the same structural motif so often that the page feels mechanical.
- Adding unnecessary wrappers, headings, or support text.
- Letting pricing or controls overpower the objects themselves.
- Showing literal instructions, placeholder phrasing, or internal guidance in the catalogue UI.

## Project Notes

- Main catalog composition starts in `app/page.tsx`.
- Product grid and filtering live in `app/_components/catalogue-browser.tsx`.
- Pricing presentation lives in `app/_components/pricing-summary.tsx`.
- Respect the current editorial sections in `app/_components/editorial-sections.tsx` when adjusting overall flow.

## Validation

- Check the page from top to bottom so the catalogue feels sequenced rather than assembled.
- Check grid density, section rhythm, and collection clarity on mobile and desktop.
- Run `npm.cmd run lint` if code changed.
