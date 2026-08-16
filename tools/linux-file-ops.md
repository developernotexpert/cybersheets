---
name: Linux File Operations
category: Utilities & Shell
description: Linux file manipulation, compression, chunking, hashing and file type identification.
tags: [linux, files, compression, hashing, tar, gzip, RTFM]
---

# Linux File Operations

File manipulation, compression, hashing and searching commands.

## File manipulation

```bash
diff <FILE_A> <FILE_B>
rm -rf <PATH>
shred -f -u <FILE>
touch -r <ORIGINAL> <MODIFIED>
touch -t <YYYYMMDDHHMM> <FILE>
grep -c "<STRING>" <FILE>
awk 'sub("$", "\r")' <SRC> > <DST>
dos2unix <FILE>
find . -type f -name "*.<EXT>"
grep -Ria "<PHRASE>"
wc -l <FILE>
find / -perm -4000 -exec ls -ld {} \;
file <FILE>
chattr +i <FILE>
chattr -i <FILE>
dd if=/dev/urandom of=<FILE> bs=3145728 count=100
```

## File compression and chunking

```bash
# tar
tar -cf <OUT>.tar <INPUT>
tar -xf <FILE>.tar
tar -czf <OUT>.tar.gz <INPUT>
tar -xzf <FILE>.tar.gz
tar -cjf <OUT>.tar.bz2 <INPUT>
tar -xjf <FILE>.tar.bz2

# gzip
gzip <INPUT>
gzip -d <FILE>.gz

# zip
zip -r <OUT>.zip <INPUT>
unzip <FILE>

# UPX (pack executable)
upx -9 -o <OUT> <INPUT>

# Split/restore with dd
dd if=<INPUT> bs=4M | gzip -c | split -b 3K - "<OUT>.chunk"
cat <FILE>.chunk* | gzip -dc | dd of=<OUT> bs=4M
```

## File hashing

```bash
md5sum <FILE>
echo "<STRING>" | md5sum
sha1sum <FILE>
```

> Source: RTFM — Red Team Field Manual v2
