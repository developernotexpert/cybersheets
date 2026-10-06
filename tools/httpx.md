---
name: httpx
category: Web & Fuzzing
description: Fast, modular HTTP toolkit for probing live hosts, status and headers at scale.
tags: [httpx, probe, http, recon, headers, tech-detect]
---

# httpx

**httpx** (by ProjectDiscovery) is a fast, multi-purpose HTTP toolkit. Feed it a list of hosts/subdomains and it tells you which are alive, their status codes, titles, technologies, headers and more — the glue between recon and web testing.

> `go install github.com/projectdiscovery/httpx/cmd/httpx@latest` · `apt install httpx-toolkit` · [github.com/projectdiscovery/httpx](https://github.com/projectdiscovery/httpx) · **not** the Python `httpx` library (on Kali the binary is often `httpx-toolkit`)

## Probe live hosts

```bash
cat subs.txt | httpx                     # which respond over HTTP/S
cat subs.txt | httpx -silent             # clean output, ready to pipe
httpx -l subs.txt -o live.txt            # read from file, save results
echo example.com | httpx                 # single target
cat subs.txt | httpx -ports 80,443,8080,8443,8000   # probe extra ports
```

## Enrich the output

```bash
cat subs.txt | httpx -status-code -title -tech-detect
cat subs.txt | httpx -sc -cl -location -server      # status, length, redirect, Server header
cat subs.txt | httpx -ip -cname -asn                # resolve IP / CNAME / ASN
cat subs.txt | httpx -td -wc -lc -ct                # tech, word count, line count, content-type
cat subs.txt | httpx -cdn                           # flag hosts behind a CDN/WAF
```

| Flag | Shows |
|------|-------|
| `-sc` / `-status-code` | HTTP status code |
| `-title` | Page `<title>` |
| `-td` / `-tech-detect` | Technologies (Wappalyzer-style) |
| `-server` | `Server` header |
| `-cl` / `-content-length` | Response size |
| `-location` | Redirect target |
| `-ip` / `-cname` / `-asn` | DNS / network info |
| `-favicon` | Favicon mmh3 hash (fingerprint, pivot in Shodan) |
| `-jarm` | JARM TLS fingerprint |
| `-hash sha256` | Hash of the response body |

## Filter & match

```bash
cat subs.txt | httpx -mc 200,301,302        # match (keep) status codes
cat subs.txt | httpx -fc 404,403            # filter out status codes
cat subs.txt | httpx -ms "admin"            # keep responses whose body matches a string
cat subs.txt | httpx -mr 'token=[a-f0-9]+'  # keep responses matching a regex
cat subs.txt | httpx -path /admin -mc 200   # probe a specific path
cat subs.txt | httpx -paths paths.txt       # probe many paths per host
```

## Requests & tuning

```bash
cat subs.txt | httpx -fr                              # follow redirects
cat subs.txt | httpx -x GET,POST,PUT -method          # try methods, show which
cat subs.txt | httpx -H 'User-Agent: Mozilla/5.0' -H 'X-Forwarded-For: 127.0.0.1'
cat subs.txt | httpx -http-proxy http://127.0.0.1:8080   # route through Burp
cat subs.txt | httpx -threads 100 -rate-limit 150 -timeout 8 -retries 2
```

## Output formats

```bash
cat subs.txt | httpx -json -o results.json           # one JSON object per line
cat subs.txt | httpx -csv -o results.csv
cat subs.txt | httpx -sc -title -o live.txt -store-response -srd responses/   # save raw bodies
cat subs.txt | httpx -screenshot -srd shots/         # headless screenshots
```

## Recon one-liner

```bash
# subdomains -> live web hosts with status, title and tech, ready for the next tool
amass enum -passive -d example.com | httpx -silent -sc -title -td -o live.txt
```

> Purpose-built for pipelines. Chain after [Amass](#/tool/amass)/[Sublist3r](#/tool/sublist3r) and before [ffuf](#/tool/ffuf)/[nikto](#/tool/nikto)/[wpscan](#/tool/wpscan). Tune `-threads` and `-rate-limit` on large lists so you don't hammer a target. Only probe hosts you're authorized to test.
