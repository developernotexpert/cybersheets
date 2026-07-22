---
name: tmux
category: Utilities & Shell
description: Terminal multiplexer — persistent sessions, splits and windows.
tags: [tmux, terminal, multiplexer, session, panes, workflow]
---

# tmux

**tmux** lets one terminal hold many sessions, windows and panes, and keeps them running after you disconnect. On an engagement it means your listeners and long jobs survive a dropped SSH connection, and you can lay out several tasks side by side.

> `apt install tmux` · default prefix key is `Ctrl+b` (written `C-b` below)

## Sessions (survive disconnects)

```bash
tmux                                   # start a session
tmux new -s work                        # named session
tmux ls                                 # list sessions
tmux attach -t work                     # reattach (e.g. after SSH dropped)
tmux kill-session -t work
```

`C-b d` detaches (leaves it running). This is the killer feature over a bare shell.

## Windows (like tabs) — prefix then key

```text
C-b c      new window
C-b ,      rename window
C-b n / p  next / previous window
C-b 0..9   jump to window N
C-b w      list windows
C-b &      kill window
```

## Panes (splits)

```text
C-b %      split vertically (left/right)
C-b "      split horizontally (top/bottom)
C-b <arrow>  move between panes
C-b z      zoom the current pane (toggle fullscreen)
C-b x      kill pane
C-b space  cycle layouts
C-b {  /  }  swap panes
```

## Copy mode & scrolling

```text
C-b [      enter copy/scroll mode  (arrows/PgUp to scroll, q to quit)
           space to start selection, enter to copy
C-b ]      paste
```

## Useful config (`~/.tmux.conf`)

```text
set -g mouse on               # click panes, scroll, resize with the mouse
setw -g mode-keys vi          # vi keys in copy mode
set -g history-limit 100000   # bigger scrollback
```

Reload without restarting: `tmux source-file ~/.tmux.conf`.

> Ideal for keeping [netcat](#/tool/netcat)/[msfconsole](#/tool/msfconsole) listeners alive and organizing recon in panes. `screen` is the older alternative; tmux is the modern default.
