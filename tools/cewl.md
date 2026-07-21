---
name: CeWL
category: Passwords & Hashes
description: Custom wordlist generator that scrapes a target URL for unique keywords.
tags: [cewl, wordlist, scraping, custom, password]
---

# CeWL

**CeWL** (Custom Word List generator) spiders a target website and extracts unique words to build a tailored wordlist. Organization-specific terms often crack passwords that generic lists like rockyou miss.

> `apt install cewl` · [github.com/digininja/CeWL](https://github.com/digininja/CeWL)

## Basic usage

```bash
cewl https://alvo.com                            # print words to stdout
cewl https://alvo.com -w wordlist.txt             # save to file
cewl https://alvo.com -d 2 -m 6 -w wl.txt         # depth 2, min length 6
```

## Key options

| Option | Purpose |
|--------|---------|
| `-d` | Spider depth (default 2) |
| `-m` | Minimum word length |
| `-w` | Output file |
| `--lowercase` | Force lowercase |
| `-c` | Also output a word count |
| `-e` / `--email_file` | Extract emails too |
| `-a` / `--meta` | Extract metadata (author names etc.) |
| `--with-numbers` | Keep words containing digits |
| `-o` | Spider offsite links |
| `-u` | Custom User-Agent |

```bash
cewl https://alvo.com -d 3 -m 5 --lowercase -w wl.txt
cewl https://alvo.com -e --email_file emails.txt          # harvest emails
cewl https://alvo.com -a --meta_file meta.txt              # document metadata
```

## Turn words into real password candidates

```bash
# 1) scrape the site
cewl https://alvo.com -m 6 -w base.txt
# 2) mangle with hashcat rules (add digits/symbols/case)
hashcat --stdout base.txt -r /usr/share/hashcat/rules/best64.rule > custom.txt
# 3) use it
hydra -L users.txt -P custom.txt ssh://10.0.0.5
```

> A targeted list from the company's own site (products, slogans, names) beats generic lists for password spraying. Feed it into [hydra](#/tool/hydra), [hashcat](#/tool/hashcat) or [john](#/tool/john). Similar: `crunch` (pattern-based) and John's mangling rules.
