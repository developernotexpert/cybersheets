---
name: Windows Active Directory
category: Post-Exploitation & PrivEsc
description: Active Directory enumeration — net.exe, dsquery, domain trusts, forest exploitation and user discovery.
tags: [windows, active-directory, domain, dsquery, enumeration, RTFM]
---

# Windows Active Directory

Enumerate Active Directory domains — users, computers, groups, OUs, trusts — using net.exe and dsquery.

## Domain enumeration with net.exe

```batch
net localgroup administrators
net localgroup administrators /domain
net view /domain
net user /domain
net user <USERNAME> /domain
net accounts /domain
net group /domain
net group "<GROUPNAME>" /domain
net group "Domain Controllers" /domain
net group "Domain Computers" /domain
net user <USERNAME> /ACTIVE:YES /domain
net user <USERNAME> "<PASSWORD>" /domain
```

## Domain enumeration with dsquery

```batch
dsquery * -filter "(&(objectclass=user)(admincount=1))" -attr samaccountname name
dsquery * -filter "(objectclass=organizationalUnit)" -attr name distinguishedName description -limit 0
dsquery * -filter "(operatingsystem=*10*)" -attr name operatingsystem dnshostname -limit 0
dsquery * -filter "(name=*DC*)" -attr name operatingsystem dnshostname -limit 0
dsquery * -filter "(name=*smith*)" -attr name samaccountname description -limit 0
dsquery * -filter "(&(objectclass=user)(lastlogon><EPOCH_TIME>))" -attr samaccountname name
dsquery * -filter "(objectclass=trusteddomain)" -attr flatname trustdirection
dsquery * -filter "(objectclass=computer)" -attr name dnshostname operatingsystem description -limit 0
dsquery * -filter "(objectclass=user)" -attr name samaccountname lastlogon memberof description -limit 0
dsquery * -filter "(objectclass=group)" -attr name samaccountname member description -limit 0
dsquery * -filter "(name=*admin*)" -attr name samaccountname description objectclass -limit 0
```

```batch
w32tm /ntte <EPOCH_TIME>
```

## Finding user systems

```batch
wevtutil qe security /rd:true /f:text /q:"*[System/EventID=4624] and *[EventData/Data[@Name='TargetUserName']='<USERNAME>']" /c:20
dsquery * -filter "(description=*<LAST_NAME>*)" -attr name samaccountname description
net session
```

## AD exploitation checklist

- Windows hashes are NOT salted — password re-use is common across domains
- Domain service account passwords may not be changed often
- Enterprise Admin accounts may traverse forest domains
- Look for separation of privilege violations

> Source: RTFM — Red Team Field Manual v2. See also [mimikatz](#/tool/mimikatz) and [impacket](#/tool/impacket).
