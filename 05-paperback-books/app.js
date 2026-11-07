// Paperback & Co. — generated book covers, search/filter/sort, pagination, detail modal,
// and a 4-step checkout with inline validation.

const BOOKS = [
  [
    "The Lighthouse Keeper's Daughter",
    "Maren Holt",
    "Literary Fiction",
    2023,
    18.99,
    4.6,
    "A quiet, luminous novel about a girl raised on a remote island and the storm that brings a stranger to its shore.",
  ],
  [
    "Salt & Cinder",
    "Idris Achebe-Lowe",
    "Fantasy",
    2024,
    22.5,
    4.8,
    "Two rival smiths discover their forge-magic is the only thing holding a crumbling empire together.",
  ],
  [
    "Small Hours",
    "Junie Park",
    "Literary Fiction",
    2021,
    16.0,
    4.2,
    "Over one sleepless night in Seoul, three strangers' lives quietly converge.",
  ],
  [
    "The Cartographer's Error",
    "Leopold Vance",
    "Mystery",
    2022,
    17.5,
    4.4,
    "A misprinted map leads a retired surveyor into a forty-year-old disappearance.",
  ],
  [
    "Orbiting Juniper",
    "Asha Rao",
    "Science Fiction",
    2025,
    24.0,
    4.7,
    "Aboard a generation ship, a botanist discovers the garden is growing something it shouldn't.",
  ],
  [
    "A Field Guide to Leaving",
    "Theo Marchetti",
    "Memoir",
    2020,
    15.99,
    4.1,
    "A funny, heartfelt account of quitting a career in finance to restore a Tuscan farmhouse.",
  ],
  [
    "Paper Wolves",
    "Signe Larsen",
    "Thriller",
    2024,
    19.99,
    4.3,
    "A journalist investigating a shell company finds her own name on its board of directors.",
  ],
  [
    "The Patient Garden",
    "Hana Okafor",
    "Non-fiction",
    2023,
    26.0,
    4.5,
    "How slow gardening can repair soil, communities, and our sense of time.",
  ],
  [
    "Brightwater",
    "Callum Reyes",
    "Fantasy",
    2021,
    18.0,
    4.0,
    "In a city of canals, a thief steals a memory that isn't hers.",
  ],
  [
    "Everything We Kept",
    "Noor Haddad",
    "Literary Fiction",
    2025,
    21.0,
    4.9,
    "Three generations of a family, told through the objects left in one house.",
  ],
  [
    "Signal Lost",
    "Dmitri Volkov",
    "Science Fiction",
    2022,
    17.99,
    3.9,
    "When Earth goes silent, a lone relay station must decide whether to keep listening.",
  ],
  [
    "The Quiet Accomplice",
    "Rosa Delgado",
    "Mystery",
    2023,
    16.5,
    4.4,
    "A small-town librarian realises the overdue books are a series of confessions.",
  ],
  [
    "Kitchen Table Physics",
    "Ben Adeyemi",
    "Non-fiction",
    2024,
    23.0,
    4.6,
    "Big ideas in physics, explained with salt shakers, spoons, and breakfast.",
  ],
  [
    "North of Nowhere",
    "Ingrid Solberg",
    "Thriller",
    2021,
    14.99,
    4.2,
    "Snowed in at an Arctic research station, one of six scientists is lying.",
  ],
  [
    "What the River Knows",
    "Amara Bell",
    "Literary Fiction",
    2022,
    17.0,
    4.3,
    "A daughter returns to her Mississippi hometown to scatter her father's ashes and uncover his secrets.",
  ],
  [
    "The Glass Orchard",
    "Fennick Ash",
    "Fantasy",
    2025,
    20.0,
    4.5,
    "Every fruit in the orchard grants a single, perfect memory — for a price.",
  ],
  [
    "Notes from a Night Shift",
    "Dr. Priya Menon",
    "Memoir",
    2023,
    18.5,
    4.8,
    "Tender and unflinching stories from fifteen years as an emergency doctor.",
  ],
  [
    "The Long Weekend",
    "Oliver Grant",
    "Thriller",
    2025,
    19.5,
    4.1,
    "A celebratory villa getaway turns deadly when the host fails to appear.",
  ],
  [
    "Atlas of Tiny Things",
    "Mei Lin Zhou",
    "Non-fiction",
    2021,
    28.0,
    4.7,
    "A gorgeously illustrated tour of the microscopic world that surrounds us.",
  ],
  [
    "Second Sun",
    "Kofi Mensah",
    "Science Fiction",
    2024,
    21.5,
    4.4,
    "On a tidally locked planet, a courier crosses the terminator line with forbidden cargo.",
  ],
].map(([title, author, genre, year, price, rating, blurb], i) => ({
  id: i + 1,
  title,
  author,
  genre,
  year,
  price,
  rating,
  blurb,
}));

