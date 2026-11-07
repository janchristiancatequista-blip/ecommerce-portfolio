// Volt — search with highlighting, multi-facet filters, compare (max 3), cart with tax.
const ICONS = {
  Laptops: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/></svg>',
  Audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/></svg>',
  Phones: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="7" y="2" width="10" height="20" rx="2.5"/><path d="M11 18h2"/></svg>',
  Cameras: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 8h4l2-3h6l2 3h4v11H3z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  Wearables: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4"/></svg>',
};
const GLOW = { Laptops: "rgba(61,224,255,.25)", Audio: "rgba(198,255,61,.22)", Phones: "rgba(170,120,255,.25)", Cameras: "rgba(255,120,90,.22)", Wearables: "rgba(255,210,74,.2)" };

const PRODUCTS = [
  { id: 1, name: "Aero 14 Pro Laptop", brand: "Nimbus", cat: "Laptops", price: 1899, was: 2099, rating: 4.8, pop: 98, specs: { CPU: "12-core M-class", RAM: "32 GB", Storage: "1 TB SSD", Battery: "18 h", Weight: "1.4 kg" } },
  { id: 2, name: "Slate 13 Ultrabook", brand: "Korra", cat: "Laptops", price: 1199, rating: 4.5, pop: 80, specs: { CPU: "8-core", RAM: "16 GB", Storage: "512 GB SSD", Battery: "14 h", Weight: "1.1 kg" } },
  { id: 3, name: "Forge 16 Gaming", brand: "Titan", cat: "Laptops", price: 2399, rating: 4.6, pop: 76, specs: { CPU: "16-core", RAM: "32 GB", Storage: "2 TB SSD", Battery: "7 h", Weight: "2.4 kg" } },
  { id: 4, name: "Pulse ANC Headphones", brand: "Sonique", cat: "Audio", price: 349, was: 399, rating: 4.9, pop: 99, specs: { Driver: "40 mm", ANC: "Adaptive", Battery: "40 h", Weight: "250 g" } },
  { id: 5, name: "Drift Earbuds", brand: "Sonique", cat: "Audio", price: 179, rating: 4.4, pop: 90, specs: { Driver: "11 mm", ANC: "Yes", Battery: "8 h (+24 h)", Weight: "5 g" } },
  { id: 6, name: "Monolith Speaker", brand: "Korra", cat: "Audio", price: 249, rating: 4.3, pop: 60, specs: { Driver: "2× 50 mm", ANC: "—", Battery: "20 h", Weight: "900 g" } },
  { id: 7, name: "Orbit X Phone", brand: "Nimbus", cat: "Phones", price: 999, rating: 4.7, pop: 95, specs: { Screen: '6.3" OLED 120 Hz', Storage: "256 GB", Camera: "50 MP triple", Battery: "4800 mAh" } },
  { id: 8, name: "Orbit Lite Phone", brand: "Nimbus", cat: "Phones", price: 549, was: 599, rating: 4.4, pop: 85, specs: { Screen: '6.1" OLED 90 Hz', Storage: "128 GB", Camera: "48 MP dual", Battery: "4300 mAh" } },
  { id: 9, name: "Edge Fold", brand: "Titan", cat: "Phones", price: 1799, rating: 4.2, pop: 64, specs: { Screen: '7.6" foldable', Storage: "512 GB", Camera: "50 MP triple", Battery: "4400 mAh" } },
  { id: 10, name: "Frame Z Mirrorless", brand: "Optix", cat: "Cameras", price: 1499, rating: 4.8, pop: 72, specs: { Sensor: "Full-frame 33 MP", Video: "4K 60p", IBIS: "5-axis", Weight: "650 g" } },
  { id: 11, name: "Snap Mini Action Cam", brand: "Optix", cat: "Cameras", price: 299, rating: 4.5, pop: 82, specs: { Sensor: '1/1.9"', Video: "5.3K 60p", IBIS: "Electronic", Weight: "150 g" } },
  { id: 12, name: "Vital Watch 3", brand: "Korra", cat: "Wearables", price: 399, rating: 4.6, pop: 88, specs: { Screen: "1.9\" AMOLED", Battery: "3 days", GPS: "Dual-band", Water: "50 m" } },
  { id: 13, name: "Loop Fitness Band", brand: "Titan", cat: "Wearables", price: 89, was: 119, rating: 4.1, pop: 70, specs: { Screen: "1.1\" AMOLED", Battery: "14 days", GPS: "Connected", Water: "50 m" } },
  { id: 14, name: "Halo Smart Ring", brand: "Nimbus", cat: "Wearables", price: 299, rating: 4.3, pop: 58, specs: { Screen: "—", Battery: "7 days", GPS: "—", Water: "100 m" } },
];

