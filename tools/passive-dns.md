---
name: Passive DNS Monitoring
category: Traffic Analysis & Wireless
description: Passive DNS monitoring with dnstop — real-time DNS query analysis from interfaces and pcap files.
tags: [dns, monitoring, passive, dnstop, BTFM]
---

# Passive DNS Monitoring

Monitor DNS requests passively with dnstop.

## Setup

```bash
apt-get update
apt-get install dnstop
```

## Live monitoring

```bash
dnstop -l 3 <INTERFACE>
```

Press `2` to show query names.

## From pcap file

```bash
dnstop -l 3 <PCAP_FILE> | <OUTPUT_FILE>.txt
```

> Source: BTFM — Blue Team Field Manual
