// THREAD — a tiny hash-router SPA: home, listing, product detail (variants), wishlist, bag with promo code.

/* ---------- Data ---------- */
const SHAPES = {
  tee: "M30 18 L42 10 Q50 16 58 10 L70 18 L84 32 L74 42 L68 37 L68 90 L32 90 L32 37 L26 42 L16 32 Z",
  hoodie:
    "M28 22 L40 12 Q50 4 60 12 L72 22 L86 50 L76 56 L70 44 L70 92 L30 92 L30 44 L24 56 L14 50 Z M42 14 Q50 26 58 14",
  pants: "M30 8 L70 8 L74 92 L56 92 L50 36 L44 92 L26 92 Z",
  dress: "M40 8 L60 8 L62 26 L78 92 L22 92 L38 26 Z",
  jacket: "M28 16 L42 10 L50 30 L58 10 L72 16 L86 46 L76 50 L72 40 L72 92 L28 92 L28 40 L24 50 L14 46 Z",
  skirt: "M32 20 L68 20 L80 86 L20 86 Z",
};
const svg = (shape, color) =>
  `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="${SHAPES[shape]}" fill="${color}" stroke="rgba(0,0,0,.18)" stroke-width=".8" stroke-linejoin="round"/></svg>`;

const PRODUCTS = [
  {
    id: "heavy-tee",
    name: "Heavyweight Tee",
    gender: "men",
    type: "Tops",
    shape: "tee",
    price: 38,
    colors: { Bone: "#ece6d9", Black: "#1d1d1d", Olive: "#6b7046" },
    soldOut: ["XS"],
    tag: "Bestseller",
  },
  {
    id: "loop-hoodie",
    name: "Loopback Hoodie",
    gender: "men",
    type: "Tops",
    shape: "hoodie",
    price: 98,
    colors: { Grey: "#a7a7a5", Navy: "#25304a", Rust: "#a4502e" },
    soldOut: [],
  },
  {
    id: "pleat-trouser",
    name: "Pleated Trouser",
    gender: "men",
    type: "Bottoms",
    shape: "pants",
    price: 120,
    was: 150,
    colors: { Khaki: "#b9a77f", Charcoal: "#3a3a3a" },
    soldOut: ["XL"],
  },
  {
    id: "chore-jacket",
    name: "Canvas Chore Jacket",
    gender: "men",
    type: "Outerwear",
    shape: "jacket",
    price: 185,
    colors: { Ecru: "#ddd2bb", Indigo: "#2e3b63" },
    soldOut: [],
    tag: "New",
  },
  {
    id: "slip-dress",
    name: "Satin Slip Dress",
    gender: "women",
    type: "Dresses",
    shape: "dress",
    price: 135,
    colors: { Champagne: "#e5cfa9", Black: "#151515", Sage: "#9aaa8f" },
    soldOut: ["S"],
    tag: "New",
  },
  {
    id: "boxy-tee",
    name: "Boxy Cotton Tee",
    gender: "women",
    type: "Tops",
    shape: "tee",
    price: 32,
    colors: { White: "#f7f7f5", Lilac: "#c6b6d8", Cocoa: "#6a4a3a" },
    soldOut: [],
  },
  {
    id: "wide-leg",
    name: "Wide-Leg Denim",
    gender: "women",
    type: "Bottoms",
    shape: "pants",
    price: 110,
    was: 140,
    colors: { Light: "#9fb5cf", Raw: "#26344f" },
    soldOut: ["XS"],
  },
  {
    id: "midi-skirt",
    name: "Bias Midi Skirt",
    gender: "women",
    type: "Bottoms",
    shape: "skirt",
    price: 88,
    colors: { Butter: "#f0dd9c", Black: "#1b1b1b" },
    soldOut: [],
  },
  {
    id: "wool-coat",
    name: "Double-Face Wool Coat",
    gender: "women",
    type: "Outerwear",
    shape: "jacket",
    price: 320,
    colors: { Camel: "#b88b5a", Oat: "#d8cbb3" },
    soldOut: ["L"],
    tag: "Bestseller",
  },
  {
    id: "fleece-hoodie",
    name: "Recycled Fleece Hoodie",
    gender: "women",
    type: "Tops",
    shape: "hoodie",
    price: 92,
    was: 115,
    colors: { Moss: "#5c6b4c", Cream: "#efe8d8" },
    soldOut: [],
  },
  {
    id: "rib-tee",
    name: "Rib Fitted Tee",
    gender: "women",
    type: "Tops",
    shape: "tee",
    price: 28,
    colors: { Red: "#b4252e", Black: "#181818" },
    soldOut: [],
  },
  {
    id: "cargo",
    name: "Ripstop Cargo",
    gender: "men",
    type: "Bottoms",
    shape: "pants",
    price: 115,
    colors: { Stone: "#a39c8a", Black: "#1d1d1d" },
    soldOut: ["S"],
  },
];
const SIZES = ["XS", "S", "M", "L", "XL"];
const PROMOS = { THREAD10: 0.1, WELCOME20: 0.2 };

