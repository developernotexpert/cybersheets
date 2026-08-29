---
name: Windows Hardening
category: Firewall & Hardening
description: Windows hardening — disable services, firewall rules, AppLocker, IPsec, GPO policies and registry lockdown.
tags: [windows, hardening, firewall, applocker, ipsec, gpo, defense, BTFM]
---

# Windows Hardening

Defensive Windows configuration — services, firewall, AppLocker, IPsec, GPO and registry hardening.

## Disable/stop services

```batch
sc query
sc config "<SERVICE>" start= disabled
sc stop "<SERVICE>"
wmic service where name='<SERVICE>' call ChangeStartmode Disabled
```

## Host firewall

```batch
netsh advfirewall firewall show rule name=all
netsh advfirewall set currentprofile state on
netsh advfirewall set allprofile state on
netsh advfirewall firewall add rule name="Open Port 80" dir=in action=allow protocol=TCP localport=80
netsh advfirewall firewall add rule name="My App" dir=in action=allow program="C:\MyApp\MyApp.exe" enable=yes
netsh advfirewall firewall delete rule name="rule name" protocol=udp localport=500
netsh advfirewall set currentprofile logging <LOCATION>\<FILE>
netsh advfirewall set allprofile logging maxfilesize 4096
netsh advfirewall set allprofile logging droppedconnections enable
netsh advfirewall set allprofile logging allowedconnections enable
```

```powershell
Get-Content $env:systemroot\system32\LogFiles\Firewall\pfirewall.log
```

## Registry hardening (standalone systems)

```batch
:: Disallow running a specific exe
reg add "HKCU\...\Policies\Explorer" /v DisallowRun /t REG_DWORD /d 1 /f
reg add "HKCU\...\Policies\Explorer\DisallowRun" /v badfile.exe /t REG_SZ /d <BAD>.exe /f

:: Disable Remote Desktop
reg add "HKLM\...\Terminal Server" /v fDenyTSConnections /t REG_DWORD /d 1 /f

:: NTLMv2 only
reg add HKLM\SYSTEM\CurrentControlSet\Control\Lsa\ /v lmcompatibilitylevel /t REG_DWORD /d 5 /f

:: Restrict anonymous access
reg add HKLM\...\Lsa /v restrictanonymous /t REG_DWORD /d 1 /f
reg add HKLM\...\Lsa /v restrictanonymoussam /t REG_DWORD /d 1 /f

:: Disable IPv6
reg add HKLM\...\TCPIP6\Parameters /v DisabledComponents /t REG_DWORD /d 255 /f

:: Disable sticky/toggle/filter keys
reg add "HKCU\Control Panel\Accessibility\StickyKeys" /v Flags /t REG_SZ /d 506 /f
reg add "HKCU\Control Panel\Accessibility\ToggleKeys" /v Flags /t REG_SZ /d 58 /f
reg add "HKCU\Control Panel\Accessibility\Keyboard Response" /v Flags /t REG_SZ /d 122 /f

:: Disable admin shares
reg add HKLM\...\LanmanServer\Parameters /v AutoShareWks /t REG_DWORD /d 0 /f

:: Remove LM hashes
reg add HKLM\...\Lsa /v NoLMHash /t REG_DWORD /d 1 /f

:: Require UAC
reg add HKLM\...\Policies\System /v EnableLUA /t REG_DWORD /d 1 /f

:: Disable Run Once list
reg add HKLM\...\Policies\Explorer /v DisableLocalMachineRunOnce /t REG_DWORD /d 1
```

## IPsec

```batch
netsh ipsec static add filter filterlist=MyIPsecFilter srcaddr=Any dstaddr=Any protocol=ANY
netsh ipsec static add filteraction name=MyIPsecAction action=negotiate
netsh ipsec static add policy name=MyIPsecPolicy assign=yes
netsh ipsec static add rule name=MyIPsecRule policy=MyIPsecPolicy filterlist=MyIPsecFilter filteraction=MyIPsecAction conntype=all activate=yes psk=<PASSWORD>
netsh ipsec static show policy name=MyIPsecPolicy
netsh ipsec static set policy name=MyIPsecPolicy
```

## Active Directory GPO

```batch
gpupdate /force
gpupdate /sync
auditpol /set /user:bob /category:"Detailed Tracking" /include /success:enable /failure:enable
dsadd OU <QUARANTINE_OU>
```

```powershell
Move-ADObject 'CN=<USER>,CN=<OLD_GROUP>,DC=<DOMAIN>,DC=<EXT>' -TargetPath 'OU=<NEW_GROUP>,DC=<DOMAIN>,DC=<EXT>'
```

## Passwords

```batch
net user <USER> * /domain
net user <USER> <NEW_PASS>
pspasswd.exe \\<REMOTE> -u <USER> -p <NEW_PASS>
```

```powershell
Set-ADAccountPassword <USER> -NewPassword $newpwd -Reset -PassThru | Set-ADuser -ChangePasswordAtLogon $True
```

## Host file defense

```batch
ipconfig /flushdns
nbtstat -R
echo 127.0.0.1 <MALICIOUS_DOMAIN> >> C:\Windows\System32\drivers\etc\hosts
ping <MALICIOUS_DOMAIN> -n 1
```

> Source: BTFM — Blue Team Field Manual
