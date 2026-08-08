---
name: shred
category: Forensics & Reverse Engineering
description: Securely overwrite and delete files so they can't be recovered.
tags: [shred, secure-delete, wipe, anti-forensics, data-destruction]
---

# shred

**shred** overwrites a file repeatedly with random data (and optionally deletes it), making recovery with forensic tools impractical. Essential in incident response clean-up, evidence handling, and anti-forensics scenarios.

> part of `coreutils` (pre-installed on most Linux) · `man shred`

## Basic usage

```bash
shred file.txt                        # overwrite 3 times (default), keep the file
shred -u file.txt                     # overwrite + unlink (delete)
shred -v file.txt                     # verbose — show each pass
shred -u -v secret.key                # wipe and delete with progress
```

## Useful options

| Option | Purpose |
|--------|---------|
| `-n N` | Number of overwrite passes (default 3) |
| `-u` | Truncate and remove the file after overwriting |
| `-z` | Add a final pass of zeros to hide the shredding |
| `-v` | Show progress (pass number and bytes written) |
| `-f` | Force — change permissions if needed to allow writing |
| `-s N` | Shred only the first N bytes |
| `--random-source=FILE` | Use FILE as random data source instead of `/dev/urandom` |

## Common patterns

```bash
# Wipe and delete with zero pass to hide shredding
shred -vfz -n 5 -u confidential.docx

# Shred multiple files
shred -vzu -n 3 *.log

# Wipe free space on a partition (fill + delete)
dd if=/dev/zero of=/tmp/fill bs=1M; rm -f /tmp/fill

# Wipe a disk/partition (e.g. USB before disposal)
shred -vfz -n 3 /dev/sdb

# Shred and rename before deleting (extra obscurity)
shred -vzu -n 1 ~/.bash_history
```

## Recursive shred (files in a directory)

`shred` doesn't recurse by itself — combine with `find`:

```bash
# Shred all files in a directory tree, then remove dirs
find /path/to/dir -type f -exec shred -vzu -n 3 {} \;
rm -rf /path/to/dir
```

## Limitations

```text
⚠ shred is NOT effective on:
  • Journaling filesystems (ext3/4, XFS, NTFS) — journal may keep old data
  • Copy-on-write filesystems (Btrfs, ZFS) — old blocks are never overwritten
  • SSD/NVMe with wear leveling — firmware remaps blocks transparently
  • RAID arrays — mirrors/parity may retain copies
  • Snapshots / cloud storage — previous versions persist elsewhere
```

For SSDs, use `blkdiscard --secure` or the drive's ATA Secure Erase. For full-disk destruction on modern hardware, encryption + key destruction (LUKS `cryptsetup erase`) is more reliable than overwriting.

> `shred` guarantees nothing on modern storage — but it raises the bar significantly on traditional HDDs. For forensic-grade wiping see [sleuthkit](#/tool/sleuthkit), and for encryption-based approaches see [gpg](#/tool/gpg) or [openssl](#/tool/openssl).
