---
name: Website Tools
category: Website Tools
description: Curated collection of essential cybersecurity websites — threat intelligence, OSINT, vulnerability databases and network analysis.
tags: [RTFM, BTFM]
---

# Website Tools

A curated list of essential online platforms for cybersecurity professionals — from malware analysis sandboxes to network reconnaissance engines.

---

## Featured

### [VirusTotal](https://www.virustotal.com)

Analyze files, URLs, domains and IPs with **70+ antivirus engines** and URL/domain blocklisting services. Upload a suspicious binary, paste a hash, or submit a link — VirusTotal aggregates results from dozens of vendors in seconds. Community comments and behavioral reports (sandboxed execution) add context beyond static signatures.

### [ANY.RUN](https://app.any.run)

Interactive malware analysis sandbox. Unlike fully automated sandboxes, ANY.RUN lets you **control the virtual machine in real-time** — click through installer steps, open attachments, interact with prompts. Watch network traffic, process trees and registry changes live. Free tier available with public submissions; paid plans keep samples private.

### [Shodan](https://www.shodan.io)

The search engine for **Internet-connected devices**. Shodan crawls the entire IPv4 space and indexes banners from services like HTTP, SSH, FTP, SNMP, SIP and more. Find exposed webcams, databases, industrial control systems and misconfigured servers. Invaluable for attack surface mapping and exposure auditing.

### [CyberChef](https://gchq.github.io/CyberChef)

The **swiss army knife** for data transformation, built by GCHQ. Encode, decode, encrypt, decrypt, compress, decompress, parse and analyze data — all in the browser with a drag-and-drop recipe interface. Chain operations together to build complex pipelines. Supports Base64, XOR, AES, hashing, regex, timestamp conversion and hundreds more.

---

## Malware & Threat Intelligence

### [Hybrid Analysis](https://www.hybrid-analysis.com)

Free malware analysis sandbox powered by **CrowdStrike Falcon**. Submit files or URLs for automated behavioral analysis. Generates detailed reports with MITRE ATT&CK mapping, YARA rule matches, network indicators and process activity. Supports Windows, Linux and Android environments.

### [URLScan.io](https://urlscan.io)

Scan and analyze any URL in a **sandboxed browser**. See the full page screenshot, DOM content, cookies set, JavaScript files loaded, HTTP requests made and DNS lookups performed. Identifies phishing pages, malicious redirects and tracking infrastructure. API available for automation.

### [ThreatFox](https://threatfox.abuse.ch)

Community-driven **IOC sharing platform** by abuse.ch. Browse and search indicators of compromise — malicious IPs, domains, URLs and file hashes — linked to specific malware families and campaigns. Export feeds in STIX, CSV or JSON for integration with SIEMs and threat intel platforms.

### [MalwareBazaar](https://bazaar.abuse.ch)

Community-driven **malware sample repository** by abuse.ch. Upload, download and share malware samples tagged with family names, YARA rules and delivery methods. Provides API access and daily feeds. Useful for building detection signatures and studying malware evolution.

### [AlienVault OTX](https://otx.alienvault.com)

Open Threat Exchange — the world's largest **crowdsourced threat intelligence** community. Users publish "pulses" containing IOCs, TTPs and context for active threats. Subscribe to pulses relevant to your industry. Integrates with AlienVault USM and third-party tools via API.

### [Talos Intelligence](https://talosintelligence.com)

Cisco's threat intelligence organization. Look up **IP and domain reputation**, check email sender scores, and browse vulnerability advisories. The reputation center provides real-time threat scoring used by Cisco security products. Also publishes Snort rules and ClamAV signatures.

---

## Vulnerability & Exploit Research

### [Exploit-DB](https://www.exploit-db.com)

The largest public archive of exploits and vulnerable software, maintained by OffSec. Search by CVE, platform, type or author. Includes **Google Hacking Database (GHDB)** — a collection of Google dorks that reveal sensitive files and misconfigurations. Pairs with `searchsploit` for offline lookups.

### [FOFA](https://fofa.info)

Chinese cyberspace search engine similar to Shodan and Censys. Indexes **global internet assets** including web services, certificates, protocols and components. Powerful query syntax for fingerprinting technologies, finding specific CMS versions, or mapping infrastructure by organization. Large dataset with strong coverage of APAC networks.

### [NVD — National Vulnerability Database](https://nvd.nist.gov)

The U.S. government's official repository of **CVE vulnerability data**. Each entry includes CVSS scores, affected products (CPE), references to advisories and patches. The authoritative source for vulnerability severity scoring and compliance reporting. Searchable by keyword, CVE ID, vendor or date range.

### [CVE Details](https://www.cvedetails.com)

Browse and search CVEs with **statistics, trends and vendor breakdowns**. Filter by CVSS score, vulnerability type, product or year. Visualize vulnerability counts over time per vendor. Useful for risk assessments and understanding a product's security track record.

### [Vulners](https://vulners.com)

Aggregated vulnerability database that indexes **CVEs, advisories, exploits and patches** from hundreds of sources in a single search. Covers NVD, vendor bulletins, Exploit-DB, Metasploit modules and more. Provides an API for vulnerability scanning integration and automated patch tracking.

---

## OSINT & Reconnaissance

### [Hunter.io](https://hunter.io)

Find and verify **professional email addresses** associated with any domain. Enter a company domain and Hunter returns known email patterns, sources where addresses were found, and a confidence score. Useful for social engineering assessments, spear phishing simulations and contact discovery during engagements.

### [Censys](https://search.censys.io)

