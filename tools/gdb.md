---
name: GDB
category: Forensics & Reverse Engineering
description: The GNU debugger for memory, registers and binary exploitation.
tags: [gdb, debugger, reverse, exploit, memory, pwn]
---

# GDB

**GDB** (GNU Debugger) inspects and controls running programs: set breakpoints, examine memory and registers, step through code and analyze crashes. Plugins like **GEF** or **pwndbg** add the context views and helpers most people rely on for reverse engineering and binary exploitation (pwn).

> `apt install gdb` · supercharge it: [GEF](https://github.com/hugsy/gef) or [pwndbg](https://github.com/pwndbg/pwndbg)

## Start & run

```bash
gdb ./binary
gdb ./binary core                   # debug a crash from a core dump
gdb -p <PID>                          # attach to a running process
gdb --args ./binary arg1 arg2         # pass arguments
```

## Breakpoints & execution

```text
(gdb) break main            # or: b main
(gdb) break *0x401136        # break at an address
(gdb) info breakpoints
(gdb) run                    # r
(gdb) continue               # c
(gdb) next                   # n  (step over)
(gdb) step                   # s  (step into)
(gdb) stepi / nexti          # instruction-level
(gdb) finish                 # run until function returns
```

## Inspect state

```text
(gdb) info registers         # all registers  (i r)
(gdb) info registers rax
(gdb) x/16xw $rsp            # examine 16 words in hex at RSP
(gdb) x/8i $rip              # disassemble 8 instructions at RIP
(gdb) x/s 0x404040           # string at address
(gdb) print $rax             # p $rax
(gdb) print/x $rax           # in hex
(gdb) backtrace              # bt  (call stack)
```

## Examine format: `x/NFU addr`

- **N** count · **F** format (`x` hex, `d` dec, `s` string, `i` instruction) · **U** unit (`b`,`h`,`w`,`g`).

## Disassembly & memory

```text
(gdb) disassemble main
(gdb) set disassembly-flavor intel
(gdb) info functions
(gdb) set {int}0x404040 = 1        # write to memory
(gdb) set $rip = 0x401136          # change execution flow
```

## Exploitation helpers (GEF/pwndbg)

```text
(gdb) checksec               # NX, PIE, canary, RELRO
(gdb) pattern create 200     # cyclic pattern to find offsets
(gdb) pattern offset $rsp     # locate the offset after a crash
(gdb) vmmap                   # memory map
(gdb) got / plt               # GOT/PLT tables
```

## Scripting

```bash
gdb -batch -ex "disassemble main" ./binary
echo -e "b main\nrun\ninfo registers" | gdb ./binary
```

> Install GEF/pwndbg for `checksec`, `vmmap`, `pattern` and colored context — they turn raw GDB into a proper RE/pwn workbench. For static disassembly and patching, use [radare2](#/tool/radare2).
