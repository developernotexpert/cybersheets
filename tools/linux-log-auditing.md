---
name: Linux Log Auditing
category: Firewall & Hardening
description: Linux log analysis — auth logs, syslog, Apache logs, cron, sudo activity, auditd and file monitoring.
tags: [linux, logging, auditing, syslog, apache, auditd, defense, BTFM]
---

# Linux Log Auditing

Linux log locations and analysis commands.

## Authentication logs

```bash
tail /var/log/auth.log
grep -i "fail" /var/log/auth.log
```

## Syslog analysis

```bash
grep -i samba /var/log/syslog
grep -i cron /var/log/syslog
grep -i sudo /var/log/auth.log
```

## Apache logs

```bash
grep 404 <LOG_FILE> | grep -v -E "favicon.ico|robots.txt"
head access_log | awk '{print $7}'
watch -n 300 -d ls -lR /<WEB_DIR>
cat <LOG_FILE> | fgrep -v <YOUR_DOMAIN> | cut -d\" -f4 | grep -v "^-"
```

## Network monitoring

```bash
netstat -ac 5 | grep tcp
```

## Audit framework

```bash
apt-get install auditd
auditctl -a exit,always -S execve
ausearch -m execve
aureport
```

> Source: BTFM — Blue Team Field Manual
