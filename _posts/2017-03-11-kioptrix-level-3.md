---
title: "Kioptrix Level 1.2 (#3)"
date: 2017-03-11 12:52:16 +0000
comments: true
categories: challenges
tags: challenges
---

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/header.png)

**Name:** Kioptrix: Level 1.2 (#3)

**Date release:** 18 Apr 2011

**Author:** Kioptrix

**Series:** Kioptrix

**Web page:** [http://www.kioptrix.com/blog/?p=358](http://www.kioptrix.com/blog/?p=358)

**Vulnhub:** [https://www.vulnhub.com/entry/kioptrix-level-12-3%2C24/](https://www.vulnhub.com/entry/kioptrix-level-12-3%2C24/)


<!-- more -->


## Host Discovery

### Arp

`arp-scan -l`

### Ping

`ping 192.168.0.20`

## Port Scanning

### TCP

`nmap -sS -A -sC -sV -O -p0- 192.168.0.20 -oA nmap_tcp_full_ver_sV`

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/1.png)


### UDP

`nmap -sU -n -oA nmap_udp_def 192.168.0.20`

No UDP ports found open

## Service Enumeration

### 22 - ssh

cant login. nothing of note

### 80 - http

http://192.168.0.20

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/2.png)


Found a login page

http://192.168.0.20/index.php?system=Admin

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/3.png)

**LotusCMS**

`nikto -h 192.168.0.20`

```bash
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.0.20
+ Target Hostname:    192.168.0.20
+ Target Port:        80
+ Start Time:         2017-06-19 11:32:35 (GMT-4)
---------------------------------------------------------------------------
+ Server: Apache/2.2.8 (Ubuntu) PHP/5.2.4-2ubuntu5.6 with Suhosin-Patch
+ Retrieved x-powered-by header: PHP/5.2.4-2ubuntu5.6
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Cookie PHPSESSID created without the httponly flag
+ No CGI Directories found (use '-C all' to force check all possible dirs)
+ Apache/2.2.8 appears to be outdated (current is at least Apache/2.4.12). Apache 2.0.65 (final release) and 2.2.29 are also current.
+ PHP/5.2.4-2ubuntu5.6 appears to be outdated (current is at least 5.6.9). PHP 5.5.25 and 5.4.41 are also current.
+ Server leaks inodes via ETags, header found with file /favicon.ico, inode: 631780, size: 23126, mtime: Fri Jun  5 15:22:00 2009
+ Web Server returns a valid response with junk HTTP methods, this may cause false positives.
+ OSVDB-877: HTTP TRACE method is active, suggesting the host is vulnerable to XST
+ OSVDB-12184: /?=PHPB8B5F2A0-3C92-11d3-A3A9-4C7B08C10000: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-12184: /?=PHPE9568F36-D428-11d2-A769-00AA001ACF42: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-12184: /?=PHPE9568F34-D428-11d2-A769-00AA001ACF42: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-12184: /?=PHPE9568F35-D428-11d2-A769-00AA001ACF42: PHP reveals potentially sensitive information via certain HTTP requests that contain specific QUERY strings.
+ OSVDB-3092: /phpmyadmin/changelog.php: phpMyAdmin is for managing MySQL databases, and should be protected or limited to authorized hosts.
+ OSVDB-3268: /icons/: Directory indexing found.
+ OSVDB-3233: /icons/README: Apache default file found.
+ /phpmyadmin/: phpMyAdmin directory found
+ OSVDB-3092: /phpmyadmin/Documentation.html: phpMyAdmin is for managing MySQL databases, and should be protected or limited to authorized hosts.
+ 7534 requests: 0 error(s) and 19 item(s) reported on remote host
+ End Time:           2017-06-19 11:32:57 (GMT-4) (22 seconds)
---------------------------------------------------------------------------
+ 1 host(s) tested
```


`dirb http://192.168.0.20`

A few intreasting directories 

```bash
---- Scanning URL: http://192.168.0.20:80/ ----
==> DIRECTORY: http://192.168.0.20:80/cache/
==> DIRECTORY: http://192.168.0.20:80/core/
+ http://192.168.0.20:80/data (CODE:403|SIZE:323)
+ http://192.168.0.20:80/favicon.ico (CODE:200|SIZE:23126)
==> DIRECTORY: http://192.168.0.20:80/gallery/
+ http://192.168.0.20:80/index.php (CODE:200|SIZE:1819)
==> DIRECTORY: http://192.168.0.20:80/modules/
==> DIRECTORY: http://192.168.0.20:80/phpmyadmin/
+ http://192.168.0.20:80/server-status (CODE:403|SIZE:332)
==> DIRECTORY: http://192.168.0.20:80/style/
```

http://192.168.0.20/phpmyadmin/

**phpmyadmin - 2.11.3.0**

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/4.png)


## Exploitation

We find an intreasting module to use in **metasploit**

**exploit/multi/http/lcms_php_exec**

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/5.png)

Execution of the exploit gives us a shell with **www-data** permissions

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/6.png)

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/ex.gif)

## Privilege Esculation

Looking around the file system

I found the user **loneferret** so decided to try bruteforce SSH using hydra. More on this later

**Gconfig.php** has mysql creds stored in clear-text which will be useful..

Checking back on my bruteforcing a little later we have a hit

`hydra -e nsr -l loneferret -P /usr/share/wordlists/rockyou.txt ssh -t 4`


![alt text]({{ site.baseurl }}/assets/images/kioptrix3/8.png)

Now SSH'd in as loneferret:starwars

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/9.png)

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/10.png)

`sudo ht`

gives us an error but using google fu we find a quickfix
[https://stackoverflow.com/questions/6804208/nano-error-error-opening-terminal-xterm-256color](https://stackoverflow.com/questions/6804208/nano-error-error-opening-terminal-xterm-256color)

Once we get it working we are faced with this screen.

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/11.png)

After fighting with the gui and figuring out how to use this I open /etc/sudoers using **alt+f**

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/12.png)

I added `, /bin/sh` to the end so we can bump to root.

Try again

![alt text]({{ site.baseurl }}/assets/images/kioptrix3/13.png)

got root :P