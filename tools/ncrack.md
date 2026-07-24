---
name: Ncrack
category: Passwords & Hashes
description: High-speed network authentication cracker from the Nmap project.
tags: [ncrack, bruteforce, login, ssh, rdp, ftp, online, nmap]
---

# Ncrack

**Ncrack** is a high-speed network authentication cracking tool built by the Nmap project. It targets live services — SSH, RDP, FTP, Telnet, HTTP(S), POP3, SMB, VNC, SIP, Redis, PostgreSQL, MySQL, MSSQL, MongoDB, Cassandra, WordPress and more — with a modular design and timing engine borrowed from Nmap.

> `apt install ncrack` · [nmap.org/ncrack](https://nmap.org/ncrack/)

## Syntax

```bash
ncrack [options] {target and service specification}
```

Service can be appended as a URL scheme or via `-p`:

```bash
ncrack ssh://10.0.0.5
ncrack -p ssh 10.0.0.5
ncrack 10.0.0.5:22
```

## Core flags

| Flag | Purpose |
|------|---------|
| `-U <file>` | Username list |
| `-P <file>` | Password list |
| `--user <u>` | Single (or comma-separated) username(s) |
| `--pass <p>` | Single (or comma-separated) password(s) |
| `-iL <file>` | Read target hosts from file |
| `-p <service>` | Service/port to attack |
| `-f` | Quit after first credential found (per host) |
| `-v` | Increase verbosity (`-vv` for more) |
| `-oA <base>` | Save output in all major formats at once |
| `-oN <file>` | Normal text output |
| `-oX <file>` | XML output |

## Common attacks

### SSH

```bash
ncrack -U users.txt -P rockyou.txt ssh://10.0.0.5
ncrack --user root -P pass.txt 10.0.0.5:22
```

### RDP

```bash
ncrack -U users.txt -P pass.txt rdp://10.0.0.5
ncrack -v --user administrator -P pass.txt -p rdp 10.0.0.5 CL=1
```

> RDP is slow by nature — `CL=1` limits concurrency to avoid connection resets.

### FTP

```bash
ncrack --user admin -P pass.txt ftp://10.0.0.5
```

### HTTP(S)

```bash
ncrack --user admin -P pass.txt http://10.0.0.5
ncrack --user admin -P pass.txt https://10.0.0.5:8443 path=/admin
```

### SMB / VNC / MySQL / WordPress

```bash
ncrack -U users.txt -P pass.txt smb://10.0.0.5
ncrack -P pass.txt vnc://10.0.0.5
ncrack --user root -P pass.txt mysql://10.0.0.5
ncrack -U users.txt -P pass.txt wp://target.com
```

## Timing & performance

Ncrack borrows Nmap's timing templates (`-T0` to `-T5`):

```bash
ncrack -T4 -U users.txt -P pass.txt ssh://10.0.0.5      # aggressive
ncrack -T2 -U users.txt -P pass.txt rdp://10.0.0.5      # polite, avoid lockout
```

Fine-grained control via per-service options:

```bash
ncrack --user root -P pass.txt ssh://10.0.0.5 CL=10,to=8s,at=5
```

| Option | Meaning |
|--------|---------|
| `CL=n` | Max concurrent connections per host |
| `to=Ns` | Connection timeout |
| `at=N` | Authentication attempts per connection |
| `cd=Nms` | Connection delay between attempts |

## Resuming & output

```bash
ncrack --resume ncrack.restore               # resume a cancelled scan
ncrack -oA scan -U users.txt -P pass.txt ssh://10.0.0.5   # all formats
```

> Online brute-force is **loud** — check the password policy first and keep concurrency low to avoid lockouts. For AD credential spraying, [NetExec](#/tool/netexec) is usually more effective.
