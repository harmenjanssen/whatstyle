---
title: "Testing IE6 on Mac using VirtualBox"
date: 2009-08-07
author: harmen-janssen
url: /articles/62/testing-ie6-on-mac-using-virtualbox
---

<p>I recently came across <a href="http://www.virtualbox.org">VirtualBox</a>, which is a great app that lets you run virtual machines on your Mac. Surprisingly, Microsoft offers different installations of Windows as disc images for free on their site.</p>
<p>So with these two combined, you have a pretty sweet testing environment. Properly configuring Windows in the virtual machine can be a bit of pain in the ass though, so this article aims to break it down into small, easy steps to get you up and running in no time.</p>

---

### Downloading and installation

![The VirtualBox logo](/blog/images/virtualbox-logo.jpg)First, you need the Virtual Box app, obviously. [Go to the download page](http://www.virtualbox.org/wiki/Downloads), grab the Mac distribution, and install it.

Meanwhile, [choose an image from the list at the Microsoft site](http://www.microsoft.com/Downloads/details.aspx?FamilyID=21eabb90-958f-4b64-b5f1-73d0a413c8ef&displaylang=en).

When you have Virtual Box installed and your disc image is downloaded, you'll notice the disc image is a `.exe` file. Not to worry, it's actually just an archive file, so unpack it using something like [UnRarX](http://www.unrarx.com/).

Along with some Read Me files, you'll end up with a `.vhd` file, that's the file you're gonna need. Save it somewhere where it makes sense to you.

### Creating you first virtual machine

Fire up Virtual Box. Choose "New" to create a new machine. Give it a name and follow the steps until you come across the point where you choose "Create new hard disk" or "Use existing hard disk". Choose the latter and select that `.vhd` from earlier.

Congrats! You can now run Windows in your virtual machine.

Chances are, however, you're gonna run into problems. Read on to learn about some common ones.

### `CmBatt.sys` and `compbatt.sys` missing

[Download the disc image file of Service Pack 3 here](http://www.microsoft.com/downloads/details.aspx?FamilyID=2fcde6ce-b5fb-4488-8c50-fe22559d164e&displaylang=en). You now have an `.iso` file that you can mount inside the virtual machine. When the virtual machine is your focused app, you can choose `Devices > Mount CD / DVD-Rom`. Do this and choose the Service Pack 3 ISO file. If it doesn't show an autorun screen, go to "My Computer" and double-click the disc.

Start the installation process. At one point it's extracting all SP3 files. When it's done, leave the screen alone, don't choose "Next" or whatever. Make sure the "Missing files" dialog box from the hardware detection is visible (you may have to manually pop it up by going to "Add Hardware" under "Control Panel"). When it complains about the aforementioned files, point it to a directory like `c:\a819b0059e04c1755\i386`. This is where that installer from before extracted all its files, and the missing files will be there.

So now that's out of the way, cancel out the Service Pack 3 installer, you don't need it anymore.

### Sound and USB

Sound and USB weren't working for me. Then again, I don't need sound and USB in a virtual machine.

In Virtual Box, right-click on your machine, choose "Settings", and under "Audio", uncheck "Enable audio". Also, under "Ports", uncheck "Enable USB controller". This should get rid of those annoying messages.

### No network is available in the virtual machine

What good is a virtual machine to a web developer when he cannot view online content, eh?

Right-click your virtual machine and choose "Settings". Under "Network", make sure "Enable Network Adapter" is checked and the Adapter-type is set to "PCnet-FAST III (Am79C973)". Then start your machine.

In the menu, under "Devices", choose "Install Guest Additions". Continue the installation process and reboot your virtual machine.

Now open a terminal and execute the following command:

```
d:\vboxwindowsadditions-x86.exe /extract
```

The necessary files are now located in `C:\Program Files\Sun\xVM VirtualBox Guest Additions\x86\Network\AMD`. Point the hardware detection concerning AMD to that folder and it will successfully install the required drivers.

If all went well, you now have a functional virtual machine in which you can test Internet Explorer. Please note that the Microsoft disc images expire after five months or so, but new ones will be put up on the site so you can just download a fresh copy. This hasn't happened to me yet, but I'm afraid you're gonna have to walk through the above steps all over again, alas. At least you've got 'em all in one place now!
