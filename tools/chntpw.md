---
name: chntpw
category: Post-Exploitation & PrivEsc
description: Offline Windows registry editing and local account password reset.
tags: [windows, registry, password-reset, offline, SAM]
---

# chntpw

**chntpw** edits the Windows registry and resets local account passwords **offline** — by mounting the disk (e.g. from a live USB or an attached image) and modifying the SAM hive directly. Useful for recovery and for lab scenarios where you have disk access.

> `apt install chntpw` · operate on the mounted Windows partition's `Windows/System32/config/`

## Mount the Windows partition first

```bash
sudo mkdir /mnt/win
sudo mount /dev/sdb2 /mnt/win
cd /mnt/win/Windows/System32/config
```

## Interactive edit of SAM

```bash
sudo chntpw -i SAM
```
Interactive menu:

```text
1 - Edit user data and passwords
2 - List groups
q - quit
# then pick a user and:
1 - Clear (blank) user password        <- most reliable
2 - Unlock and enable account
3 - Promote user to administrator
4 - (set new password — often unreliable on modern Windows)
```

> On modern Windows, **clearing** the password (option 1) works far better than setting a new one.

## Non-interactive

```bash
sudo chntpw -u "Administrator" SAM        # edit a specific user
sudo chntpw -l SAM                         # list all users
```

## Registry editing

```bash
sudo chntpw -e SYSTEM                       # open a hive in the registry editor
# navigate with: cd, ls, cat, hex, ed <value>
```

## Notes & caveats

- Clearing the password can make **EFS-encrypted files and DPAPI secrets unrecoverable**.
- Won't help against BitLocker without the recovery key.
- Domain accounts live on the DC, not in the local SAM — this only touches local accounts.

> A recovery/offline-access tool, not an over-the-network attack. For extracting (rather than resetting) hashes from a live system, see [mimikatz](#/tool/mimikatz) / [impacket](#/tool/impacket) `secretsdump`.
