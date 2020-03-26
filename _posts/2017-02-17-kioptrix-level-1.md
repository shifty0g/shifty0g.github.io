---
title: "Kioptrix Level 1"
date: 2017-02-17 12:52:16 +0000
comments: true
categories: challenges
tags: challenges
---

This is a challenge writeup on my blog to sharpen my markdown skillz and figure out a nice template going forward! 
A nice ez box to start with :D 
 
 
**Name:** Kioptrix: Level 1 (#1)

**Date release:** 17 Feb 2010

**Author:** Kioptrix

**Series:** Kioptrix

**Web page:** [http://www.kioptrix.com/blog/?page_id=135](http://www.kioptrix.com/blog/?page_id=135)

**Vulnhub URL:** [https://www.vulnhub.com/entry/kioptrix-level-1-1,22/](https://www.vulnhub.com/entry/kioptrix-level-1-1,22/)

**Description:**

This Kioptrix VM Image are easy challenges. The object of the game is to acquire root access via any means possible (except actually hacking the VM server or player). The purpose of these games are to learn the basic tools and techniques in vulnerability assessment and exploitation. There are more ways then one to successfully complete the challenges.


<!-- more -->
## Port Scanning

### TCP

`nmap -sS -n -oN 192.168.0.23.quick.nmap 192.168.0.23`



![alt text]({{ site.baseurl }}/assets/images/kioptrix1/1.png)

### UDP

Decided to mix it up and use unicorncan here.

`unicornscan -mU -r200-Iv -p 0-65535 -l 192.168.0.23_udp.unicorn 192.168.0.23`


![alt text]({{ site.baseurl }}/assets/images/kioptrix1/2.png)


## Service Enumeration

### 22 - ssh

`ssh 192.168.0.23`

Not that easy. Default and silly credentials didnt work here (root:root, est)

### 80 - http

http://192.168.0.23

![alt text]({{ site.baseurl }}/assets/images/kioptrix1/3.png)

Just some default content. I ran Nikto and Dirb against the web service which returned a few bits. 

`nikto -h 192.168.0.23`

`dirb http://192.168.0.23`


```bash
Server: Apache/1.3.20 (Unix)  (Red-Hat/Linux) mod_ssl/2.8.4 OpenSSL/0.9.6b
/test.php
Allowed HTTP Methods: GET, HEAD, OPTIONS, TRACE 
OSVDB-877: HTTP TRACE method is active, suggesting the host is vulnerable to XST
OSVDB-682: /usage/: Webalizer may be installed. Versions lower than 2.01-09 vulnerable to Cross Site Scripting (XSS). http://www.cert.org/advisories/CA-2000-02.html.
OSVDB-3268: /manual/: Directory indexing found.
OSVDB-3092: /manual/: Web server manual found.
OSVDB-3268: /icons/: Directory indexing found.
OSVDB-3233: /icons/README: Apache default file found.
OSVDB-3092: /test.php: This might be interesting...
```

### 139 - netbios

`enum4linux 192.168.0.23 > enum4linux_192.168.0.23`

```bash
KIOPTRIX       Wk Sv PrQ Unx NT SNT Samba Server

Domain=[MYGROUP] OS=[Unix] Server=[Samba 2.2.1a]

//192.168.0.23/IPC$	[E] Can't understand response:
//192.168.0.23/ADMIN$	[E] Can't understand response:
```
 
## Exploitation

**Exploit used:** [https://www.exploit-db.com/exploits/10/](https://www.exploit-db.com/exploits/10/)

`searchsploit samba`

searchsploit was used to find a exploit in the version of samba running on port

The exploit was downloaded and compiled 

![alt text]({{ site.baseurl }}/assets/images/kioptrix1/4.png)

Started a netcat listener on port 4444

![alt text]({{ site.baseurl }}/assets/images/kioptrix1/5.png)

Run the exploit 

![alt text]({{ site.baseurl }}/assets/images/kioptrix1/6.png)

Get root shell on the target!😎😎😎

From here we can get a tty and read the flag

![alt text]({{ site.baseurl }}/assets/images/kioptrix1/end.png)
