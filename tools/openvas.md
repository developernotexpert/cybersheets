---
name: OpenVAS
category: Reconnaissance
description: OpenVAS vulnerability scanner setup — installation, user creation, target configuration and scanning.
tags: [openvas, vulnerability, scanner, BTFM]
---

# OpenVAS

OpenVAS vulnerability scanner setup and usage.

## Installation and setup

```bash
apt-get install openvas-server openvas-client openvas-plugins-base openvas-plugins-dfsg
openvas-nvt-sync
openvas-adduser
# Login: sysadm, set password, add rules:
# accept <YOUR_IP_RANGE>
# default deny
# Ctrl+D to exit
service openvas-server start
```

## Configure and scan

```bash
vi scanme.txt            # Add one host/network per line
openvas-client -q 127.0.0.1 9390 sysadm nsrc+ws scanme.txt openvas-output.html -T txt -V -x
openvas-client -q 127.0.0.1 9390 sysadm nsrc+ws scanme.txt openvas-output.txt -T html -V -x
```

> Source: BTFM — Blue Team Field Manual
