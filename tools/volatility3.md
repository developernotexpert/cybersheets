---
name: Volatility 3
category: Forensics & Reverse Engineering
description: Advanced framework for memory forensics and RAM dump artifact extraction.
tags: [forensics, memory, ram, dump, dfir, volatility]
---

# Volatility 3

**Volatility 3** is the leading framework for **memory forensics** — analyzing RAM dumps to recover processes, network connections, injected code, credentials and more. Core skill for DFIR and malware analysis.

> `pip install volatility3` · run as `vol` or `python3 vol.py` · [github.com/volatilityfoundation/volatility3](https://github.com/volatilityfoundation/volatility3)

> Volatility 3 **auto-detects** the OS/profile (no `--profile` like v2). Syntax: `vol -f <dump> <plugin>`.

## Basics

```bash
vol -f mem.raw windows.info                 # image info / verify it's Windows
vol -f mem.raw -r pretty windows.pslist      # pretty output
vol -f mem.raw -o ./out windows.dumpfiles    # set output dir for dumps
```

## Processes

```bash
vol -f mem.raw windows.pslist                # process list
vol -f mem.raw windows.pstree                 # parent/child tree
vol -f mem.raw windows.psscan                  # scan (finds hidden/terminated)
vol -f mem.raw windows.cmdline                 # process command lines
vol -f mem.raw windows.dlllist --pid 1234
```

## Network

```bash
vol -f mem.raw windows.netscan                 # connections & listening ports
vol -f mem.raw windows.netstat
```

## Credentials & registry

```bash
vol -f mem.raw windows.hashdump                # SAM hashes
vol -f mem.raw windows.lsadump                  # LSA secrets
vol -f mem.raw windows.registry.hivelist
vol -f mem.raw windows.registry.printkey --key "Software\\Microsoft\\Windows\\CurrentVersion\\Run"
```

## Malware hunting

```bash
vol -f mem.raw windows.malfind                  # injected/hidden code regions
vol -f mem.raw windows.dlllist --pid 1234
vol -f mem.raw windows.dumpfiles --pid 1234     # extract files from memory
vol -f mem.raw windows.svcscan                   # services
```

## Linux / Mac

```bash
vol -f mem.raw linux.pslist
vol -f mem.raw linux.bash                        # recovered bash history
vol -f mem.raw mac.pslist
```

## Handy

```bash
vol -h                                           # global help
vol -f mem.raw windows.pslist -h                 # plugin-specific options
vol --help | grep windows                         # list Windows plugins
```

> Acquire dumps with tools like WinPMEM, DumpIt, LiME (Linux) or AVML. `malfind` + `pstree` + `netscan` is a strong triage trio. Extracted binaries can go straight into [binwalk](#/tool/binwalk)/[radare2](#/tool/radare2).
