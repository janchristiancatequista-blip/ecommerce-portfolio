// Lumen — vanilla JS store: filtering, sorting, quick view, persistent cart drawer.
const PRODUCTS = [
  { id: 1, name: "Oak Lounge Chair", category: "Furniture", price: 489, icon: "🪑", bg: "#e7d8c6", badge: "Bestseller", desc: "Solid white oak frame with a hand-woven paper cord seat. Built to soften and age beautifully." },
  { id: 2, name: "Dune Table Lamp", category: "Lighting", price: 168, icon: "💡", bg: "#efe2cf", desc: "Hand-thrown ceramic base with a linen shade that casts a warm, diffused glow." },
  { id: 3, name: "Stoneware Vase", category: "Ceramics", price: 64, icon: "🏺", bg: "#d9c4ad", badge: "New", desc: "Speckled stoneware vase, glazed inside only for a raw, tactile finish." },
  { id: 4, name: "Linen Throw", category: "Textiles", price: 95, icon: "🧣", bg: "#e4dccf", desc: "Stonewashed European linen, generously sized at 130 × 180 cm." },
  { id: 5, name: "Walnut Side Table", category: "Furniture", price: 329, icon: "🪵", bg: "#d6c1a8", desc: "A compact round table in oiled American walnut. Perfect next to a sofa or bed." },
  { id: 6, name: "Paper Pendant", category: "Lighting", price: 142, icon: "🏮", bg: "#f0e6d6", badge: "New", desc: "Hand-folded mulberry paper pendant. Each one is slightly unique." },
  { id: 7, name: "Ripple Mug Set", category: "Ceramics", price: 48, icon: "☕", bg: "#e8d5c0", desc: "Set of two textured mugs, dishwasher-safe, 300 ml each." },
  { id: 8, name: "Wool Floor Cushion", category: "Textiles", price: 120, icon: "🛋️", bg: "#ded2c2", desc: "Chunky hand-loomed wool cushion filled with recycled fibre." },
  { id: 9, name: "Arc Floor Lamp", category: "Lighting", price: 395, icon: "🪔", bg: "#e9dccb", badge: "Bestseller", desc: "Brushed brass arc with a dimmable LED. Gently sculptural, deeply practical." },
  { id: 10, name: "Serving Bowl", category: "Ceramics", price: 72, icon: "🥣", bg: "#e3cfb8", desc: "Wide, shallow bowl for salads and sharing. Food-safe matte glaze." },
  { id: 11, name: "Cane Bench", category: "Furniture", price: 540, icon: "🛏️", bg: "#dccab3", desc: "Entryway bench in ash with a natural rattan cane panel." },
  { id: 12, name: "Herringbone Rug", category: "Textiles", price: 260, icon: "🧶", bg: "#e6dbcb", desc: "Flat-woven jute and wool rug, 160 × 230 cm." },
];

const FREE_SHIPPING = 150;
const STORAGE_KEY = "lumen-cart";
const fmt = (n) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
const $ = (sel) => document.querySelector(sel);

const state = {
  category: "All",
  sort: "featured",
  cart: loadCart(),
};

function loadCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveCart() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state.cart)); } catch { /* storage unavailable */ }
}

/* ---------- Catalogue ---------- */
function renderChips() {
  const cats = ["All", ...new Set(PRODUCTS.map((p) => p.category))];
  $("#categoryChips").innerHTML = cats
    .map((c) => `<button class="chip" role="tab" aria-selected="${c === state.category}" data-cat="${c}">${c}</button>`)
    .join("");
}

function visibleProducts() {
  let list = PRODUCTS.filter((p) => state.category === "All" || p.category === state.category);
  const sorters = {
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    name: (a, b) => a.name.localeCompare(b.name),
  };
  if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
  return list;
}

function renderGrid() {
  $("#productGrid").innerHTML = visibleProducts()
    .map((p, i) => `
      <article class="card" style="animation-delay:${i * 40}ms">
        <button class="card-media" style="background:${p.bg}" data-quick="${p.id}" aria-label="Quick view ${p.name}">
          ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}
          <span aria-hidden="true">${p.icon}</span>
          <span class="quick">Quick view</span>
        </button>
        <div class="card-body">
          <div><h3>${p.name}</h3><span class="cat">${p.category}</span></div>
          <span class="price">${fmt(p.price)}</span>
        </div>
        <button class="btn btn-outline add-btn" data-add="${p.id}">Add to cart</button>
      </article>`)
    .join("");
}

