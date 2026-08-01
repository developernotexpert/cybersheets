---
name: Scapy
category: Traffic Analysis & Wireless
description: Interactive Python packet crafting, sniffing, spoofing and network scanning.
tags: [scapy, packet, crafting, sniffing, spoofing, python, pcap]
---

# Scapy

**Scapy** is a Python-based interactive packet manipulation tool. You can craft, send, sniff, dissect and forge packets at any layer — from Ethernet frames to application data. It replaces a dozen tools (hping, nmap SYN scan, arping, tcpdump filters, etc.) with a single scriptable interface.

> `pip install scapy` · [scapy.net](https://scapy.net/) · run with `sudo` for raw sockets

## Interactive mode

```bash
sudo scapy                  # interactive REPL
```

## Packet building basics

Scapy stacks layers with the `/` operator:

```python
from scapy.all import *

# Simple ICMP ping
pkt = IP(dst="10.0.0.5") / ICMP()

# TCP SYN to port 80
pkt = IP(dst="10.0.0.5") / TCP(dport=80, flags="S")

# UDP with payload
pkt = IP(dst="10.0.0.5") / UDP(dport=53) / DNS(rd=1, qd=DNSQR(qname="target.com"))

# Ethernet frame (layer 2)
pkt = Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst="10.0.0.0/24")
```

## Inspecting packets

```python
pkt.show()                   # detailed field dump
pkt.summary()                # one-line summary
ls(IP)                       # list all IP fields
hexdump(pkt)                 # raw hex view

pkt[IP].src                  # access specific fields
pkt[TCP].dport
pkt.haslayer(TCP)            # check if layer exists
```

## Sending packets

| Function | Layer | Response |
|----------|-------|----------|
| `send(pkt)` | 3 (IP) | Fire and forget |
| `sendp(pkt)` | 2 (Ether) | Fire and forget |
| `sr(pkt)` | 3 | Send and receive (returns ans, unans) |
| `sr1(pkt)` | 3 | Send and receive one reply |
| `srp(pkt)` | 2 | Send/receive at layer 2 |
| `srp1(pkt)` | 2 | Send/receive one reply at layer 2 |

```python
# Send ICMP and wait for reply
resp = sr1(IP(dst="10.0.0.5") / ICMP(), timeout=2)
resp.show()

# Send at layer 2 (requires iface)
ans, unans = srp(Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst="10.0.0.0/24"), timeout=2, iface="eth0")
```

## Sniffing

```python
# Capture 10 packets
pkts = sniff(count=10)
pkts.summary()

# Filter by BPF (same syntax as tcpdump)
pkts = sniff(filter="tcp port 80", count=20)

# Sniff on specific interface
pkts = sniff(iface="eth0", filter="icmp", count=5)

# Live callback per packet
sniff(filter="tcp", prn=lambda p: p.summary(), count=0)

# Stop condition
sniff(stop_filter=lambda p: p.haslayer(TCP) and p[TCP].flags == "SA")
```

## Reading and writing pcaps

```python
# Write captured packets
wrpcap("capture.pcap", pkts)

# Read pcap file
pkts = rdpcap("capture.pcap")
pkts.summary()

# Filter a pcap
http_pkts = [p for p in pkts if p.haslayer(TCP) and p[TCP].dport == 80]
```

## ARP scan (host discovery)

```python
ans, _ = srp(Ether(dst="ff:ff:ff:ff:ff:ff") / ARP(pdst="10.0.0.0/24"), timeout=2, verbose=0)

for snd, rcv in ans:
    print(f"{rcv[ARP].psrc} → {rcv[Ether].src}")
```

## TCP SYN scan (port scan)

```python
ans, _ = sr(IP(dst="10.0.0.5") / TCP(dport=[22,80,443,8080], flags="S"), timeout=2, verbose=0)

for snd, rcv in ans:
    if rcv[TCP].flags == "SA":     # SYN-ACK = open
        print(f"[+] Port {snd[TCP].dport} open")
```

## Traceroute

```python
ans, _ = sr(IP(dst="8.8.8.8", ttl=(1,20)) / ICMP(), timeout=2, verbose=0)

for snd, rcv in ans:
    print(f"TTL {snd[IP].ttl:2d} → {rcv[IP].src}")
```

## DNS query

```python
ans = sr1(IP(dst="8.8.8.8") / UDP(dport=53) / DNS(rd=1, qd=DNSQR(qname="target.com")), verbose=0)

for i in range(ans[DNS].ancount):
    print(ans[DNSRR][i].rdata)
```

## ARP spoofing (MITM)

```python
# Tell victim that attacker is the gateway
send(ARP(op=2, pdst="10.0.0.100", hwdst="VICTIM_MAC", psrc="10.0.0.1"), loop=1, inter=2)
```

> Enable IP forwarding first: `echo 1 > /proc/sys/net/ipv4/ip_forward`

## ICMP redirect / crafted packets

```python
# Ping of death (fragmented oversized ICMP)
send(fragment(IP(dst="10.0.0.5") / ICMP() / (b"X" * 60000)))

# Christmas tree scan (all TCP flags set)
sr(IP(dst="10.0.0.5") / TCP(dport=80, flags="FPU"), timeout=2)
```

## Useful one-liners

```python
# Arping a subnet
arping("10.0.0.0/24")

# Traceroute
traceroute(["target.com"], maxttl=20)

# Show all supported protocols
ls()

# Show fields for a protocol
ls(TCP)

# Fuzz a packet (random field values)
send(IP(dst="10.0.0.5") / fuzz(TCP(dport=80)))
```

## Scapy in scripts

```python
#!/usr/bin/env python3
from scapy.all import *
import sys

conf.verb = 0              # suppress scapy output

target = sys.argv[1]
ports = [21, 22, 80, 443, 445, 3389, 8080]

ans, _ = sr(IP(dst=target) / TCP(dport=ports, flags="S"), timeout=3)

for snd, rcv in ans:
    if rcv[TCP].flags == "SA":
        print(f"[+] {target}:{snd[TCP].dport} open")
    send(IP(dst=target) / TCP(dport=snd[TCP].dport, flags="R"), verbose=0)  # RST cleanup
```

> Scapy needs root / sudo for raw sockets. For high-level [Python](#/tool/python-cybersec) HTTP and SSH work, standard libraries are faster. For large-scale capture, [tcpdump](#/tool/tcpdump) / [tshark](#/tool/tshark) are more efficient — Scapy shines at crafting, prototyping and surgical packet manipulation.
