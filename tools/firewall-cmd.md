---
name: firewall-cmd (firewalld)
category: Firewall & Hardening
description: Zone-based firewall management on RHEL/Fedora and beyond.
tags: [firewalld, firewall-cmd, zones, rhel, fedora, linux]
---

# firewall-cmd (firewalld)

**firewalld** is a higher-level firewall manager (front-end to [nftables](#/tool/nftables)/[iptables](#/tool/iptables)) built around **zones** — named trust levels you attach interfaces and rules to. `firewall-cmd` is its CLI. Default on RHEL, CentOS, Fedora and available elsewhere.

> `apt install firewalld` / `dnf install firewalld` · **requires root** · `systemctl enable --now firewalld`

## Runtime vs permanent

Changes are **runtime** (lost on reload) unless you add `--permanent`. The usual pattern: apply permanently, then reload.

```bash
firewall-cmd --state                     # is firewalld running?
firewall-cmd --reload                     # apply permanent config now
firewall-cmd --runtime-to-permanent       # persist current runtime rules
```

## Zones

```bash
firewall-cmd --get-default-zone
firewall-cmd --get-active-zones
firewall-cmd --list-all                   # everything in the default zone
firewall-cmd --zone=public --list-all
firewall-cmd --set-default-zone=drop
firewall-cmd --zone=internal --change-interface=eth1 --permanent
```

Common zones: `drop`, `block`, `public`, `internal`, `trusted`.

## Allow services and ports

```bash
firewall-cmd --add-service=ssh --permanent
firewall-cmd --add-service=https --permanent
firewall-cmd --add-port=8080/tcp --permanent
firewall-cmd --zone=public --add-port=5000-5100/tcp --permanent
firewall-cmd --get-services                 # list known service names
firewall-cmd --reload
```

## Remove / query

```bash
firewall-cmd --remove-service=http --permanent
firewall-cmd --remove-port=8080/tcp --permanent
firewall-cmd --query-service=ssh
firewall-cmd --list-services
firewall-cmd --list-ports
```

## Rich rules (fine-grained)

```bash
# Allow SSH only from one subnet
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" \
  source address="10.0.0.0/24" service name="ssh" accept'

# Block a host
firewall-cmd --permanent --add-rich-rule='rule family="ipv4" \
  source address="10.0.0.66" drop'

# Rate-limit and log
firewall-cmd --permanent --add-rich-rule='rule service name="http" \
  log prefix="HTTP " level="info" limit value="3/m" accept'
firewall-cmd --reload
```

## Port forwarding & masquerade

```bash
firewall-cmd --zone=public --add-masquerade --permanent
firewall-cmd --add-forward-port=port=8080:proto=tcp:toport=80:toaddr=10.0.0.5 --permanent
firewall-cmd --reload
```

## Panic mode

```bash
firewall-cmd --panic-on        # drop ALL traffic (incident response)
firewall-cmd --panic-off
```

> Almost every command needs `--permanent` + `--reload` to survive a restart, or use `--runtime-to-permanent` after testing live. Zones are the mental model: assign interfaces to a zone, then open services/ports in that zone. Lower-level equivalents: [nftables](#/tool/nftables), [iptables](#/tool/iptables); simpler front-end: [ufw](#/tool/ufw).
