---
name: WPScan
category: Web & Fuzzing
description: WordPress vulnerability scanner for core, themes, plugins and users.
tags: [wordpress, cms, plugin, theme, vulnerability, enum]
---

# WPScan

**WPScan** is a black-box WordPress security scanner. It enumerates the WordPress version, plugins, themes and users, and cross-references a vulnerability database to flag known issues.

> `apt install wpscan` · `gem install wpscan` · [wpscan.com](https://wpscan.com) · get a free API token for vuln data

## Basic scan

```bash
wpscan --url https://alvo
wpscan --url https://alvo --api-token SEU_TOKEN     # enables vulnerability data
wpscan --url https://alvo --random-user-agent
wpscan --url https://alvo --disable-tls-checks
```

## Enumeration (`-e`)

| Code | Enumerates |
|------|-----------|
| `vp` | Vulnerable plugins |
| `ap` | All plugins |
| `vt` | Vulnerable themes |
| `at` | All themes |
| `u`  | Users |
| `cb` | Config backups |
| `dbe` | Db exports |

```bash
wpscan --url https://alvo -e vp,vt,u                  # vuln plugins/themes + users
wpscan --url https://alvo -e ap --plugins-detection aggressive
wpscan --url https://alvo -e u                         # enumerate usernames
```

## Password brute-force

```bash
# Enumerate users, then attack the login
wpscan --url https://alvo -e u
wpscan --url https://alvo -U admin -P rockyou.txt --password-attack xmlrpc
wpscan --url https://alvo -U users.txt -P pass.txt --password-attack wp-login
```

`xmlrpc` is usually faster than `wp-login` when `/xmlrpc.php` is exposed.

## Detection modes

```bash
--plugins-detection passive|mixed|aggressive
--detection-mode aggressive
```

> Add the free API token to turn version detections into actual CVEs. Aggressive plugin detection is thorough but loud. Combine with [nikto](#/tool/nikto) and [ffuf](#/tool/ffuf) for non-WordPress paths.
