---
name: Linux Scripting
category: Cheatsheets & Playbooks
description: Bash scripting recipes — ping sweeps, reverse DNS, fork bombs, IP banning and file comparison.
tags: [linux, bash, scripting, ping-sweep, RTFM]
---

# Linux Scripting

Bash scripting recipes for network operations.

## Ping sweep

```bash
for x in {1..254..1};do ping -c 1 1.1.1.$x | grep "64 b" | cut -d" " -f4 >> ips.txt; done
```

## Reverse DNS lookup

```bash
#!/bin/bash
echo "Enter Class C Range: i.e. 192.168.3"
read range
for ip in {1..254..1};do
  host $range.$ip | grep "name pointer" | cut -d" " -f5
done
```

```bash
for ip in {1..254..1}; do dig -x 1.1.1.$ip | grep $ip >> dns.txt; done;
```

## Fork bomb

```bash
:(){ :|: & };:
```

## IP banning script

```bash
#!/bin/sh
i=2
while [[ $i -le 253 ]]
do
  if [[ $i -ne 20 && $i -ne 21 && $i -ne 22 ]]; then
    echo "BANNED: arp -s 192.168.1.$i"
    arp -s 192.168.1.$i 00:00:00:00:00:0a
  else
    echo "IP NOT BANNED: 192.168.1.$i"
  fi
  i=`expr $i +1`
done
```

## Compare two files for similar lines

```bash
for line in $(cat <FILE_A>); do grep -i $line <FILE_B>; done;
```

> Source: RTFM — Red Team Field Manual v2
