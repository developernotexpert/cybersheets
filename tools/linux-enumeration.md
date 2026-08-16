---
name: Linux Enumeration
category: Post-Exploitation & PrivEsc
description: Linux situational awareness — file system structure, shadow/passwd formats, packages, users and network config.
tags: [linux, enumeration, situational-awareness, shadow, passwd, RTFM]
---

# Linux Enumeration

Linux system enumeration — file system layout, password file formats, package management, user accounts and network configuration.

## File system structure

| Path | Description |
|------|-------------|
| `/` | Root of filesystem |
| `/bin` | User binaries |
| `/boot` | Boot files |
| `/dev` | System devices |
| `/etc` | System config |
| `/home` | User files |
| `/lib` | Critical libraries |
| `/opt` | Third party software |
| `/proc` | Running programs |
| `/root` | Root home |
| `/sbin` | Admin binaries |
| `/tmp` | Temporary files |
| `/usr` | Less critical files |
| `/var` | Variable system files |

## Important files

| Path | Description |
|------|-------------|
| `/etc/shadow` | Password hashes |
| `/etc/passwd` | User accounts |
| `/etc/group` | Group names |
| `/etc/rc.d` | Startup services |
| `/etc/init.d` | Start/stop scripts |
| `/etc/hosts` | Hostname/IP combos |
| `/etc/hostname` | Full hostname |
| `/etc/network/interfaces` | Network config |
| `/etc/profile` | Environment variables |
| `/etc/apt/sources.list` | Debian package source |
| `/etc/resolv.conf` | DNS configuration |
| `~/.bash_history` | Bash history |
| `~/.ssh/` | SSH keystore |
| `/var/log` | System logs |
| `/etc/fstab` | Mount configuration |

## /etc/shadow format

```
root:$6$RqNi$...PbED0:16520:0:99999:7:::
 1       2          3    4   5    6 7 8 9
```

1=Login, 2=Hash, 3=Last change (epoch days), 4=Min age, 5=Max age, 6=Warning, 7=Inactivity, 8=Expiration, 9=Reserved

### Hash types

| Prefix | Algorithm |
|--------|-----------|
| `$1$` | MD5 |
| `$2a$` / `$2y$` | bcrypt |
| `$5$` | SHA-256 |
| `$6$` | SHA-512 |

## /etc/passwd format

```
root:x:0:0:Root:/root:/bin/bash
 1   2 3 4  5    6      7
```

1=Login, 2=Password (x=in shadow), 3=UID, 4=GID, 5=Comment, 6=Home, 7=Shell

## OS information

```bash
df -h
uname -a
cat /etc/issue
cat /etc/*release*
cat /proc/version
which <SHELL>
fdisk -l
```

## Package management

```bash
# Red Hat (RPM)
rpm -qa
rpm -ivh *.rpm
rpm -e <PACKAGE>

# Debian (DPKG)
dpkg --get-selections
dpkg -i *.deb
dpkg -r <PACKAGE>

# APT
apt-get update
apt-get upgrade
apt-get dist-upgrade
```

## Situational awareness

```bash
id
w
who -a
last -a
ps -ef
mount
findmnt
kill -9 <PID>
killall <PROCESS>
top
cat /etc/fstab
```

## User accounts

```bash
getent passwd
useradd -m <USER>
usermod -g <GROUP> <USER>
passwd <USER>
usermod --expiredate 1 --lock --shell /bin/nologin <USER>
usermod --expiredate 99999 --unlock --shell /bin/bash <USER>
chage -l <USER>
userdel <USER>
```

## Network configuration

```bash
watch --interval 3 ss -t --all
netstat -tulpn
lsof -i -u <USER> -a
ifconfig <IFACE> <IP> netmask <MASK>
ip addr add <IP> dev <IFACE>
route add default gw <GW> <IFACE>
ip route add <NET>/<CIDR> via <GW> dev <IFACE>
ifconfig <IFACE> mtu <SIZE>
ip link set dev <IFACE> mtu <SIZE>
iwlist <IFACE> scan
cat /var/log/messages | grep DHCP
tcpkill host <IP> and port <PORT>
echo "1" > /proc/sys/net/ipv4/ip_forward
echo "nameserver <IP>" >> /etc/resolv.conf
```

## DNS zone transfer

```bash
dig -x <IP>
host <HOST>
dig axfr <DOMAIN> @<DNS_IP>
host -t axfr -l <DOMAIN> <DNS_IP>
```

> Source: RTFM — Red Team Field Manual v2
