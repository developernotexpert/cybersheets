---
name: Google Dorks
category: Reconnaissance
description: Advanced search operators for OSINT and information gathering.
tags: [osint, google, dork, recon, search]
---

# Google Dorks

**Google Dorking** (or Google Hacking) uses advanced search operators to find exposed information: sensitive files, login panels, open directories and leaked data. A core technique for **OSINT** and passive reconnaissance.

> Ethical use: querying is legal, but accessing/exploiting third-party systems without authorization is not. Combine with [Nmap](#/tool/nmap) in the recon phase.

## Core operators

| Operator | What it does | Example |
|----------|--------------|---------|
| `site:` | Restrict to a domain | `site:example.com` |
| `inurl:` | Term in the URL | `inurl:admin` |
| `intitle:` | Term in the page title | `intitle:"index of"` |
| `intext:` | Term in the body | `intext:"password"` |
| `filetype:` / `ext:` | File type | `filetype:pdf` |
| `cache:` | Google's cached version | `cache:example.com` |
| `link:` | Pages linking to the URL | `link:example.com` |
| `related:` | Similar sites | `related:example.com` |
| `AROUND(n)` | Terms within n words | `admin AROUND(3) password` |

## Logical modifiers

```text
"exact phrase"          quotes = literal match
term1 OR term2          either term
term1 -term2            exclude the second term
term *                  wildcard (unknown word)
site:*.example.com      wildcard subdomain
```

## Domain & subdomain enumeration

```text
site:example.com
site:*.example.com -www
site:example.com -site:www.example.com
site:example.com inurl:admin
site:example.com intitle:login
```

## Exposed directories & files

```text
intitle:"index of" site:example.com
intitle:"index of" "parent directory"
intitle:"index of" (backup OR bak OR old)
intitle:"index of" "database.sql"
inurl:/backup intitle:"index of"
```

## Documents & data leakage

```text
site:example.com filetype:pdf
site:example.com (filetype:xls OR filetype:xlsx OR filetype:csv)
site:example.com filetype:docx confidential
filetype:log intext:password
filetype:env "DB_PASSWORD"
filetype:sql "INSERT INTO users"
intext:"BEGIN RSA PRIVATE KEY" filetype:key
```

## Credentials & configuration

```text
inurl:wp-config.php
intitle:"index of" ".env"
filetype:xml inurl:web.config
"index of" "config.php"
inurl:phpinfo.php
intext:"Index of /" "id_rsa"
```

## Login panels & devices

```text
inurl:admin intitle:login
inurl:/wp-admin/
intitle:"Dashboard" inurl:login
intitle:"webcamXP" OR intitle:"live view"
inurl:"/view.shtml"                       cameras
intitle:"router" intext:"login"
```

## Revealing error messages

```text
intext:"sql syntax near"
intext:"Warning: mysql_connect()"
intext:"Fatal error" filetype:php
"Error Occurred While Processing Request"
intext:"ORA-00921: unexpected end of SQL command"
```

## Code & cloud services

```text
site:github.com "example.com" password
site:pastebin.com example.com
site:trello.com example.com
site:s3.amazonaws.com example
inurl:.s3.amazonaws.com
site:drive.google.com confidential
```

## Attack-surface recon

```text
site:example.com inurl:(login | signin | admin | dashboard | portal)
site:example.com (inurl:api OR inurl:v1 OR inurl:swagger)
site:example.com filetype:xml OR filetype:json OR filetype:conf
site:example.com intitle:"phpMyAdmin"
```

## Best practices

- Combine operators to cut noise: `site:` + `filetype:` + `intext:`.
- Document each query and what it found — recon should be reproducible.
- Bulk queries trigger Google's CAPTCHA; pace yourself or use dedicated tooling.
- The **Google Hacking Database (GHDB)** on Exploit-DB collects thousands of ready-made, categorized dorks.
- The same operators work (with variations) on **Bing**, **DuckDuckGo** and **Shodan** (the latter aimed at exposed devices/services).

> **Remember:** finding is not the same as accessing. Report exposures through responsible channels and stay within the authorized scope.
