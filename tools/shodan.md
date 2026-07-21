---
name: Shodan (CLI + Site)
category: Reconnaissance
description: Search and filter exposed devices and services on the Shodan engine.
tags: [osint, shodan, iot, exposed, recon, banner]
---

# Shodan (CLI + Site)

**Shodan** indexes devices and services exposed on the internet (banners, ports, versions, geolocation). The CLI lets you search and filter without leaving the terminal. Requires an account and API key.

> `pip install shodan` · site: [shodan.io](https://www.shodan.io) · filters: [Filter Reference](https://www.shodan.io/search/filters)

## Setup

```bash
shodan init YOUR_API_KEY
shodan info                     # remaining query credits
```

## CLI searches

```bash
shodan search apache
shodan search --fields ip_str,port,org 'apache country:BR'
shodan count 'port:22 country:BR'          # count only (no result credits)
shodan host 8.8.8.8                          # everything Shodan knows about an IP
shodan search 'ssl:"example.com"'            # by certificate
```

## Essential filters (site and CLI)

| Filter | Example |
|--------|---------|
| `port:` | `port:3389` |
| `country:` | `country:BR` |
| `city:` | `city:"Sao Paulo"` |
| `org:` | `org:"Company"` |
| `net:` | `net:192.30.252.0/24` |
| `hostname:` | `hostname:example.com` |
| `product:` | `product:nginx` |
| `os:` | `os:"Windows"` |
| `ssl.cert.subject.cn:` | by certificate CN |
| `vuln:` | `vuln:CVE-2021-44228` (requires a plan) |
| `http.title:` | `http.title:"Dashboard"` |

## Useful dorks

```text
port:3389 country:BR                      exposed RDP
"authentication disabled" port:5900       VNC with no password
product:MongoDB port:27017                open MongoDB databases
http.title:"index of /"                   directory listings
org:"Company" port:445                    the org's SMB
webcamxp country:BR                        cameras
```

## Other actions

```bash
shodan scan submit 1.2.3.4               # on-demand scan of an IP (credits)
shodan download mydump 'port:22 org:"Company"'   # download results (.json.gz)
shodan parse --fields ip_str,port mydump.json.gz
shodan honeyscore 1.2.3.4                # probability of being a honeypot
shodan alert create "My network" 192.30.252.0/24  # monitoring
```

> Searching is passive. `scan submit` touches the target — scope only. Alternatives: **Censys** and **FOFA** with similar filters.
