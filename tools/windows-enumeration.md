---
name: Windows Enumeration
category: Post-Exploitation & PrivEsc
description: Windows situational awareness — OS info, processes, accounts, network, registry and environment variables.
tags: [windows, enumeration, situational-awareness, registry, recon, RTFM]
---

# Windows Enumeration

Commands for Windows situational awareness — OS details, processes, accounts, network configuration, registry keys and environment variables.

## OS information

```batch
ver
systeminfo
wmic qfe list
wmic cpu get datawidth /format:list
dir /a c:\
fsutil fsinfo drives
wmic logicaldisk get description,name
set
dir /a c:\pagefile.sys
```

## Windows versions

| ID | Version | Released |
|----|---------|----------|
| 1511 | Windows 10 – Threshold 2 | 2015-11-12 |
| 1607 | Windows 10 – Redstone 1 | 2016-08-02 |
| 21H2 | Windows 11 – Sun Valley | 2021-10-05 |
| 21H2 | Windows Server 2022 | 2021-08-18 |

## Administrative binaries

| Binary | Purpose |
|--------|---------|
| `lusrmgr.msc` | Local user and group manager |
| `services.msc` | Services control panel |
| `taskmgr.exe` | Task manager |
| `secpol.msc` | Local security policy editor |
| `eventvwr.msc` | Event viewer |
| `regedit.exe` | Registry editor |
| `gpedit.msc` | Group policy editor |
| `ncpa.cpl` | Network connections manager |
| `devmgmt.msc` | Device manager |
| `diskmgmt.msc` | Disk manager |

## Environment variables

| Variable | Points to |
|----------|-----------|
| `%SYSTEMROOT%` | Windows folder (C:\Windows) |
| `%APPDATA%` | User roaming directory |
| `%COMPUTERNAME%` | Computer hostname |
| `%HOMEDRIVE%` | Default OS drive (C:\) |
| `%HOMEPATH%` | User directory |
| `%PATH%` | Executable search paths |
| `%PATHEXT%` | Executable file extensions |
| `%SYSTEMDRIVE%` | Default OS drive |
| `%TMP%` / `%TEMP%` | User temp folders |
| `%USERPROFILE%` | User directory |
| `%WINDIR%` | Windows directory |
| `%ALLUSERSPROFILE%` | All users profile (ProgramData) |

## Key files and locations

| Path | Description |
|------|-------------|
| `%SYSTEMROOT%\System32\drivers\etc\hosts` | DNS entries |
| `%SYSTEMROOT%\System32\drivers\etc\networks` | Network settings |
| `%SYSTEMROOT%\System32\config\SAM` | User & password hashes |
| `%SYSTEMROOT%\repair\SAM` | Backup SAM (WinXP) |
| `%SYSTEMROOT%\System32\config\RegBack\SAM` | Backup SAM |
| `%WINDIR%\System32\config\SECURITY` | Security log |
| `%WINDIR%\System32\config\APPLICATION` | Application log |
| `%WINDIR%\Panther\` | Unattend install files |
| `%WINDIR%\System32\Sysprep` | Unattend install files |

## Process and service enumeration

```batch
tasklist /svc
tasklist /FI "USERNAME ne NT AUTHORITY\SYSTEM" /FI "STATUS eq running" /V
taskkill /F /IM <PROCESS_NAME> /T
wmic process get name,executablepath,processid
wmic process get processid,commandline
sc query state= all
runas /user:<DOMAIN>\<USERNAME> "<FILE_PATH> [ARGS]"
tasklist /v | findstr "<STRING>"
```

```powershell
Get-WmiObject -Namespace "root\SecurityCenter2" -Class AntiVirusProduct -ErrorAction Stop
```

## Account enumeration

```batch
echo %USERNAME%
wmic netlogin where (name like "%<USERNAME>%") get Name,numberoflogons
net localgroup "Administrator"
```

## Network info and configuration

```batch
ipconfig /all
ipconfig /displaydns
netstat -ano
netstat -anop tcp 3 >> <FILE_PATH>
netstat -an | findstr LISTENING
route print
arp -a
nslookup -type=SRV _www._tcp.<URL>
netsh wlan show profiles
netsh wlan export profile folder=. key=clear
netsh interface ip show interfaces
```

## Registry commands

```batch
reg query HKLM /f password /t REG_SZ /s
reg save HKLM\Security security.hive
```

| Registry Key | Info |
|--------------|------|
| `HKLM\...\CurrentVersion /v ProductName` | OS information |
| `HKLM\...\TimeZoneInformation /v ActiveTimeBias` | Time zone |
| `HKCU\...\Map Network Drive MRU` | Mapped network drives |
| `HKLM\System\MountedDevices` | Mounted devices |
| `HKLM\System\CurrentControlSet\Enum\USB` | USB devices |
| `HKLM\Security\Policy\PolAdTev` | Audit policy |
| `HKLM\SYSTEM\CurrentControlSet\Services` | Kernel/user services |
| `HKCU\...\Explorer\RunMRU` | Recent Run dialog entries |
| `HKCU\...\Internet Explorer\TypedURLs` | Typed URLs |
| `HKCU\...\SimonTatham\Putty\Sessions` | Saved SSH connections |

## Registry run keys (boot order)

```
HKLM\SYSTEM\CurrentControlSet\Control\Session Manager\BootExecute
HKLM\System\CurrentControlSet\Services
HKLM\Software\Microsoft\Windows\CurrentVersion\RunServicesOnce
HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon /v Userinit
HKLM\Software\Microsoft\Windows NT\CurrentVersion\Winlogon /v Shell
HKLM\Software\Microsoft\Windows\CurrentVersion\ShellServiceObjectDelayLoad
HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce
HKLM\Software\Microsoft\Windows\CurrentVersion\Run
HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run
```

## Remote system enumeration

```batch
net session \\<IP>
wmic /node:<IP> computersystem get username
wmic /node:<IP> /user:<DOMAIN>\<USER> /password:<PASS> process call create "\\<IP>\<SHARE>\<FILE>"
wmic /node:<IP> process list brief /every:1
tasklist /S <IP> /v
systeminfo /S <IP> /U <DOMAIN>\<USER> /P <PASS>
net view \\<IP> /all
net use * \\<IP>\<SHARE> /user:<DOMAIN>\<USER> <PASS>
xcopy /s \\<IP>\<SHARE> <LOCAL_DIR>
dir \\<IP>\c$
```

## Data mining and file searching

```batch
dir /a /s /b C:\*pdf*
findstr /SI password *.txt
type <FILE_PATH>
find /I "<STRING>" <FILE_PATH>
type <FILE_PATH> | find /c /v ""
tree.com /F /A \\<IP>\<PATH> > c:\windows\temp\output.log
makecab c:\windows\temp\output.log c:\windows\temp\compressed.zip
```

## Volume Shadow Service (VSS)

```batch
vssadmin list shadows
wmic shadowcopy call create Volume=c:\
mklink /D C:\restore \\?\GLOBALROOT\Device\HarddiskVolumeShadowCopy6\
rmdir c:\restore
```

> Source: RTFM — Red Team Field Manual v2
