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

just a lazy one to quickly list out the nmap scripts avalible

{% highlight bash %}
alias nmap-scripts='ls -la /usr/share/nmap/scripts/'
{% endhighlight %}

