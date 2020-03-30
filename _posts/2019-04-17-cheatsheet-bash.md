---
title: "Lazy Bash Tricks for Pentesters"
date: 2019-04-17 12:52:16 +0000
comments: true
published: true
toc: true
tags:  
  - bash
  - script
  - alias
categories: 
  - cheatsheet 
---

So here is a collections of bits i keep in my .zshrc (yes im a zsh guy) to make my life easier. This is a growing list 

To install or use most of these can be added into `.bashrc` file providing you have the tool setup properly


# nmap

## Coloured nmap output

make nmap look pretty and colourful

{% highlight bash %}
# install grc
sudo apt-get install grc
# create a new alias for nmap 
alias nmap="grc nmap"
{% endhighlight %}

![](/assets/images/bash/1.png)

## list out the nmap scripts 

just a lazy one to quickly list out the nmap scripts avalible

{% highlight bash %}
alias nmap-scripts='ls -la /usr/share/nmap/scripts/'
{% highlight bash %}

## update nmap

update alias

{% highlight bash %}
alias nmap-update="nmap -script-updatedb"
{% highlight bash %}


### quick nmap scans 


{% highlight bash %}
# host discovery
alias nmap-ping='sudo nmap -sP -v -n -oA nmap_ping $1'
alias nmap-xmas='sudo nmap -n -sX -oN nmap_xmas $1'
alias nmap-protocol='sudo nmap -T4 -sO $1 -oA nmap_proto'

alias nmap-disc-adv='sudo nmap -v -n -PE -PM -PS21,22,23,25,26,53,80,81,110,111,113,135,139,143,179,199,443,445,465,514,548,554,587,993,995,1025,1026,1433,1720,1723,2000,2001,3306,3389,5060,5900,6001,8000,8080,8443,8888,10000,32768,49152 -PA21,80,443,13306 -oA nmap_disc_adv $1'
alias nmap-disc-adv2='nmap -sn --min-hostgroup 100 -vv --max-hostgroup 125 -PE -PM -PS21,22,23,25,26,53,80,81,110,111,113,135,139,143,179,199,443,445,465,514,548,554,587,993,995,1025,1026,1433,1720,1723,2000,2001,3306,3389,5060,5900,6001,8000,8080,8443,8888,10000,32768,49152 -PP -PU161,139 -PA22,80,443,445,3389 --source-port 53 $1 -oA nmap_disc_adv2'

# tcp
alias nmap-tcp-fast='nmap -sSV -F -vvv --reason -oA nmap_tcp_fast $1'
alias nmap-tcp-full='nmap -sSV -vvv -p0- --reason -oA nmap_tcp_full $1'
alias nmap-tcp-fullconn='nmap -sTV -vvv -p0- --reason -oA nmap_tcp_fullconn $1'
alias nmap-tcp-def='nmap -sSV -vvv --reason --script=banner,version -oA nmap_tcp_def_safe $1'

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



# grep 

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

# grep out URL -  may need to tidy output up a little 
alias grep-url="egrep -o 'http.+'"
{% endhighlight %}


### Metasploit

{% highlight bash %}
# update metasploit
alias m-update='apt update; apt install metasploit-framework'
{% endhighlight %}


### Nessus 

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



### Networking 

{% highlight bash %}
alias i='ifconfig -a'
alias ifu='ifconfig eth0 up'
alias ifd='ifconfig eth0 down'

# run tcpdump`
alias td='tcpdump -i eth0'

# clear arptables & iptables 
alias tables-flush='iptables -Z && iptables -F && arptables -Z && arptables -F'

# will clear everything and get a dhcp address on eth0
alias dhcp='ip a flush eth0 && ifconfig eth0 down && ifconfig eth0 up && dhclient -v eth0 && ifconfig eth0 && echo "" && cat /etc/resolv.conf && echo "" && ip route'

# run netstat see what ports are listening
alias ports='netstat -tulanp'
{% endhighlight %}


### Misc 

{% highlight bash %}

# chmod
alias read='chmod +r $1'
alias write='chmod +w $1'
alias execute='chmod +x $1'

# up and down dirs
alias ..='cd ..'
alias ...='cd ../../../'
alias ....='cd ../../../../'
alias .....='cd ../../../../'
alias .4='cd ../../../../'
alias .5='cd ../../../../..'
alias bk='cd ..'

# better ls
alias ls='ls --color=auto --group-directories-first'
alias l='ls --color=auto --group-directories-first -rthla'
alias ll='ls -l --color=auto'
alias du='du -h -c'
alias diff='colordiff' # sudo apt-get install colordiff

# lazy clear
alias cl='clear && l'
alias c='clear'
alias C='clear'

# misc
alias mkdir='mkdir -pv'
alias e!='exit'
alias now='date +"%T"'
alias nowtime=now
alias nowdate='date +"%d-%m-%Y"'
alias xo='xdg-open .'  # opens current directory in explorer

# start firefox 
alias f='nohup firefox &>/dev/null &'

# apt-get 
alias update='sudo apt-get update'
alias updatesys='apt-get update && apt-get upgrade'
alias updatedist='apt-get dist-upgrade'
alias install="sudo apt-get install"
alias remove="sudo apt-get remove"

# opens current directory in explorer
alias xo='xdg-open .'  

# Safety checks
alias rm='rm -I --preserve-root'
alias cp='cp -i'
alias mv='mv -i'
alias mkdir='mkdir -p'
alias h='history'
alias j='jobs -l'
alias which='type -a'
alias ln='ln -i'
alias chown='chown --preserve-root'
alias chmod='chmod --preserve-root'
alias chgrp='chgrp --preserve-root'
{% endhighlight %}



### Preperation

{% highlight bash %}
# create target.txt file just use 't'
alias t="nano targets.txt && realpath targets.txt && echo "------------------------------------------" && cat targets.txt && echo"

# create excludes.txt file just  use 'e'
alias e="nano excludes.txt && realpath excludes.txt && echo "------------------------------------------" && cat excludes.txt && echo"
{% endhighlight %}

