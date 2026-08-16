---
name: macOS Enumeration
category: Post-Exploitation & PrivEsc
description: macOS situational awareness — system info, user/group management, plist enumeration and file system structure.
tags: [macos, mac, enumeration, plist, situational-awareness, RTFM]
---

# macOS Enumeration

macOS system enumeration, user/group management and file system reference.

## File system structure

| Path | Description |
|------|-------------|
| `/Applications` | Apps (Mail, Safari, etc.) |
| `/bin` | User binaries |
| `/dev` | System devices |
| `/cores` | Memory debug files |
| `/etc` | System config |
| `/Users` | User files base |
| `/Library` | Critical software libraries |
| `/private` | Essential system files/caches |
| `/opt` | Third party software |
| `/sbin` | System admin binaries |
| `/System` | OS files |
| `/tmp` | Temporary files |
| `/usr` | Less critical files |
| `/Volumes` | Mounted volumes |
| `/var` | Variable system files |

## Situational awareness

```bash
ls /Applications
hostname
id
w
last
df -h
uname -a
mount
sw_vers
echo $0
ls /Users
ifconfig -a
ps -ef
kill -9 <PID>
ps -ef | grep -ia <STRING>
netstat -p tcp -van
sudo nano /etc/paths
```

## User plist enumeration

```bash
sudo plutil -p /var/db/dslocal/nodes/Default/users/<USER>.plist
sudo dscl . read Users/<USER> ShadowHashData
```

## User management

```bash
dscl . list /Users
dscl . list /Users | grep -v '_'
dscacheutil -q user
dscl . -read /Users/<USER>
dscacheutil -q group -a name <GROUP>
dscl . -delete /Users/<USER>
```

## Create user and make admin

```bash
dscl . -create /Users/<USER>
dscl . -create /Users/<USER> UserShell /bin/bash
dscl . -create /Users/<USER> RealName "<FULL_NAME>"
dscl . list /Users UniqueID
dscl . -create /Users/<USER> UniqueID "<ID>"
dscl . -create /Users/<USER> PrimaryGroupID 20
dscl . -create /Users/<USER> NFSHomeDirectory /Users/<USER>
mkdir /Users/<USER>
dscl . -passwd /Users/<USER> <PASSWORD>
dscl . -append /Groups/admin GroupMembership <USER>
```

## Group management

```bash
sudo dscl . -create /Groups/<GROUP>
sudo dscl . -create /Groups/<GROUP> RealName "Service and Support"
sudo dscl . -create /Groups/<GROUP> passwd "*"
dscl . list /Groups PrimaryGroupID | tr -s ' ' | sort -n -t ' ' -k2,2
sudo dscl . -create /Groups/<GROUP> gid <ID>
sudo dscl . -create /Groups/<GROUP> GroupMembership <USER>
dscacheutil -q group
sudo dscl . -append /Groups/<GROUP> GroupMembership <USER>
sudo dscl . -delete /Groups/<GROUP> GroupMembership <USER>
dscl . -delete /Groups/<GROUP>
```

> Source: RTFM — Red Team Field Manual v2
