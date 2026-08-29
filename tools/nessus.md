---
name: Nessus
category: Reconnaissance
description: Nessus vulnerability scanner — command-line scanning, batch mode and report conversion.
tags: [nessus, vulnerability, scanner, BTFM]
---

# Nessus

Nessus vulnerability scanner command-line reference.

## Basic scan

```bash
nessus -q -x -T html <SERVER_IP> <PORT_1241> <ADMIN> <PASSWORD> <TARGETS>.txt <RESULTS>.html
```

## Batch-mode scan

```bash
nessus -q [-pPS] <HOST> <PORT> <USER> <PASSWORD> <TARGETS_FILE> <RESULT_FILE>
```

## Report conversion

```bash
nessus -i in.[nsr|nbe] -o out.[xml|nsr|nbe|html|txt]
```

> Source: BTFM — Blue Team Field Manual