const PALETTES = [
  ["#a8322d", "#fbf7ef", "#e7b04a"],
  ["#1f3a5f", "#f2ebdd", "#d9774b"],
  ["#2f5d50", "#f6efe2", "#e9c46a"],
  ["#e9c46a", "#1f1c18", "#d1495b"],
  ["#efe6d6", "#1f1c18", "#5b8e7d"],
  ["#3d2c4f", "#f5e9da", "#ef8354"],
  ["#d1495b", "#fff4e6", "#2b2d42"],
  ["#5b8e7d", "#fbf7ef", "#1f3a5f"],
];
const MOTIFS = ["sun", "bars", "arch", "diag", "dots"];
const PER_PAGE = 8;
const DELIVERY = { standard: 3.95, express: 8.95, pickup: 0 };
const GIFT_WRAP = 2.5;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const money = (n) => "$" + n.toFixed(2);
const esc = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const stars = (r) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));
const byId = (id) => BOOKS.find((b) => b.id === id);

function cover(book, fontSize = "1.15rem") {
  const [c1, c2, c3] = PALETTES[book.id % PALETTES.length];
  const motif = MOTIFS[(book.id * 7) % MOTIFS.length];
  return `<div class="cover" style="--c1:${c1};--c2:${c2};--c3:${c3};--fs:${fontSize}">
      <span class="motif motif-${motif}"></span>
      <span class="t">${esc(book.title)}</span>
      <span class="a">${esc(book.author)}</span>
    </div>`;
}

/* ---------- State ---------- */
const state = { q: "", genre: "All", sort: "title", page: 1, step: 0 };
let tote = (() => {
  try {
    return JSON.parse(localStorage.getItem("paperback-tote")) || {};
  } catch {
    return {};
  }
})();
const saveTote = () => {
  try {
    localStorage.setItem("paperback-tote", JSON.stringify(tote));
  } catch {}
};
const shipping = {};

/* ---------- Staff pick ---------- */
const PICK = byId(10);
function renderPick() {
  $("#pickTitle").textContent = PICK.title;
  $("#pickBlurb").textContent = `${PICK.blurb} — ${PICK.author}`;
  $("#pickCover").innerHTML = cover(PICK, "1.9rem");
}

/* ---------- Catalogue ---------- */
function filtered() {
  const q = state.q.toLowerCase();
  const sorters = {
    title: (a, b) => a.title.localeCompare(b.title),
    author: (a, b) => a.author.split(" ").pop().localeCompare(b.author.split(" ").pop()),
    rating: (a, b) => b.rating - a.rating,
    price: (a, b) => a.price - b.price,
    year: (a, b) => b.year - a.year,
  };
  return BOOKS.filter(
    (b) =>
      (state.genre === "All" || b.genre === state.genre) &&
      (!q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)),
  ).sort(sorters[state.sort]);
}

function renderShelf() {
  const list = filtered();
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
  state.page = Math.min(state.page, pages);
  const start = (state.page - 1) * PER_PAGE;
  const pageItems = list.slice(start, start + PER_PAGE);

  $("#summary").textContent = list.length
    ? `Showing ${start + 1}–${start + pageItems.length} of ${list.length} book${list.length === 1 ? "" : "s"}${state.genre !== "All" ? ` in ${state.genre}` : ""}`
    : "";

  $("#shelf").innerHTML = pageItems.length
    ? pageItems
        .map(
          (b) => `
      <article class="book">
        <button class="book-open" data-open="${b.id}" aria-label="View ${esc(b.title)}">${cover(b)}</button>
        <span class="title">${esc(b.title)}</span>
        <span class="author">${esc(b.author)}</span>
        <div class="meta"><span class="stars" aria-label="${b.rating} out of 5">${stars(b.rating)}</span><span class="price">${money(b.price)}</span></div>
        <button class="add-mini" data-add="${b.id}">Add to tote</button>
      </article>`,
        )
        .join("")
    : `<p class="empty">No books match “${esc(state.q)}”. Try another title or author.</p>`;

  const btn = (label, page, opts = "") => `<button data-page="${page}" ${opts}>${label}</button>`;
  $("#pager").innerHTML =
    pages > 1
      ? btn("‹", state.page - 1, `aria-label="Previous page" ${state.page === 1 ? "disabled" : ""}`) +
        Array.from({ length: pages }, (_, i) =>
          btn(i + 1, i + 1, state.page === i + 1 ? 'aria-current="page"' : ""),
        ).join("") +
        btn("›", state.page + 1, `aria-label="Next page" ${state.page === pages ? "disabled" : ""}`)
      : "";
}

