---
name: Windows Log Auditing
category: Firewall & Hardening
description: Windows log auditing — increase log size, audit policies, security event IDs and IIS log analysis.
tags: [windows, logging, auditing, event-log, iis, siem, defense, BTFM]
---

# Windows Log Auditing

Configure Windows audit policies, query security events and analyze IIS logs.

## Increase log size

```batch
reg add HKLM\...\Eventlog\Application /v MaxSize /t REG_DWORD /d 0x19000
reg add HKLM\...\Eventlog\Security /v MaxSize /t REG_DWORD /d 0x64000
reg add HKLM\...\EventLog\System /v MaxSize /t REG_DWORD /d 0x19000
```

## Audit policies

```batch
wevtutil gl Security
auditpol /get /category:*
auditpol /set /category:* /success:enable /failure:enable
auditpol /set /subcategory:"Logon" /success:enable /failure:enable
auditpol /set /subcategory:"Process Creation" /success:enable /failure:enable
auditpol /set /subcategory:"Account Lockout" /success:enable /failure:enable
```

## Key security event IDs

| ID | Event |
|----|-------|
| 4624 | Successful logon |
| 4625 | Failed logon |
| 4634 | Logoff |
| 4648 | Explicit credential logon |
| 4672 | Special privileges assigned |
| 4688 | Process creation |
| 4689 | Process termination |
| 4698-4702 | Scheduled task events |
| 4720 | User account created |
| 4722 | User account enabled |
| 4724 | Password reset |
| 4726 | User account deleted |
| 4732 | Member added to local group |
| 4768 | Kerberos TGT requested |
| 4769 | Kerberos service ticket |
| 4771 | Kerberos pre-auth failed |
| 4776 | Credential validation |

## PowerShell event queries

```powershell
Get-EventLog -list
Get-EventLog -newest 5 -logname application | Format-List
Get-EventLog Security | ? { $_.EventId -eq 4800 }
Get-WinEvent -FilterHashtable @{LogName="Security"; ID=4774}
Get-EventLog Security 4624,4625,4634,4647 -after ((get-date).addDays(-1))
```

## IIS log analysis

```powershell
Import-Module WebAdministration
Get-IISSite
(Get-WebConfigurationProperty '/system.applicationHost/sites/siteDefaults' -Name 'logfile.directory').Value
$LogDirPath = "C:\inetpub\logs\LogFiles\W3SVC1"
Get-ChildItem -Path $LogDirPath -recurse | Where-Object {$_.lastwritetime -lt (get-date).addDays(-7)}
Select-String -Path $LogDirPath\*.log -Pattern '192.168.*.*'
Select-String -Path $LogDirPath\*.log '(@@version)|(sqlmap)|(Connect\(\))|(cast\()|(char\()|(sys databases)'
```

> Source: BTFM — Blue Team Field Manual
