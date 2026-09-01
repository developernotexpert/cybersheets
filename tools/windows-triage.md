---
name: Windows Live Triage
category: Forensics & Reverse Engineering
description: Windows live triage — system info, users, network, services, policies, autoruns, logs and file information.
tags: [windows, triage, forensics, incident-response, BTFM]
---

# Windows Live Triage

Live triage commands for Windows incident response.

## System information

```batch
echo %DATE% %TIME%
hostname
systeminfo
systeminfo | findstr /B /C:"OS Name" /C:"OS Version"
wmic csproduct get name
wmic bios get serialnumber
wmic computersystem list brief
psinfo -accepteula -s -h -d
```

## User information

```batch
whoami
net users
net localgroup administrators
net group administrators
wmic rdtoggle list
wmic useraccount list
wmic group list
wmic netlogin get name,lastlogon,badpasswordcount
doskey /history > history.txt
```

## Network information

```batch
netstat -e
netstat -naob
netstat -nr
netstat -vb
nbtstat -s
route print
arp -a
ipconfig /displaydns
netsh winhttp show proxy
ipconfig /allcompartments /all
netsh wlan show interfaces
type %SYSTEMROOT%\system32\drivers\etc\hosts
wmic nicconfig get descriptions,IPaddress,MACaddress
wmic netuse get name,username,connectiontype,localname
```

## Service information

```batch
at
tasklist
tasklist /SVC
tasklist /SVC /fi "imagename eq svchost.exe"
schtasks
net start
sc query
wmic service list brief | findstr "Running"
wmic service list config
wmic process list brief
wmic process list status
wmic process list memory
wmic job list brief
```

```powershell
Get-Service | Where-Object { $_.Status -eq "running" }
Get-Process | select modules | Foreach-Object{$_.modules}
```

## Autorun information

```batch
wmic startup list full
wmic ntdomain list brief
autorunsc -accepteula -m
autorunsc.exe -accepteula -a -c -i -e -f -l -m -v
```

Key registry autoruns:

```batch
reg query HKCR\Comfile\Shell\Open\Command
reg query HKCU\Software\Microsoft\Windows\CurrentVersion\Run
reg query HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce
reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Run
reg query HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce
reg query HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run
```

## Policy and patch information

```batch
set
gpresult /r
gpresult /z > output.txt
gpresult /H report.html /F
wmic qfe
reg query "HKLM\Software\Microsoft\Windows\Current Version\Group Policy\AppMgmt"
```

> Source: BTFM — Blue Team Field Manual
