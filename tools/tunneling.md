---
name: Tunneling Techniques
category: Connection & Pivoting
description: Tunneling with FPipe, Socat and STunnel for port forwarding and SSL-encapsulated connections.
tags: [tunneling, fpipe, socat, stunnel, port-forward, RTFM]
---

# Tunneling Techniques

Port forwarding and encrypted tunneling with FPipe, Socat and STunnel.

## FPipe

```batch
fpipe.exe -l 1234 -r 80 2.2.2.2
```

Listen on port 1234, forward to 2.2.2.2:80.

## Socat

```bash
socat TCP-LISTEN:1234,fork TCP:2.2.2.2:80
```

Listen on 1234, forward to 2.2.2.2:80.

### IPv6 through IPv4 tools

```bash
socat TCP-LISTEN:<PORT>,reuseaddr,fork TCP6:[<IPv6>]:<PORT>
```

## STunnel (SSL encapsulated Netcat)

### Listening server

```bash
openssl req -new -x509 -days 365 -nodes -out stunnel.pem -keyout stunnel.pem
```

Edit `/stunnel.conf`:
```ini
client = no
[netcat server]
accept = 4444
connect = 7777
cert = /etc/stunnel/stunnel.pem
```

```bash
sudo stunnel ./stunnel.conf
nc -vlp 7777
```

### Attacker

Edit `/stunnel.conf`:
```ini
client = yes
[netcat client]
accept = 5555
connect = <LISTENING_IP>:4444
```

```bash
sudo stunnel ./stunnel.conf
nc -nv 127.0.0.1 5555
```

> Source: RTFM — Red Team Field Manual v2. See also [socat](#/tool/socat) and [chisel](#/tool/chisel).
