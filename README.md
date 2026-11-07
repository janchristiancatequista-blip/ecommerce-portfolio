# E-commerce Front-end Portfolio

Five responsive storefronts built with **semantic HTML, modern CSS and vanilla JavaScript**. They use no frameworks, libraries or build step. Each store is a self-contained project that focuses on a different set of real-world front-end problems.

**🔗 Live demo:** https://janchristiancatequista-blip.github.io/ecommerce-portfolio/

| Store                                     | Live                                                                                           | Focus                                                |
| ----------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Lumen**: minimalist home goods          | [Open](https://janchristiancatequista-blip.github.io/ecommerce-portfolio/01-lumen-home/)       | Cart drawer, quick-view modal, filtering and sorting |
| **Volt**: dark-mode electronics           | [Open](https://janchristiancatequista-blip.github.io/ecommerce-portfolio/02-volt-electronics/) | Faceted search, product comparison                   |
| **THREAD**: fashion single-page app       | [Open](https://janchristiancatequista-blip.github.io/ecommerce-portfolio/03-thread-fashion/)   | Client-side routing, product variants                |
| **Bloom Market**: grocery delivery        | [Open](https://janchristiancatequista-blip.github.io/ecommerce-portfolio/04-bloom-grocery/)    | App-style layout, delivery scheduling                |
| **Paperback & Co.**: independent bookshop | [Open](https://janchristiancatequista-blip.github.io/ecommerce-portfolio/05-paperback-books/)  | Pagination, multi-step checkout and validation       |

---

## Features

### 1. Lumen: home goods

- Category filter chips and sorting by price or name
- Quick-view modal built on the native `<dialog>` element (focus trapping and <kbd>Esc</kbd> to close come built in)
- Slide-out cart drawer with quantity controls and a **free-shipping progress bar**
- Cart saved in `localStorage`, so it survives page reloads
- Newsletter form with inline email validation and toast notifications

### 2. Volt: electronics

- **Debounced search** that highlights matching text (input is escaped to prevent HTML injection)
- Multi-facet filters: category, brand (with result counts), a price range slider, and minimum rating
- **Compare tray** for up to 3 products, opening a spec table that highlights the best price and rating
- Cart with live tax calculation; press <kbd>/</kbd> to jump to search

### 3. THREAD: fashion single-page app

- A small **hash-based router** (`#/shop/women`, `#/product/:id`, `#/bag`) with focus and scroll restored on every page change
- Product detail page with **colour variants** that recolour the product image, plus size selection with sold-out states
- Validation that asks for a size before adding to the bag, with a shake animation and an error message read out to screen readers
- Wishlist, bag line items keyed by product, colour and size, and promo codes (`THREAD10`, `WELCOME20`)
- Animated hamburger menu on mobile

### 4. Bloom Market: grocery delivery

- Three-column layout (aisles, products, basket) that collapses to a slide-out basket on tablets and a scrollable aisle bar on phones
- Inline **quantity steppers** that update a single card in place instead of re-rendering the whole grid
- Delivery-slot picker built with `Intl.DateTimeFormat`, which disables time slots that have already passed today
- Postcode dialog with validation, a custom organic-only toggle switch, and a free-delivery meter

### 5. Paperback & Co.: bookshop

- **Book covers generated entirely in CSS** from a palette and pattern system, with no image files
- Search by title or author, genre filter, five sort orders, and **pagination**
- **Four-step checkout** (tote → shipping → delivery → review) using the browser's built-in Constraint Validation API, with accessible inline error messages
- Order review screen with an "Edit" link that jumps back to any step

---

## Technical decisions

- **Vanilla JavaScript on purpose.** Writing state management, rendering, routing and validation by hand shows an understanding of what frameworks do for you.
- **One state object per app plus render functions.** The UI is always derived from state, which keeps it predictable.
- **Event delegation.** One listener per event type handles all dynamically rendered elements, so listeners don't need re-binding after each render.
- **Progressive enhancement.** Semantic HTML first, then CSS, then JavaScript. Native elements (`<dialog>`, `<details>`, `<form>`, `type="search"`) are used before custom widgets.
- **No external images.** Product visuals are emoji, inline SVG or pure CSS, so the sites load fast and never show broken images.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `aside`, `footer`) and a skip link
- Every control has a label; toggle buttons use `aria-pressed`, `aria-checked`, `aria-selected` and `aria-current`
- `aria-live` regions announce cart updates, toasts and form errors
- Visible `:focus-visible` outlines, and focus moves into dialogs and to new content after route changes
- Respects `prefers-reduced-motion`

## Responsive and cross-browser support

Tested at 320px, 360px, 390px, 768px, 1024px, 1366px and 1920px wide, with no horizontal scrolling or overlapping content at any size.

| Browser              | Supported |
| -------------------- | --------- |
| Chrome / Edge        | 105+      |
| Firefox              | 110+      |
| Safari (macOS & iOS) | 15.4+     |
| Samsung Internet     | 20+       |

Compatibility details:

- `-webkit-` prefixes for `backdrop-filter`, `appearance` and `background-clip`
- `100dvh` with a `100vh` fallback, so mobile browser toolbars don't cut off drawers
- `env(safe-area-inset-*)` padding for notched phones
- Inputs are at least 16px on phones, which stops iOS Safari from zooming in when you tap a field
- `@media (hover: none)` shows hover-only UI, such as the quick-view label, on touch screens
- `localStorage` access is wrapped in `try/catch`, so the stores still work in private browsing

## Run locally

No install is required. Open `index.html` directly, or start a local server:

```bash
npm start
```

Format the code with Prettier:

```bash
npm run format
```

## Project structure

```
├── index.html              # Project gallery (landing page)
├── 404.html                # Custom not-found page for GitHub Pages
├── 01-lumen-home/          # index.html · styles.css · app.js
├── 02-volt-electronics/
├── 03-thread-fashion/
├── 04-bloom-grocery/
└── 05-paperback-books/
```

## Roadmap

- [ ] Dark-mode toggle for Lumen using CSS custom properties
- [ ] "Recently viewed" row in THREAD
- [ ] Unit tests for the cart and price logic
- [ ] Load products from a JSON file with `fetch()` and add loading skeletons

## License

[MIT](LICENSE). All brands, products and books are fictional. No real orders or payments are processed.
