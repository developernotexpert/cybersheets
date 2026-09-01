---
name: Incident Response Checklist
category: Cheatsheets & Playbooks
description: IR checklist — identification, containment, remediation, lessons learned and malware attributes tracking.
tags: [incident-response, ir, checklist, containment, remediation, BTFM]
---

# Incident Response Checklist

Structured checklist for incident response based on NIST framework.

## Identification tasks

- [ ] Review alerts and determine scope
- [ ] Identify affected systems and data
- [ ] Document timeline of events
- [ ] Classify incident severity
- [ ] Notify incident response team
- [ ] Begin chain of custody documentation
- [ ] Preserve volatile evidence (memory, network connections)
- [ ] Capture live system state before changes
- [ ] Identify attack vector and initial compromise
- [ ] Determine if incident is ongoing

## Containment tasks

- [ ] Isolate affected systems (network segmentation)
- [ ] Block malicious IPs/domains at firewall
- [ ] Disable compromised accounts
- [ ] Change affected credentials
- [ ] Preserve forensic evidence before containment
- [ ] Deploy additional monitoring on adjacent systems
- [ ] Consider short-term vs long-term containment
- [ ] Document all containment actions taken

## Remediation tasks

- [ ] Remove malware and artifacts
- [ ] Patch exploited vulnerabilities
- [ ] Reset all potentially compromised credentials
- [ ] Rebuild affected systems if necessary
- [ ] Verify removal of persistence mechanisms
- [ ] Update firewall/IDS rules
- [ ] Restore from known-good backups
- [ ] Verify system integrity before returning to production

## Lessons learned

- [ ] Conduct post-incident review
- [ ] Document root cause analysis
- [ ] Update incident response procedures
- [ ] Identify detection gaps
- [ ] Implement preventive measures
- [ ] Share threat intelligence (as appropriate)
- [ ] Update training and awareness programs

## Malware attributes to document

- File name, size, hash (MD5/SHA256)
- File type (PE, ELF, script, document)
- Network indicators (C2 domains, IPs, ports, protocols)
- Host indicators (registry keys, mutexes, file paths)
- Persistence mechanism
- Capabilities (keylogger, RAT, ransomware, etc.)
- Encryption/packing method
- Related samples or campaigns

> Source: BTFM — Blue Team Field Manual
