---
name: WhatWeb
category: Web & Fuzzing
description: Fingerprint web technologies — CMS, frameworks, servers, versions.
tags: [fingerprint, web, cms, recon, technology, http]
---

# WhatWeb

**WhatWeb** identifies what a website is running: CMS (WordPress, Joomla), frameworks, web servers, analytics, JS libraries and versions. It's a quick fingerprint pass that tells you where to dig next.

> `apt install whatweb` · [github.com/urbanadventurer/WhatWeb](https://github.com/urbanadventurer/WhatWeb)

## Basic usage

```bash
whatweb example.com
whatweb https://example.com
whatweb -i hosts.txt                  # scan a list of targets
```

## Aggression levels (`-a`)

```bash
whatweb -a 1 example.com              # stealthy: one request (default)
whatweb -a 3 example.com              # more requests, more detail
whatweb -a 4 example.com              # heavy: aggressive plugin checks
```

## Output & tuning

```bash
whatweb -v example.com                       # verbose (per-plugin detail)
whatweb --log-json=out.json example.com
whatweb --log-brief=out.txt -i hosts.txt
whatweb --user-agent "Mozilla/5.0" example.com
whatweb --proxy 127.0.0.1:8080 example.com   # through Burp
whatweb --colour=never ... | tee scan.txt
```

## Workflow

```bash
# Find live hosts, then fingerprint each
subfinder -d example.com -silent | httpx -silent | whatweb -i -
```

> Level 1 is safe for a first look; bump to 3–4 when you have scope. Once you know the stack, pivot to the right tool — [wpscan](#/tool/wpscan) for WordPress, [nikto](#/tool/nikto) for server issues, [wafw00f](#/tool/wafw00f) to check for a WAF.
