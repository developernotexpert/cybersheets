---
name: UFW
category: Firewall & Hardening
description: Uncomplicated Firewall — simple front-end for host rules on Debian/Ubuntu.
tags: [ufw, firewall, ubuntu, debian, iptables, host]
---

# UFW

**UFW** (Uncomplicated Firewall) is a simple front-end to [iptables](#/tool/iptables)/[nftables](#/tool/nftables), aimed at single hosts. Good default for Debian/Ubuntu servers when you don't need the zone model of firewalld.

> `apt install ufw` · **requires root** · disabled by default until you enable it

## Enable with a safe baseline

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH            # or: ufw allow 22/tcp  — do this BEFORE enabling remotely
ufw enable
ufw status verbose
```

## Allow / deny

```bash
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5000:5100/tcp                 # port range
ufw allow from 10.0.0.0/24              # from a subnet (any port)
ufw allow from 10.0.0.5 to any port 3306 proto tcp
ufw deny 23/tcp                          # block telnet
ufw limit ssh                            # rate-limit (brute-force mitigation)
```

## Application profiles

```bash
ufw app list                             # known app profiles
ufw allow "Nginx Full"
ufw app info OpenSSH
```

## Inspect / manage rules

```bash
ufw status numbered                      # list with rule numbers
ufw delete 3                             # delete rule #3
ufw delete allow 80/tcp                  # delete by spec
ufw reload
ufw disable
ufw reset                                # wipe all rules (start over)
```

## Logging

```bash
ufw logging on
ufw logging medium                       # off | low | medium | high | full
tail -f /var/log/ufw.log
```

> Add the SSH rule (`ufw allow OpenSSH`) before `ufw enable` on a remote box, or the default-deny will cut your session. `ufw limit ssh` is an easy win against SSH brute-force. For zone-based management use [firewall-cmd](#/tool/firewall-cmd); for full control drop to [nftables](#/tool/nftables)/[iptables](#/tool/iptables).
