---
title: "Lazy Bash Tricks for Pentesters"
excerpt: A collection of useful bits and bobs which I have made to make life easier when pentesting
date: 2019-04-17 12:52:16 +0000
comments: true
published: true
toc: true 
toc_sticky: false
classes: wide
header:
  teaser: 
  teaser_home_page: true
tags:  
  - bash
  - script
  - alias
categories: 
  - cheatsheet 
---

So here is a collections of bits I have in my .zshrc (yes im a zsh guy)

To install or use most of these can be added into `.bashrc` file providing you have the tool setup correctly.

I will keep adding cool bits to this list overtime. 






grep 
=============
some day to day greps that always useful to keep at the ready. 

{% highlight bash %}
#colored grep
alias grep='grep --color=auto'
alias egrep='egrep --color=auto'
alias fgrep='fgrep --color=auto'

#grep out just ip address 129.168.0.1 (cat nmap.gnmap | grep-ip)
alias grep-ip='grep -oE "\b([0-9]{1,3}\.){3}[0-9]{1,3}\b"' 

#grep out just ipv6 address  3ffe:1900:4545:3:200:f8ff:fe21:67cf (ifconfig | grep-ip6)
alias grep-ip6='grep -oE "(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))"'

#grep out just MAC addres 08:00:27:3b:0c:7d (ifconfig| grep-mac)
alias grep-mac="grep -oE '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'" 

# grep out URL http://test.com -  may need to tidy output up a little 
alias grep-url="egrep -o 'http.+'"
{% endhighlight %}






nmap
======

Coloured nmap output
---------------------

make nmap look pretty and colourful

{% highlight bash %}
# install grc
sudo apt-get install grc
# create a new alias for nmap 
alias nmap="grc nmap"
{% endhighlight %}

![](/assets/images/bash/1.png)


list out the nmap scripts 
----------------------------

just a lazy one to quickly list out the nmap scripts avalible. somehow i use it quite a bit along with grep

{% highlight bash %}
alias nmap-scripts='ls -la /usr/share/nmap/scripts/'
{% endhighlight %}


update nmap script DB
---------------------------

alias to update nmap and its scripts database 

{% highlight bash %}
alias nmap-update="sudo apt-get install nmap && nmap -script-updatedb"
{% endhighlight %}

Scanning alias 
---------------------------

quite a few useful alias 

examples:
{% highlight bash %}
nmap-tcp-full	192.168.1.1/24
nmap-udp-def	192.168.1.2
{% endhighlight %}


{% highlight bash %}
# host discovery
alias nmap-ping='sudo nmap -sP -v -n -oA nmap_ping $1'
alias nmap-xmas='sudo nmap -n -sX -oN nmap_xmas $1'
alias nmap-protocol='sudo nmap -T4 -sO $1 -oA nmap_proto'

alias nmap-disc-adv='sudo nmap -v -n -PE -PM -PS21,22,23,25,26,53,80,81,110,111,113,135,139,143,179,199,443,445,465,514,548,554,587,993,995,1025,1026,1433,1720,1723,2000,2001,3306,3389,5060,5900,6001,8000,8080,8443,8888,10000,32768,49152 -PA21,80,443,13306 -oA nmap_disc_adv $1'
alias nmap-disc-adv2='nmap -sn --min-hostgroup 100 -vv --max-hostgroup 125 -PE -PM -PS21,22,23,25,26,53,80,81,110,111,113,135,139,143,179,199,443,445,465,514,548,554,587,993,995,1025,1026,1433,1720,1723,2000,2001,3306,3389,5060,5900,6001,8000,8080,8443,8888,10000,32768,49152 -PP -PU161,139 -PA22,80,443,445,3389 --source-port 53 $1 -oA nmap_disc_adv2'

# tcp
alias nmap-tcp-fast='nmap -sSV -F -vv --reason -oA nmap_tcp_fast $1'
alias nmap-tcp-full='nmap -sSV -vvv -p0- --reason -oA nmap_tcp_full $1'
alias nmap-tcp-fullconn='nmap -sTV -vv -p0- --reason -oA nmap_tcp_fullconn $1'
alias nmap-tcp-def='nmap -sSV -vv --reason --script=banner,version -oA nmap_tcp_def_safe $1'

# udp
alias nmap-udp-def='nmap -v -sU -Pn -n --reason -oA nmap_udp_def $1'
alias nmap-udp-fast='nmap -v -Pn -sU -n -F --reason -oA nmap_udp_fast $1'

# vulnscan
# this needs the vulscan script installing - https://github.com/scipag/vulscan
alias nmap-tcp-vulnscan='nmap -sS -v --reason --script=vulscan/vulscan.nse --script-args vulscanshowall=1 -oN nmap_vulnscan $1'

# nmap - deeper scripts
alias nmap-tcp-def-script-vuln-unsafe='nmap -sSV ---script exploit,vuln --script-args=unsafe=1 -oN nmap_tcp_script-vuln-unsafe $1'
alias nmap-tcp-fast-script-heavy-unsafe='nmap -sSV -F --script vuln,brute,exploit,intrusive,fuzzer --script-args=unsafe=1 -oN nmap_tcp_script-heavy-unsafe $1'
{% endhighlight %}




metasploit
========================

{% highlight bash %}
# update metasploit **BE CAREFUL**
alias m-update='apt update; apt install metasploit-framework'
{% endhighlight %}




Nessus 
====================

{% highlight bash %}
# start service
alias nessus-start='service nessusd start'

# stop service
alias nessus-stop='service nessusd stop'

#update nessus
alias nessus-update='/opt/nessus/sbin/nessuscli update --all'

# nessus cli
alias nessus-cli='/opt/nessus/sbin/nessuscli'

# start nessus and open in firefox
alias n="service nessusd start && sleep 1.5 && nohup firefox https://localhost:8834/ &>/dev/null &"
{% endhighlight %}





Log Info
================

This function is useful just to quickly save a record of things such as IP Address, Current User and Time before you start a test.
creates a file called info.txt in current directory

Use:

{% highlight bash %}
loginfo	
{% endhighlight %}

Code:

{% highlight bash %}
function loginfo () {
#logfile="info_$(date "+%m-%d-%y_%H-%M").txt"
logfile="info.txt"
echo "---------------------" | tee  $logfile
echo "date:"                 | tee -a $logfile
echo "---------------------" | tee -a $logfile
date                         | tee -a $logfile
echo "---------------------" | tee -a $logfile
echo "User:"                 | tee -a $logfile
echo "---------------------" | tee -a $logfile
id							 | tee -a $logfile
echo "---------------------" | tee -a $logfile
echo "pwd"                   | tee -a $logfile
echo "---------------------" | tee -a $logfile
pwd                          | tee -a $logfile
echo "---------------------" | tee -a $logfile
echo "ifconfig:"             | tee -a $logfile
echo "---------------------" | tee -a $logfile
ifconfig                     | tee -a $logfile
echo "---------------------" | tee -a $logfile
echo "Route:"                | tee -a $logfile
echo "---------------------" | tee -a $logfile
route                        | tee -a $logfile
echo "---------------------" | tee -a $logfile
echo "/etc/resolv.conf"      | tee -a $logfile
echo "---------------------" | tee -a $logfile
cat /etc/resolv.conf         | tee -a $logfile
echo "---------------------" | tee -a $logfile
echo "nmap --iflist"      | tee -a $logfile
echo "---------------------" | tee -a $logfile
nmap --iflist		       | tee -a $logfile
echo "---------------------" | tee -a $logfile
}
{% endhighlight %}
