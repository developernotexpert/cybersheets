---
name: hping3
category: Port Scanning
description: Custom TCP/IP packet crafter/analyzer for firewall, IDS and stress testing.
tags: [packet, tcp, firewall, ids, dos, spoofing]
---

# hping3

**hping3** crafts and sends custom TCP/IP packets. Use it to test firewall/IDS rules, do advanced traceroute, measure latency and generate stress traffic. Requires root.

> `apt install hping3` · **requires root** · targets only within authorized scope

## Modes (protocol)

```bash
hping3 -1 target        # ICMP (ping)
hping3 -2 target        # UDP
hping3 -8 target        # scan mode
# default: TCP
```

## Port & firewall probing

```bash
hping3 -S -p 80 target                 # send SYN to port 80
hping3 -S -p 80 -c 3 target            # 3 packets
hping3 -S --scan 1-1000 target         # scan a port range
hping3 -S -p ++1 -c 100 target         # increment port each packet
hping3 -A -p 80 target                 # ACK (map a stateful firewall)
hping3 -F -P -U -p 80 target           # FIN/PSH/URG flags (Xmas-like)
```

Interpretation: **SA** (SYN-ACK) = open · **RA** (RST-ACK) = closed · no reply = filtered.

## TCP flags & custom fields

```bash
hping3 -S -w 64 -p 80 target           # set window size
hping3 -a 10.0.0.99 -S -p 80 target    # spoof the source IP (-a)
hping3 -S -p 80 --ttl 64 target        # set TTL
hping3 -S -p 80 -d 120 -E file         # 120-byte payload from a file
```

## Traceroute

```bash
hping3 --traceroute -S -p 80 target    # traceroute using SYN to port 80
hping3 --traceroute -1 target          # via ICMP
```

## Stress / flood testing (authorized lab only)

```bash
hping3 -S -p 80 --flood target             # send as fast as possible
hping3 -S -p 80 --flood --rand-source target   # random source
hping3 --icmp --flood target
```

> **`--flood` is a DoS** — use only in a controlled, authorized environment. Spoofing (`-a`, `--rand-source`) masks the source: may be illegal out of scope. hping3 is great for understanding exactly how a firewall responds to each packet type.
