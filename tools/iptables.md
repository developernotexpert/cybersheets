---
name: iptables
category: Firewall & Hardening
description: Classic Linux netfilter firewall — chains, rules and NAT.
tags: [iptables, firewall, netfilter, nat, linux, packet-filter]
---

# iptables

**iptables** configures the Linux netfilter firewall through tables and chains. It's being replaced by [nftables](#/tool/nftables), but it's still everywhere, and understanding its chains explains how Linux filters packets.

> `apt install iptables` · **requires root** · rules are not persistent by default (see below)

## Model

- **Tables:** `filter` (default, allow/deny), `nat` (address translation), `mangle`, `raw`.
- **Chains (filter):** `INPUT` (to this host), `OUTPUT` (from this host), `FORWARD` (routed through).
- **Targets:** `ACCEPT`, `DROP`, `REJECT`, `LOG`, or a custom chain.

## Inspect

```bash
iptables -L -n -v                 # list filter rules (numeric, with counters)
iptables -L INPUT -n --line-numbers
iptables -t nat -L -n -v          # NAT table
iptables -S                        # dump rules as commands
```

## Basic filtering

```bash
iptables -A INPUT -p tcp --dport 22 -j ACCEPT        # allow SSH
iptables -A INPUT -p tcp --dport 80 -j ACCEPT        # allow HTTP
iptables -A INPUT -i lo -j ACCEPT                     # allow loopback
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT
iptables -A INPUT -s 10.0.0.5 -j DROP                 # block a host
iptables -A INPUT -p tcp --dport 3306 -s 10.0.0.0/24 -j ACCEPT   # scoped allow
```

## Default-deny policy (careful over SSH)

```bash
iptables -P INPUT DROP           # drop everything not explicitly allowed
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT
# make sure ESTABLISHED + SSH rules exist BEFORE setting policy to DROP
```

## Edit and delete

```bash
iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT     # insert at position 1
iptables -D INPUT -p tcp --dport 80 -j ACCEPT         # delete a matching rule
iptables -D INPUT 3                                    # delete by line number
iptables -F                                            # flush all (blank slate)
iptables -F INPUT                                      # flush one chain
```

## NAT / port forwarding

```bash
# Masquerade a LAN out through eth0 (share a connection)
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
# Forward external :8080 to an internal host
iptables -t nat -A PREROUTING -p tcp --dport 8080 -j DNAT --to 10.0.0.5:80
```

## Persistence

```bash
iptables-save > /etc/iptables/rules.v4      # dump current rules
iptables-restore < /etc/iptables/rules.v4   # reload
apt install iptables-persistent              # auto-restore on boot (Debian/Ubuntu)
```

> Rules are ordered — first match wins, so put specific ACCEPTs before broad DROPs and keep an ESTABLISHED rule near the top. When setting `-P INPUT DROP` remotely, allow SSH first or you'll lock yourself out. On modern distros, [firewall-cmd](#/tool/firewall-cmd) (firewalld) or [nftables](#/tool/nftables) are the higher-level options.
