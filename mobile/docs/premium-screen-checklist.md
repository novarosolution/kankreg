# Premium screen checklist

Apply on every customer/admin screen pass.

## API-only catalog (customer)

- [x] `KankregHomeScreen` — `getProducts` + `getHomeViewConfig` (no `HOME_VIEW_DEFAULTS` fallback on failure)
- [x] `HomeCategoryCards` — categories derived from products only
- [x] `ShopScreen` — category filters from product `category` fields
- [x] `ProductScreen` — related products from same API/category
- [ ] Trust / marquee / `HOME_BRAND_QUOTE` — static `appContent` (by design)

## Chrome

- [ ] `CustomerScreenShell`
- [ ] `KankregScrollPage` (`scrollVariant`: `page` | `inner` | `admin` | `auth`)
- [ ] `KankregUnifiedPageHeader` (compact on phone)
- [ ] `KankregPageWrap` with `gap={KANKREG_PAGE_SECTION_GAP}` where applicable

## Layout & panels

- [ ] `customerPanel()` / `authPanel()` — avoid ad-hoc card colors
- [ ] `useKankregLayout()` for gutters and grid density

## Motion

- [ ] Major blocks: [`KankregAnimatedSection`](../src/components/kankreg/KankregAnimatedSection.js) or [`SectionReveal`](../src/components/motion/SectionReveal.js)
- [ ] Product grids: [`CatalogGridReveal`](../src/components/kankreg/CatalogGridReveal.js)
- [ ] Lists: [`useStaggeredReveal`](../src/hooks/useStaggeredReveal.js) (max index 10)
- [ ] Screen enter: [`PageTransition`](../src/components/motion/PageTransition.js)
- [ ] Respect `useReducedMotion`

## Loading & empty

- [ ] `SkeletonBlock` for list/grid loads
- [ ] `PremiumEmptyState` when no data

## Dividers

- [ ] `GoldHairline` between major sections on inner pages

## Screen status (rollout)

| Area | Motion | Data |
|------|--------|------|
| Home | KankregAnimatedSection, CatalogGridReveal, HeroParallax | API products + home-view |
| Shop | Sort pulse, CatalogGridReveal | API products |
| Product | SectionReveal, hero fade, related grid, PremiumStickyBar buy bar | API |
| Cart/Checkout | SectionReveal, animated checkout steps | API cart + products cross-sell |
| Profile cluster | SectionReveal, skeletons (Profile) | API |
| Delivery | SectionReveal | API orders |
| Admin | AdminPageHeading in shell, dashboard KPI skeletons, list SectionReveal | API |

## QA

- [ ] Web: 375, 768, 1280
- [ ] Native: one phone width
- [x] `npm run lint` (run after each pass)

## Tokens

- [`src/theme/motion.js`](../src/theme/motion.js)
- [`src/theme/kankregScreenStyles.js`](../src/theme/kankregScreenStyles.js)
- Design reference: `kankreg.html`
