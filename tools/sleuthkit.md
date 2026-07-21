---
name: The Sleuth Kit
category: Forensics & Reverse Engineering
description: CLI tools for forensic analysis of disk images and filesystems.
tags: [forensics, disk, filesystem, tsk, autopsy, dfir]
---

# The Sleuth Kit (TSK)

**The Sleuth Kit** is a collection of command-line tools for **disk and filesystem forensics**: listing partitions, walking filesystems, recovering deleted files and building timelines from disk images. **Autopsy** is its GUI front-end.

> `apt install sleuthkit` · [sleuthkit.org](https://www.sleuthkit.org)

## Partition layout

```bash
mmls disk.img                          # partition table & offsets
img_stat disk.img                       # image metadata
fsstat -o 2048 disk.img                 # filesystem details (use offset from mmls)
```

## Browse the filesystem

```bash
fls -o 2048 disk.img                    # list files/dirs at root
fls -o 2048 -r disk.img                  # recursive
fls -o 2048 -d disk.img                  # deleted entries only
fls -o 2048 disk.img 12345               # list contents of inode 12345
```

Output like `r/r 12345: file.txt` — the number is the **inode**.

## Recover file content by inode

```bash
icat -o 2048 disk.img 12345 > recovered.txt      # dump a file's data
istat -o 2048 disk.img 12345                       # metadata of an inode
ffind -o 2048 disk.img 12345                        # filename for an inode
```

## Recover deleted files

```bash
fls -o 2048 -rd disk.img                 # find deleted files (recursive)
icat -o 2048 disk.img 6789 > deleted.bin # carve one out by inode
tsk_recover -o 2048 disk.img ./out       # bulk-recover to a directory
```

## Timeline (great for incident reconstruction)

```bash
fls -o 2048 -r -m / disk.img > body.txt      # body file
mactime -b body.txt -d > timeline.csv         # human-readable timeline
```

## Hash & search

```bash
tsk_gettimes disk.img > times.body
blkls -o 2048 disk.img > unalloc.raw          # extract unallocated space
strings unalloc.raw | grep -i password         # search the slack/unallocated
```

> Always work on a **copy/read-only image** (e.g. `dd`/`ewfacquire`) to preserve evidence. Combine carved artifacts with [binwalk](#/tool/binwalk) and memory analysis from [Volatility 3](#/tool/volatility3).