function renderGenres() {
  const genres = ["All", ...[...new Set(BOOKS.map((b) => b.genre))].sort()];
  $("#genre").innerHTML = genres.map((g) => `<option value="${g}">${g === "All" ? "All genres" : g}</option>`).join("");
}

/* ---------- Detail ---------- */
function openBook(id) {
  const b = byId(id);
  $("#bookBody").innerHTML = `
    ${cover(b, "1.5rem")}
    <div>
      <h2>${esc(b.title)}</h2>
      <p class="by">by ${esc(b.author)}</p>
      <p>${esc(b.blurb)}</p>
      <dl class="facts">
        <dt>Genre</dt><dd>${b.genre}</dd>
        <dt>Published</dt><dd>${b.year}</dd>
        <dt>Rating</dt><dd><span class="stars">${stars(b.rating)}</span> ${b.rating}</dd>
        <dt>Format</dt><dd>Paperback, ${220 + b.id * 13} pages</dd>
      </dl>
      <button class="btn" data-add="${b.id}">Add to tote — ${money(b.price)}</button>
    </div>`;
  $("#bookDialog").showModal();
}

/* ---------- Tote ---------- */
function addToTote(id, btn) {
  tote[id] = (tote[id] || 0) + 1;
  saveTote();
  updateToteCount();
  if (btn) {
    const label = btn.textContent;
    btn.textContent = "Added ✓";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove("added");
    }, 1000);
  }
}
const toteItems = () => Object.entries(tote).map(([id, qty]) => ({ ...byId(+id), qty }));
const toteSubtotal = () => toteItems().reduce((s, b) => s + b.price * b.qty, 0);
function updateToteCount() {
  $("#toteCount").textContent = toteItems().reduce((s, b) => s + b.qty, 0);
}

function renderTote() {
  const items = toteItems();
  $("#toteList").innerHTML = items.length
    ? items
        .map(
          (b) => `
      <li>
        ${cover(b, ".38rem")}
        <div><strong>${esc(b.title)}</strong><br /><small>${esc(b.author)}</small></div>
        <div class="qty"><button data-qty="${b.id}" data-d="-1" aria-label="Fewer">−</button>${b.qty}<button data-qty="${b.id}" data-d="1" aria-label="More">+</button></div>
        <strong>${money(b.price * b.qty)}</strong>
      </li>`,
        )
        .join("")
    : `<li><p class="empty">Your tote is empty — go find a good book.</p></li>`;
  $("#toteSub").textContent = money(toteSubtotal());
  $("#toteNext").disabled = !items.length;
}

/* ---------- Checkout steps ---------- */
function goTo(step) {
  state.step = step;
  $$(".step-panel").forEach((p) => p.classList.toggle("active", +p.dataset.panel === step));
  $$("#steps li").forEach((li) => {
    li.classList.toggle("active", +li.dataset.step === step);
    li.classList.toggle("done", +li.dataset.step < step);
  });
  $("#steps").hidden = step === 4;
  if (step === 0) renderTote();
  if (step === 3) renderReview();
  $(`[data-panel="${step}"] input, [data-panel="${step}"] button`)?.focus();
}

const MESSAGES = {
  valueMissing: "This field is required.",
  typeMismatch: "Please enter a valid email address.",
  tooShort: "That looks a little short.",
  patternMismatch: "Please enter a valid postcode.",
};
function validateField(input) {
  const err = Object.keys(MESSAGES).find((k) => input.validity[k]);
  input.setAttribute("aria-invalid", !!err);
  input.nextElementSibling.textContent = err ? MESSAGES[err] : "";
  return !err;
}

