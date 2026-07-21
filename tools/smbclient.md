---
name: smbclient
category: Service Enumeration
description: FTP-like client to interact with SMB/CIFS file shares.
tags: [smb, cifs, share, windows, samba, files]
---

# smbclient

**smbclient** is a command-line client (FTP-style) for accessing SMB/CIFS shares on Windows and Samba servers: list, download and upload files.

> part of the `samba-client` package · `apt install smbclient`

## List shares

```bash
smbclient -L //10.0.0.5 -N                     # -N: no password (null session)
smbclient -L //10.0.0.5 -U user                # prompts for password
smbclient -L //10.0.0.5 -U 'DOMAIN\user%pass'
```

## Connect to a share

```bash
smbclient //10.0.0.5/Share -N
smbclient //10.0.0.5/C$ -U administrator        # administrative share
smbclient //10.0.0.5/share -U user%pass
```

## Commands inside the smb:\> prompt

```text
ls                      list files
cd folder               navigate
get file.txt            download
put local.txt           upload
mget *                  download several (prompt off to skip confirmations)
recurse ON; prompt OFF  prepare recursive download
mget *                  download everything recursively
!command                run a local command
exit
```

## Non-interactive (good for scripts)

```bash
smbclient //10.0.0.5/share -N -c 'ls'
smbclient //10.0.0.5/share -U u%p -c 'get report.xlsx'
# Recursive download, automated
smbclient //10.0.0.5/share -N -c 'recurse ON; prompt OFF; mget *'
```

## With Kerberos / hash (pass-the-hash)

```bash
smbclient //10.0.0.5/C$ -U administrator --pw-nt-hash -A hash.txt
smbclient //10.0.0.5/share -k -U user            # Kerberos ticket
```

> Null sessions (`-N`) that list or read shares are a good finding. To mount as a filesystem: `mount -t cifs`. To sweep many hosts at once, use [netexec](#/tool/netexec) `smb ... --shares`.