/* ---------- State (persisted) ---------- */
const store = {
  get(k, d) {
    try {
      return JSON.parse(localStorage.getItem("thread-" + k)) ?? d;
    } catch {
      return d;
    }
  },
  set(k, v) {
    try {
      localStorage.setItem("thread-" + k, JSON.stringify(v));
    } catch {}
  },
};
let wishlist = store.get("wish", []);
let bag = store.get("bag", []); // [{ key, id, color, size, qty }]
let promo = store.get("promo", null);

const $ = (s, el = document) => el.querySelector(s);
const app = $("#app");
const money = (n) => `$${n.toFixed(2).replace(/\.00$/, "")}`;
const find = (id) => PRODUCTS.find((p) => p.id === id);

/* ---------- Components ---------- */
function priceHTML(p) {
  return p.was ? `<span class="new">${money(p.price)}</span><span class="old">${money(p.was)}</span>` : money(p.price);
}

function card(p) {
  const [firstColor] = Object.values(p.colors);
  const liked = wishlist.includes(p.id);
  return `
    <article class="item fade-in">
      <button class="heart" data-wish="${p.id}" aria-pressed="${liked}" aria-label="${liked ? "Remove from" : "Add to"} wishlist">${liked ? "♥" : "♡"}</button>
      <a href="#/product/${p.id}" class="item-media">
        ${p.was ? `<span class="label sale">Sale</span>` : p.tag ? `<span class="label">${p.tag}</span>` : ""}
        ${svg(p.shape, firstColor)}
      </a>
      <div class="item-info">
        <a href="#/product/${p.id}"><strong>${p.name}</strong></a>
        <span class="muted">${Object.keys(p.colors).length} colours</span>
        <span class="price">${priceHTML(p)}</span>
        <div class="swatches">${Object.entries(p.colors)
          .map(([n, c]) => `<span class="dot" title="${n}" style="background:${c}"></span>`)
          .join("")}</div>
      </div>
    </article>`;
}

