---
name: Tool Name
category: Reconnaissance
description: One-line summary shown in the sidebar and search results.
tags: [tag1, tag2, tag3]
---

# Tool Name

One or two sentences on what the tool does and when you'd use it.

> `apt install tool` · [project link](https://example.com) · notes (e.g. requires root)

## Section (e.g. Basic usage)

```bash
tool --help
tool -x target
```

## Another section (e.g. Common options)

| Option | Purpose |
|--------|---------|
| `-x` | What it does |
| `-y` | What it does |

## Recipes

```bash
# A useful real-world one-liner
tool -x target | other-tool
```

> Closing tip, caveat, or safety/scope note. Link related tools like [Nmap](#/tool/nmap).

<!--
  HOW TO CONTRIBUTE THIS FILE
  1) Copy this file to tools/<your-tool-id>.md  (the filename becomes the URL id — use lowercase-with-dashes).
  2) Fill in the front-matter above (only `category` is strictly required):
     - category MUST be one of:
         Reconnaissance · Port Scanning · Service Enumeration · Web & Fuzzing ·
         Exploitation · Post-Exploitation & PrivEsc · Passwords & Hashes ·
         Connection & Pivoting · Traffic Analysis & Wireless ·
         Forensics & Reverse Engineering · Cryptography
     - if you omit `name`, the first "# Heading" is used.
     - if you omit `description`, the first paragraph is used.
  3) Write the cheatsheet in Markdown. Delete this comment block.
  4) Open a Pull Request. That's it — CI builds the index and publishes automatically.
     You do NOT need to run any build or touch search-index.json.
-->
