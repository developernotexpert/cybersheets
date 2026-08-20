---
name: IPv4/IPv6 Reference
category: Cheatsheets & Playbooks
description: IPv4/IPv6 ranges, subnetting, private ranges, broadcast addresses and subnet calculation.
tags: [ipv4, ipv6, subnetting, networking, cidr, RTFM]
---

# IPv4/IPv6 Reference

Classful ranges, private ranges, subnetting table and IPv6 addresses.

## Classful IPv4 ranges

| Class | Range |
|-------|-------|
| A | 0.0.0.0 – 127.255.255.255 |
| B | 128.0.0.0 – 191.255.255.255 |
| C | 192.0.0.0 – 223.255.255.255 |
| D | 224.0.0.0 – 239.255.255.255 |
| E | 240.0.0.0 – 255.255.255.255 |

## Reserved private ranges

| Range | Class |
|-------|-------|
| 10.0.0.0 – 10.255.255.255 | A |
| 172.16.0.0 – 172.31.255.255 | B |
| 192.168.0.0 – 192.168.255.255 | C |
| 127.0.0.0 – 127.255.255.255 | Loopback |

## Subnetting

| CIDR | Mask | Hosts |
|------|------|-------|
| /30 | 255.255.255.252 | 2 |
| /29 | 255.255.255.248 | 6 |
| /28 | 255.255.255.240 | 14 |
| /27 | 255.255.255.224 | 30 |
| /26 | 255.255.255.192 | 62 |
| /25 | 255.255.255.128 | 126 |
| /24 | 255.255.255.0 | 254 |
| /23 | 255.255.254.0 | 510 |
| /22 | 255.255.252.0 | 1022 |
| /21 | 255.255.248.0 | 2046 |
| /20 | 255.255.240.0 | 4094 |
| /16 | 255.255.0.0 | 65534 |
| /8 | 255.0.0.0 | 16777214 |

## Calculating subnet range

Given `1.1.1.101/28`: mask=255.255.255.240, 256-240=16 → ranges of 16. Range: 1.1.1.96 – 1.1.1.111.

## IPv6 broadcast addresses

| Address | Scope |
|---------|-------|
| `ff02::1` | link-local nodes |
| `ff01::2` | node-local routers |
| `ff02::2` | link-local routers |
| `ff05::2` | site-local routers |

## IPv6 interface addresses

| Prefix | Type |
|--------|------|
| `fe80::` | link-local |
| `2001::` | routable |
| `::a.b.c.d` | IPv4 compatible |
| `::ffff:a.b.c.d` | IPv4 mapped |
| `2000::/3` | Global Unicast |
| `FC00::/7` | Unique Local |

> Source: RTFM — Red Team Field Manual v2
