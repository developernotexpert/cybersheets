---
name: snmpwalk
category: Service Enumeration
description: Walk and extract the MIB tree from SNMP-enabled devices.
tags: [snmp, mib, enum, network, oid]
---

# snmpwalk

**snmpwalk** queries and walks the MIB tree of devices running SNMP (routers, switches, printers, servers). Misconfigured SNMP with default community strings (`public`/`private`) can leak users, processes, network interfaces, installed software and more.

> part of `snmp` / `snmp-utils` · `apt install snmp` · try communities: `public`, `private`, `manager`

## Basic walk

```bash
snmpwalk -v2c -c public 10.0.0.5                 # full walk (SNMP v2c)
snmpwalk -v1  -c public 10.0.0.5                 # SNMP v1
snmpwalk -v2c -c public 10.0.0.5 1.3.6.1.2.1.1   # specific OID subtree (system)
```

## Useful OIDs

| OID | What it reveals |
|-----|-----------------|
| `1.3.6.1.2.1.1.5` | Hostname |
| `1.3.6.1.2.1.25.4.2.1.2` | Running processes |
| `1.3.6.1.2.1.25.6.3.1.2` | Installed software |
| `1.3.6.1.4.1.77.1.2.25` | Windows user accounts |
| `1.3.6.1.2.1.25.4.2.1.4` | Process paths |
| `1.3.6.1.2.1.6.13.1.3` | Local TCP ports |
| `1.3.6.1.2.1.4.20` | Network interfaces / IPs |

```bash
snmpwalk -v2c -c public 10.0.0.5 1.3.6.1.4.1.77.1.2.25   # Windows users
snmpwalk -v2c -c public 10.0.0.5 1.3.6.1.2.1.25.4.2.1.2  # processes
```

## SNMPv3 (authenticated)

```bash
snmpwalk -v3 -l authPriv -u user -a SHA -A authpass -x AES -X privpass 10.0.0.5
```

## Finding valid community strings

```bash
# brute-force communities with onesixtyone
onesixtyone -c communities.txt 10.0.0.5
# or nmap
nmap -sU -p161 --script snmp-brute 10.0.0.5
```

> SNMP runs on **UDP/161**. Default/guessable community strings are a common finding. Related tools: `snmp-check`, `onesixtyone`, nmap `snmp-*` scripts.
