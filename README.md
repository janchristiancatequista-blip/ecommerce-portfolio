# E-commerce Front-end Portfolio

Five storefronts built with **semantic HTML, modern CSS and vanilla JavaScript**. They have no frameworks, dependencies or build step.

## Run it

Open `index.html` in a browser. Or serve the folder locally:

```bash
npx serve .
```

## Projects

| # | Project | Theme | What it demonstrates |
|---|---------|-------|----------------------|
| 1 | [Lumen](01-lumen-home/) | Minimalist home goods | Category filter and sort, quick-view modal (`<dialog>`), slide-out cart drawer, free-shipping progress bar, cart saved in `localStorage`, newsletter validation, toast notifications |
| 2 | [Volt](02-volt-electronics/) | Dark electronics store | Debounced search with highlighted matches, multi-facet filters (category, brand, price slider, rating), compare tray and spec table (max 3), cart with tax, `/` shortcut to focus search |
| 3 | [THREAD](03-thread-fashion/) | Fashion SPA | Hash-based client-side router, product detail pages, colour and size variants with sold-out states, required-size validation, wishlist, bag with promo codes (`THREAD10`, `WELCOME20`), animated mobile menu |
| 4 | [Bloom Market](04-bloom-grocery/) | Grocery delivery | Three-column responsive layout, inline quantity steppers that update in place, live basket, delivery-slot picker built with `Intl.DateTimeFormat`, postcode dialog, organic toggle |
| 5 | [Paperback & Co.](05-paperback-books/) | Independent bookshop | Book covers generated in CSS, search, genre and sort, pagination, detail modal, 4-step checkout with the Constraint Validation API and accessible error messages |

## Shared practices

- **Accessibility:** semantic landmarks, labelled controls, `aria-pressed` / `aria-checked` / `aria-current` states, focus management, visible focus styles, `prefers-reduced-motion` support
- **Responsive:** mobile-first layouts with CSS Grid and Flexbox and fluid type using `clamp()`
- **State:** one state object per app, render functions, event delegation, and persistence in `localStorage`
- **No external images:** product visuals are emoji, inline SVG or pure CSS, so nothing breaks offline

## Structure

```
index.html              ← portfolio landing page
01-lumen-home/          index.html · styles.css · app.js
02-volt-electronics/    index.html · styles.css · app.js
03-thread-fashion/      index.html · styles.css · app.js
04-bloom-grocery/       index.html · styles.css · app.js
05-paperback-books/     index.html · styles.css · app.js
```

> All brands, products and books are fictional. No real orders or payments are processed.
