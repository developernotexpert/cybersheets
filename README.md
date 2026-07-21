# CyberCheats

A community collection of cybersecurity, cryptography and pentest cheatsheets. It's a static site — no backend, just HTML/CSS/JS — meant to live on GitHub Pages. Each tool is a Markdown file rendered in the page, and you can search either by tool name or by anything written inside the sheets.

## Adding or editing a cheatsheet

Every tool is a single file under `tools/` (e.g. `tools/nmap.md`) that starts with a short front-matter block:

```markdown
---
name: My Tool
category: Reconnaissance
description: One line that shows up in the sidebar and search.
tags: [tag1, tag2]
---

# My Tool

Then the cheatsheet itself — headings, code blocks, tables.
```

The filename becomes the page URL (`#/tool/my-tool`), so keep it lowercase-with-dashes. Only `category` is actually required: skip `name` and it falls back to the first heading; skip `description` and it uses the first paragraph.

You don't build or generate anything by hand. Open a pull request with your `.md` and that's it — CI checks it and, once merged, rebuilds the index and redeploys.

The quickest path is straight from GitHub: open `tools/_TEMPLATE.md`, hit the edit pencil (it forks the repo for you), rename the file, paste your sheet, and propose the change. If you'd rather work locally:

```bash
git clone https://github.com/<you>/CyberCheats.git
cd CyberCheats
cp tools/_TEMPLATE.md tools/mytool.md
# write it, then optionally preview:
node build/build-index.js && python -m http.server 8000
```

### Categories

Use one of these for `category` (or add a new one to `CATEGORY_ORDER` in `build/build-index.js`):

Reconnaissance · Port Scanning · Service Enumeration · Web & Fuzzing · Exploitation · Post-Exploitation & PrivEsc · Passwords & Hashes · Connection & Pivoting · Traffic Analysis & Wireless · Forensics & Reverse Engineering · Cryptography

### Conventions

Favor real commands with short comments over long explanations. Fence code blocks with a language (```` ```bash ````) so they get highlighted, and link other tools with `[Name](#/tool/tool-id)`. Most of these are offensive tools, so add a line reminding people to stay in scope. More detail lives in [CONTRIBUTING.md](CONTRIBUTING.md).

## How the search works

There's no server, so the page can't list files on its own. A small Node script (`build/build-index.js`) reads every sheet's front-matter and body and writes a single `search-index.json`. The site downloads that one file, builds a [MiniSearch](https://github.com/lucaong/minisearch) index in the background, and only fetches a tool's Markdown when you actually open it. That holds up even with thousands of sheets: search stays in the single-digit milliseconds, and indexing never blocks the first paint. `search-index.json` is generated, so it's git-ignored and rebuilt by CI on every deploy — don't commit or hand-edit it.

Handy shortcut: press `/` to jump to search, `Esc` to clear it.

## Running locally

Browsers won't `fetch` over `file://`, so build once and serve over HTTP:

```bash
node build/build-index.js
python -m http.server 8000   # http://localhost:8000
```

## Deploying

Deployment runs through GitHub Actions, so there's nothing to build by hand:

1. Push to GitHub.
2. Settings → Pages → Source: **GitHub Actions**.

After that, every push to `main` rebuilds the index and republishes, and pull requests are validated automatically.

## License

Code (HTML/CSS/JS and the build script) is [MIT](LICENSE). The cheatsheet content under `tools/` is [CC BY-SA 4.0](LICENSE-CONTENT) — reuse and adapt it with credit, keeping derivatives under the same license. Maintained under the alias **Developer !Expert**. The sheets describe third-party tools that belong to their own authors; contributions go in under the same licenses.
