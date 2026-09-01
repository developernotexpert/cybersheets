---
name: DDoS Defense
category: Cheatsheets & Playbooks
description: DDoS fingerprinting and defense — identifying attack types by packet characteristics and TTL analysis.
tags: [ddos, dos, defense, fingerprinting, BTFM]
---

# DDoS Defense

Fingerprinting and identifying DDoS attack types.

## Identify DDoS type

### SYN flood

```bash
netstat -n | awk '{print $6}' | sort | uniq -c | sort -rn | head
tcpdump -nn -c 1000 | awk '{print $3}' | cut -d. -f1-4 | sort -n | uniq -c | sort -nr
```

Look for: massive SYN_RECV state, many unique source IPs.

### UDP flood

```bash
netstat -su
tcpdump -nn udp -c 1000 | awk '{print $3}' | cut -d. -f1-4 | sort | uniq -c | sort -rn
```

### ICMP flood

```bash
tcpdump -nn icmp -c 1000 | awk '{print $3}' | cut -d. -f1-4 | sort | uniq -c | sort -rn
```

### HTTP flood

```bash
tail -f /var/log/apache2/access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head
```

## TTL analysis

Spoofed packets often have unusual TTL values. Legitimate traffic clusters around 64, 128, 255.

```bash
tcpdump -nn -c 1000 | awk '{print $6}' | sort | uniq -c | sort -rn
```

## Mitigation

```bash
# Rate limit with iptables
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP

# Block specific IP
iptables -A INPUT -s <ATTACKER_IP> -j DROP

# Limit ICMP
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP
```

> Source: BTFM — Blue Team Field Manual
