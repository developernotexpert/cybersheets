---
name: Burp Suite
category: Web & Fuzzing
description: The standard intercepting proxy and web app testing platform.
tags: [burp, proxy, intercept, repeater, intruder, web]
---

# Burp Suite

**Burp Suite** is an intercepting proxy and web-app testing platform. You route your browser through it, inspect and modify every request, then replay and fuzz them. The Community edition covers manual testing; Professional adds the active scanner and unthrottled Intruder.

> [portswigger.net/burp](https://portswigger.net/burp) · ships on Kali · set browser proxy to `127.0.0.1:8080`

## Setup

1. Start Burp, note the proxy listener (`127.0.0.1:8080`).
2. Point your browser at it (or use the bundled Chromium: **Proxy → Intercept → Open Browser**).
3. Install Burp's CA cert to intercept HTTPS: browse to `http://burp` → **CA Certificate**, import it into the browser.

## Core tools

- **Proxy** — intercept, view and edit requests/responses in flight. Toggle *Intercept on/off*; browse history under **HTTP history**.
- **Repeater** (`Ctrl+R` to send there) — manually tweak and resend a single request. The workhorse for testing one endpoint.
- **Intruder** (`Ctrl+I`) — automated fuzzing: mark positions with `§`, load payloads, run. Attack types: Sniper, Battering ram, Pitchfork, Cluster bomb.
- **Decoder / Inspector** — encode/decode base64, URL, hex; build and analyze tokens.
- **Comparer** — diff two responses (spot subtle auth/logic differences).

## Common workflow

```text
1. Proxy → browse the app so Burp maps it (HTTP history / Target site map).
2. Right-click an interesting request → "Send to Repeater".
3. In Repeater, tamper parameters, headers, cookies; resend; read the response.
4. Send to Intruder to fuzz a parameter (IDs, usernames, payload lists).
5. Send the raw request to sqlmap:  right-click → "Copy to file" → sqlmap -r req.txt
```

## Handy bits

- **Match & Replace** (Proxy → Options) — auto-rewrite headers (e.g. force a `User-Agent`).
- **Scope** (Target → Scope) — restrict logging/attacks to your target only.
- **Extensions** (BApp Store) — Logger++, Autorize, JWT Editor, Param Miner.
- Scanning (active/passive) is Pro-only; in Community, lean on Repeater + Intruder.

> The bridge to other tools is the saved request: export from Repeater and feed it to [sqlmap](#/tool/sqlmap) (`-r`) or [commix](#/tool/commix). Open-source alternative with a free active scanner: [OWASP ZAP](#/tool/zaproxy).
