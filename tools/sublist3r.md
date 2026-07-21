---
name: Sublist3r
category: Reconnaissance
description: Fast subdomain enumeration using multiple search engines.
tags: [subdomain, osint, recon, dns, search]
---

# Sublist3r

**Sublist3r** enumerates subdomains quickly by querying multiple search engines and sources (Google, Bing, Yahoo, Baidu, VirusTotal, ThreatCrowd, DNSdumpster, SSL certs). Great for a fast overview before moving to [Amass](#/tool/amass).

> `pip install sublist3r` · `apt install sublist3r` · [github.com/aboul3la/Sublist3r](https://github.com/aboul3la/Sublist3r)

## Basic usage

```bash
sublist3r -d example.com
sublist3r -d example.com -o subs.txt          # save to file
sublist3r -d example.com -v                    # verbose (real-time output)
```

## Useful options

| Option | Purpose |
|--------|---------|
| `-d` | Target domain |
| `-o` | Output file |
| `-v` | Verbose mode |
| `-t` | Number of threads (default 30) |
| `-e` | Specific engines (`google,bing,virustotal`) |
| `-p` | Ports to test on found subdomains |
| `-b` | Enable brute-force with the subbrute module |

```bash
sublist3r -d example.com -e google,bing,yahoo
sublist3r -d example.com -p 80,443            # check web ports on the hosts
sublist3r -d example.com -b -t 50             # include brute-force
```

## Recipe

```bash
# Enumerate and validate which ones respond over HTTP
sublist3r -d example.com -o subs.txt
cat subs.txt | httpx -silent -status-code
```

> Lightweight and passive (only queries public sources). For more complete enumeration, combine with Amass and [dnsrecon](#/tool/dnsrecon).
