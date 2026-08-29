---
name: PCAP Tools
category: Traffic Analysis & Wireless
description: PCAP manipulation tools — editcap for splitting and mergecap for combining capture files.
tags: [pcap, editcap, mergecap, wireshark, BTFM]
---

# PCAP Tools

Tools for splitting and merging packet capture files.

## editcap

```bash
# Split into 1000 packets each
editcap -F pcap -c 1000 original.pcap out_split.pcap

# Split into 1 hour chunks
editcap -F pcap -t+3600 original.pcap out_split.pcap
```

## mergecap

```bash
mergecap -w merged.pcap cap1.pcap cap2.pcap cap3.pcap
```

> Source: BTFM — Blue Team Field Manual. See also [tshark](#/tool/tshark) and [wireshark](#/tool/wireshark).
