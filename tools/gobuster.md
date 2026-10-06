---
name: Gobuster
category: Web & Fuzzing
description: Fast brute-forcing of web dirs/files, DNS records and vhosts.
tags: [gobuster, directory, dns, vhost, fuzz, go]
---

# Gobuster

**Gobuster** brute-forces URIs (directories/files), DNS subdomains, virtual hosts and more. Written in Go, it's fast and simple, organized into modes. It brute-forces from a wordlist — it does **not** crawl or parse the HTML it gets back.

> `apt install gobuster` · `go install github.com/OJ/gobuster/v3@latest` · [github.com/OJ/gobuster](https://github.com/OJ/gobuster)

## Modes

| Mode | Target |
|------|--------|
| `dir` | Directories and files |
| `dns` | DNS subdomains |
| `vhost` | Virtual hosts (same IP, different `Host:`) |
| `fuzz` | Generic `FUZZ` keyword (like [ffuf](#/tool/ffuf)) |
| `s3` | Open Amazon S3 buckets |
| `gcs` | Open Google Cloud Storage buckets |
| `tftp` | Files on a TFTP server |

```bash
gobuster <mode> --help      # per-mode flags
gobuster version
```

## Directory / file mode

```bash
gobuster dir -u https://target.com -w wordlist.txt
gobuster dir -u https://target.com -w wl.txt -x php,html,txt   # try extensions
gobuster dir -u https://target.com -w wl.txt -t 50             # 50 threads (default 10)
gobuster dir -u https://target.com -w wl.txt -k                # ignore TLS cert errors
gobuster dir -u https://target.com -w wl.txt -r                # follow redirects
gobuster dir -u https://target.com -w wl.txt -o out.txt        # save results
gobuster dir -u https://target.com -w wl.txt -c 'session=abc'  # send cookies
gobuster dir -u https://target.com -w wl.txt -H 'Authorization: Bearer ...'
```

### Status codes (whitelist vs blacklist)

Gobuster blacklists `404` by default. Use **either** a whitelist (`-s`) **or** a blacklist (`-b`), not both — to use `-s` you must clear the default blacklist with `-b ''`.

```bash
gobuster dir -u https://target.com -w wl.txt -b 404,500          # hide these (blacklist)
gobuster dir -u https://target.com -w wl.txt -s 200,204,301,302,307,403 -b ''   # only these
gobuster dir -u https://target.com -w wl.txt --exclude-length 1234   # hide a fixed body size
```

## DNS subdomain mode

```bash
gobuster dns -d example.com -w subdomains.txt
gobuster dns -d example.com -w subs.txt -r 8.8.8.8     # custom resolver
gobuster dns -d example.com -w subs.txt -i             # show resolved IPs
gobuster dns -d example.com -w subs.txt --wildcard     # continue past wildcard DNS
```

## VHost mode

Finds hostnames served from the same IP. `--append-domain` turns wordlist entries into `entry.target.com`.

```bash
gobuster vhost -u https://target.com -w vhosts.txt --append-domain
gobuster vhost -u https://target.com -w vhosts.txt --append-domain --exclude-length 0
```

## Common options

| Flag | Purpose |
|------|---------|
| `-t` | Threads (default 10) |
| `-k` | Skip TLS certificate verification |
| `-r` | Follow redirects |
| `-a` | Custom `User-Agent` |
| `-H` | Add a header (repeatable) |
| `-p` | Proxy (`-p http://127.0.0.1:8080` → Burp) |
| `-o` | Write output to a file |
| `-q` | Quiet (no banner) |
| `-n` | No status codes in output |
| `--delay` | Delay between requests (e.g. `100ms`) |
| `--timeout` | Per-request timeout (default `10s`) |
| `--wildcard` | Don't stop on wildcard responses |

## Recipes

```bash
# Dirs + common file extensions, through Burp, skipping cert errors
gobuster dir -u https://target.com -w /usr/share/seclists/Discovery/Web-Content/directory-list-2.3-medium.txt \
  -x php,txt,bak,zip -k -p http://127.0.0.1:8080 -o gobuster.txt

# Subdomains with IPs, custom resolver, quiet
gobuster dns -d example.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-110000.txt -i -r 1.1.1.1 -q
```

> `dir` mode brute-forces paths and does **not** recurse or crawl — feed interesting hits back in, or switch to [ffuf](#/tool/ffuf) for recursion and parameter fuzzing. Great starter wordlists: SecLists `directory-list-2.3-medium.txt` and the `raft-*` lists. Only scan hosts you're authorized to test.
