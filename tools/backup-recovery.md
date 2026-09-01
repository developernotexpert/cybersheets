---
name: Backup & Recovery
category: Cheatsheets & Playbooks
description: Backup and recovery commands for Windows (wbadmin, robocopy) and Linux (tar, rsync, dd) plus malware process killing.
tags: [backup, recovery, restore, wbadmin, rsync, BTFM]
---

# Backup & Recovery

Backup, recovery and malware process killing commands.

## Windows backup

```batch
:: Windows Server Backup
wbadmin start backup -backuptarget:<DRIVE>: -include:C: -quiet
wbadmin get versions
wbadmin start recovery -version:<VERSION> -itemType:Volume -items:C: -recoveryTarget:D:

:: Robocopy
robocopy <SOURCE> <DEST> /MIR /R:1 /W:1 /LOG:<LOG_FILE>
```

## Linux backup

```bash
# tar backup
tar -czf /backup/$(date +%Y%m%d).tar.gz /home /etc

# rsync
rsync -avz --progress /source/ /destination/
rsync -avz -e ssh /source/ user@remote:/destination/

# dd (full disk)
dd if=/dev/sda of=/backup/disk.img bs=4M status=progress
```

## Kill malware process

### Windows

```batch
tasklist /v
taskkill /F /PID <PID>
taskkill /F /IM <PROCESS_NAME>
wmic process where name="<PROCESS>" call terminate
```

### Linux

```bash
ps -ef | grep <SUSPECT>
kill -9 <PID>
killall <PROCESS_NAME>
pkill -f <PATTERN>
```

> Source: BTFM — Blue Team Field Manual
