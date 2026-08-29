---
name: Linux Hardening
category: Firewall & Hardening
description: Linux hardening — iptables/ufw defense, service management, IPsec with Racoon, passwords and host file.
tags: [linux, hardening, iptables, ufw, ipsec, defense, BTFM]
---

# Linux Hardening

Defensive Linux configuration — services, iptables, UFW, IPsec, passwords and host file.

## Disable/stop services

```bash
service --status-all
ps -ef
ps -aux
initctl list
/etc/init.d/apache2 stop
service mysql stop
update-rc.d apache2 disable
```

## iptables defense

```bash
iptables-save > firewall.out
vi firewall.out
iptables-restore < firewall.out
iptables -A INPUT -s 10.10.10.10 -j DROP
iptables -A INPUT -s 10.10.10.0/24 -j DROP
iptables -A INPUT -p tcp --dport ssh -s 10.10.10.10 -j DROP
iptables-policy INPUT DROP
iptables-policy OUTPUT DROP
iptables-policy FORWARD DROP
iptables -I INPUT 5 -m limit --limit 5/min -j LOG --log-prefix "iptables denied: " --log-level 7
iptables -L
iptables -F
```

## UFW

```bash
ufw enable
ufw disable
ufw logging on
ufw logging off
cp /lib/ufw/{user.rules,user6.rules} /<BACKUP>
ufw status verbose
ufw delete <RULE#>
ufw allow from <IP>
ufw allow all 80/tcp
ufw deny from <BAD_IP> proto udp to any port 443
```

## Passwords

```bash
passwd              # Current user
passwd bob          # User bob
sudo su passwd      # Root
```

## Host file

```bash
echo 127.0.0.1 <MALICIOUS_DOMAIN> >> /etc/hosts
ping -c 1 <MALICIOUS_DOMAIN>
/etc/init.d/dns-clean start
/etc/init.d/nscd restart
service nscd restart
nscd -i hosts
/etc/init.d/dnsmasq restart
```

## IPsec with Racoon

```bash
apt-get install racoon
# Edit /etc/ipsec-tools.conf, /etc/racoon/racoon.conf, /etc/racoon/psk.txt
# See BTFM for full configuration
iptables -A INPUT -p esp -j ACCEPT
iptables -A INPUT -p ah -j ACCEPT
iptables -A INPUT -p udp --dport 500 -j ACCEPT
iptables -A INPUT -p udp --dport 4500 -j ACCEPT
service setkey restart
setkey -D
setkey -DP
```

> Source: BTFM — Blue Team Field Manual. See also [iptables](#/tool/iptables) and [ufw](#/tool/ufw).
