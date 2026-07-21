---
name: tcpdump
category: Traffic Analysis & Wireless
description: CLI packet capture and analysis using pcap filters.
tags: [tcpdump, pcap, sniffer, packets, network, bpf]
---

# tcpdump

**tcpdump** captures and displays network packets from the command line using BPF (pcap) filters. It's installed almost everywhere and scriptable, which makes it the usual choice for quick captures on servers where a GUI isn't an option.

> `apt install tcpdump` · **requires root** · save captures for [Wireshark](#/tool/wireshark)/[tshark](#/tool/tshark)

## Capture basics

```bash
tcpdump -i eth0                     # capture on eth0
tcpdump -i any                       # all interfaces
tcpdump -D                            # list interfaces
tcpdump -c 100 -i eth0               # stop after 100 packets
tcpdump -n -i eth0                    # don't resolve names (-nn: no port names either)
```

## Read / write pcap

```bash
tcpdump -i eth0 -w capture.pcap       # write to file
tcpdump -r capture.pcap                # read from file
tcpdump -i eth0 -w cap.pcap -C 100 -W 5   # rotate: 100MB files, keep 5
```

## Output verbosity

```bash
tcpdump -i eth0 -v                     # verbose (-vv, -vvv for more)
tcpdump -i eth0 -A                      # print payload as ASCII
tcpdump -i eth0 -X                       # hex + ASCII
tcpdump -i eth0 -e                        # include link-layer (MAC) headers
tcpdump -i eth0 -tttt                     # human-readable timestamps
```

## Filters (BPF)

```bash
tcpdump host 10.0.0.5
tcpdump src 10.0.0.5 and dst 8.8.8.8
tcpdump net 192.168.0.0/24
tcpdump port 80
tcpdump portrange 1-1024
tcpdump tcp port 443
tcpdump udp port 53
tcpdump 'tcp port 80 and host 10.0.0.5'
tcpdump 'tcp[tcpflags] & tcp-syn != 0'      # SYN packets
tcpdump 'icmp'
```

## Handy recipes

```bash
# See DNS queries in real time
tcpdump -i eth0 -nn udp port 53

# Grab plaintext HTTP
tcpdump -i eth0 -A -s0 'tcp port 80'

# Detect a port scan (many SYNs)
tcpdump -nn 'tcp[tcpflags] == tcp-syn'

# Capture only headers (fast, small)
tcpdump -i eth0 -s 96 -w headers.pcap
```

> `-s0` captures full packets (default is full on modern versions). For deep analysis open the `.pcap` in [Wireshark](#/tool/wireshark) or filter it with [tshark](#/tool/tshark).
