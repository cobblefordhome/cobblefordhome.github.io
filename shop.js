/* Cobbleford Home & Garden – FICTIONAL shop for COMP1812 coursework.
   Static site: nothing typed on these pages is sent anywhere. Basket and
   orders are kept only in this browser (localStorage). */

var PRODUCTS = [
  {sku: "CF-21407", slug: "cable-ties-300mm-black-100", cat: "DIY & tools", price: 4.99,
   name: "Heavy-duty cable ties, black, 300 × 4.8 mm (pack of 100)", img: "img-cable-ties-black.svg",
   desc: "UV-resistant nylon cable ties for hoses, fencing, garden netting and cables. 300 mm long, 4.8 mm wide, 22 kg loop strength. Pack of 100.",
   tags: "cable ties cable tie zip ties zip tie tie wraps nylon black heavy duty 300mm 300 mm"},
  {sku: "CF-21402", slug: "cable-ties-200mm-assorted-200", cat: "DIY & tools", price: 3.49,
   name: "Cable ties, assorted colours, 200 × 3.6 mm (pack of 200)", img: "img-cable-ties-colour.svg",
   desc: "General-purpose nylon cable ties in five colours for tidying cables and tying in plants. 200 mm long. Pack of 200.",
   tags: "cable ties cable tie zip ties zip tie tie wraps nylon coloured colours 200mm 200 mm"},
  {sku: "CF-31118", slug: "splash-blaster-water-pistol-orange", cat: "Toys & outdoor fun", price: 6.99,
   name: "Splash Blaster toy water pistol, orange", img: "img-water-pistol.svg",
   desc: "Bright orange and yellow toy water pistol with a 300 ml tank and pump-action trigger. About 26 cm long. Ages 5+. Outdoor use only.",
   tags: "water pistol toy pistol squirt gun water gun water blaster orange garden toy kids"},
  {sku: "CF-31120", slug: "bubble-machine", cat: "Toys & outdoor fun", price: 11.99,
   name: "Bubble machine with 2 × 118 ml bubble solution", img: "img-bubble-machine.svg",
   desc: "Battery-powered bubble machine for the garden. Needs 4 × AA batteries (not included). Ages 3+.",
   tags: "bubble machine bubbles toy kids garden party"},
  {sku: "CF-11035", slug: "expandable-garden-hose-15m", cat: "Garden", price: 14.99,
   name: "Expandable garden hose, 15 m", img: "img-hose.svg",
   desc: "Lightweight hose that expands to 15 m under pressure and shrinks back for storage. Spray gun included.",
   tags: "hose garden hose hosepipe watering expandable"},
  {sku: "CF-11210", slug: "hanging-bird-feeder-seed", cat: "Garden", price: 7.49,
   name: "Hanging bird feeder for seed", img: "img-bird-feeder.svg",
   desc: "Weatherproof seed feeder with a removable base for easy cleaning. Hanging hook included.",
   tags: "bird feeder birds seed garden wildlife"},
  {sku: "CF-11502", slug: "plant-pots-set-of-3", cat: "Garden", price: 9.99,
   name: "Terracotta-effect plant pots, set of 3", img: "img-plant-pots.svg",
   desc: "Frost-resistant plastic pots in three sizes (15, 20 and 25 cm) with drainage holes.",
   tags: "plant pots pot planter garden terracotta"},
  {sku: "CF-41007", slug: "clear-storage-box-32-litres", cat: "Home & storage", price: 8.99,
   name: "Clear storage box with lid, 32 litres", img: "img-storage-box.svg",
   desc: "Stackable clear box with a clip-on lid for lofts, garages and under-bed storage.",
   tags: "storage box plastic box clear box lid 32 litre"},
  {sku: "CF-51019", slug: "warm-white-fairy-lights-10m", cat: "Christmas", price: 9.99,
   name: "Warm white LED fairy lights, 10 m, plug-in", img: "img-fairy-lights.svg",
   desc: "100 warm white LEDs on green cable with 8 light settings. Indoor and outdoor use.",
   tags: "christmas lights fairy lights led warm white decorations"},
  {sku: "CF-11630", slug: "solar-garden-stake-lights-6", cat: "Garden", price: 12.99,
   name: "Solar garden stake lights, pack of 6", img: "img-solar-lights.svg",
   desc: "Solar-powered path lights that switch on automatically at dusk. No wiring needed.",
   tags: "solar lights garden lights path lights outdoor"}
];

var SHOP = {name: "Cobbleford Home & Garden", phone: "020 7946 0772",
  address: "Unit 4, Fernhill Trading Estate, Cobbleford"};
var DELIVERY = {
  standard: {label: "Standard delivery (3–5 working days)", price: 3.95, freeOver: 40},
  nextday: {label: "Next working day delivery (order by midnight)", price: 5.99, cutoff: 24},
  sameday: {label: "Same-day delivery, London postcodes (order by 11:00, delivered 13:00–15:00)", price: 7.99, cutoff: 11}
};

