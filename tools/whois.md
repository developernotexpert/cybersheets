---
name: WHOIS
category: Reconnaissance
description: Query domain registration databases and IP block allocation.
tags: [whois, domain, registration, asn, ip, recon]
---

# WHOIS

**whois** queries the registration databases for domains and IP/ASN allocations (RIRs like LACNIC, ARIN, RIPE). It reveals the owner, dates, DNS servers, contacts and the network range of an IP.

> `apt install whois` · .br registry: [registro.br](https://registro.br) · Latin America RIR: LACNIC

## Queries

```bash
whois example.com                     # domain data
whois 8.8.8.8                          # IP owner/range (organization, ASN)
whois AS15169                          # ASN information
whois -h whois.lacnic.net 200.160.0.0  # specific WHOIS server
```

## Fields that matter

- **Registrant / Org** — organization owning the domain or block.
- **Creation / Expiry Date** — age and validity (useful for phishing and scope).
- **Name Servers** — authoritative DNS (points to provider/infra).
- **NetRange / CIDR** — IP range allocated to the organization (expands scope).
- **Abuse contact** — reporting channel.

## Recipes

```bash
# Extract just the name servers
whois example.com | grep -i "name server"

# Find an IP's network range to scan later
whois 200.160.2.3 | grep -iE "inetnum|netrange|cidr"

# Expiry date
whois example.com | grep -i "expir"
```

> Some TLDs redact data under GDPR/LGPD. For IPs, WHOIS points to the organization's range — combine with [Amass intel](#/tool/amass) (`-cidr`, `-asn`) and [nmap](#/tool/nmap) to scan the discovered block (with authorization).
