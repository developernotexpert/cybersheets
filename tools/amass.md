---
name: Amass
category: Reconnaissance
description: Attack-surface mapping and deep subdomain enumeration (OWASP).
tags: [subdomain, dns, osint, owasp, recon, asset]
---

# Amass

**OWASP Amass** maps attack surface and enumerates subdomains by combining DNS resolution, OSINT sources, certificate transparency and brute-force. It tends to find more than the lighter tools, at the cost of taking longer.

> `apt install amass` · `go install github.com/owasp-amass/amass/v4/...@master` · [github.com/owasp-amass/amass](https://github.com/owasp-amass/amass)

## Subcommands

| Command | Purpose |
|---------|---------|
| `amass enum` | Subdomain enumeration (passive and active) |
| `amass intel` | Intelligence gathering (orgs, ASNs, ranges) |
| `amass db` | Query results stored in the local database |
| `amass viz` | Generate asset-graph visualizations |

## Subdomain enumeration

```bash
amass enum -d example.com                     # passive + active (default)
amass enum -passive -d example.com            # OSINT only (doesn't touch the target)
amass enum -active -d example.com             # includes active resolution/validation
amass enum -brute -d example.com              # brute-force names
amass enum -d example.com -o results.txt
amass enum -df domains.txt                    # multiple domains from a file
```

## Intelligence (discover the org's domains)

```bash
amass intel -d example.com -whois             # related domains via WHOIS
amass intel -org "Company Name"               # search by organization
amass intel -asn 15169                        # domains in an ASN
amass intel -cidr 192.30.252.0/22
```

## Querying the DB and visualizing

```bash
amass db -names -d example.com                # list discovered names
amass db -show -d example.com                 # details
amass viz -d3 -d example.com                  # interactive graph (HTML/D3)
```

## Config and API keys

Add keys (Shodan, VirusTotal, Censys, SecurityTrails…) in the config file to greatly expand sources:

```bash
amass enum -config ~/.config/amass/config.ini -d example.com
```

## Recipes

```bash
# Quiet passive recon feeding other tools
amass enum -passive -d example.com -o subs.txt
cat subs.txt | httpx -silent            # see which are alive

# Aggressive enumeration with brute-force + wordlist
amass enum -active -brute -w wordlist.txt -d example.com
```

> `-passive` is safe and quiet for the initial phase; `-active`/`-brute` touch the target and DNS infrastructure — use only within authorized scope. Feed results into [httpx](#/tool/httpx), and compare with [Sublist3r](#/tool/sublist3r)/[dnsrecon](#/tool/dnsrecon).
