/* ------------------------------------------------------------------
   CyberCheats — front-end app

   Single-page, no framework. It fetches one prebuilt index
   (tools/search-index.json), renders the sidebar from it, and only
   downloads a tool's Markdown when you actually open that tool.
   Search runs on MiniSearch (inverted index) built off the main thread
   so the first paint isn't blocked.
   ------------------------------------------------------------------ */

const CAP_RESULTS = 300;          // don't render more than this many search hits at once
const AUTO_EXPAND_LIMIT = 40;     // small catalogs open every category; larger ones start collapsed

// One-line explanation of each category, shown on the home page.
const CATEGORY_DESCRIPTIONS = {
  "Cheatsheets & Playbooks": "End-to-end workflows and checklists that span several tools — reverse shells, privilege-escalation.",
  "Reconnaissance": "Discover hosts, domains, subdomains and exposed assets before touching the target.",
  "Port Scanning": "Find open ports and running services fast, from a single host to whole ranges.",
  "Service Enumeration": "Dig into SMB, SNMP, LDAP and Active Directory to pull users, shares and configuration.",
  "Web & Fuzzing": "Map, fingerprint and attack web apps — proxies, fuzzers, injection and CMS scanners.",
  "Exploitation": "Find and launch exploits against known vulnerabilities.",
  "Post-Exploitation & PrivEsc": "After a foothold — enumerate the host, escalate privileges and grab credentials.",
  "Passwords & Hashes": "Crack hashes and brute-force logins, offline and online, plus wordlist tooling.",
  "Connection & Pivoting": "Move through networks — shells, port forwarding, tunnels and SOCKS proxies.",
  "Traffic Analysis & Wireless": "Capture and analyze packets, run MITM attacks and audit Wi-Fi.",
  "Forensics & Reverse Engineering": "Inspect binaries, memory, disks and files — decompilers, carving, steganography.",
  "Cryptography": "Encrypt, sign and inspect keys, certificates and TLS from the command line.",
  "Cloud": "Enumerate and test cloud-provider access and misconfigurations.",
  "Utilities & Shell": "Everyday CLI glue — HTTP requests, JSON, proxy chaining and terminal multiplexing.",
  "Firewall & Hardening": "Configure and audit host firewalls on Linux.",
};

const STATE = {
  docs: [],
  byId: new Map(),
  categoryOrder: [],
  byCategory: new Map(),
  mini: null,
  mdCache: new Map(),
  currentId: null,
  query: "",
  expanded: new Set(),
};

const $ = (s) => document.querySelector(s);
const el = {
  nav:     () => $("#nav"),
  body:    () => $("#markdown-body"),
  search:  () => $("#search-input"),
  count:   () => $("#tool-count"),
  sidebar: () => $("#sidebar"),
  overlay: () => $("#overlay"),
};

/* marked + highlight.js wiring */
marked.setOptions({
  gfm: true,
  highlight: (code, lang) => {
    try {
      if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
      return hljs.highlightAuto(code).value;
    } catch (_) { return code; }
  },
});

/* ---- Boot: one fetch of the index, then wire everything up ---- */
async function init() {
  try {
    const res = await fetch("tools/search-index.json", { cache: "no-cache" });
    if (!res.ok) throw new Error("search-index.json not found");
    const data = await res.json();

    STATE.docs = data.docs || [];
    STATE.categoryOrder = data.categoryOrder || [];
    STATE.docs.forEach((d) => {
      STATE.byId.set(d.id, d);
      if (!STATE.byCategory.has(d.category)) STATE.byCategory.set(d.category, []);
      STATE.byCategory.get(d.category).push(d);
    });
    el.count().textContent = STATE.docs.length;

    // Only auto-open every category on a small catalog; otherwise it's a wall of links.
    if (STATE.docs.length <= AUTO_EXPAND_LIMIT) {
      STATE.categoryOrder.forEach((c) => STATE.expanded.add(c));
    }

    setupEvents();
    renderNav();   // sidebar is ready immediately from the catalog
    route();

    // Build the search index during idle time so it never blocks the first paint.
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
    idle(buildSearchEngine);
  } catch (err) {
    el.body().innerHTML = errorBox(
      "Startup error",
      `${escapeHtml(err.message)}.<br><br>
      1) Run the build: <code>node build/build-index.js</code><br>
      2) Serve over HTTP (browsers block <code>fetch</code> on <code>file://</code>):
      <code>python -m http.server</code> → <code>http://localhost:8000</code>`
    );
    console.error(err);
  }
}