function money(n) { return "£" + n.toFixed(2); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) {
  return {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]; }); }
function bySku(sku) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].sku === sku) return PRODUCTS[i]; return null; }
function bySlug(slug) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].slug === slug) return PRODUCTS[i]; return null; }
function param(name) { return new URLSearchParams(location.search).get(name); }

function load(key, fallback) { try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

function getBasket() { return load("cf_basket", []); }
function setBasket(b) { save("cf_basket", b); updateCount(); }
function addToBasket(sku, qty) {
  var b = getBasket(), found = false;
  for (var i = 0; i < b.length; i++) if (b[i].sku === sku) { b[i].qty += qty; found = true; }
  if (!found) b.push({sku: sku, qty: qty});
  setBasket(b);
}
function basketCount() { return getBasket().reduce(function (n, l) { return n + l.qty; }, 0); }
function updateCount() { var el = document.getElementById("basket-count"); if (el) el.textContent = basketCount(); }

/* London date helpers (the shop is UK-based, so it always shows UK time) */
function londonParts(d) {
  var f = new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/London", year: "numeric", month: "2-digit",
    day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23", weekday: "short"});
  var o = {}; f.formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
  return o;
}
function longDate(d) { return new Intl.DateTimeFormat("en-GB", {timeZone: "Europe/London", weekday: "long", day: "numeric", month: "long", year: "numeric"}).format(d); }
function shortDate(d) { var p = londonParts(d); return p.day + "/" + p.month + "/" + p.year; }
function timeHM(d) { var p = londonParts(d); return p.hour + ":" + p.minute; }
function addWorkingDays(d, n) {
  var x = new Date(d.getTime());
  while (n > 0) { x = new Date(x.getTime() + 86400000); var w = londonParts(x).weekday; if (w !== "Sat" && w !== "Sun") n--; }
  return x;
}

/* Order number: CF + yymmdd + 4 digits worked out from the order contents,
   so the same order placed on the same day gives the same number. */
function orderNumber(date, name, postcode, lines, method) {
  var p = londonParts(date);
  var s = name.trim().toLowerCase() + "|" + postcode.replace(/\s+/g, "").toUpperCase() + "|" + method + "|" +
    lines.map(function (l) { return l.sku + "x" + l.qty; }).sort().join(",");
  var h = 5381; for (var i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return "CF" + p.year.slice(2) + p.month + p.day + "-" + (1000 + (h % 9000));
}

function totals(lines, method) {
  var sub = lines.reduce(function (n, l) { var p = bySku(l.sku); return n + (p ? p.price * l.qty : 0); }, 0);
  var d = DELIVERY[method] || DELIVERY.standard;
  var del = (d.freeOver && sub >= d.freeOver) ? 0 : d.price;
  var total = Math.round((sub + del) * 100) / 100;
  return {sub: sub, del: del, total: total, vat: Math.round(total / 6 * 100) / 100};
}

function header() {
  return '<div class="notice">Fictional website created for COMP1812 coursework (University of Greenwich). Not a real shop – nothing typed here is sent anywhere.</div>' +
    '<header><div class="wrap bar">' +
    '<a class="brand" href="index.html"><span class="leaf">&#10047;</span> Cobbleford<small>HOME &amp; GARDEN</small></a>' +
    '<form class="search" action="search.html" method="get" role="search">' +
    '<input type="search" name="q" placeholder="Search products" aria-label="Search products" value="' + esc(param("q") || "") + '">' +
    '<button type="submit">Search</button></form>' +
    '<a class="basket-link" href="basket.html">Basket (<span id="basket-count">0</span>)</a>' +
    '</div><nav class="cats wrap">' +
    ['Garden', 'DIY & tools', 'Home & storage', 'Toys & outdoor fun', 'Christmas'].map(function (c) {
      return '<a href="search.html?cat=' + encodeURIComponent(c) + '">' + esc(c) + '</a>'; }).join("") +
    '</nav></header>';
}
function footer() {
  return '<footer><div class="wrap"><p>' + SHOP.name + ' · ' + SHOP.address + ' · ' + SHOP.phone + '</p>' +
    '<p>FICTIONAL WEBSITE – created for COMP1812 coursework (University of Greenwich). All names, products, prices, addresses and orders are invented.</p></div></footer>';
}
function card(p) {
  return '<a class="pcard" href="product.html?p=' + p.slug + '"><img src="' + p.img + '" alt="">' +
    '<span class="pname">' + esc(p.name) + '</span><span class="pprice">' + money(p.price) + '</span></a>';
}
function frame() {
  document.getElementById("top").innerHTML = header();
  document.getElementById("bottom").innerHTML = footer();
  updateCount();
}