const MAX_COMPARE = 3;
const TAX = 0.08;
const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const maxPrice = Math.max(...PRODUCTS.map((p) => p.price));
const initial = () => ({ q: "", cats: new Set(), brands: new Set(), max: Math.ceil(maxPrice / 50) * 50, highRated: false, sort: "pop" });
let filters = initial();
let compare = [];
let cart = JSON.parse(localStorage.getItem("volt-cart") || "{}");

/* ---------- Filters UI ---------- */
function renderFacet(el, key, values) {
  el.innerHTML = values.map((v) => {
    const n = PRODUCTS.filter((p) => p[key] === v).length;
    return `<label class="check"><input type="checkbox" value="${v}" ${filters[key === "cat" ? "cats" : "brands"].has(v) ? "checked" : ""} /> ${v}<span class="n">${n}</span></label>`;
  }).join("");
}
function renderFilters() {
  renderFacet($("#categoryFilters"), "cat", [...new Set(PRODUCTS.map((p) => p.cat))]);
  renderFacet($("#brandFilters"), "brand", [...new Set(PRODUCTS.map((p) => p.brand))].sort());
  $("#priceRange").max = filters.max > maxPrice ? filters.max : Math.ceil(maxPrice / 50) * 50;
  $("#priceRange").value = filters.max;
  $("#priceLabel").textContent = money(filters.max);
  $("#highRated").checked = filters.highRated;
  $("#searchInput").value = filters.q;
  $("#sortSelect").value = filters.sort;
}

