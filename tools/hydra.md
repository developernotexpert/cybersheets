---
name: Hydra
category: Passwords & Hashes
description: Fast online credential brute-forcer for 50+ protocols.
tags: [hydra, bruteforce, login, ssh, ftp, http, online]
---

# Hydra

**Hydra** (thc-hydra) is a fast **online** login brute-forcer supporting 50+ protocols: SSH, FTP, RDP, SMB, HTTP(S) forms, MySQL, and more. Unlike [hashcat](#/tool/hashcat)/[john](#/tool/john) (offline hashes), Hydra attacks live services.

> `apt install hydra` · [github.com/vanhauser-thc/thc-hydra](https://github.com/vanhauser-thc/thc-hydra)

## Syntax

```bash
hydra -l <user> -P <passlist> <target> <service>
hydra -L <userlist> -P <passlist> <target> <service>
```

- `-l` single user · `-L` user list · `-p` single pass · `-P` pass list
- `-t` tasks (parallel) · `-f` stop on first hit · `-V` verbose · `-s` port

## Common services

```bash
hydra -l root -P rockyou.txt ssh://10.0.0.5
hydra -L users.txt -P pass.txt ftp://10.0.0.5
hydra -l admin -P pass.txt rdp://10.0.0.5
hydra -l admin -P pass.txt 10.0.0.5 smb
hydra -l sa -P pass.txt 10.0.0.5 mysql
hydra -L users.txt -P pass.txt 10.0.0.5 -s 2222 ssh    # non-default port
```

## HTTP POST form (very common)

```bash
hydra -l admin -P rockyou.txt 10.0.0.5 http-post-form \
  "/login.php:user=^USER^&pass=^PASS^:F=Invalid credentials"
```

- `^USER^`/`^PASS^` are placeholders · `F=` failure string (or `S=` success string).

## HTTP basic / GET

```bash
hydra -l admin -P pass.txt 10.0.0.5 http-get /admin
hydra -L users.txt -P pass.txt -e nsr 10.0.0.5 http-get /admin
```

`-e nsr`: also try **n**ull, **s**ame-as-login, **r**eversed passwords.

## Tuning & safety

```bash
hydra ... -t 4                    # fewer tasks = gentler (avoid lockouts)
hydra ... -f                       # stop when a valid pair is found
hydra ... -o results.txt           # save hits
hydra ... -w 30                    # wait time
```

> Online brute-force is **loud** and can lock accounts — check the [enum4linux-ng](#/tool/enum4linux-ng) password policy first and keep `-t` low. [medusa](#/tool/medusa) is a parallel alternative; for AD, [NetExec](#/tool/netexec) spraying is often better.
