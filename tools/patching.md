---
name: Patching
category: Cheatsheets & Playbooks
description: System patching commands for Windows (WUSA, DISM, WSUS) and Linux (apt, yum, rpm).
tags: [patching, windows, linux, updates, BTFM]
---

# Patching

System patching commands for Windows and Linux.

## Windows

```batch
:: List installed patches
wmic qfe list
systeminfo

:: Install patch
wusa.exe <PATCH>.msu /quiet /norestart

:: DISM
DISM /Online /Add-Package /PackagePath:<PATH>.cab
DISM /Online /Get-Packages

:: Uninstall patch
wusa.exe /uninstall /kb:<KB_NUMBER> /quiet /norestart
```

```powershell
# PowerShell Windows Update
Install-Module PSWindowsUpdate
Get-WindowsUpdate
Install-WindowsUpdate -AcceptAll -AutoReboot
```

## Linux

```bash
# Debian/Ubuntu
apt-get update
apt-get upgrade
apt-get dist-upgrade
apt list --upgradable

# Red Hat/CentOS
yum check-update
yum update
yum update --security

# Check installed patches
dpkg --get-selections
rpm -qa --last
```

> Source: BTFM — Blue Team Field Manual
