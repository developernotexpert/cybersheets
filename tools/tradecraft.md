---
name: Tradecraft Checklist
category: Cheatsheets & Playbooks
description: Red team tradecraft concerns — artifact creation, persistence, remote execution, infrastructure and end-of-day ops.
tags: [tradecraft, opsec, red-team, checklist, RTFM]
---

# Tradecraft Checklist

Operational security considerations for red team assessments.

## Artifact creation and uploading

- Do artifact names blend in with the target environment?
- Is the payload packed/obfuscated?
- Does the payload match target architecture, C2 type and payload type?
- Is the artifact uploaded to a non-descript location?

## Persistence actions

- Correct permission level (admin vs user persistence)?
- Is the payload process suspicious after execution?
- Is the callback interval too fast or too slow?
- Should this persistence be logged?

## Remote execution

- Is the remote machine in scope?
- Is it normal to see this machine communicate with the target?
- Do you hold correct permissions?
- Should the artifact be removed after gaining persistence?
- Should this be logged?

## Infrastructure setup

- VPS purchased for C2 redirection
- SSL certs configured on redirector
- Redirector aged as long as possible
- Content uploaded and categorized
- ProxyPass configured for implant traffic
- IPtables blocking unwanted traffic
- Passwords changed on all Red Team machines
- SSH keys configured and password protected

## Token manipulation

- Correct privilege for the token manipulation method?
- Domain section set correctly?
- Hash/password still valid (not expired)?
- User in any concerning groups (firewall admin, etc.)?
- User account enabled? Logged in recently?
- Has the user authenticated from this machine before?

## End of day operations

- Revert all credentials (rev2self, drop_token)
- Exit unneeded implants
- Unlink SMB implants (outer chain first)
- Sleep HTTPS implants to slower interval (4+ hours)
- Update organizational logs

> Source: RTFM — Red Team Field Manual v2
