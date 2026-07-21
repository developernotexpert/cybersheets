---
name: theHarvester
category: Reconnaissance
description: Gathers emails, names, subdomains, IPs and ports from public sources.
tags: [osint, email, subdomain, recon, footprint]
---

# theHarvester

**theHarvester** does passive footprinting: it pulls emails, names, subdomains, IPs, URLs and open ports from dozens of public sources (search engines, PGP, Shodan, certificate transparency). It's usually one of the first tools run in the OSINT phase of a pentest or red team engagement.

> `apt install theharvester` · `pip install theHarvester` · [github.com/laramies/theHarvester](https://github.com/laramies/theHarvester)

## Basic usage

```bash
theHarvester -d example.com -b all            # all sources
theHarvester -d example.com -b bing
theHarvester -d example.com -b google -l 500  # limit to 500 results
```

## Main options

| Option | Purpose |
|--------|---------|
| `-d` | Target domain or company |
| `-b` | Source(s): `bing`, `google`, `duckduckgo`, `crtsh`, `shodan`, `all`… |
| `-l` | Result limit |
| `-s` | Start at result N |
| `-f` | Save to HTML/JSON/XML |
| `-n` | DNS resolution of found hosts |
| `-c` | DNS brute-force |
| `-p` | Port discovery |

```bash
theHarvester -d example.com -b crtsh,bing,duckduckgo -f output
theHarvester -d example.com -b all -n -c       # resolve DNS and brute-force
```

## Sources that need an API key

Shodan, Hunter, SecurityTrails etc. require a key in `api-keys.yaml`:

```bash
theHarvester -d example.com -b shodan
```

## Recipe

```bash
# Collect emails and subdomains and export a report
theHarvester -d example.com -b all -l 1000 -f report
# -> report.html and report.json
```

> Fully passive with the default sources. Ideal for building email lists (authorized phishing) and expanding the surface found by [Amass](#/tool/amass) and [Sublist3r](#/tool/sublist3r).
