---
name: binwalk
category: Forensics & Reverse Engineering
description: Analyze, extract and reverse-engineer firmware and binary files.
tags: [binwalk, firmware, extract, reverse, embedded, entropy]
---

# binwalk

**binwalk** scans binary files — especially **firmware images** — for embedded files, filesystems and executable code, and extracts them. It's a standard first step in IoT/embedded reversing and CTF forensics.

> `apt install binwalk` · extraction may need `sasquatch`, `jefferson`, `unrar` etc. · [github.com/ReFirmLabs/binwalk](https://github.com/ReFirmLabs/binwalk)

## Scan for embedded content

```bash
binwalk firmware.bin                    # signature scan (what's inside)
binwalk -B firmware.bin                  # signature scan (explicit)
```

Output shows offsets and identified types (e.g. "Squashfs filesystem", "gzip", "uImage header").

## Extract everything

```bash
binwalk -e firmware.bin                  # extract known types
binwalk -Me firmware.bin                  # recursive extraction (matryoshka)
binwalk --dd='.*' firmware.bin            # dump every signature to files
```

Extracted files land in `_firmware.bin.extracted/`.

## Entropy analysis (find encryption/compression)

```bash
binwalk -E firmware.bin                   # entropy graph (needs matplotlib for PNG)
binwalk -E -J firmware.bin                 # save entropy plot
```

High, flat entropy ≈ encrypted or compressed; steps often mark section boundaries.

## Other useful modes

```bash
binwalk -A firmware.bin                   # scan for CPU opcodes (architectures)
binwalk -Y firmware.bin                    # identify executable architecture
binwalk --raw='\x00CFG' firmware.bin        # search for a raw byte pattern
binwalk -y filesystem firmware.bin          # filter to a signature type
```

## Typical firmware workflow

```bash
binwalk firmware.bin                      # 1) see what's there
binwalk -Me firmware.bin                    # 2) recursively extract
find _firmware.bin.extracted -name "*.conf" -o -name "passwd"   # 3) hunt secrets
strings squashfs-root/etc/shadow            # 4) grab hashes
```

> After extracting a root filesystem, grep for hardcoded creds, keys and configs; feed executables into [radare2](#/tool/radare2)/[gdb](#/tool/gdb). For file-carving of arbitrary data, `foremost`/`scalpel` complement binwalk.
