---
name: httpx
category: Web & Fuzzing
description: Fast, modular HTTP toolkit for probing live hosts, status and headers at scale.
tags: [httpx, probe, http, recon, headers, tech-detect]
---

# httpx

**httpx** (by ProjectDiscovery) is a fast, multi-purpose HTTP toolkit. Feed it a list of hosts/subdomains and it tells you which are alive, their status codes, titles, technologies, headers and more — the glue between recon and web testing.

> `go install github.com/projectdiscovery/httpx/cmd/httpx@latest` · `apt install httpx-toolkit` · **not** the Python `httpx` library

## Probe live hosts

```bash
cat subs.txt | httpx                        # which respond over HTTP/S
cat subs.txt | httpx -silent                 # clean output for piping
httpx -l subs.txt -o live.txt
echo exemplo.com | httpx
```

## Enrich the output

```bash
cat subs.txt | httpx -status-code -title -tech-detect
cat subs.txt | httpx -sc -cl -location -server         # status, content-length, redirect, server
cat subs.txt | httpx -ip -cname                         # resolve IP/CNAME
cat subs.txt | httpx -json -o results.json
```

## Filter & match

```bash
cat subs.txt | httpx -mc 200,301,302        # match status codes
cat subs.txt | httpx -fc 404,403             # filter out codes
cat subs.txt | httpx -ports 80,443,8080,8443
cat subs.txt | httpx -path /admin -mc 200    # probe a specific path
```

## Screenshots & content

```bash
cat subs.txt | httpx -screenshot -srd shots/      # headless screenshots
cat subs.txt | httpx -favicon                       # favicon hash (fingerprint)
cat subs.txt | httpx -match-string "admin"          # grep body
```

## Recon one-liner

```bash
# subdomains -> live web hosts with tech, ready for the next tool
amass enum -passive -d exemplo.com | httpx -silent -title -tech-detect -o live.txt
```

> Purpose-built for pipelines. Chain after [Amass](#/tool/amass)/[Sublist3r](#/tool/sublist3r) and before [ffuf](#/tool/ffuf)/[nikto](#/tool/nikto). Tune `-threads` and `-rate-limit` on large lists.
