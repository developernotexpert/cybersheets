---
name: ExifTool
category: Forensics & Reverse Engineering
description: Read, write and strip metadata from images, docs and media.
tags: [exiftool, metadata, exif, osint, forensics, images]
---

# ExifTool

**ExifTool** reads and edits metadata in almost any file — photos (EXIF/GPS), PDFs and Office docs (author, software), audio and video. It's a staple for OSINT (who/what/where made this), CTF forensics, and scrubbing metadata before publishing.

> `apt install libimage-exiftool-perl` · `brew install exiftool` · [exiftool.org](https://exiftool.org)

## Read metadata

```bash
exiftool photo.jpg                    # all tags
exiftool -a -G1 photo.jpg              # show duplicates, group by category
exiftool -gps:all photo.jpg           # GPS coordinates
exiftool -CreateDate -Model -Software photo.jpg
exiftool *.jpg                         # every file in the folder
exiftool -r -ext jpg /path/            # recursive by extension
```

## OSINT / forensics targets

```bash
exiftool -Author -Creator -Producer document.pdf     # who/what made the PDF
exiftool -Company -LastModifiedBy report.docx         # office doc leaks
exiftool -GPSLatitude -GPSLongitude photo.jpg          # geolocation
exiftool -ThumbnailImage -b photo.jpg > thumb.jpg      # extract embedded thumbnail
```

Embedded thumbnails sometimes reveal the original, un-edited image — worth checking.

## Write / strip metadata

```bash
exiftool -Artist="Me" photo.jpg
exiftool -GPS:all= photo.jpg                # remove GPS only
exiftool -all= photo.jpg                     # strip ALL metadata
exiftool -all= -overwrite_original *.jpg     # in place, no _original backups
```

## Bulk / CSV

```bash
exiftool -csv -GPSLatitude -GPSLongitude -CreateDate *.jpg > meta.csv
exiftool -T -Model -FileName *.jpg           # tab-separated, scriptable
```

> Metadata is a two-way street: use it to profile a target's files, and strip it (`-all=`) before you publish your own. Files with hidden data past the metadata may also hide payloads — check with [binwalk](#/tool/binwalk)/[steghide](#/tool/steghide).
