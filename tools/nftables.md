---
name: nftables (nft)
category: Firewall & Hardening
description: Modern Linux firewall replacing iptables — one tool, unified syntax.
tags: [nftables, nft, firewall, netfilter, linux, packet-filter]
---

# nftables (nft)

**nftables** is the successor to [iptables](#/tool/iptables): one framework and one `nft` command for IPv4, IPv6, ARP and bridge filtering, with a cleaner rule syntax and atomic rule replacement. It's the default backend on most current distros.

> `apt install nftables` · **requires root** · service: `systemctl enable --now nftables`

## Model

- **Tables** hold **chains**; chains hold **rules**.
- A chain becomes a filter hook via `type filter hook input priority 0`.
- Families: `ip`, `ip6`, `inet` (both v4+v6), `arp`, `bridge`. Use `inet` for most host firewalls.

## Inspect

```bash
nft list ruleset                    # everything currently loaded
nft list tables
nft list table inet filter
nft -a list ruleset                  # include handles (needed to delete rules)
```

## Build a basic host firewall

```bash
nft add table inet filter
nft add chain inet filter input '{ type filter hook input priority 0; policy drop; }'
nft add rule inet filter input iif lo accept
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input tcp dport { 80, 443 } accept
nft add rule inet filter input ip saddr 10.0.0.0/24 tcp dport 3306 accept
```

## Add, delete, flush

```bash
nft -a list chain inet filter input          # find the rule "handle N"
nft delete rule inet filter input handle 7   # delete by handle
nft flush chain inet filter input             # empty one chain
nft flush ruleset                             # wipe everything
```

## Load from a file (the recommended way)

`/etc/nftables.conf`:

```text
#!/usr/sbin/nft -f
flush ruleset
table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;
        iif "lo" accept
        ct state established,related accept
        tcp dport { 22, 80, 443 } accept
        ip protocol icmp accept
    }
}
```

```bash
nft -f /etc/nftables.conf            # load atomically (all-or-nothing)
```

## NAT example

```text
table ip nat {
    chain postrouting {
        type nat hook postrouting priority 100;
        oif "eth0" masquerade
    }
}
```

## Migrating from iptables

```bash
iptables-save > rules.v4
iptables-restore-translate -f rules.v4 > ruleset.nft   # convert to nft syntax
nft -f ruleset.nft
```

> `policy drop` on the input chain makes it default-deny — add the loopback, ESTABLISHED and SSH rules before relying on it, especially over a remote session. Loading via `nft -f` is atomic, so a syntax error won't leave you half-firewalled. Higher-level front-ends: [firewall-cmd](#/tool/firewall-cmd) and [ufw](#/tool/ufw).
