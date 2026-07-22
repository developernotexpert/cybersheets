---
name: Ghidra
category: Forensics & Reverse Engineering
description: Full-featured reverse-engineering suite with a decompiler (NSA, free).
tags: [ghidra, reverse, decompiler, disassembler, sre, binary]
---

# Ghidra

**Ghidra** is a reverse-engineering framework released by the NSA. Its headline feature is a solid **decompiler** that turns machine code back into readable C-like pseudocode, alongside a disassembler, scripting and multi-architecture support. It's the free alternative to IDA Pro.

> [ghidra-sre.org](https://ghidra-sre.org) · needs a JDK (17+) · run `./ghidraRun`

## Getting started

1. **File → New Project** (non-shared) → give it a name.
2. **File → Import File** → select your binary.
3. Double-click the file in the tree to open the **CodeBrowser**.
4. When prompted, run **Auto Analysis** (accept defaults) — this finds functions, strings and cross-references.

## The main windows

- **Listing** — the disassembly, annotated with comments and xrefs.
- **Decompiler** (right pane) — C-like pseudocode for the selected function. This is where you spend most of your time.
- **Symbol Tree** — functions, labels, imports, exports.
- **Defined Strings** (**Window → Defined Strings**) — every string; great starting point.

## Navigation & analysis

```text
G            go to an address or symbol
L            rename a variable/function (label)
Ctrl+Shift+E edit function signature
;            add a comment
Ctrl+Shift+F find references to the selected item (xrefs)
double-click a function/xref to follow it
```

Typical flow: read **Defined Strings** → double-click an interesting string → follow the xref to the function that uses it → read the **Decompiler** → rename variables as you understand them.

## Extras

- **Script Manager** (**Window → Script Manager**) — Python/Java automation; many bundled scripts.
- **Version Tracking / BSim** — diff binaries, find similar functions.
- **Headless mode** for batch analysis:

```bash
analyzeHeadless /proj/dir ProjName -import ./binary -postScript MyScript.py
```

> Best for static analysis and decompilation. For dynamic debugging pair with [gdb](#/tool/gdb); for quick triage and firmware carving, [binwalk](#/tool/binwalk), [strings](#/tool/strings) and [radare2](#/tool/radare2).