/* ---------- Views ---------- */
const views = {
  home() {
    const featured = PRODUCTS.filter((p) => p.tag).slice(0, 4);
    return `
      <section class="hero fade-in">
        <div class="hero-main">
          ${svg("jacket", "#a4502e")}
          <h1>Built<br/>to last.</h1>
          <p>The autumn edit: heavyweight cottons, recycled wool and workwear cuts made to be worn hard.</p>
          <a class="btn" href="#/shop/all">Shop the edit</a>
        </div>
        <div class="hero-side">
          <a href="#/shop/women" class="tile"><h2>Women</h2><span>Shop now</span></a>
          <a href="#/shop/men" class="tile"><h2>Men</h2><span>Shop now</span></a>
        </div>
      </section>
      <div class="section-title"><h2>Most loved</h2><a href="#/shop/all">View all</a></div>
      <div class="grid">${featured.map(card).join("")}</div>`;
  },

  shop(gender = "all", type = "All") {
    const types = ["All", ...new Set(PRODUCTS.map((p) => p.type))];
    const list = PRODUCTS.filter(
      (p) => (gender === "all" || p.gender === gender) && (type === "All" || p.type === type),
    );
    return `
      <div class="toolbar">
        <div><h1>${gender === "all" ? "All products" : gender}</h1><span class="count">${list.length} items</span></div>
        <div class="pills">${types.map((t) => `<a class="pill ${t === type ? "on" : ""}" href="#/shop/${gender}/${t}">${t}</a>`).join("")}</div>
      </div>
      <div class="grid">${list.map(card).join("") || "<p>No items in this category yet.</p>"}</div>`;
  },

  product(id) {
    const p = find(id);
    if (!p) return views.notFound();
    const [firstName, firstColor] = Object.entries(p.colors)[0];
    const liked = wishlist.includes(p.id);
    return `
      <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Home</a> / <a href="#/shop/${p.gender}">${p.gender}</a> / ${p.name}</nav>
      <section class="pdp fade-in" data-product="${p.id}">
        <div class="pdp-gallery">
          ${[0, 1, 2].map(() => `<div class="shot">${svg(p.shape, firstColor)}</div>`).join("")}
        </div>
        <div class="pdp-info">
          <div>
            <h1>${p.name}</h1>
            <p class="price">${priceHTML(p)}</p>
          </div>
          <div>
            <div class="opt-label">Colour <span id="colorName">${firstName}</span></div>
            <div class="colors" role="radiogroup" aria-label="Colour">
              ${Object.entries(p.colors)
                .map(
                  ([n, c], i) =>
                    `<button class="color" role="radio" aria-checked="${i === 0}" aria-label="${n}" data-color="${n}" style="background:${c}"></button>`,
                )
                .join("")}
            </div>
          </div>
          <div>
            <div class="opt-label">Size <span>Model is 185 cm, wears M</span></div>
            <div class="sizes" role="radiogroup" aria-label="Size" id="sizes">
              ${SIZES.map((s) => `<button class="size" role="radio" aria-checked="false" data-size="${s}" ${p.soldOut.includes(s) ? "disabled" : ""}>${s}</button>`).join("")}
            </div>
            <p class="error" id="sizeError" role="alert"></p>
          </div>
          <div class="pdp-actions">
            <button class="btn" id="addToBag">Add to bag — ${money(p.price)}</button>
            <button class="heart" data-wish="${p.id}" aria-pressed="${liked}" aria-label="Wishlist">${liked ? "♥" : "♡"}</button>
          </div>
          <div>
            <details open><summary>Details</summary><p>Relaxed fit. Made from organic and recycled fibres in a Fair Wear certified factory in Portugal.</p></details>
            <details><summary>Care</summary><p>Machine wash cold, inside out. Hang to dry. Do not tumble dry.</p></details>
            <details><summary>Shipping & returns</summary><p>Free carbon-neutral delivery in 2–4 days. Free returns within 30 days.</p></details>
          </div>
        </div>
      </section>
      <div class="section-title"><h2>You may also like</h2></div>
      <div class="grid">${PRODUCTS.filter((x) => x.type === p.type && x.id !== p.id)
        .slice(0, 4)
        .map(card)
        .join("")}</div>`;
  },

  wishlist() {
    const list = wishlist.map(find).filter(Boolean);
    return (
      `<h1 class="page-title">Wishlist</h1>` +
      (list.length
        ? `<div class="grid">${list.map(card).join("")}</div>`
        : `<div class="empty-state"><p>Nothing saved yet. Tap ♡ on anything you like.</p><a class="btn" href="#/shop/all">Browse products</a></div>`)
    );
  },

  bag() {
    if (!bag.length)
      return `<h1 class="page-title">Your bag</h1><div class="empty-state"><p>Your bag is empty.</p><a class="btn" href="#/shop/all">Start shopping</a></div>`;
    const t = totals();
    return `
      <h1 class="page-title">Your bag</h1>
      <section class="bag fade-in">
        <div>
          ${bag
            .map((l) => {
              const p = find(l.id);
              return `
              <div class="bag-line">
                <a href="#/product/${p.id}" class="bag-thumb">${svg(p.shape, p.colors[l.color])}</a>
                <div>
                  <strong>${p.name}</strong>
                  <div class="muted">${l.color} · ${l.size}</div>
                  <label class="muted">Qty
                    <select class="qty-select" data-line="${l.key}">${[1, 2, 3, 4, 5, 6].map((n) => `<option ${n === l.qty ? "selected" : ""}>${n}</option>`).join("")}</select>
                  </label>
                  <button class="text-btn" data-remove="${l.key}">Remove</button>
                </div>
                <strong>${money(p.price * l.qty)}</strong>
              </div>`;
            })
            .join("")}
        </div>
        <aside class="summary">
          <div class="row"><span>Subtotal</span><span>${money(t.sub)}</span></div>
          ${t.discount ? `<div class="row"><span>Discount (${promo})</span><span>−${money(t.discount)}</span></div>` : ""}
          <div class="row"><span>Shipping</span><span>${t.ship ? money(t.ship) : "Free"}</span></div>
          <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
          <form class="promo" id="promoForm">
            <input id="promoInput" aria-label="Promo code" placeholder="Promo code" value="${promo ?? ""}" />
            <button>Apply</button>
          </form>
          <p class="promo-msg" id="promoMsg"></p>
          <button class="btn btn-block" id="checkoutBtn">Checkout</button>
        </aside>
      </section>`;
  },

  notFound() {
    return `<div class="empty-state"><h1 class="page-title">Page not found</h1><a class="btn" href="#/">Go home</a></div>`;
  },
};

function totals() {
  const sub = bag.reduce((s, l) => s + find(l.id).price * l.qty, 0);
  const discount = promo ? +(sub * PROMOS[promo]).toFixed(2) : 0;
  const ship = sub - discount >= 100 ? 0 : 8;
  return { sub, discount, ship, total: sub - discount + ship };
}

