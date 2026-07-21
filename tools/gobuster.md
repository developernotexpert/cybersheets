---
name: Gobuster
category: Web & Fuzzing
description: Fast brute-forcing of web dirs/files, DNS records and vhosts.
tags: [gobuster, directory, dns, vhost, fuzz, go]
---

# Gobuster

**Gobuster** brute-forces URIs (directories/files), DNS subdomains, virtual hosts and more. Written in Go, it's fast and simple, organized into modes.

> `apt install gobuster` · [github.com/OJ/gobuster](https://github.com/OJ/gobuster)

## Modes

| Mode | Target |
|------|--------|
| `dir` | Directories and files |
| `dns` | DNS subdomains |
| `vhost` | Virtual hosts |
| `fuzz` | Generic FUZZ keyword |
| `s3` | Open S3 buckets |

## Directory / file mode

```bash
gobuster dir -u https://alvo -w wordlist.txt
gobuster dir -u https://alvo -w wl.txt -x php,html,txt      # extensions
gobuster dir -u https://alvo -w wl.txt -t 50                # threads
gobuster dir -u https://alvo -w wl.txt -s 200,204,301,302,307,403 -b ''
gobuster dir -u https://alvo -w wl.txt -c 'session=abc'     # cookies
gobuster dir -u https://alvo -w wl.txt -k                   # ignore TLS cert
gobuster dir -u https://alvo -w wl.txt -o out.txt
```

## DNS subdomain mode

```bash
gobuster dns -d exemplo.com -w subdomains.txt
gobuster dns -d exemplo.com -w subs.txt -r 8.8.8.8          # custom resolver
gobuster dns -d exemplo.com -w subs.txt -i                  # show resolved IPs
```

## VHost mode

```bash
gobuster vhost -u https://alvo -w vhosts.txt --append-domain
```

## Useful flags

```bash
--wildcard          continue on wildcard responses
-a "Mozilla/5.0"    custom User-Agent
-p http://127.0.0.1:8080   proxy through Burp
--exclude-length 1234      hide responses of a given size
```

> `dir` mode brute-forces paths and does **not** crawl — pair with a crawler or [ffuf](#/tool/ffuf) for parameters. Great starter wordlists: SecLists `directory-list-2.3-medium.txt`.
