---
name: Solaris Commands
category: Cheatsheets & Playbooks
description: Solaris OS commands — file system, interfaces, services, process management and packet capture.
tags: [solaris, unix, system-administration, RTFM]
---

# Solaris Commands

Solaris file system and system administration reference.

## File system

| Path | Description |
|------|-------------|
| `/etc/vfstab` | Mount table |
| `/var/adm/authlog` | Login attempt log |
| `/etc/default/*` | Default settings |
| `/etc/system` | Kernel modules & config |
| `/var/adm/messages` | System messages/errors |
| `/etc/auto_*` | Automounter config |
| `/etc/inet/ipnodes` | IPv4/IPv6 host file |

## Commands

```bash
ifconfig -a                    # List interfaces
netstat -in                    # List routes
ifconfig <IFACE> dhcp start    # Start DHCP
ifconfig <IFACE> <IP> + <MASK> # Set IP
route add default <IP>         # Set gateway
logins -p                      # Users without passwords
svcs -a                        # All services with status
prstat -a                      # List processes
svcadm enable ssh              # Start SSH
inetadm -e telnet              # Enable telnet
prtconf | grep Memory          # Physical memory
shutdown -i6 g0 -y             # Restart
dfmounts                       # NFS clients
smc                            # Management GUI
snoop -d <IFACE> -c <COUNT> -o <OUT>  # Packet capture
```

> Source: RTFM — Red Team Field Manual v2
