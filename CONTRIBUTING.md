# Contributing to CyberCheats

Thanks for helping build a global cybersecurity cheatsheet collection! Adding a page is meant to be simple: **you write one Markdown file and open a Pull Request. That's it.** You never run a build or edit any generated file — automation (GitHub Actions) rebuilds the search index and publishes the site on merge.

## Add a new tool (the whole process)

1. Copy [`tools/_TEMPLATE.md`](tools/_TEMPLATE.md) to `tools/<tool-id>.md`.
   - The **filename becomes the page URL** (`#/tool/<tool-id>`), so use `lowercase-with-dashes` (e.g. `sqlmap.md`, `hashcat.md`).
2. Fill in the front-matter at the top. Only `category` is strictly required:

   ```markdown
   ---
   name: My Tool
   category: Reconnaissance
   description: One-line summary for the sidebar.
   tags: [tag1, tag2]
   ---
   ```

   - **name** — optional. If omitted, the first `# Heading` (or the filename) is used.
   - **description** — optional. If omitted, the first paragraph is used.
   - **tags** — optional, but they improve search.
3. Write the cheatsheet in Markdown below the front-matter.
4. Open a Pull Request.

A validation check runs automatically on your PR. If something's off (e.g. an unknown category), it tells you exactly what to fix.

## Categories

`category` must be **exactly one** of:

| Category |
|----------|
| Reconnaissance |
| Port Scanning |
| Service Enumeration |
| Web & Fuzzing |
| Exploitation |
| Post-Exploitation & PrivEsc |
| Passwords & Hashes |
| Connection & Pivoting |
| Traffic Analysis & Wireless |
| Forensics & Reverse Engineering |
| Cryptography |

Need a new category? Open an issue or add it to `CATEGORY_ORDER` in `build/build-index.js` in your PR (keep the list in workflow order).

## Style guide

- Prefer **real, runnable commands** with short comments over prose.
- Use fenced code blocks with a language (```` ```bash ````) for syntax highlighting.
- Link related tools with `[Name](#/tool/tool-id)`.
- Add a short **scope/safety note** — these are offensive tools; remind readers to stay authorized.
- Keep it practical: install line → core syntax → an options table → examples → recipes.

## Fixing or improving an existing page

Just edit the relevant `tools/<tool>.md` and open a PR. No other steps.

## Running it locally (optional)

You only need this if you want to preview before opening the PR:

```bash
node build/build-index.js      # regenerate tools/search-index.json
python -m http.server 8000     # serve (browsers block fetch on file://)
# open http://localhost:8000
```

> `tools/search-index.json` is a **generated file** — it's git-ignored and produced by CI. Don't commit it; don't hand-edit it.
