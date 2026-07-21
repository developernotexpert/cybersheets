---
name: enum4linux-ng
category: Service Enumeration
description: Enumerate information from Windows and Samba hosts over SMB.
tags: [smb, windows, samba, enum, netbios, rpc]
---

# enum4linux-ng

**enum4linux-ng** is the modern (Python) rewrite of the classic enum4linux. It enumerates information from Windows and Samba hosts over SMB/RPC: users, groups, shares, password policy, sessions and SIDs.

> `pip install enum4linux-ng` · [github.com/cddmp/enum4linux-ng](https://github.com/cddmp/enum4linux-ng)

## Usage

```bash
enum4linux-ng 10.0.0.5                     # full enumeration
enum4linux-ng -A 10.0.0.5                   # everything (equivalent to -U -G -S -P -o -n -i)
enum4linux-ng -A -oJ out 10.0.0.5           # export JSON/YAML
```

## Main options

| Option | Enumerates |
|--------|-----------|
| `-U` | Users |
| `-G` | Groups and members |
| `-S` | Shares |
| `-P` | Password policy |
| `-o` | OS info |
| `-n` | NetBIOS/nmblookup |
| `-i` | Printers |
| `-A` | All of the above |

## With credentials

```bash
enum4linux-ng -A -u user -p pass 10.0.0.5
enum4linux-ng -A -u '' -p '' 10.0.0.5           # null session
```

## What to look for in the output

- **Null session allowed** → enumeration without credentials (notable finding).
- **User list** → targets for [hydra](#/tool/hydra)/password spraying.
- **Password policy** → minimum length, lockout (guides brute-force).
- **Readable/writable shares** → access them with [smbclient](#/tool/smbclient).

> A read/enumeration tool. For broader AD/SMB actions (spraying, execution, dumps) use [netexec](#/tool/netexec) and [impacket](#/tool/impacket).
