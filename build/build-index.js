#!/usr/bin/env node
/* ============================================================
   CyberSheets — build-index.js
   Scans tools/*.md, reads the front-matter and generates
   tools/search-index.json. Zero dependencies (Node built-ins only).

   Build:     node build/build-index.js
   Validate:  node build/build-index.js --check   (used by CI on PRs)

   Contributor-friendly rules:
   - `category` is the only truly required field.
   - `name` falls back to the first "# Heading" (or the filename).
   - `description` falls back to the first paragraph.
   - Files starting with "_" (e.g. _TEMPLATE.md) are ignored.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const { marked } = require("./vendor/marked.cjs");   // vendored, no npm install needed

const ROOT = path.resolve(__dirname, "..");
const TOOLS_DIR = path.join(ROOT, "tools");
const OUT = path.join(TOOLS_DIR, "search-index.json");
const CHECK_ONLY = process.argv.includes("--check");

// Where the site is published. Change SITE_BASE to "" if you move to a root domain.
const SITE_ORIGIN = "https://developernotexpert.github.io";
const SITE_BASE = "/cybersheets";                 // repo/base path, no trailing slash
const SITE_URL = SITE_ORIGIN + SITE_BASE + "/";   // canonical home URL
const REPO_URL = "https://github.com/developernotexpert/cybersheets";  // source repo

// Allowed categories, in preferred sidebar order (pentest workflow).
// Add new categories here when the project needs them.
const CATEGORY_ORDER = [
  "Cheatsheets & Playbooks",
  "Reconnaissance",
  "Port Scanning",
  "Service Enumeration",
  "Web & Fuzzing",
  "Exploitation",
  "Post-Exploitation & PrivEsc",
  "Passwords & Hashes",
  "Connection & Pivoting",
  "Traffic Analysis & Wireless",
  "Forensics & Reverse Engineering",
  "Cryptography",
  "Cloud",
  "Utilities & Shell",
  "Firewall & Hardening",
];

/* ---- Minimal YAML front-matter parser (--- ... ---) ---- */
function parseFrontMatter(raw) {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return { data: {}, body: raw };
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const key = kv[1].trim();
    let val = kv[2].trim();
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val.slice(1, -1).split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean);
    } else {
      val = val.replace(/^["']|["']$/g, "");
    }
    data[key] = val;
  }
  return { data, body: raw.slice(m[0].length) };
}

/* ---- Fallback helpers so front-matter stays minimal ---- */
function firstHeading(body) {
  const m = body.match(/^\s*#\s+(.+?)\s*$/m);
  return m ? m[1].trim() : "";
}
function firstParagraph(body) {
  const clean = body
    .replace(/^\s*#.*$/gm, "")        // drop headings
    .replace(/^\s*>.*$/gm, "");       // drop blockquotes
  for (const block of clean.split(/\n\s*\n/)) {
    const t = block.trim();
    if (t && !t.startsWith("```") && !t.startsWith("|")) {
      return stripMd(t).slice(0, 160);
    }
  }
  return "";
}

/* ---- Reduce markdown to plain text for the search index ---- */
function stripMd(md) {
  return md
    .replace(/```(\w+)?/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`|]/g, " ")
    .replace(/-{2,}/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function build() {
  if (!fs.existsSync(TOOLS_DIR)) {
    console.error("tools/ folder not found.");
    process.exit(1);
  }

  const files = fs
    .readdirSync(TOOLS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_")); // ignore _TEMPLATE.md etc.

  const docs = [];
  const pages = [];     // like docs, but keeps the raw body for static rendering
  const catOrder = [];
  const errors = [];    // block the build / fail CI
  const warnings = [];  // informational

  for (const file of files.sort()) {
    const id = file.replace(/\.md$/, "");
    // Normalize CRLF/CR to LF so front-matter parsing works regardless of the OS the file was saved on.
    let raw;
    try {
      raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf8").replace(/\r\n?/g, "\n");
    } catch (e) {
      warnings.push(`${file}: could not be read (${e.code}) — skipped. On Windows this is often antivirus locking the file.`);
      continue;
    }
    const { data, body } = parseFrontMatter(raw);

    const name = data.name || firstHeading(body) || id;
    const category = data.category || "";
    const description = data.description || firstParagraph(body);
    const tags = Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []);

    // Validation
    if (!category) {
      errors.push(`${file}: missing "category" in the front-matter (required).`);
    } else if (!CATEGORY_ORDER.includes(category)) {
      warnings.push(`${file}: category "${category}" is not in the known list — it will appear at the bottom. Add it to CATEGORY_ORDER if intentional.`);
    }
    if (!data.name && !firstHeading(body)) {
      warnings.push(`${file}: no "name" and no "# Heading" — using the filename "${id}".`);
    }

    if (!catOrder.includes(category || "Uncategorized")) catOrder.push(category || "Uncategorized");

    docs.push({
      id,
      name,
      category: category || "Uncategorized",
      description,
      tags,
      file: `tools/${file}`,
      text: stripMd(body),
    });
    pages.push({ id, name, category: category || "Uncategorized", description, body });
  }

  // Report validation
  if (warnings.length) {
    console.log("\n  Warnings:");
    warnings.forEach((w) => console.log(`  ! ${w}`));
  }
  if (errors.length) {
    console.error("\n  Errors:");
    errors.forEach((e) => console.error(`  ✗ ${e}`));
    console.error(`\n  ${errors.length} error(s). Fix the front-matter above.\n`);
    process.exit(1);
  }

  if (CHECK_ONLY) {
    console.log(`\n  ✓ Validation passed — ${docs.length} tool(s), no blocking errors.\n`);
    return;
  }

  // Order categories by preferred workflow; unknown ones alphabetically at the end.
  const orderedCats = catOrder.slice().sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a), ib = CATEGORY_ORDER.indexOf(b);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  const out = {
    generatedAt: new Date().toISOString(),
    categoryOrder: orderedCats,
    docs,
  };

  fs.writeFileSync(OUT, JSON.stringify(out));
  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);

  console.log(`\n  CyberSheets — index generated`);
  console.log(`  ${docs.length} tools · ${orderedCats.length} categories · ${kb} KB`);
  console.log(`  -> ${path.relative(ROOT, OUT)}`);

  // Pre-rendered, crawlable static page per tool + a sitemap.
  generateStaticSite(pages);
}

/* ============================================================
   Static pre-rendering: one HTML page per tool at /t/<id>.html
   Each is a standalone, crawlable page (content already in the HTML)
   loaded independently — visitors never download every page at once.
   ============================================================ */
function generateStaticSite(pages) {
  const outDir = path.join(ROOT, "t");
  fs.mkdirSync(outDir, { recursive: true });

  let written = 0;
  for (const p of pages) {
    try {
      fs.writeFileSync(path.join(outDir, `${p.id}.html`), toolPageHtml(p));
      written++;
    } catch (e) {
      // e.g. antivirus locking a file mid-write — don't fail the whole build
      console.log(`  ! could not write t/${p.id}.html (${e.code})`);
    }
  }

  // sitemap.xml (home + every tool page)
  const urls = [SITE_URL, ...pages.map((p) => `${SITE_URL}t/${p.id}.html`)];
  const sitemap =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map((u, i) => `  <url><loc>${u}</loc><priority>${i === 0 ? "1.0" : "0.7"}</priority></url>`).join("\n") +
    `\n</urlset>\n`;
  fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);

  console.log(`  -> t/ (${written} static pages) + sitemap.xml\n`);
}

