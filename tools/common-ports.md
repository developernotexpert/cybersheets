---
name: Common Ports
category: Cheatsheets & Playbooks
description: Common TCP/UDP ports, healthcare protocols, SCADA ports and TTL fingerprinting reference.
tags: [ports, tcp, udp, scada, healthcare, networking, RTFM]
---

# Common Ports

Quick reference for common service ports, healthcare protocols, SCADA ports and TTL fingerprinting.

## Common ports

| Port | Service |
|------|---------|
| 20 | FTP (Data) |
| 21 | FTP (Control) |
| 22 | SSH/SCP |
| 23 | Telnet |
| 25 | SMTP |
| 49 | TACACS |
| 53 | DNS |
| 67-68 | DHCP/BOOTP |
| 69 | TFTP (UDP) |
| 80 | HTTP |
| 88 | Kerberos |
| 110 | POP3 |
| 111 | RPC |
| 123 | NTP (UDP) |
| 135 | Windows RPC |
| 137-138 | NetBIOS |
| 139 | SMB |
| 143 | IMAP4 |
| 161-162 | SNMP (UDP) |
| 179 | BGP |
| 389 | LDAP |
| 443 | HTTPS |
| 445 | SMB |
| 500 | ISAKMP (UDP) |
| 514 | Syslog |
| 587 | SMTP |
| 1433-1434 | MS-SQL |
| 1521 | Oracle |
| 2049 | NFS |
| 3306 | MySQL |
| 3389 | RDP |
| 5432 | Postgres |
| 5900 | VNC |
| 6665-6669 | IRC |
| 9001 | Tor |

## SCADA ports

| Port | Service |
|------|---------|
| 102 | ICCP |
| 502 | Modbus TCP |
| 1089-1091 | Foundation Fieldbus HSE |
| 2222 | Ethernet/IP (UDP) |
| 4000 | ROC Plus |
| 4840 | OPC UA Discovery |
| 20000 | DNP3 |
| 34962-34964 | PROFINET |
| 44818 | Ethernet/IP |
| 47808 | BACnet/IP (UDP) |

## TTL fingerprinting

| TTL | OS |
|-----|-----|
| 128 | Windows |
| 64 | Linux |
| 255 | Network / Solaris |

> Source: RTFM — Red Team Field Manual v2
