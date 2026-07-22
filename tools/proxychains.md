---
name: proxychains
category: Connection & Pivoting
description: Force any TCP tool through a SOCKS/HTTP proxy chain.
tags: [proxychains, socks, pivot, proxy, tunnel, tor]
---

# proxychains

**proxychains** forces the TCP connections of any program through a proxy (SOCKS4/5 or HTTP). In pentesting it's how you push tools like [nmap](#/tool/nmap) or [curl](#/tool/curl) through a SOCKS pivot you built with [ssh -D](#/tool/ssh) or [chisel](#/tool/chisel), reaching an internal network. `proxychains-ng` (`proxychains4`) is the maintained version.

> `apt install proxychains4` · config: `/etc/proxychains4.conf` or `~/.proxychains/proxychains.conf`

## Configure the proxy

Edit the config and set the chain end (bottom of the file):

```text
# /etc/proxychains4.conf
strict_chain          # use proxies in the exact order listed
proxy_dns             # resolve DNS through the proxy (avoid leaks)
[ProxyList]
socks5 127.0.0.1 1080     # e.g. from  ssh -D 1080  or  chisel R:1080:socks
```

Chain modes: `strict_chain` (all, in order), `dynamic_chain` (skip dead ones), `random_chain`.

## Use it

```bash
proxychains4 curl http://10.10.10.5
proxychains4 nmap -sT -Pn -p 22,80,445 10.10.10.0/24     # must be TCP connect (-sT)
proxychains4 smbclient -L //10.10.10.5 -N
proxychains4 firefox                                       # browse internal apps
proxychains4 -q evil-winrm -i 10.10.10.5 -u admin -p pass  # -q quiet
```

## Pivoting recipe

```bash
# 1) open a SOCKS proxy through a foothold host
ssh -D 1080 -N user@jump          # or: chisel client ATTACKER:8080 R:1080:socks
# 2) set "socks5 127.0.0.1 1080" in proxychains4.conf
# 3) run tools through it
proxychains4 nmap -sT -Pn -p- 10.10.10.9
```

## Gotchas

- Only **TCP** is proxied — no ICMP, so nmap needs `-sT -Pn` (no ping, no SYN scan).
- Turn on `proxy_dns` or your DNS lookups leak outside the tunnel.
- SYN scans, raw sockets and UDP won't work through it.

> The glue between a foothold and your toolbox. Build the SOCKS endpoint with [ssh](#/tool/ssh) (`-D`) or [chisel](#/tool/chisel); for per-tool proxying without proxychains, many tools accept `--socks5`/`--proxy` directly (e.g. [curl](#/tool/curl)).
