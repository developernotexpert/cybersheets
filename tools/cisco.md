---
name: Cisco IOS
category: Cheatsheets & Playbooks
description: Cisco IOS command reference — enable mode, interface config, routing, ACLs and TFTP backup.
tags: [cisco, ios, networking, router, switch, RTFM]
---

# Cisco IOS

Cisco IOS command reference for routers and switches.

## Basic commands

```
> enable
# configure terminal
(config)# interface fa0/0
(config-if)# ip addr <IP> <MASK>
(config)# line vty 0 4
(config-line)# login
(config-line)# password <PASSWORD>
```

## Show commands

```
# show session
# show version
# dir file systems
# dir all-filesystems
# dir /all
# show running-config
# show startup-config
# show ip interface brief
# show interface <IFACE>
# show ip route
# show access-lists
# terminal length 0
```

## Configuration management

```
# copy running-config startup-config
# copy running-config tftp
```

> Source: RTFM — Red Team Field Manual v2