/* ---- Search engine (MiniSearch, in memory) ---- */
function buildSearchEngine() {
  if (STATE.mini) return STATE.mini;
  STATE.mini = new MiniSearch({
    idField: "id",
    fields: ["name", "description", "tags", "text"],
    storeFields: ["name", "category", "description"],
    extractField: (doc, field) => {
      const v = doc[field];
      return Array.isArray(v) ? v.join(" ") : (v == null ? "" : String(v));
    },
  });
  STATE.mini.addAll(STATE.docs);
  return STATE.mini;
}

function runSearch(q) {
  if (!STATE.mini) buildSearchEngine();   // if the user searches before idle fired, build now
  return STATE.mini.search(q, {
    prefix: true,
    fuzzy: 0.2,
    combineWith: "AND",
    boost: { name: 4, tags: 2, description: 1.5 },
  });
}

/* ---- Sidebar ---- */
function renderNav() {
  const q = STATE.query.trim();
  if (q) return renderSearchResults(q);
  return renderCategoryTree();
}

// Browse mode: collapsible categories; a category's items only render when it's open.
// Categories and the tools inside each one are always shown in alphabetical order.
function renderCategoryTree() {
  let html = "";
  const cats = [...STATE.categoryOrder].sort((a, b) => a.localeCompare(b));
  for (const cat of cats) {
    const items = [...(STATE.byCategory.get(cat) || [])].sort((a, b) => a.name.localeCompare(b.name));
    const open = STATE.expanded.has(cat);
    html += `
      <button class="cat-toggle${open ? " open" : ""}" data-cat="${escapeAttr(cat)}">
        <span class="chev">${open ? "▾" : "▸"}</span>
        <span class="cat-name">${escapeHtml(cat)}</span>
        <span class="cat-count">${items.length}</span>
      </button>`;
    if (open) {
      html += `<div class="cat-items">`;
      for (const d of items) html += navItem(d, "");
      html += `</div>`;
    }
  }
  el.nav().innerHTML = html;
}

// Search mode: grouped by WHERE the match happened — name first, then description, then content.
function renderSearchResults(q) {
  const results = runSearch(q).slice(0, CAP_RESULTS);
  if (!results.length) {
    el.nav().innerHTML = `<div class="no-results">no results for "${escapeHtml(q)}"</div>`;
    return;
  }

  const byName = [], byDesc = [], byContent = [];
  for (const r of results) {
    const d = STATE.byId.get(r.id);
    if (!d) continue;
    // MiniSearch tells us which fields each term matched, in r.match.
    const fields = new Set();
    for (const term in r.match) (r.match[term] || []).forEach((f) => fields.add(f));
    if (fields.has("name")) byName.push(d);
    else if (fields.has("description")) byDesc.push(d);
    else byContent.push(d);   // matched tags or the body text of the .md
  }

  const section = (label, arr) =>
    arr.length ? `<div class="group-label">${label} · ${arr.length}</div>` + arr.map((d) => navItem(d, q)).join("") : "";

  el.nav().innerHTML =
    `<div class="search-meta">${results.length} result(s)</div>` +
    section("name", byName) +
    section("description", byDesc) +
    section("content", byContent);
}

function navItem(d, q) {
  const active = d.id === STATE.currentId ? " active" : "";
  return `
    <a class="nav-item${active}" href="#/tool/${encodeURIComponent(d.id)}" data-id="${escapeAttr(d.id)}">
      <span class="nav-name">${highlight(d.name, q)}</span>
      <span class="nav-desc">${highlight(d.description, q)}</span>
    </a>`;
}

