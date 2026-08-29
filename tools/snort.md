---
name: Snort IDS
category: Traffic Analysis & Wireless
description: Snort IDS — configuration testing, packet replay, logging, rule creation and rule syntax reference.
tags: [snort, ids, intrusion-detection, rules, BTFM]
---

# Snort IDS

Snort intrusion detection system — usage and rule writing.

## Basic usage

```bash
snort -T -c /path/to/snort.conf          # Test config
snort -dv -r <LOG>.log                    # Replay with payload
snort -dvr packet.log icmp               # Replay matching icmp
snort -K ascii -l <LOG_DIR>              # Log in ASCII
snort -l <LOG_DIR>                       # Log in binary
snort -q -A console -i eth0 -c /etc/snort/snort.conf  # Console output
```

## Single rule testing

```bash
echo 'alert any any <RULE>' > one.rule
snort -T -c one.rule
mkdir ./logs
snort -vd -c one.rule -r <PCAP>.pcap -A console -l logs
```

## Snort rule syntax

```
[action] [protocol] [src_ip] [src_port] -> [dst_ip] [dst_port] ([options])
```

### Actions

| Action | Description |
|--------|-------------|
| `alert` | Generate alert and log |
| `log` | Log packet |
| `pass` | Ignore packet |
| `drop` | Block and log (inline) |
| `reject` | Block, log, and TCP RST |

### Common options

| Option | Description |
|--------|-------------|
| `msg` | Alert message |
| `sid` | Rule ID |
| `rev` | Revision number |
| `content` | Payload match |
| `nocase` | Case insensitive |
| `depth` | Search depth |
| `offset` | Start offset |
| `flags` | TCP flags (S,A,F,R,P,U) |
| `flow` | Traffic direction |
| `threshold` | Rate limiting |
| `classtype` | Attack category |

### Example rules

```
# Detect NMAP FIN scan
alert tcp any any -> $HOME_NET any (msg:"NMAP FIN Scan"; flags:F; sid:10001; rev:1;)

# Detect SYN/FIN scan
alert tcp any any -> $HOME_NET any (msg:"SYN FIN Scan"; flags:SF; sid:10002; rev:1;)

# Detect NULL scan
alert tcp any any -> $HOME_NET any (msg:"NULL Scan"; flags:0; sid:10003; rev:1;)

# Detect XMAS scan
alert tcp any any -> $HOME_NET any (msg:"XMAS Scan"; flags:FPU; sid:10004; rev:1;)

# Detect ping
alert icmp any any -> $HOME_NET any (msg:"ICMP Ping"; itype:8; sid:10005; rev:1;)
```

> Source: BTFM — Blue Team Field Manual
