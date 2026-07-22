---
name: OWASP ZAP
category: Web & Fuzzing
description: Open-source intercepting proxy and web scanner with a free active scanner.
tags: [zap, proxy, scanner, web, owasp, intercept]
---

# OWASP ZAP

**ZAP** (Zed Attack Proxy) is an open-source web app scanner and intercepting proxy. It overlaps a lot with [Burp](#/tool/burpsuite), with one big difference: the **active scanner is free**. It also automates well from the CLI/Docker for CI pipelines.

> `apt install zaproxy` · [zaproxy.org](https://www.zaproxy.org) · proxy defaults to `127.0.0.1:8080`

## GUI workflow

1. Set your browser proxy to ZAP (or use **Quick Start → Manual Explore** to launch a pre-configured browser).
2. Import ZAP's CA cert (**Options → Dynamic SSL Certificates → Save**) to intercept HTTPS.
3. Browse the app so ZAP builds the site tree.
4. Right-click the target → **Attack → Spider** (crawl), then **Active Scan** (find vulns).
5. Review findings under the **Alerts** tab.

## Key components

- **Manual Request Editor / Requester** — the Repeater equivalent: edit and resend one request.
- **Spider** and **AJAX Spider** — crawl classic and JS-heavy apps.
- **Active Scan** — sends attack payloads to find SQLi, XSS, etc. (free).
- **Fuzzer** — payload-based fuzzing of a parameter.
- **HUD** — an in-browser overlay for testing without switching windows.

## Automation (headless / CI)

```bash
# Baseline passive scan (great for pipelines)
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://example.com

# Full active scan with an HTML report
docker run -v $(pwd):/zap/wrk owasp/zap2docker-stable \
  zap-full-scan.py -t https://example.com -r report.html

# Headless daemon + API
zap.sh -daemon -host 127.0.0.1 -port 8090 -config api.key=CHANGEME
```

> Choose ZAP when you want a free active scanner or CI automation; [Burp](#/tool/burpsuite) still leads for deep manual testing and extensions. Both export requests you can hand to [sqlmap](#/tool/sqlmap).
