#!/usr/bin/env node
/* ============================================================
   CyberCheats — build-index.js
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

const ROOT = path.resolve(__dirname, "..");
const TOOLS_DIR = path.join(ROOT, "tools");
const OUT = path.join(TOOLS_DIR, "search-index.json");
const CHECK_ONLY = process.argv.includes("--check");

// Allowed categories, in preferred sidebar order (pentest workflow).
// Add new categories here when the project needs them.
const CATEGORY_ORDER = [
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
  const catOrder = [];
  const errors = [];    // block the build / fail CI
  const warnings = [];  // informational

  for (const file of files.sort()) {
    const id = file.replace(/\.md$/, "");
    // Normalize CRLF/CR to LF so front-matter parsing works regardless of the OS the file was saved on.
    const raw = fs.readFileSync(path.join(TOOLS_DIR, file), "utf8").replace(/\r\n?/g, "\n");
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

  console.log(`\n  CyberCheats — index generated`);
  console.log(`  ${docs.length} tools · ${orderedCats.length} categories · ${kb} KB`);
  console.log(`  -> ${path.relative(ROOT, OUT)}\n`);
}

build();
