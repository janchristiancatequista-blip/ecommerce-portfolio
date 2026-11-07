// Bloom Market — aisles, live search, inline quantity steppers, delivery meter, slot picker, postcode check.
const ITEMS = [
  { id: 1, name: "Honeycrisp Apples", aisle: "Fruit & Veg", emoji: "🍎", price: 3.49, unit: "1 kg bag", organic: true },
  { id: 2, name: "Hass Avocados", aisle: "Fruit & Veg", emoji: "🥑", price: 4.99, was: 5.99, unit: "Pack of 4", organic: false },
  { id: 3, name: "Strawberries", aisle: "Fruit & Veg", emoji: "🍓", price: 3.99, unit: "400 g punnet", organic: true },
  { id: 4, name: "Bananas", aisle: "Fruit & Veg", emoji: "🍌", price: 1.29, unit: "Bunch of 6", organic: false },
  { id: 5, name: "Heirloom Carrots", aisle: "Fruit & Veg", emoji: "🥕", price: 2.49, unit: "750 g", organic: true },
  { id: 6, name: "Broccoli", aisle: "Fruit & Veg", emoji: "🥦", price: 1.79, unit: "Each", organic: false },
  { id: 7, name: "Sourdough Loaf", aisle: "Bakery", emoji: "🍞", price: 5.5, unit: "800 g", organic: false },
  { id: 8, name: "Butter Croissants", aisle: "Bakery", emoji: "🥐", price: 4.25, was: 4.99, unit: "Pack of 4", organic: false },
  { id: 9, name: "Everything Bagels", aisle: "Bakery", emoji: "🥯", price: 3.75, unit: "Pack of 6", organic: false },
  { id: 10, name: "Free-Range Eggs", aisle: "Dairy & Eggs", emoji: "🥚", price: 4.49, unit: "Dozen", organic: true },
  { id: 11, name: "Whole Milk", aisle: "Dairy & Eggs", emoji: "🥛", price: 2.99, unit: "2 L", organic: true },
  { id: 12, name: "Aged Cheddar", aisle: "Dairy & Eggs", emoji: "🧀", price: 6.25, unit: "300 g", organic: false },
  { id: 13, name: "Oat Milk Barista", aisle: "Dairy & Eggs", emoji: "🧃", price: 3.29, unit: "1 L", organic: false },
  { id: 14, name: "Wild Salmon Fillet", aisle: "Meat & Fish", emoji: "🐟", price: 11.99, unit: "2 × 125 g", organic: false },
  { id: 15, name: "Chicken Thighs", aisle: "Meat & Fish", emoji: "🍗", price: 7.49, was: 8.99, unit: "1 kg", organic: true },
  { id: 16, name: "Arabica Coffee Beans", aisle: "Pantry", emoji: "☕", price: 9.99, unit: "500 g", organic: true },
  { id: 17, name: "Spaghetti", aisle: "Pantry", emoji: "🍝", price: 1.99, unit: "500 g", organic: false },
  { id: 18, name: "Wildflower Honey", aisle: "Pantry", emoji: "🍯", price: 7.5, unit: "340 g jar", organic: true },
  { id: 19, name: "Dark Chocolate 70%", aisle: "Snacks", emoji: "🍫", price: 2.79, unit: "100 g", organic: true },
  { id: 20, name: "Sea Salt Popcorn", aisle: "Snacks", emoji: "🍿", price: 2.25, unit: "150 g", organic: false },
];
const AISLE_ICONS = { All: "🛒", "Fruit & Veg": "🥬", Bakery: "🥖", "Dairy & Eggs": "🧈", "Meat & Fish": "🥩", Pantry: "🫙", Snacks: "🍪" };
const FREE_DELIVERY = 35;
const DELIVERY_FEE = 3.99;
const SLOTS = ["8–10 am", "10–12 pm", "12–2 pm", "2–4 pm", "4–6 pm", "6–8 pm"];

const $ = (s) => document.querySelector(s);
const money = (n) => "$" + n.toFixed(2);
const load = (k, d) => { try { return JSON.parse(localStorage.getItem("bloom-" + k)) ?? d; } catch { return d; } };
const save = (k, v) => { try { localStorage.setItem("bloom-" + k, JSON.stringify(v)); } catch {} };

