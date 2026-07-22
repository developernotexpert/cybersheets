---
name: wafw00f
category: Web & Fuzzing
description: Detect and fingerprint web application firewalls (WAFs).
tags: [waf, fingerprint, web, recon, bypass, http]
---

# wafw00f

**wafw00f** checks whether a site sits behind a Web Application Firewall and, if so, which one. Knowing the WAF up front tells you why requests get blocked and which evasion tricks to try.

> `apt install wafw00f` · `pip install wafw00f` · [github.com/EnableSecurity/wafw00f](https://github.com/EnableSecurity/wafw00f)

## Basic usage

```bash
wafw00f https://example.com
wafw00f example.com -v                 # verbose (how it decided)
wafw00f -i hosts.txt                    # test a list
wafw00f https://example.com -a          # find ALL matching WAFs, don't stop at first
```

## Useful options

```bash
wafw00f -l                              # list WAFs it can detect
wafw00f https://example.com -o out.json -f json
wafw00f https://example.com -p 127.0.0.1:8080   # through a proxy
wafw00f https://example.com --no-colors | tee waf.txt
```

## How it works (and why it matters)

It sends benign and mildly malicious requests and studies the responses (headers, cookies, block pages, status codes) to match a signature. If it reports a WAF, expect payload filtering — plan encoding/tampering (e.g. [sqlmap](#/tool/sqlmap) `--tamper`) and slower, lower-rate testing.

> A "no WAF detected" result isn't a guarantee — some WAFs stay quiet until you send a real attack. Run it before heavy scanning with [nikto](#/tool/nikto)/[ffuf](#/tool/ffuf) so you understand what's filtering you.
