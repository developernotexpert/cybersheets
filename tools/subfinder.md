---
name: subfinder
category: Reconnaissance
description: Fast passive subdomain discovery from many sources (ProjectDiscovery).
tags: [subdomain, recon, osint, dns, projectdiscovery, passive]
---

# subfinder

**subfinder** enumerates subdomains passively by querying a long list of sources (certificate transparency, DNS aggregators, search APIs). It's fast, script-friendly, and a common first step before probing hosts.

> `go install github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest` · `apt install subfinder` · [github.com/projectdiscovery/subfinder](https://github.com/projectdiscovery/subfinder)

## Basic usage

```bash
subfinder -d example.com
subfinder -d example.com -o subs.txt
subfinder -d example.com -silent            # clean output for piping
subfinder -dL domains.txt -o all.txt         # many domains from a file
```

## Useful flags

```bash
subfinder -d example.com -all               # use all sources (slower, more results)
subfinder -d example.com -recursive
subfinder -d example.com -nW                 # only resolvable hosts
subfinder -d example.com -rl 10              # rate limit
subfinder -d example.com -oJ -o subs.json    # JSON output
```

## API keys

Add keys (Shodan, Censys, VirusTotal, SecurityTrails…) to `$HOME/.config/subfinder/provider-config.yaml` to unlock more sources.

## Recon one-liner

```bash
subfinder -d example.com -silent | httpx -silent -title -tech-detect -o live.txt
```

> Passive only — it doesn't touch the target directly. Pair with [amass](#/tool/amass) for deeper enumeration, [dnsx](#/tool/subfinder) for resolution, and [httpx](#/tool/httpx) to find live web hosts.
