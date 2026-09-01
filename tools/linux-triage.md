---
name: Linux Live Triage
category: Forensics & Reverse Engineering
description: Linux live triage — system info, users, network, services, policies, logs and file system analysis.
tags: [linux, triage, forensics, incident-response, BTFM]
---

# Linux Live Triage

Live triage commands for Linux incident response.

## System information

```bash
date
uname -a
cat /etc/issue
cat /etc/*release*
uptime
hostname
cat /proc/version
```

## User information

```bash
whoami
id
who -a
w
last -a
cat /etc/passwd
cat /etc/shadow
cat /etc/sudoers
awk -F: '($3 == "0") {print}' /etc/passwd
```

## Network information

```bash
ifconfig -a
netstat -antup
netstat -plantux
ss -a
arp -a
route -n
cat /etc/resolv.conf
iptables -L -n -v
```

## Service information

```bash
ps -ef
ps aux --forest
service --status-all
chkconfig --list
systemctl list-unit-files --type=service
cat /etc/crontab
ls -la /etc/cron.*
crontab -l
```

## Policy and patch information

```bash
cat /etc/pam.d/common-auth
cat /etc/login.defs
dpkg --get-selections
rpm -qa
```

## Logs

```bash
cat /var/log/auth.log
cat /var/log/syslog
cat /var/log/kern.log
cat /var/log/messages
cat /var/log/secure
last -f /var/log/wtmp
last -f /var/log/btmp
```

## Files and drives

```bash
df -ah
mount
lsblk
cat /etc/fstab
find / -mtime -1 -ls
find / -ctime -1 -ls
find / -name "*.log" -mtime -1
find / -uid 0 -perm -4000
lsof -i
lsof +L1
```

> Source: BTFM — Blue Team Field Manual