function totals() {
  const sub = toteSubtotal();
  const method = new FormData($("#deliveryForm")).get("delivery");
  const ship = DELIVERY[method];
  const gift = $("#giftWrap").checked ? GIFT_WRAP : 0;
  return { sub, method, ship, gift, total: sub + ship + gift };
}

function renderReview() {
  const t = totals();
  $("#review").innerHTML = `
    <div class="review-block">
      <h3>Books <button data-goto="0">Edit</button></h3>
      ${toteItems()
        .map(
          (b) =>
            `<div class="line"><span>${b.qty} × ${esc(b.title)}</span><span>${money(b.qty * b.price)}</span></div>`,
        )
        .join("")}
    </div>
    <div class="review-block">
      <h3>Ship to <button data-goto="1">Edit</button></h3>
      <div>${esc(shipping.name)} · ${esc(shipping.email)}<br />${esc(shipping.address)}, ${esc(shipping.city)} ${esc(shipping.zip)}</div>
    </div>
    <div class="review-block">
      <h3>Delivery <button data-goto="2">Edit</button></h3>
      <div class="line"><span>${t.method[0].toUpperCase() + t.method.slice(1)}</span><span>${t.ship ? money(t.ship) : "Free"}</span></div>
      ${t.gift ? `<div class="line"><span>Gift wrap</span><span>${money(t.gift)}</span></div>` : ""}
    </div>
    <div class="line total"><span>Total</span><span>${money(t.total)}</span></div>`;
}

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open],[data-add],[data-page],[data-qty],[data-close],[data-back],[data-goto]");
  if (!t) return;
  const d = t.dataset;
  if (d.open) openBook(+d.open);
  if (d.add) addToTote(+d.add, t);
  if (d.page && !t.disabled) {
    state.page = +d.page;
    renderShelf();
    $("#catTitle").scrollIntoView({ behavior: "smooth" });
  }
  if (d.qty) {
    tote[d.qty] = (tote[d.qty] || 0) + +d.d;
    if (tote[d.qty] <= 0) delete tote[d.qty];
    saveTote();
    updateToteCount();
    renderTote();
  }
  if ("close" in d) t.closest("dialog").close();
  if ("back" in d) goTo(state.step - 1);
  if (d.goto) goTo(+d.goto);
});

$$("dialog").forEach((dlg) =>
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg) dlg.close();
  }),
);

let qTimer;
$("#q").addEventListener("input", (e) => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    state.q = e.target.value.trim();
    state.page = 1;
    renderShelf();
  }, 150);
});
$("#genre").addEventListener("change", (e) => {
  state.genre = e.target.value;
  state.page = 1;
  renderShelf();
});
$("#sort").addEventListener("change", (e) => {
  state.sort = e.target.value;
  state.page = 1;
  renderShelf();
});

$("#pickAdd").addEventListener("click", (e) => addToTote(PICK.id, e.currentTarget));
$("#pickMore").addEventListener("click", () => openBook(PICK.id));
$("#toteBtn").addEventListener("click", () => {
  $("#toteDialog").showModal();
  goTo(0);
});
$("#toteNext").addEventListener("click", () => goTo(1));

const shipForm = $("#shipForm");
shipForm.addEventListener("input", (e) => {
  if (e.target.getAttribute("aria-invalid") === "true") validateField(e.target);
});
shipForm.addEventListener("focusout", (e) => {
  if (e.target.matches("input") && e.target.value) validateField(e.target);
});
shipForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputs = $$("input", shipForm);
  const results = inputs.map(validateField);
  if (results.every(Boolean)) {
    Object.assign(shipping, Object.fromEntries(new FormData(shipForm)));
    goTo(2);
  } else {
    inputs[results.indexOf(false)].focus();
  }
});
$("#deliveryForm").addEventListener("submit", (e) => {
  e.preventDefault();
  goTo(3);
});

$("#placeOrder").addEventListener("click", () => {
  const ref = "PB-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  $("#thanksText").textContent =
    `Order ${ref} is confirmed. A receipt is on its way to ${shipping.email}. (This is a demo — nothing was charged.)`;
  tote = {};
  saveTote();
  updateToteCount();
  shipForm.reset();
  goTo(4);
});

renderPick();
renderGenres();
renderShelf();
updateToteCount();