const state = {
  aisle: "All",
  query: "",
  organicOnly: false,
  basket: load("basket", {}),
  zip: load("zip", ""),
  day: 0,
  slot: null,
};

/* ---------- Aisles ---------- */
function renderAisles() {
  const aisles = ["All", ...new Set(ITEMS.map((i) => i.aisle))];
  $("#aisles").innerHTML = aisles.map((a) => {
    const n = a === "All" ? ITEMS.length : ITEMS.filter((i) => i.aisle === a).length;
    return `<li><button class="aisle" data-aisle="${a}" aria-current="${a === state.aisle}">${AISLE_ICONS[a]} ${a}<span class="n">${n}</span></button></li>`;
  }).join("");
}

/* ---------- Products ---------- */
function controlHTML(id) {
  const qty = state.basket[id] || 0;
  return qty
    ? `<div class="stepper"><button data-step="${id}" data-d="-1" aria-label="Remove one">−</button><span aria-live="polite">${qty}</span><button data-step="${id}" data-d="1" aria-label="Add one">+</button></div>`
    : `<button class="add" data-step="${id}" data-d="1">+ Add</button>`;
}

function renderProducts() {
  const q = state.query.toLowerCase();
  const list = ITEMS.filter((i) =>
    (state.aisle === "All" || i.aisle === state.aisle) &&
    (!state.organicOnly || i.organic) &&
    (!q || i.name.toLowerCase().includes(q) || i.aisle.toLowerCase().includes(q))
  );
  $("#aisleTitle").textContent = q ? `Results for “${state.query}”` : state.aisle === "All" ? "All groceries" : state.aisle;
  $("#emptyMsg").hidden = list.length > 0;
  $("#products").innerHTML = list.map((i) => `
    <article class="product ${state.basket[i.id] ? "in-basket" : ""}" data-id="${i.id}">
      <div class="p-img">
        ${i.organic ? `<span class="organic">Organic</span>` : ""}
        ${i.was ? `<span class="deal">Deal</span>` : ""}
        <span aria-hidden="true">${i.emoji}</span>
      </div>
      <div class="p-price">${money(i.price)}${i.was ? `<s>${money(i.was)}</s>` : ""}</div>
      <div class="p-name">${i.name}</div>
      <div class="p-unit">${i.unit}</div>
      <div class="ctrl">${controlHTML(i.id)}</div>
    </article>`).join("");
}

/* Update a single card in place instead of re-rendering the grid (keeps focus stable) */
function refreshCard(id) {
  const card = document.querySelector(`.product[data-id="${id}"]`);
  if (!card) return;
  card.classList.toggle("in-basket", !!state.basket[id]);
  card.querySelector(".ctrl").innerHTML = controlHTML(id);
  card.querySelector(".ctrl button:last-child")?.focus();
}

/* ---------- Basket ---------- */
function step(id, d) {
  const next = (state.basket[id] || 0) + d;
  if (next <= 0) delete state.basket[id]; else state.basket[id] = Math.min(next, 20);
  save("basket", state.basket);
  refreshCard(id);
  renderBasket();
  const btn = $("#basketToggle");
  btn.classList.remove("pulse"); void btn.offsetWidth; btn.classList.add("pulse");
}

function totals() {
  const items = Object.entries(state.basket).map(([id, qty]) => ({ ...ITEMS.find((i) => i.id === +id), qty }));
  const sub = items.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = sub === 0 || sub >= FREE_DELIVERY ? 0 : DELIVERY_FEE;
  return { items, sub, delivery, total: sub + delivery };
}