/* ---------- Results ---------- */
function highlight(text) {
  const safe = esc(text);
  if (!filters.q) return safe;
  const re = new RegExp(`(${filters.q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "ig");
  return safe.replace(re, "<mark>$1</mark>");
}

function results() {
  const q = filters.q.toLowerCase();
  const list = PRODUCTS.filter((p) =>
    (!q || `${p.name} ${p.brand} ${p.cat}`.toLowerCase().includes(q)) &&
    (!filters.cats.size || filters.cats.has(p.cat)) &&
    (!filters.brands.size || filters.brands.has(p.brand)) &&
    p.price <= filters.max &&
    (!filters.highRated || p.rating >= 4.5)
  );
  const by = { pop: (a, b) => b.pop - a.pop, low: (a, b) => a.price - b.price, high: (a, b) => b.price - a.price, rating: (a, b) => b.rating - a.rating };
  return list.sort(by[filters.sort]);
}

function renderGrid() {
  const list = results();
  $("#resultCount").textContent = list.length;
  $("#noResults").hidden = list.length > 0;
  $("#grid").innerHTML = list.map((p) => {
    const inCmp = compare.includes(p.id);
    const off = p.was ? Math.round((1 - p.price / p.was) * 100) : 0;
    return `
      <article class="card">
        <div class="media" style="--glow:${GLOW[p.cat]}">
          ${off ? `<span class="disc">-${off}%</span>` : ""}
          ${ICONS[p.cat]}
        </div>
        <span class="brand">${highlight(p.brand)}</span>
        <h3>${highlight(p.name)}</h3>
        <div class="specs">${Object.values(p.specs).slice(0, 3).map((s) => `<span>${s}</span>`).join("")}</div>
        <div class="rating"><b>★</b> ${p.rating.toFixed(1)}</div>
        <div class="price-row"><span class="price">${money(p.price)}</span>${p.was ? `<span class="was">${money(p.was)}</span>` : ""}</div>
        <div class="actions">
          <button class="btn" data-add="${p.id}">Add to cart</button>
          <button class="cmp" data-cmp="${p.id}" aria-pressed="${inCmp}">${inCmp ? "✓ Compare" : "+ Compare"}</button>
        </div>
      </article>`;
  }).join("");
}

/* ---------- Compare ---------- */
function toggleCompare(id) {
  if (compare.includes(id)) compare = compare.filter((x) => x !== id);
  else if (compare.length < MAX_COMPARE) compare.push(id);
  else return alert(`You can compare up to ${MAX_COMPARE} products.`);
  renderCompareTray();
  renderGrid();
}

function renderCompareTray() {
  $("#compareTray").hidden = compare.length === 0;
  const slots = [];
  for (let i = 0; i < MAX_COMPARE; i++) {
    const p = PRODUCTS.find((x) => x.id === compare[i]);
    slots.push(p
      ? `<div class="slot filled">${esc(p.name)}<button data-cmp="${p.id}" aria-label="Remove ${esc(p.name)} from compare">✕</button></div>`
      : `<div class="slot">Add a product</div>`);
  }
  $("#compareSlots").innerHTML = slots.join("");
  $("#compareOpen").disabled = compare.length < 2;
}

function openCompare() {
  const items = compare.map((id) => PRODUCTS.find((p) => p.id === id));
  const keys = [...new Set(items.flatMap((p) => Object.keys(p.specs)))];
  const minPrice = Math.min(...items.map((p) => p.price));
  const maxRating = Math.max(...items.map((p) => p.rating));
  const row = (label, cells) => `<tr><th>${label}</th>${cells.join("")}</tr>`;
  $("#compareTable").innerHTML = [
    row("Product", items.map((p) => `<td><strong>${esc(p.name)}</strong><br><span class="brand">${p.brand}</span></td>`)),
    row("Price", items.map((p) => `<td class="mono ${p.price === minPrice ? "best" : ""}">${money(p.price)}</td>`)),
    row("Rating", items.map((p) => `<td class="${p.rating === maxRating ? "best" : ""}">★ ${p.rating}</td>`)),
    ...keys.map((k) => row(k, items.map((p) => `<td>${p.specs[k] ?? "—"}</td>`))),
    row("", items.map((p) => `<td><button class="btn" data-add="${p.id}">Add to cart</button></td>`)),
  ].join("");
  $("#compareDialog").showModal();
}

/* ---------- Cart ---------- */
function setQty(id, qty) {
  if (qty <= 0) delete cart[id]; else cart[id] = qty;
  localStorage.setItem("volt-cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  const items = Object.entries(cart).map(([id, qty]) => ({ ...PRODUCTS.find((p) => p.id === +id), qty }));
  const count = items.reduce((s, i) => s + i.qty, 0);
  const sub = items.reduce((s, i) => s + i.qty * i.price, 0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(sub);
  $("#sumSub").textContent = money(sub);
  $("#sumTax").textContent = money(+(sub * TAX).toFixed(2));
  $("#sumTotal").textContent = money(+(sub * (1 + TAX)).toFixed(2));
  $("#checkout").disabled = !count;
  $("#cartList").innerHTML = items.length
    ? items.map((i) => `
      <li>
        <div><div>${esc(i.name)}</div><div class="meta">${money(i.price)} each</div></div>
        <div class="mono">${money(i.price * i.qty)}</div>
        <div class="stepper">
          <button data-qty="${i.id}" data-d="-1" aria-label="Decrease">−</button><span>${i.qty}</span><button data-qty="${i.id}" data-d="1" aria-label="Increase">+</button>
        </div>
      </li>`).join("")
    : `<li class="empty">Cart is empty</li>`;
}

/* ---------- Events ---------- */
let debounce;
$("#searchInput").addEventListener("input", (e) => {
  clearTimeout(debounce);
  debounce = setTimeout(() => { filters.q = e.target.value.trim(); renderGrid(); }, 150);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement.tagName !== "INPUT") { e.preventDefault(); $("#searchInput").focus(); }
});

$("#categoryFilters").addEventListener("change", (e) => { e.target.checked ? filters.cats.add(e.target.value) : filters.cats.delete(e.target.value); renderGrid(); });
$("#brandFilters").addEventListener("change", (e) => { e.target.checked ? filters.brands.add(e.target.value) : filters.brands.delete(e.target.value); renderGrid(); });
$("#priceRange").addEventListener("input", (e) => { filters.max = +e.target.value; $("#priceLabel").textContent = money(filters.max); renderGrid(); });
$("#highRated").addEventListener("change", (e) => { filters.highRated = e.target.checked; renderGrid(); });
$("#sortSelect").addEventListener("change", (e) => { filters.sort = e.target.value; renderGrid(); });
const reset = () => { filters = initial(); renderFilters(); renderGrid(); };
$("#resetFilters").addEventListener("click", reset);
$("#resetFilters2").addEventListener("click", reset);

document.addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const cmp = e.target.closest("[data-cmp]");
  const qty = e.target.closest("[data-qty]");
  if (add) {
    const id = +add.dataset.add;
    setQty(id, (cart[id] || 0) + 1);
    add.textContent = "Added ✓";
    setTimeout(() => (add.textContent = "Add to cart"), 900);
  }
  if (cmp) toggleCompare(+cmp.dataset.cmp);
  if (qty) setQty(+qty.dataset.qty, (cart[qty.dataset.qty] || 0) + +qty.dataset.d);
});

$("#compareOpen").addEventListener("click", openCompare);
$("#compareClose").addEventListener("click", () => $("#compareDialog").close());
$("#cartBtn").addEventListener("click", () => $("#cartDialog").showModal());
$("#cartClose").addEventListener("click", () => $("#cartDialog").close());
document.querySelectorAll("dialog").forEach((d) => d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
$("#checkout").addEventListener("click", () => {
  cart = {};
  setQty(0, 0);
  $("#cartDialog").close();
  alert("Order placed! (Demo only — nothing was charged.)");
});

renderFilters();
renderGrid();
renderCompareTray();
renderCart();
