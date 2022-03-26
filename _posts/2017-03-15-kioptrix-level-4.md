---

title: "Kioptrix Level 1.3 (#4)"
date: 2017-03-15 12:52:16 +0000
comments: true
categories: challenges
published: false
---

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/header.png)


**Name:** Kioptrix: Level 1.3 (#4)

**Date release:** 8 Feb 2012

**Author:** Kioptrix

**Series:** Kioptrix

**Web page:** [http://www.kioptrix.com/blog/?p=604](http://www.kioptrix.com/blog/?p=604)

**Vulnhub:** [https://www.vulnhub.com/entry/kioptrix-level-13-4,25/](http://www.kioptrix.com/blog/?p=604)

<!-- more -->


## Host Discovery

### Arp

decided to use netdiscover this time

`netdiscover`

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/1.png)

### Ping

`ping 192.168.0.24`

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/2.png)


![alt text]({{ site.baseurl }}/assets/images/kioptrix4/3.png)

## Port Scanning

### TCP

`nmap -sS -A -sC -sV -O -p0- 192.168.0.24 -oA nmap_tcp_full_verOSscript`

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/4.png)

### UDP

`nmap -sU -n 192.168.0.24 -oA nmap_udp_def`

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/5.png)

## Service Enumeration

### 22 - ssh

nothing here. no password :(

### 80 - http

http://192.168.0.24

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/6.png)

LigGoat secure Login Copyright (c) 2013!

### 445 - SMB

`enum4linux 192.168.0.24 | tee enum4linux.txt`


```bash
 ====================================== 
|    OS information on 192.168.0.24    |
 ====================================== 
[+] Got OS info for 192.168.0.24 from smbclient: Domain=[WORKGROUP] OS=[Unix] Server=[Samba 3.0.28a]

 ============================= 
|    Users on 192.168.0.24    |
 ============================= 
user:[nobody] rid:[0x1f5]
user:[robert] rid:[0xbbc]
user:[root] rid:[0x3e8]
user:[john] rid:[0xbba]
user:[loneferret] rid:[0xbb8]

 ========================================= 
|    Share Enumeration on 192.168.0.24    |
 ========================================= 
WARNING: The "syslog" option is deprecated
Domain=[WORKGROUP] OS=[Unix] Server=[Samba 3.0.28a]
Domain=[WORKGROUP] OS=[Unix] Server=[Samba 3.0.28a]

[+] Attempting to map shares on 192.168.0.24
//192.168.0.24/print$   Mapping: DENIED, Listing: N/A
//192.168.0.24/IPC$ [E] Can't understand response:
WARNING: The "syslog" option is deprecated
Domain=[WORKGROUP] OS=[Unix] Server=[Samba 3.0.28a]
NT_STATUS_NETWORK_ACCESS_DENIED listing \*


Password Complexity: Disabled
Minimum Password Length: 0

S-1-22-1-1000 Unix User\loneferret (Local User)
S-1-22-1-1001 Unix User\john (Local User)
S-1-22-1-1002 Unix User\robert (Local User)
S-1-5-21-2529228035-991147148-3991031631-1000 KIOPTRIX4\root (Local User)
S-1-5-21-2529228035-991147148-3991031631-501 KIOPTRIX4\nobody (Local User)
```

## Exploitation

Starting with the webapp. Supplying the username and password fields with a tick ' gives us a SQL error suggesting SQL injection attack here.


![alt text]({{ site.baseurl }}/assets/images/kioptrix4/7.png)

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/8.png)

we get a SQL error. taking this a step further using the usernames found from the enum4linux output and injecting a true MYSQL statement into the password field to try and login

Username: John
Password: ' OR 1=1 #

We can login :D 

Johns password is there for the taking.

I logged in again with the same technique to get roberts password

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/9.png)

I logged in again with the same technique to get roberts password

<iframe width="560" height="315" src="https://www.youtube.com/embed/AfIOBLr1NDU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Not much else we can do with the LigGoat so i moved on the try and login to SSH with the creds obtained.

We can login as John :D


![alt text]({{ site.baseurl }}/assets/images/kioptrix4/10.png)

After trying to move around I was kicked out . The same was experience as Robert

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/11.png)

After a while playing with the limited shell and research

Exploiting the echo command we break out into a bash shell

`echo os.system(‘/bin/bash’)`

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/12.png)

## Privilege Esculation

Now we need to get root

Looking around the system and in `/var/www`

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/13.png)

Inside the file checklogin.php with clear-text login creds

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/14.png)

Theres no root password either.

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/doh.png)

Note - Never store creds on a system in clear-text. this will be picked up quick by someone who knows what they are doing. You can hash the value in config files using something like MD5

Now we can jump into mysql

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/15.png)


Got a little stuck here and banged my head against a wall for a bit. I found the following guide

[https://www.adampalmer.me/iodigitalsec/2013/08/13/mysql-root-to-system-root-with-udf-for-windows-and-linux/](https://www.adampalmer.me/iodigitalsec/2013/08/13/mysql-root-to-system-root-with-udf-for-windows-and-linux/)

had a quick look for the file needed to do the business

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/16.png)

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/17.png)


looks good. followed the guide and got root :P:P

Never underestimate and forget the power of google. Step away from the problem for a while use google. Dont give up :D

Hope this was useful.

![alt text]({{ site.baseurl }}/assets/images/kioptrix4/end.gif)
