---
name: Screen
category: Utilities & Shell
description: GNU Screen terminal multiplexer — sessions, windows, splits and keybindings.
tags: [screen, terminal, multiplexer, RTFM]
---

# Screen

GNU Screen terminal multiplexer reference.

## Session management

```bash
screen -S <NAME>            # Start named session
screen -ls                  # List sessions
screen -r <NAME>            # Attach to session
screen -S <NAME> -X <CMD>   # Send command to session
```

## Keybindings (Ctrl+a, then key)

| Key | Action |
|-----|--------|
| `?` | Help |
| `d` | Detach |
| `D D` | Detach and logout |
| `c` | Create new window |
| `C-a` | Switch to last window |
| `"` | List windows |
| `k` | Kill current window |
| `S` | Split horizontal |
| `\|` | Split vertical |
| `tab` | Next split |
| `X` | Remove current region |
| `Q` | Remove all but current |
| `A` | Rename window |
| `n` | Next window |
| `p` | Previous window |

> Source: RTFM — Red Team Field Manual v2. See also [tmux](#/tool/tmux).
