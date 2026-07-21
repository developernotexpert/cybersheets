---
name: dirb
category: Web & Fuzzing
description: Classic dictionary-based web content scanner.
tags: [dirb, directory, web, bruteforce, content]
---

# dirb

**dirb** brute-forces directories and files from a wordlist. It's older and slower than ffuf/gobuster, but it's dependency-free and ships on Kali, which makes it a reliable fallback.

> `apt install dirb` · wordlists ship in `/usr/share/dirb/wordlists/`

## Basic usage

```bash
dirb https://alvo                              # uses default common.txt
dirb https://alvo /usr/share/dirb/wordlists/big.txt
dirb https://alvo wordlist.txt -o out.txt      # save output
```

## Common options

| Option | Purpose |
|--------|---------|
| `-X .php,.html` | Append extensions |
| `-x ext.txt` | Extensions from file |
| `-r` | Non-recursive |
| `-z 100` | Delay (ms) between requests |
| `-c 'cookie=val'` | Send cookie |
| `-H 'Header: val'` | Custom header |
| `-u user:pass` | HTTP basic auth |
| `-p proxy:port` | Proxy (e.g. Burp) |
| `-S` | Silent (no per-request output) |
| `-w` | Don't stop on warning |

```bash
dirb https://alvo -X .php,.bak,.old
dirb https://alvo -c 'PHPSESSID=abc' -z 200
dirb https://alvo -p 127.0.0.1:8080            # route through Burp
```

## Wordlists included

```text
/usr/share/dirb/wordlists/common.txt      default, quick
/usr/share/dirb/wordlists/big.txt         larger
/usr/share/dirb/wordlists/vulns/          vuln-specific lists
```

> Slower and simpler than [ffuf](#/tool/ffuf) / [gobuster](#/tool/gobuster), but zero-config and always available on Kali. Recurses into found directories by default.