Search engine for internet-wide scan data. Censys continuously scans the IPv4 address space and catalogs **certificates, hosts and services**. Query by IP, domain, certificate fingerprint, or autonomous system. Especially strong for TLS/SSL certificate transparency analysis and tracking certificate infrastructure.

### [ViewDNS.info](https://viewdns.info)

Swiss army knife for **DNS and domain intelligence**. Tools include reverse IP lookup (find all domains on a server), DNS record viewer, WHOIS, IP history, port scanner, reverse WHOIS (find domains by registrant), and more — all from a simple web interface. Great for quick passive recon.

### [crt.sh](https://crt.sh)

Certificate Transparency log search engine. Find **SSL/TLS certificates** issued for any domain, including subdomains you might not know about. Query by domain, organization, or certificate fingerprint. One of the fastest ways to discover subdomains during reconnaissance — just search `%.target.com`.

### [DNSdumpster](https://dnsdumpster.com)

Free domain research tool by HackerTarget. Discover **hosts, DNS records and network topology** related to a domain. Visualizes the DNS map graphically showing relationships between nameservers, mail servers and subdomains. No account required — quick passive recon from a single search.

### [SecurityTrails](https://securitytrails.com)

Comprehensive **historical DNS and WHOIS data**. Track how a domain's DNS records changed over time, discover related domains through shared nameservers or IP ranges, and enumerate subdomains. API available for automated infrastructure analysis and threat hunting.

### [Intelligence X](https://intelx.io)

Search engine for **leaked data, darknet content and public OSINT sources**. Indexes paste sites, breach databases, Tor hidden services, WHOIS records and public documents. Search by email, domain, IP, Bitcoin address, IBAN or phone number. Useful for breach verification and exposure assessment.

### [WiGLE](https://wigle.net)

Wireless network **geolocation database**. Community-contributed data mapping Wi-Fi networks (SSIDs, BSSIDs, encryption type) and cell towers to physical locations worldwide. Search by SSID name or MAC address to find where a network has been seen. Useful for wireless security auditing and OSINT investigations.

### [Have I Been Pwned](https://haveibeenpwned.com)

Check if an email address or password has appeared in **known data breaches**. Created by Troy Hunt, the database covers billions of compromised accounts across hundreds of breaches. Offers domain-wide search for organizations and a password API for checking credentials against known leaks without exposing the password.

---

## Network & Infrastructure

### [IPLeak.net](https://ipleak.net/)

Test your VPN, proxy or Tor connection for **IP, DNS and WebRTC leaks**. Shows your public IPv4/IPv6 addresses, DNS servers your browser is using, and whether WebRTC is exposing your real IP. Essential check before any engagement to verify your operational security setup is working correctly.

### [ifconfig.me](https://ifconfig.me)

Minimal service that returns your **public IP address** and request metadata. Curl-friendly — `curl ifconfig.me` returns just the IP. Also shows User-Agent, remote host, and other HTTP headers. Useful for quick IP checks in scripts and verifying egress through VPNs or tunnels.

### [BGP Toolkit (HE)](https://bgp.he.net)

Hurricane Electric's **BGP and network lookup** tool. Query ASN ownership, IP prefix announcements, peering relationships and routing tables. Look up any IP to find its originating AS and allocated prefix. Essential for network forensics, ISP analysis and understanding internet routing infrastructure.

### [MXToolbox](https://mxtoolbox.com)

All-in-one **email and DNS diagnostics** platform. Test MX records, check if an IP is blacklisted across 100+ DNSBLs, verify SPF/DKIM/DMARC configuration, trace SMTP delivery and analyze email headers. The go-to tool for troubleshooting email deliverability and investigating spam infrastructure.

### [Duck DNS](https://www.duckdns.org)

Free **dynamic DNS** service. Point a subdomain of `duckdns.org` to your current IP address and keep it updated automatically. Simple API — update your IP with a single `curl` call or a cron job. Useful for accessing home labs, C2 callbacks, reverse shell listeners and VPN endpoints on dynamic IPs without paying for a static address.

### [GreyNoise](https://www.greynoise.io)

Tells you whether an IP is **mass-scanning the internet** or specifically targeting you. GreyNoise collects and analyzes internet-wide scan traffic, tagging known scanners, crawlers and worms. Query any IP to see if it's background noise (benign scanners, research projects) or potentially targeted activity worth investigating.

---

## Red Team & Offensive Reference

### [Pentest Book](https://www.pentest-book.com)

Comprehensive, community-driven **penetration testing reference**. Covers the full engagement lifecycle — reconnaissance, exploitation, post-exploitation, Active Directory attacks, web application testing, privilege escalation, pivoting and reporting. Structured as an online book with searchable chapters and practical command examples.

### [RevShells](https://www.revshells.com)

Online **reverse shell payload generator**. Select your listener IP, port, shell type and target language — get a ready-to-use payload. Supports Bash, PowerShell, Python, PHP, Ruby, Perl, Netcat, socat and more. Includes encoding options (Base64, URL) and listener commands for the attacker side.

### [GTFOBins](https://gtfobins.github.io)

Curated list of **Unix binaries that can be exploited** to bypass local security restrictions. Each entry documents how a legitimate binary (find, vim, python, docker, etc.) can be abused for file read/write, SUID escalation, reverse shells or sudo privilege escalation. Essential reference for Linux post-exploitation.

### [LOLBAS](https://lolbas-project.github.io)

Living Off The Land Binaries, Scripts and Libraries — the **Windows equivalent of GTFOBins**. Documents legitimate Microsoft binaries and scripts (certutil, mshta, regsvr32, rundll32, etc.) that can be abused for code execution, file download, persistence, UAC bypass and credential theft. Key reference for Windows red teaming.
