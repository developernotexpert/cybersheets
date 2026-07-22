---
name: foremost
category: Forensics & Reverse Engineering
description: Carve files out of disk images, memory or raw data by signature.
tags: [foremost, carving, recovery, forensics, dfir, ctf]
---

# foremost

**foremost** recovers files by **carving** — it scans raw data for known headers/footers and pulls out the files, ignoring the filesystem entirely. Use it on disk images, memory dumps, unallocated space, or any blob that hides embedded files (common in CTF forensics).

> `apt install foremost` · signature-based; works even when the filesystem is gone

## Basic usage

```bash
foremost -i disk.img -o output/            # carve everything into output/
foremost -i dump.raw -o out/
foremost -t jpg,pdf,zip -i image.dd -o out/   # only these types
foremost -v -i disk.img -o out/            # verbose
```

Results land in `output/` grouped by type, plus an `audit.txt` summarizing what was recovered.

## Common file types (`-t`)

```text
jpg png gif bmp   pdf doc  zip rar  htm  avi mov mpg  wav  exe  all
```

`-t all` carves every supported type (slower, noisier).

## Options

```bash
foremost -T -i disk.img -o out/     # timestamped output dir (don't overwrite)
foremost -q -i disk.img -o out/     # quick mode (only checks block boundaries)
foremost -c /etc/foremost.conf ...   # custom config (add your own signatures)
```

## Typical CTF / DFIR flow

```bash
file challenge.bin                  # what is it?
binwalk challenge.bin               # list embedded files
foremost -i challenge.bin -o out/   # carve them out
ls -R out/                          # inspect recovered files
```

> Recovers deleted/embedded files without a filesystem; for a filesystem-aware recovery use [The Sleuth Kit](#/tool/sleuthkit) (`tsk_recover`). `binwalk -e` and `scalpel` are close alternatives — [binwalk](#/tool/binwalk) is better at firmware, foremost at media/documents.