/* ---- Hash routing ---- */
function route() {
  const hash = location.hash.replace(/^#\/?/, "");
  const [section, id] = hash.split("/");
  if (section === "tool" && id) loadTool(decodeURIComponent(id));
  else renderHome();
}

async function loadTool(id) {
  const d = STATE.byId.get(id);
  if (!d) return renderHome();

  STATE.currentId = id;
  markActive();
  document.title = `${d.name} — CyberCheats`;
  el.body().innerHTML = `<div class="loading">loading ${escapeHtml(d.name)}…</div>`;

  try {
    const md = await fetchMd(d);
    el.body().innerHTML = marked.parse(stripFrontMatter(md));
    enhanceCodeBlocks();
    enhanceLinks();
    el.body().querySelectorAll("pre code").forEach((b) => hljs.highlightElement(b));
    window.scrollTo(0, 0);
  } catch (_) {
    el.body().innerHTML = errorBox("Load error", `Could not load <code>${escapeHtml(d.file)}</code>.`);
  }
  closeSidebar();
}

// Fetch a tool's raw Markdown on demand and cache it for the session.
async function fetchMd(d) {
  if (STATE.mdCache.has(d.id)) return STATE.mdCache.get(d.id);
  const r = await fetch(d.file, { cache: "no-cache" });
  if (!r.ok) throw new Error("md fetch");
  const md = await r.text();
  STATE.mdCache.set(d.id, md);
  return md;
}

function renderHome() {
  STATE.currentId = null;
  document.title = "CyberCheats — Cybersecurity Cheatsheets";
  markActive();

  const card = (d) => `
    <a class="home-card" href="#/tool/${encodeURIComponent(d.id)}">
      <div class="hc-name">${escapeHtml(d.name)}</div>
      <div class="hc-desc">${escapeHtml(d.description)}</div>
    </a>`;

  // One section per category: name + count, a one-line explanation, then its tools.
  // Categories and their tools are always listed in alphabetical order.
  const cats = [...STATE.categoryOrder].sort((a, b) => a.localeCompare(b));
  const sections = cats.map((cat) => {
    const items = [...(STATE.byCategory.get(cat) || [])].sort((a, b) => a.name.localeCompare(b.name));
    if (!items.length) return "";
    const desc = CATEGORY_DESCRIPTIONS[cat] || "";
    return `
      <section class="home-cat">
        <div class="home-cat-head">
          <h2>${escapeHtml(cat)}</h2>
          <span class="home-cat-count">${items.length}</span>
        </div>
        ${desc ? `<p class="home-cat-desc">${escapeHtml(desc)}</p>` : ""}
        <div class="home-grid">${items.map(card).join("")}</div>
      </section>`;
  }).join("");

  el.body().innerHTML = `
    <div class="home-hero">
      <div class="glyph">[ ACCESS GRANTED ]</div>
      <h1>CyberCheats</h1>
      <p>A global cheatsheet collection for cybersecurity, cryptography and pentest tools.
         Pick a category below, or search (press <code>/</code>) by name or content.</p>
    </div>
    ${sections}`;
  window.scrollTo(0, 0);
}

// Toggle the active item without re-rendering the whole tree.
function markActive() {
  el.nav().querySelectorAll(".nav-item.active").forEach((n) => n.classList.remove("active"));
  if (STATE.currentId) {
    const n = el.nav().querySelector(`.nav-item[data-id="${cssEscape(STATE.currentId)}"]`);
    if (n) n.classList.add("active");
  }
}

/* ---- Add a copy button to each code block ---- */
function enhanceCodeBlocks() {
  el.body().querySelectorAll("pre").forEach((pre) => {
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.textContent = "copy";
    btn.addEventListener("click", () => {
      const code = pre.querySelector("code")?.innerText || pre.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = "copied!";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("copied"); }, 1500);
      });
    });
    pre.appendChild(btn);
  });
}

/* ---- Open external links in a new tab (internal #/tool links stay in-app) ---- */
function enhanceLinks() {
  el.body().querySelectorAll("a[href]").forEach((a) => {
    if (/^https?:\/\//i.test(a.getAttribute("href") || "")) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
  });
}

/* ---- Events ---- */
let searchTimer = null;
function setupEvents() {
  window.addEventListener("hashchange", route);

  el.search().addEventListener("input", (e) => {
    const v = e.target.value;
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { STATE.query = v; renderNav(); }, 150); // debounce typing
  });

  // Category toggles, via event delegation on the nav.
  el.nav().addEventListener("click", (e) => {
    const t = e.target.closest(".cat-toggle");
    if (!t) return;
    const cat = t.getAttribute("data-cat");
    if (STATE.expanded.has(cat)) STATE.expanded.delete(cat);
    else STATE.expanded.add(cat);
    renderNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== el.search()) {
      e.preventDefault(); el.search().focus();
    }
    if (e.key === "Escape") {
      el.search().value = ""; STATE.query = ""; renderNav(); el.search().blur();
    }
  });

  $("#menu-toggle").addEventListener("click", toggleSidebar);
  el.overlay().addEventListener("click", closeSidebar);
}

function toggleSidebar() { el.sidebar().classList.toggle("open"); el.overlay().classList.toggle("show"); }
function closeSidebar() { el.sidebar().classList.remove("open"); el.overlay().classList.remove("show"); }

/* ---- Helpers ---- */
function stripFrontMatter(md) { return md.replace(/^---\s*\n[\s\S]*?\n---\s*\n?/, ""); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }
function cssEscape(s) { return String(s).replace(/["\\]/g, "\\$&"); }
function highlight(text, query) {
  const safe = escapeHtml(text || "");
  if (!query) return safe;
  const terms = query.trim().split(/\s+/).filter((t) => t.length > 1).map(escapeRegex);
  if (!terms.length) return safe;
  return safe.replace(new RegExp(`(${terms.join("|")})`, "gi"), '<mark class="hl">$1</mark>');
}
function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
function errorBox(title, msg) {
  return `<div class="markdown-body"><h1>${escapeHtml(title)}</h1><blockquote>${msg}</blockquote></div>`;
}

init();
