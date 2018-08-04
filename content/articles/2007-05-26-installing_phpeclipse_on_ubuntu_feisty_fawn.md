---
title: "Installing PHPEclipse on Ubuntu Feisty Fawn"
date: 2007-05-26
author: harmen-janssen
url: /articles/27/installing_phpeclipse_on_ubuntu_feisty_fawn
---

{{< intro >}}
<p>
I recently installed <a href="http://www.ubuntu.com/">Ubuntu</a>'s latest version, <em>Feisty Fawn</em>.</p>
<p>
I'm not really comfortable yet, since I don't have <em>any</em> Linux experience whatsoever, and I didn't have time to research and play around extensively the last couple of days.</p>
<p>One of the first things I did after I installed the operation system, was downloading and installing <a href="http://www.phpeclipse.de">PHPEclipse</a>, my favourite code editor on both Mac and Windows.</p>
<p>I'm not sure why, and it may just be my inexperience with the system, but I ran into some errors. Fortunately, after lots of Google-searching, I managed to install it correctly.</p>
{{< /intro >}}

 It isn't even that hard actually, and I'm a little surprised I had problems in the beginning. I want to share the method I used for installing Eclipse and PHPEclipse, for there might be another lost soul like me somewhere out there. Also, the downside of open-source software (especially \*nix based software) is that manuals, documentations and the like are always a bit vague to me.

To compete with that, here's a clear outline of the installation process. Follow the steps and you're good to go. I promise.

1. From your desktop, go to **Applications -> Accessories -> Terminal**
2. Inside the terminal, type the following: `sudo apt-get install eclipse`
3. Eclipse 3.2.2 will now be installed. You will be asked for your password.
4. When the procedure is done, Eclipse will reside inside **Applications -> Programming**. Click on it to start the program.
5. Then, inside Eclipse, go to **Help -> Software Updates -> Find And Install...**
6. Check "Search for new features to install", and click on "New Remote Site".
7. Use "PHPEclipse Update Site" as a name and, more importantly, use "<http://phpeclipse.sourceforge.net/update/releases>".
8. A new remote site is added. Click 'next' and 'finished' until you enter a screen that provides a button labeled "Install All". Click it.
9. PHPEclipse is now installed. After restarting Eclipse, open the PHP view and create a new file. A dialog box tells you an error has occurred and you have to take a look inside the Log.
10. Close Eclipse, surf to [http://www.plog4u.org/index.php/Using\_PHPEclipse\_:\_Installation\_:\_Installing\_PHPEclipse#Ubuntu\_Feisty\_7.04\_Fix](http://www.plog4u.org/index.php/Using_PHPEclipse_:_Installation_:_Installing_PHPEclipse#Ubuntu_Feisty_7.04_Fix) and follow the instructions listed there.
11. Restart Eclipse and all is well!
 
 Hopefully this information will help someone who, just like me, has basically no clue what to do in Linux ;)