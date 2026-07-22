---
name: xxd
category: Forensics & Reverse Engineering
description: Hex dump and reverse — inspect and patch raw bytes.
tags: [xxd, hexdump, hex, binary, patch, forensics]
---

# xxd

**xxd** makes a hex dump of a file (or the reverse: hex back to binary). It's the quick way to look at raw bytes — file headers/magic, embedded data, or to hand-patch a binary.

> part of `vim` · `apt install xxd` (or comes with vim-common)

## Dump

```bash
xxd file.bin                          # hex + ASCII
xxd file.bin | head                     # just the header (magic bytes)
xxd -l 64 file.bin                      # first 64 bytes
xxd -s 0x100 -l 32 file.bin             # 32 bytes starting at offset 0x100
xxd -c 16 file.bin                       # 16 bytes per line
xxd -b file.bin                          # binary (bits) instead of hex
```

## Identify a file by magic bytes

```bash
xxd -l 4 unknown.file
# 7f45 4c46 = ELF   |  504b 0304 = ZIP/Office  |  8950 4e47 = PNG
# ffd8 ffe0 = JPEG  |  2550 4446 = PDF (%PDF)
```

## Hex → binary (patching & building files)

```bash
xxd file.bin > file.hex                # dump to editable hex
# ...edit file.hex in a text editor...
xxd -r file.hex > patched.bin          # rebuild the binary

# Turn a hex string into raw bytes
echo -n "48656c6c6f" | xxd -r -p       # -> Hello
echo -n "Hello" | xxd -p               # -> 48656c6c6f  (plain hex, no offsets)
```

## Handy combos

```bash
xxd -p file.bin | tr -d '\n'           # one long hex string
diff <(xxd a.bin) <(xxd b.bin)          # byte-level diff of two files
```

> Great for CTF file-format puzzles and small patches. For higher-level analysis use [ghidra](#/tool/ghidra)/[radare2](#/tool/radare2); to pull readable text quickly, [strings](#/tool/strings); to carve embedded files, [binwalk](#/tool/binwalk)/[foremost](#/tool/foremost).
