---
name: SSH (OpenSSH)
category: Connection & Pivoting
description: Remote shell plus port forwarding and pivoting (-L, -R, -D, ProxyJump).
tags: [ssh, tunnel, portforward, socks, pivot, proxyjump, keys]
---

# SSH (OpenSSH)

**SSH** is the standard for remote shells, file transfer and — the reason it's here — tunneling and pivoting. Its local/remote/dynamic forwarders turn a single shell into a route through a network.

> ships with OpenSSH · `ssh`, `scp`, `sftp`, `ssh-keygen`, `ssh-copy-id`

## Connect & keys

```bash
ssh user@host
ssh -p 2222 user@host                      # non-default port
ssh -i ~/.ssh/id_ed25519 user@host          # specific key
ssh-keygen -t ed25519 -C "me@example"       # generate a key pair
ssh-copy-id user@host                        # install your pubkey on the host
ssh -v user@host                             # verbose (debug auth)
```

## Config file (`~/.ssh/config`)

```text
Host jump
    HostName 10.0.0.1
    User admin
    IdentityFile ~/.ssh/id_ed25519

Host internal
    HostName 10.10.10.5
    ProxyJump jump          # hop through "jump" automatically
```

Then just `ssh internal`.

## Local forward (-L): reach a remote service locally

```bash
# Access the target's internal 10.10.10.9:3306 on your localhost:3306
ssh -L 3306:10.10.10.9:3306 user@jump
# open a DB client against 127.0.0.1:3306
```

## Remote forward (-R): expose a local service on the remote

```bash
# Expose your local 8000 on the remote host's 8000 (e.g. serve a file to the target)
ssh -R 8000:localhost:8000 user@target
```

## Dynamic forward (-D): SOCKS proxy for pivoting

```bash
ssh -D 1080 user@jump                       # SOCKS5 proxy on 127.0.0.1:1080
proxychains nmap -sT 10.10.10.0/24          # set "socks5 127.0.0.1 1080" in proxychains
curl --socks5 127.0.0.1:1080 http://10.10.10.5
```

## Multi-hop pivot

```bash
ssh -J jumpuser@jump internaluser@10.10.10.5     # ProxyJump on the CLI
# chain forwards through the jump:
ssh -L 3389:10.10.10.9:3389 -J user@jump user@10.10.10.5
```

## Handy flags

```bash
ssh -N -f -L 3306:db:3306 user@jump     # -N no shell, -f background (tunnel only)
ssh -o StrictHostKeyChecking=no user@host
ssh -C user@host                          # compression
scp file.txt user@host:/tmp/              # copy up
scp user@host:/etc/passwd .               # copy down
sftp user@host                             # interactive file transfer
```

> Forwarders + a foothold host let you reach segmented networks without extra tooling. For tunnels through HTTP-only egress, use [chisel](#/tool/chisel); for TLS relays and PTY shells, [socat](#/tool/socat).