function renderBasket() {
  const { items, sub, delivery, total } = totals();
  const left = FREE_DELIVERY - sub;
  $("#deliveryMeter").innerHTML = `
    ${left > 0 ? `Add <strong>${money(left)}</strong> more for <strong>free delivery</strong> 🚚` : `🎉 You've got <strong>free delivery!</strong>`}
    <div class="meter"><span style="width:${Math.min(100, (sub / FREE_DELIVERY) * 100)}%"></span></div>`;

  $("#basketList").innerHTML = items.length
    ? items.map((i) => `
        <li class="b-item">
          <span class="e" aria-hidden="true">${i.emoji}</span>
          <div>${i.name}<small>${i.qty} × ${money(i.price)}</small></div>
          <strong>${money(i.qty * i.price)}</strong>
        </li>`).join("")
    : `<li class="b-empty">Your basket is empty.<br/>Tap “+ Add” on anything to get started.</li>`;

  $("#basketTotalTop").textContent = money(total);
  $("#tItems").textContent = money(sub);
  $("#tDelivery").textContent = delivery ? money(delivery) : "Free";
  $("#tTotal").textContent = money(total);
  validateOrder();
}

/* ---------- Delivery slots ---------- */
function renderDays() {
  const fmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dfmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });
  $("#days").innerHTML = [0, 1, 2, 3].map((offset) => {
    const d = new Date(); d.setDate(d.getDate() + offset);
    return `<button class="day" role="tab" data-day="${offset}" aria-selected="${offset === state.day}">${offset === 0 ? "Today" : fmt.format(d)}<small>${dfmt.format(d)}</small></button>`;
  }).join("");
}

function renderSlots() {
  const hour = new Date().getHours();
  $("#slots").innerHTML = SLOTS.map((s, i) => {
    const startHour = 8 + i * 2;
    // Today's past slots are unavailable; a pseudo-random slot is "full" to show disabled states
    const unavailable = (state.day === 0 && startHour <= hour) || (i + state.day) % 5 === 3;
    const key = `${state.day}-${i}`;
    return `<button class="slot" data-slot="${key}" aria-pressed="${state.slot === key}" ${unavailable ? "disabled" : ""}>${s}</button>`;
  }).join("");
}

function validateOrder() {
  const { items } = totals();
  const hint =
    !items.length ? "" :
    !state.zip ? "Set your postcode to continue." :
    !state.slot ? "Choose a delivery slot." : "";
  $("#orderHint").textContent = hint;
  $("#placeOrder").disabled = !items.length || !!hint;
}

/* ---------- Postcode ---------- */
function renderZip() { $("#zipLabel").textContent = state.zip || "Set postcode"; }

$("#zipBtn").addEventListener("click", () => {
  $("#zipInput").value = state.zip;
  $("#zipError").textContent = "";
  $("#zipDialog").showModal();
});
$("#zipSave").addEventListener("click", (e) => {
  const v = $("#zipInput").value.trim();
  if (!/^\d{5}$/.test(v)) { e.preventDefault(); $("#zipError").textContent = "Please enter a valid 5-digit postcode."; return; }
  state.zip = v; save("zip", v); renderZip(); validateOrder();
});

/* ---------- Events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-aisle],[data-step],[data-day],[data-slot]");
  if (!t) return;
  if (t.dataset.aisle) { state.aisle = t.dataset.aisle; state.query = ""; $("#search").value = ""; renderAisles(); renderProducts(); }
  if (t.dataset.step) step(+t.dataset.step, +t.dataset.d);
  if (t.dataset.day) { state.day = +t.dataset.day; state.slot = null; renderDays(); renderSlots(); validateOrder(); }
  if (t.dataset.slot) { state.slot = t.dataset.slot; renderSlots(); validateOrder(); }
});

$("#search").addEventListener("input", (e) => { state.query = e.target.value.trim(); renderProducts(); });
$("#searchForm").addEventListener("submit", (e) => e.preventDefault());
$("#organicOnly").addEventListener("change", (e) => { state.organicOnly = e.target.checked; renderProducts(); });

const setBasketOpen = (open) => { $("#basket").classList.toggle("open", open); $("#basketToggle").setAttribute("aria-expanded", open); };
$("#basketToggle").addEventListener("click", () => setBasketOpen(!$("#basket").classList.contains("open")));
$("#basketClose").addEventListener("click", () => setBasketOpen(false));

$("#placeOrder").addEventListener("click", () => {
  const [day, slot] = state.slot.split("-").map(Number);
  const dayLabel = document.querySelector(`[data-day="${day}"]`).childNodes[0].textContent;
  $("#doneText").textContent = `Arriving ${dayLabel.toLowerCase() === "today" ? "today" : "on " + dayLabel}, ${SLOTS[slot]} to ${state.zip}. Total ${money(totals().total)}. (Demo — no real order.)`;
  $("#orderDone").hidden = false;
  state.basket = {}; state.slot = null; save("basket", {});
  setBasketOpen(false);
  renderProducts(); renderBasket(); renderSlots();
});
$("#doneClose").addEventListener("click", () => ($("#orderDone").hidden = true));

renderAisles();
renderProducts();
renderDays();
renderSlots();
renderZip();
renderBasket();
