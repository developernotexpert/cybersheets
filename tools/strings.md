---
name: strings
category: Forensics & Reverse Engineering
description: Extract printable text from binary files — the fastest triage step.
tags: [strings, binary, triage, reverse, forensics, ctf]
---

# strings

**strings** prints sequences of printable characters found in a file. It's usually the first thing you run on an unknown binary, memory dump or disk image — it surfaces URLs, paths, error messages, hardcoded credentials and format strings in seconds.

> part of `binutils` · `apt install binutils`

## Basic usage

```bash
strings file.bin
strings -n 8 file.bin                 # minimum length 8 (cut noise)
strings binary | less
strings binary | grep -i password
strings binary | grep -iE 'http|ftp|/etc/|BEGIN'
```

## Useful options

```bash
strings -a file.bin                   # scan the whole file (not just data sections)
strings -t x file.bin                 # show the offset (hex) of each string
strings -e l file.bin                 # 16-bit little-endian (Unicode/UTF-16, common on Windows)
strings -e b file.bin                  # 16-bit big-endian
strings -f *.bin                       # prefix each line with the filename
```

`-e l` matters a lot on Windows binaries and memory dumps, where text is often UTF-16 and default `strings` misses it.

## Triage patterns

```bash
strings -n 6 malware.bin | grep -iE 'cmd|powershell|http|reg add|schtasks'
strings dump.raw | grep -iE 'flag\{|password=|api[_-]?key'      # CTF / secrets
strings -t x firmware.bin | grep -i admin                        # with offsets
```

> A first pass, not the whole story — packed/encrypted binaries hide their strings until unpacked. Follow up with [ghidra](#/tool/ghidra)/[radare2](#/tool/radare2) for structure, [xxd](#/tool/xxd) for raw bytes, and [binwalk](#/tool/binwalk) for embedded content.
