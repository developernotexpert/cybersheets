---
name: Nmap
category: Reconnaissance
description: Industry-standard network scanner for host discovery, ports and service/OS detection.
tags: [scan, network, ports, recon, discovery, nse]
---

# Nmap

**Nmap** (Network Mapper) is the industry standard for host discovery, port scanning, service/version detection and scripting (NSE). Only use it on networks you're authorized to test.

> `apt install nmap` · `brew install nmap` · [nmap.org](https://nmap.org)

## Basic syntax

```bash
nmap [scan type] [options] <target>
```

The target can be an IP, hostname, range or CIDR:

```bash
nmap 192.168.0.1
nmap scanme.nmap.org
nmap 192.168.0.1-50
nmap 192.168.0.0/24
nmap -iL targets.txt          # read targets from a file
```

## Host discovery

```bash
nmap -sn 192.168.0.0/24     # ping scan (live hosts only, no ports)
nmap -Pn 10.0.0.5           # treat host as up (skip discovery)
nmap -PS22,80,443 target    # TCP SYN ping on ports
nmap -PU53 target           # UDP ping
nmap -PR 192.168.0.0/24     # ARP ping (local net, very fast)
```

## Port scan types

| Flag | Type | Notes |
|------|------|-------|
| `-sS` | TCP SYN (stealth) | Default as root, fast and quiet |
| `-sT` | TCP Connect | No root needed |
| `-sU` | UDP | Slow but essential (DNS, SNMP, DHCP) |
| `-sA` | TCP ACK | Maps firewall rules |
| `-sN` `-sF` `-sX` | Null / FIN / Xmas | Evade simple firewalls |

```bash
sudo nmap -sS 10.0.0.5
sudo nmap -sU --top-ports 100 10.0.0.5
```

## Port selection

```bash
nmap -p 80 target
nmap -p 1-65535 target        # or -p-  (all ports)
nmap -p 22,80,443,3389 target
nmap -p U:53,T:80 target      # UDP and TCP together
nmap -F target                # fast: 100 most common ports
nmap --top-ports 20 target
```

## Service, version and OS detection

```bash
nmap -sV target               # service versions
nmap -sV --version-intensity 9 target
nmap -O target                # OS detection
nmap -A target                # aggressive: -sV -O --script=default --traceroute
```

## Timing and performance

```bash
nmap -T4 target               # T0 (slow/stealth) … T5 (insane/fast)
nmap --min-rate 1000 target   # minimum packets per second
nmap --max-retries 2 target
nmap --host-timeout 30m target
```

## Nmap Scripting Engine (NSE)

```bash
nmap --script=default target           # or -sC
nmap --script=vuln target              # known vulnerabilities
nmap --script=http-enum target
nmap --script=ssl-enum-ciphers -p 443 target
nmap --script=smb-os-discovery target
nmap --script "http-*" target          # wildcard by category/name
```

Useful categories: `auth`, `brute`, `default`, `discovery`, `exploit`, `safe`, `vuln`.

## Output formats

```bash
nmap -oN out.txt target       # normal text
nmap -oX out.xml target       # XML
nmap -oG out.gnmap target     # greppable
nmap -oA base target          # all three formats at once
```

## Firewall / IDS evasion

```bash
nmap -f target                # fragment packets
nmap --mtu 16 target
nmap -D RND:10 target         # decoys
nmap -S <fake_IP> target      # spoof source
nmap --source-port 53 target  # trusted source port
nmap --data-length 25 target
```

## Quick recipes

```bash
# Full recon of one host
sudo nmap -A -T4 -p- 10.0.0.5 -oA host_full

# Fast sweep of an entire network
nmap -sn 192.168.0.0/24

# Find web servers on the network
nmap -p 80,443,8080,8443 --open 192.168.0.0/24

# TLS audit
nmap --script ssl-enum-ciphers -p 443 example.com

# SMB enumeration
nmap -p 445 --script smb-enum-shares,smb-os-discovery 10.0.0.5
```

> **`--open`** shows only open ports · **`-v` / `-vv`** increases verbosity · **`--reason`** explains why each port was classified. Chain fast discovery from [masscan](#/tool/masscan) into detailed `-sV` scans here.