/* ---------- Quick view ---------- */
function openQuickView(id) {
  const p = PRODUCTS.find((x) => x.id === id);
  $("#qvBody").innerHTML = `
    <div class="qv-media" style="background:${p.bg}"><span aria-hidden="true">${p.icon}</span></div>
    <div class="qv-info">
      <span class="eyebrow">${p.category}</span>
      <h3>${p.name}</h3>
      <span class="price">${fmt(p.price)}</span>
      <p>${p.desc}</p>
      <ul><li>Ships in 3–5 business days</li><li>Lifetime repair guarantee</li><li>Plastic-free packaging</li></ul>
      <button class="btn btn-dark" data-add="${p.id}">Add to cart</button>
    </div>`;
  $("#quickView").showModal();
}

/* ---------- Cart ---------- */
function addToCart(id) {
  state.cart[id] = (state.cart[id] || 0) + 1;
  saveCart();
  renderCart();
  const badge = $("#cartCount");
  badge.classList.add("bump");
  setTimeout(() => badge.classList.remove("bump"), 300);
  toast(`${PRODUCTS.find((p) => p.id === id).name} added to cart`);
}

function changeQty(id, delta) {
  state.cart[id] = (state.cart[id] || 0) + delta;
  if (state.cart[id] <= 0) delete state.cart[id];
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = Object.entries(state.cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === +id), qty }));
  const count = entries.reduce((s, i) => s + i.qty, 0);
  const subtotal = entries.reduce((s, i) => s + i.qty * i.price, 0);

  $("#cartCount").textContent = count;
  $("#cartSubtotal").textContent = fmt(subtotal);
  $("#checkoutBtn").disabled = count === 0;

  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING) * 100);
  $("#shipProgress").innerHTML = `
    ${remaining > 0 ? `You're <strong>${fmt(remaining)}</strong> away from free shipping` : "🎉 You've unlocked <strong>free shipping</strong>"}
    <div class="bar"><span style="width:${pct}%"></span></div>`;

  $("#cartItems").innerHTML = entries.length
    ? entries.map((i) => `
        <li class="cart-item">
          <div class="cart-thumb" style="background:${i.bg}" aria-hidden="true">${i.icon}</div>
          <div>
            <h4>${i.name}</h4>
            <div class="qty">
              <button data-dec="${i.id}" aria-label="Decrease quantity">−</button>
              <span>${i.qty}</span>
              <button data-inc="${i.id}" aria-label="Increase quantity">+</button>
            </div>
            <br /><button class="remove" data-remove="${i.id}">Remove</button>
          </div>
          <strong>${fmt(i.price * i.qty)}</strong>
        </li>`).join("")
    : `<li class="empty">Your cart is empty.<br />Find something you'll love.</li>`;
}

function toggleDrawer(open) {
  $("#cartDrawer").classList.toggle("open", open);
  $("#cartDrawer").setAttribute("aria-hidden", String(!open));
  $("#overlay").hidden = !open;
  document.body.style.overflow = open ? "hidden" : "";
  if (open) $("#cartClose").focus();
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------- Events (delegated) ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-cat],[data-add],[data-quick],[data-inc],[data-dec],[data-remove]");
  if (!t) return;
  const d = t.dataset;
  if (d.cat) { state.category = d.cat; renderChips(); renderGrid(); }
  if (d.add) addToCart(+d.add);
  if (d.quick) openQuickView(+d.quick);
  if (d.inc) changeQty(+d.inc, 1);
  if (d.dec) changeQty(+d.dec, -1);
  if (d.remove) changeQty(+d.remove, -Infinity);
});

$("#sortSelect").addEventListener("change", (e) => { state.sort = e.target.value; renderGrid(); });
$("#cartOpen").addEventListener("click", () => toggleDrawer(true));
$("#cartClose").addEventListener("click", () => toggleDrawer(false));
$("#overlay").addEventListener("click", () => toggleDrawer(false));
$("#qvClose").addEventListener("click", () => $("#quickView").close());
$("#quickView").addEventListener("click", (e) => { if (e.target.id === "quickView") e.target.close(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleDrawer(false); });

$("#checkoutBtn").addEventListener("click", () => {
  state.cart = {};
  saveCart();
  renderCart();
  toggleDrawer(false);
  toast("Thank you! This is a demo — no order was placed.");
});

$("#newsletterForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#email");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
  input.classList.toggle("invalid", !ok);
  $("#newsletterMsg").textContent = ok ? "Thanks — you're on the list." : "Please enter a valid email address.";
  if (ok) input.value = "";
});

renderChips();
renderGrid();
renderCart();
