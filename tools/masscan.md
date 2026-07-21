---
name: Masscan
category: Port Scanning
description: Ultra-fast asynchronous port scanner (the whole internet in minutes).
tags: [scan, ports, network, fast, asynchronous]
---

# Masscan

**Masscan** is an asynchronous TCP port scanner that can sweep huge ranges (up to the entire internet) in minutes. Syntax similar to [nmap](#/tool/nmap), but orders of magnitude faster — it trades depth for speed.

> `apt install masscan` · [github.com/robertdavidgraham/masscan](https://github.com/robertdavidgraham/masscan) · **requires root**

## Syntax

```bash
masscan <target> -p<ports> --rate <packets/s>
```

```bash
sudo masscan 10.0.0.0/8 -p80,443 --rate 10000
sudo masscan 192.168.0.0/16 -p0-65535 --rate 1000
sudo masscan 10.0.0.5 -p80,443,22 --banners        # try to grab banners
```

## Main options

| Option | Purpose |
|--------|---------|
| `-p` | Ports (`-p80,443`, `-p0-65535`, `-pU:53` for UDP) |
| `--rate` | Packets per second (the "throttle") |
| IP/CIDR | Targets |
| `-iL targets.txt` | Read targets from a file |
| `--excludefile` | Ranges to exclude (respect it!) |
| `--banners` | Capture service banners |
| `-oL` / `-oX` / `-oJ` | List / XML / JSON output |
| `--open` | Open ports only |

## Save and reuse config

```bash
sudo masscan 10.0.0.0/16 -p1-65535 --rate 5000 -oJ scan.json
sudo masscan --echo > scan.conf          # generate a config file
sudo masscan -c scan.conf                 # run from it
```

## Typical flow: masscan + nmap

```bash
# 1) masscan quickly finds what's open
sudo masscan 10.0.0.0/24 -p1-65535 --rate 10000 -oL ports.txt

# 2) nmap details only the found hosts/ports
awk '/open/{print $4}' ports.txt | sort -u > hosts.txt
nmap -sV -sC -iL hosts.txt -oA detailed
```

> **Mind `--rate`:** high values can take down networks and trip alarms. Start low. Never scan ranges outside your scope — use `--excludefile` to protect sensitive IPs.
