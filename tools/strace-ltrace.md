---
name: strace / ltrace
category: Forensics & Reverse Engineering
description: Trace system calls and library calls of a running program.
tags: [strace, ltrace, syscall, debug, trace, dynamic]
---

# strace / ltrace

Two dynamic-analysis tracers. **strace** logs the **system calls** a process makes (files opened, network, exec); **ltrace** logs **library calls** (e.g. `strcmp`, `getenv`, crypto functions). Together they show what a binary actually does at runtime — great for triage, debugging and black-box RE.

> `apt install strace ltrace` · tracing others' processes needs matching privileges (ptrace)

## strace — system calls

```bash
strace ./program                     # trace everything
strace -f ./program                   # follow forked/threaded children
strace -e trace=open,openat ./program # only file-open calls
strace -e trace=network ./program     # only network syscalls
strace -e trace=file ./program        # all filesystem-related calls
strace -p 1234                         # attach to a running PID
```

Useful for: "what file/config is it looking for?", "what does it connect to?", "why does it fail?" (watch for `ENOENT`, `EACCES`).

```bash
strace -f -e trace=open,stat ./program 2>&1 | grep -i 'ENOENT'   # missing files it wants
strace -c ./program                   # summary: count + time per syscall
strace -e trace=execve -f ./script.sh # see what a script runs
```

## ltrace — library calls

```bash
ltrace ./program
ltrace -f ./program                   # follow children
ltrace -e 'strcmp+strncmp' ./program  # only these functions
ltrace -S ./program                   # also show syscalls (like strace)
ltrace -p 1234
```

Classic use in RE/CTF: watch a password check compare your input against the real secret:

```bash
ltrace ./crackme
# ... strcmp("mypass", "S3cr3t!") = ...   <- the expected value leaks
```

## Output control

```bash
strace -o trace.log ./program         # write to a file
strace -tt -T ./program               # timestamps + time spent in each call
strace -s 200 ./program                # show longer strings (default truncates)
```

> Dynamic view; pair it with a static tool ([ghidra](#/tool/ghidra)/[radare2](#/tool/radare2)) for the full picture. For interactive control (breakpoints, memory), use [gdb](#/tool/gdb). Statically linked or anti-debug binaries may resist ltrace.
