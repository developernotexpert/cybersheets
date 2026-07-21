---
name: Radare2
category: Forensics & Reverse Engineering
description: Framework for reverse engineering, disassembly and binary patching.
tags: [radare2, reverse, disassembly, patch, r2, binary]
---

# Radare2

**Radare2** (`r2`) is an open-source reverse-engineering framework: disassembly, analysis, debugging and binary patching. The command syntax is terse but composable — you chain short letters like a language — and **Cutter** is the GUI if you'd rather point and click.

> `apt install radare2` · or install from git for the latest · GUI: Cutter · [rada.re](https://rada.re)

## Open a binary

```bash
r2 ./binary                 # open (read-only)
r2 -w ./binary               # open in write mode (for patching)
r2 -d ./binary               # open in debug mode
r2 -A ./binary               # open and auto-analyze
```

## Analyze (do this first)

```text
[0x000000]> aaa            # analyze all (functions, refs, strings)
[0x000000]> aa             # lighter analysis
```

## Navigate & disassemble

```text
> afl                      # list functions
> s main                    # seek to main
> pdf                       # print disassembly of current function
> pd 20                     # disassemble 20 instructions
> pdf @ sym.check_password  # disassemble a specific function
> VV                        # visual graph mode (call graph)
> V                         # visual mode (p to cycle views, q to quit)
```

## Strings, symbols, info

```text
> iz                       # strings in data sections
> izz                       # strings in the whole binary
> ii                        # imports
> is                        # symbols
> ie                        # entrypoints
> i                         # binary info (arch, bits, protections)
```

## Cross-references (find who calls what)

```text
> axt @ sym.strcmp         # who references strcmp
> axt @ str.password        # xrefs to a string
```

## Patching (in `-w` mode)

```text
> s 0x401136
> wa jmp 0x401200          # write assembly at current offset
> wx 9090                   # write raw bytes (NOP NOP)
> "wa nop"                  # NOP an instruction
```

## Debugging

```text
> db 0x401136              # breakpoint
> dc                        # continue
> dr                        # registers
> ds                        # step
> px 32 @ rsp               # hexdump 32 bytes at RSP
```

## Scripting

```bash
r2 -q -c "aaa; afl" ./binary          # run commands and quit
r2 -q -c "izz~password" ./binary       # grep strings for "password" (~ = internal grep)
```

> The `~` operator greps r2 output internally (e.g. `afl~main`). Start every session with `aaa`. For dynamic analysis and pwn, [gdb](#/tool/gdb)+GEF pairs well; for firmware unpacking, [binwalk](#/tool/binwalk) feeds r2.
