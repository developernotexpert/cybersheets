---
name: DNSRecon
category: Reconnaissance
description: DNS record auditing and enumeration (AXFR, brute-force, reverse).
tags: [dns, axfr, zone-transfer, recon, subdomain]
---

# DNSRecon

**DNSRecon** audits and enumerates DNS: standard records, zone transfer (AXFR), name brute-force, reverse PTR lookups and wildcard checks. Essential in the infrastructure recon phase.

> `apt install dnsrecon` · `pip install dnsrecon` · [github.com/darkoperator/dnsrecon](https://github.com/darkoperator/dnsrecon)

## Standard enumeration

```bash
dnsrecon -d example.com                       # A, AAAA, MX, NS, SOA, TXT, SRV records
dnsrecon -d example.com -a                     # also attempt AXFR
```

## Scan types (`-t`)

| Type | What it does |
|------|--------------|
| `std` | Standard records (default) |
| `axfr` | Zone transfer on all NS |
| `brt` | Subdomain brute-force (with `-D wordlist`) |
| `rvl` | Reverse lookup over a range (with `-r`) |
| `srv` | SRV records |
| `zonewalk` | Enumeration via DNSSEC/NSEC |

```bash
dnsrecon -d example.com -t axfr                        # zone transfer
dnsrecon -d example.com -t brt -D subdomains.txt       # brute-force
dnsrecon -r 192.30.252.0/24 -t rvl                     # reverse PTR of the range
dnsrecon -d example.com -t zonewalk
```

## Output

```bash
dnsrecon -d example.com --json out.json
dnsrecon -d example.com --xml out.xml
dnsrecon -d example.com -c out.csv
```

## Recipes

```bash
# Test zone transfer (critical finding if it works)
dnsrecon -d example.com -t axfr

# Brute-force with a wordlist and specific DNS server
dnsrecon -d example.com -t brt -D /usr/share/wordlists/dns.txt -n 8.8.8.8
```

> An open **zone transfer (AXFR)** exposes every record in the zone — always worth testing. Quick alternatives: `dig axfr @ns example.com`, `dnsenum`, `fierce`.
