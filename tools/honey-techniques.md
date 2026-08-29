---
name: Honey Techniques
category: Cheatsheets & Playbooks
description: Honeypot techniques — honey ports (Windows/Linux), honey hashes for detecting Mimikatz, and Labrea tarpit.
tags: [honeypot, honey-port, honey-hash, deception, defense, BTFM]
---

# Honey Techniques

Deception techniques to detect scanning and credential theft.

## Windows honey ports

Create a firewall rule to block anything connecting on port 3333:

```batch
echo @echo off for /L %%i in (1,1,1) do @for /f "tokens=3" %%j in ('netstat -nao ^| find "":3333 ^"') do @for /f "tokens=1 delims=:" %%k in ("%%j") do netsh advfirewall firewall add rule name="HONEY TOKEN RULE" dir=in remoteip=%%k localport=any protocol=TCP action=block >> honeypot.bat
honeypot.bat
```

## Windows honey hashes (detect Mimikatz)

```batch
:: Create fake credential in memory
runas /user:yourdomain.com\fakeadministratoraccount /netonly cmd.exe

:: Query remote access attempts
wevtutil qe System /q:"*[System[(EventID=20274)]]" /f:text /rd:true /c:1 /r:remotecomputer

:: Query failed logins
wevtutil qe Security /q:"*[System[(EventID=4624 or EventID=4625)]]" /f:text /rd:true /c:5 /r:remotecomputer

:: Loop with 30s pause
for /L %i in (1,0,2) do (wevtutil qe ...) & timeout 30
```

## Linux honey ports

```bash
while [ 1 ]; echo "started"; do IP='nc -v -l -p 2222 2>&1 |> /dev/null | grep from | cut -d[ -f 3 | cut -d] -f 1'; iptables -A INPUT -p tcp -s ${IP} -j DROP; done
```

## Labrea tarpit

```bash
apt-get install labrea
labrea -z -s -o -b -v -i eth0 2>&1 | tee -a log.txt
```

## Netcat listeners

```bash
nc -v -k -l 80
nc -v -k -l 443
nc -v -k -l 3389
```

> Source: BTFM — Blue Team Field Manual