/* ---------- Router ---------- */
function router() {
  const [, route = "", a, b] = location.hash.split("/");
  const html =
    route === ""
      ? views.home()
      : route === "shop"
        ? views.shop(a, b && decodeURIComponent(b))
        : route === "product"
          ? views.product(a)
          : route === "wishlist"
            ? views.wishlist()
            : route === "bag"
              ? views.bag()
              : views.notFound();
  app.innerHTML = html;
  document
    .querySelectorAll(".nav a")
    .forEach((l) => l.classList.toggle("active", location.hash.startsWith(l.getAttribute("href"))));
  closeMenu();
  window.scrollTo(0, 0);
  app.focus({ preventScroll: true });
  updateCounts();
}

function updateCounts() {
  $("#wishCount").textContent = wishlist.length;
  $("#bagCount").textContent = bag.reduce((s, l) => s + l.qty, 0);
}

let toastTimer;
function toast(html) {
  const t = $("#toast");
  t.innerHTML = html;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
}

function closeMenu() {
  $("#mainNav").classList.remove("open");
  $("#menuToggle").setAttribute("aria-expanded", "false");
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const wish = e.target.closest("[data-wish]");
  if (wish) {
    const id = wish.dataset.wish;
    wishlist = wishlist.includes(id) ? wishlist.filter((x) => x !== id) : [...wishlist, id];
    store.set("wish", wishlist);
    if (location.hash === "#/wishlist") return router();
    const liked = wishlist.includes(id);
    document.querySelectorAll(`[data-wish="${id}"]`).forEach((b) => {
      b.textContent = liked ? "♥" : "♡";
      b.setAttribute("aria-pressed", liked);
    });
    updateCounts();
    return;
  }

  const pdp = e.target.closest(".pdp");
  if (pdp) {
    const p = find(pdp.dataset.product);
    const color = e.target.closest("[data-color]");
    const size = e.target.closest("[data-size]");
    if (color) {
      pdp.querySelectorAll("[data-color]").forEach((b) => b.setAttribute("aria-checked", b === color));
      $("#colorName").textContent = color.dataset.color;
      pdp.querySelectorAll(".shot path").forEach((path) => path.setAttribute("fill", p.colors[color.dataset.color]));
    }
    if (size) {
      pdp.querySelectorAll("[data-size]").forEach((b) => b.setAttribute("aria-checked", b === size));
      $("#sizeError").textContent = "";
    }
    if (e.target.id === "addToBag") {
      const chosenSize = $('[data-size][aria-checked="true"]', pdp)?.dataset.size;
      const chosenColor = $('[data-color][aria-checked="true"]', pdp).dataset.color;
      if (!chosenSize) {
        $("#sizeError").textContent = "Please select a size.";
        const s = $("#sizes");
        s.classList.remove("shake");
        void s.offsetWidth;
        s.classList.add("shake");
        return;
      }
      const key = `${p.id}|${chosenColor}|${chosenSize}`;
      const line = bag.find((l) => l.key === key);
      line ? line.qty++ : bag.push({ key, id: p.id, color: chosenColor, size: chosenSize, qty: 1 });
      store.set("bag", bag);
      updateCounts();
      toast(`Added <b>${p.name}</b> (${chosenColor}, ${chosenSize}) <a href="#/bag">View bag</a>`);
    }
  }

  const rm = e.target.closest("[data-remove]");
  if (rm) {
    bag = bag.filter((l) => l.key !== rm.dataset.remove);
    store.set("bag", bag);
    router();
  }

  if (e.target.id === "checkoutBtn") {
    bag = [];
    promo = null;
    store.set("bag", bag);
    store.set("promo", null);
    router();
    toast("Order confirmed — thank you! (Demo only)");
  }
});

document.addEventListener("change", (e) => {
  if (e.target.matches(".qty-select")) {
    bag.find((l) => l.key === e.target.dataset.line).qty = +e.target.value;
    store.set("bag", bag);
    router();
  }
});

document.addEventListener("submit", (e) => {
  if (e.target.id !== "promoForm") return;
  e.preventDefault();
  const code = $("#promoInput").value.trim().toUpperCase();
  if (PROMOS[code]) {
    promo = code;
    store.set("promo", promo);
    router();
    toast(`Code <b>${code}</b> applied`);
  } else {
    $("#promoMsg").textContent = code ? "That code isn't valid. Try THREAD10." : "";
  }
});

$("#menuToggle").addEventListener("click", () => {
  const open = $("#mainNav").classList.toggle("open");
  $("#menuToggle").setAttribute("aria-expanded", open);
});

window.addEventListener("hashchange", router);
router();
