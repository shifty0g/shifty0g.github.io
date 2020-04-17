---
title: "Tools"
permalink: /tools/
date: 2020-03-09
layout: single
classes: wide
---

Just a Few scripts - nothing special. enjoy my bad code 



Ultimate Nmap Parser 
========================

[https://github.com/shifty0g/ultimate-nmap-parser](https://github.com/shifty0g/ultimate-nmap-parser)

One nmap parser to rule them all!

Features
-------------------

* Parse out IP addresses of hosts that are Up/Down
* Generate .csv file
* Generate a summary report of open ports 
* Parse out TCP,UDP and Unqiue ports
* Generate URL list from open web ports - https://192.168.2.11:443
* Generate a list of SMB connections - SMB://X.X.X.X
* Generate a list of SSL/TLS ports.
* Parse out a list of IP:PORT - 192.168.2.11:443
* Create indidivual files for IPs of open ports to be used with other tools

Install
----------

{% highlight bash %}
git clone https://github.com/shifty0g/ultimate-nmap-parser
chmod +x /ultimate-nmap-parser/ultimate-nmap-parser.sh 
{% endhighlight %}






Lazy net-tools 
========================

[https://github.com/shifty0g/lazy-net-tools](https://github.com/shifty0g/lazy-net-tools)

a simple bash script to check network connectivity and set various things 
nothing special just to make things a little eaiser 

Features
--------------
* Set Static IP
* Set DHCP IP
* Set Default
* Set nameserver 
* Add entries to hosts file 
* net-check - checks connectivity - arp,ping,dns,portscan,curl
* Speedtest - using speedtest-cli
* Find public IP
* Block IPv4 and IPv6 addresss using iptables,arptables and ip6tables
* Display iptables
* flush iptables


Install
-----------
{% highlight bash %}
cd /usr/share

git clone https://github.com/shifty0g/lazy-net-tools

cd lazy-net-check

chmod +x net-check.sh

./net-tools.sh net-tools-install

* runs the function to instal the additional tools required and adds source entry to ~/.bashrc
{% endhighlight %}