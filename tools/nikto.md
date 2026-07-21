---
name: Nikto
category: Web & Fuzzing
description: Web server scanner for dangerous files, misconfigs and outdated software.
tags: [nikto, web, scanner, vulnerability, misconfig]
---

# Nikto

**Nikto** scans web servers for thousands of potentially dangerous files/CGIs, outdated server versions, insecure configurations and other issues. Fast, noisy, great for a first pass.

> `apt install nikto` · [github.com/sullo/nikto](https://github.com/sullo/nikto)

## Basic scan

```bash
nikto -h https://alvo
nikto -h 10.0.0.5 -p 80,443,8080          # multiple ports
nikto -h https://alvo -ssl                 # force SSL
nikto -h https://alvo -o report.html -Format htm
```

## Useful options

| Option | Purpose |
|--------|---------|
| `-h` | Target host/URL |
| `-p` | Port(s) |
| `-ssl` | Force HTTPS |
| `-o` / `-Format` | Output file / format (csv, htm, xml, json) |
| `-Tuning` | Select test categories |
| `-useproxy` | Route through a proxy |
| `-id user:pass` | HTTP basic auth |
| `-Plugins` | Run specific plugins |
| `-maxtime` | Time limit |

## Tuning (test categories)

```bash
nikto -h https://alvo -Tuning 1     # interesting files
nikto -h https://alvo -Tuning 9     # SQL injection
nikto -h https://alvo -Tuning x6    # exclude category 6
# 0 File upload  1 Files  2 Default files  3 Info disclosure
# 4 Injection    5 Remote retrieval  6 DoS  9 SQLi  b Identification
```

## Through Burp / with evasion

```bash
nikto -h https://alvo -useproxy http://127.0.0.1:8080
nikto -h https://alvo -evasion 1        # IDS evasion techniques (1-8)
```

## Scan many hosts

```bash
nikto -h hosts.txt                       # one host per line
# or feed nmap output
nmap -p80,443 10.0.0.0/24 -oG - | nikto -h -
```

> Very loud — every request is signatured. Results include CVEs and paths worth verifying manually. Complements [nmap](#/tool/nmap) `http-*` scripts and [wpscan](#/tool/wpscan) for CMS-specific checks.
