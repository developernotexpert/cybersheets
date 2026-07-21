---
name: rkhunter / chkrootkit
category: Forensics & Reverse Engineering
description: Local POSIX/Linux auditing for rootkits, trojans and suspicious changes.
tags: [rootkit, rkhunter, chkrootkit, audit, linux, ids]
---

# rkhunter / chkrootkit

Two classic host auditing tools for POSIX/Linux that scan for **rootkits, trojans, backdoors** and suspicious system changes. Run them on a host you suspect is compromised (ideally from read-only/known-good tooling).

> `apt install rkhunter chkrootkit` · both are signature + heuristic based

## chkrootkit

```bash
sudo chkrootkit                       # run all checks
sudo chkrootkit -q                     # quiet: only infected/warnings
sudo chkrootkit -l                      # list available tests
sudo chkrootkit -p /mnt/good/bin        # use trusted binaries (post-compromise)
```

Look for lines ending in **INFECTED** or **Vulnerable**. It also flags interfaces in promiscuous mode and deleted-but-running binaries.

## rkhunter

```bash
sudo rkhunter --update                 # update signatures first
sudo rkhunter --propupd                 # baseline current file properties (clean system only!)
sudo rkhunter --check                    # full scan
sudo rkhunter --check --sk               # --skip-keypress (non-interactive)
sudo rkhunter --check --rwo              # report warnings only
```

Report location:

```bash
sudo cat /var/log/rkhunter.log
sudo grep -i warning /var/log/rkhunter.log
```

## What they check

- Known rootkit files/dirs and kernel modules.
- Modified system binaries (hash/property comparison to a baseline).
- Suspicious ports, hidden processes, promiscuous interfaces.
- Startup files, `/dev` anomalies, wrong file permissions.

## Important caveats

- Run `--propupd` **only on a known-clean system** — baselining a compromised host validates the malware.
- A capable rootkit can hide from tools running on the same kernel; for serious cases, boot from **trusted live media** and scan the mounted disk.
- Expect some false positives (custom kernels, updated packages) — investigate, don't panic.

> These are triage/auditing aids, not definitive proof. Combine with [The Sleuth Kit](#/tool/sleuthkit) (disk) and [Volatility 3](#/tool/volatility3) (memory) for real incident response, and monitor traffic with [zeek](#/tool/zeek).