function toolPageHtml(p) {
  const title = `${p.name} — CyberSheets`;
  const canonical = `${SITE_URL}t/${p.id}.html`;
  const desc = p.description || `${p.name} cheatsheet — commands and usage.`;

  // Render markdown, then rewrite links for the static context:
  //  - internal #/tool/x  ->  x.html (sibling page)
  //  - external http(s)   ->  open in a new tab
  const bodyHtml = marked
    .parse(p.body)
    .replace(/href="#\/tool\/([a-z0-9-]+)"/g, 'href="$1.html"')
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a target="_blank" rel="noopener noreferrer" href="$1"');

  const jsonld = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "headline": p.name,
    "description": desc,
    "url": canonical,
    "isPartOf": { "@type": "WebSite", "name": "CyberSheets", "url": SITE_URL },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escAttr(title)}</title>
  <meta name="description" content="${escAttr(desc)}" />
  <link rel="canonical" href="${canonical}" />
  <meta name="theme-color" content="#0a0e14" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="CyberSheets" />
  <meta property="og:title" content="${escAttr(title)}" />
  <meta property="og:description" content="${escAttr(desc)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE_URL}assets/og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escAttr(title)}" />
  <meta name="twitter:description" content="${escAttr(desc)}" />
  <meta name="twitter:image" content="${SITE_URL}assets/og.png" />
  <script type="application/ld+json">${jsonld}</script>
  <link rel="icon" href="${SITE_BASE}/assets/favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="${SITE_BASE}/assets/css/style.css" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css" />
</head>
<body class="doc-standalone">
  <div class="doc-wrap">
    <header class="doc-topbar">
      <a class="doc-home" href="${SITE_BASE}/"><span class="brand-prompt">root@cyber</span><span class="brand-sep">:~#</span> CyberSheets</a>
      <span class="doc-cat">${escAttr(p.category)}</span>
    </header>
    <article class="markdown-body">${bodyHtml}</article>
    <aside class="contrib-term">
      <div class="contrib-term-bar">
        <span class="contrib-term-title">root@cyber: ~</span>
        <span class="contrib-term-btns"><i>&#9472;</i><i>&#9633;</i><i>&#10005;</i></span>
      </div>
      <div class="contrib-cta">
        <p class="contrib-cta-title"><span class="contrib-cta-mark">root@cyber:~#</span>Missing a command, or spot a mistake?</p>
        <p class="contrib-cta-text"><span class="contrib-cta-mark">root@cyber:~#</span>This whole sheet is a single Markdown file — edit it and open a pull request.</p>
        <a class="contrib-cta-btn" href="${REPO_URL}/edit/main/tools/${p.id}.md" target="_blank" rel="noopener noreferrer">improve_this_page()</a>
      </div>
    </aside>
    <footer class="doc-foot">
      <a href="${SITE_BASE}/">&larr; Browse and search all cheatsheets</a>
    </footer>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>document.querySelectorAll('pre code').forEach(function(b){try{hljs.highlightElement(b);}catch(e){}});</script>
</body>
</html>
`;
}

function escAttr(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

build();
