---
name: dig
category: Reconnaissance
description: Query DNS records directly — the standard tool for DNS lookups.
tags: [dns, dig, lookup, axfr, records, recon]
---

# dig

**dig** (domain information groper) queries DNS servers directly and prints exactly what they return. It's the go-to for checking records, testing a specific resolver, and probing for zone transfers.

> part of `dnsutils` / `bind-utils` · `apt install dnsutils`

## Basic lookups

```bash
dig example.com                      # A record (verbose answer)
dig example.com +short               # just the answer
dig example.com A
dig example.com AAAA
dig example.com MX +short
dig example.com NS +short
dig example.com TXT
dig example.com ANY                   # (often refused by modern servers)
```

## Choose the resolver / reverse

```bash
dig @8.8.8.8 example.com              # ask a specific DNS server
dig -x 8.8.8.8                         # reverse lookup (PTR)
dig example.com +trace                 # follow delegation from the root
```

## Zone transfer (AXFR)

```bash
dig axfr @ns1.example.com example.com  # dumps the whole zone if misconfigured
```

A successful AXFR is a real finding — it leaks every record in the zone.

## Handy output control

```bash
dig example.com +noall +answer         # show only the answer section
dig example.com +short MX
dig +nocmd example.com any +noall +answer
for s in www mail ftp dev; do dig +short $s.example.com; done   # quick manual sweep
```

> `+short` is what you want for scripting. For automated enumeration and brute-force see [dnsrecon](#/tool/dnsrecon); for passive subdomain discovery, [subfinder](#/tool/subfinder). WHOIS data comes from [whois](#/tool/whois), not dig.
