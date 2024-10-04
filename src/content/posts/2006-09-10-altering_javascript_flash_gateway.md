---
title: "Altering JavascriptFlashGateway"
date: 2006-09-10
author: harmen-janssen
url: /articles/9/altering_javascript_flash_gateway
---

<p>
In my current project, some communication between Javascript and Actionscript is needed. While a couple of years ago, this was hard to achieve and relied on unstable techniques that were not very cross-browser compatible, Macromedia made a developer's life a little easier by introducing the <em>JavascriptFlashGateway</em>. 
</p>

---

JavascriptFlashGateway makes it easy to call Actionscript functions from a Javascript file. All you need is a Javascript-file and a SWF-file and you're good to go. More documentation on the installation process can be found [here](http://weblogs.macromedia.com/flashjavascript/ "Learn how to install FlashJavascriptGateway") and [here](http://osflash.org/doku.php?id=flashjs "Read more about the project").

### Enhancing it a little

Filled with child-like enthusiasm I installed the files on my server and started experimenting. The syntax is very easy to use, so I was up and running in no-time.

Yet when I started adding HTML to the page, I noticed the JavascriptFlashGateway erasing all original markup and replacing it with its FlashTag code. How rude!

Naturally, I tried the following... (full syntax description can be found in the link above)

```
window.onload = function ()
{
	var uid = new Date().getTime();

	var flashProxy = new FlashProxy(uid, 'JavaScriptFlashGateway.swf');

	var tag = new FlashTag ('test.swf',550,400);
	tag.setFlashvars ('lcId='+uid);
	tag.write(document.getElementById ('content_div'));

	flashProxy.call('foo','arg');
}
```

Notice how I replaced `document` with `document.getElementById('content_div')`, in comparison with the installation tutorial.

Nothing happened! A quick look at the [Error Console](https://addons.mozilla.org/firefox/1815/ "Download Error Console for Firefox") made clear that <q>doc.write is not a function</q>.

I fired up _JavascriptFlashGateway.js_ and searched for the `write` method of the `FlashTag` class. The code I found was:

```
FlashTag.prototype.write = function(doc)
{
   doc.write (this.toString());
}
```

Obviously, this won't work on HTML-objects (like one returned by `document.getElementById ()`), because there is no `write` method available as a member of those objects.

Luckily, it takes just a tiny alteration to extend this method. Change the above function to the following:

```
FlashTag.prototype.write = function(doc)
{
   (doc == document) ? doc.write (this.toString()) : doc.innerHTML = (this.toString());
}
```

Now the `write` method checks to see if the passed argument is `document`, or something else. If so, it uses `write()`, if not, it changes the `innerHTML` property of an HTML-object. If you're feeling lazy you can [download the altered file here](http://www.whatstyle.net/examples/JavaScriptFlashGateway.rar "Download the altered file") as a RAR-archive.

### Enhancing it even a little more

This should work in most cases, but I might be wrong. I would love to receive some feedback on this alteration, in order to make it perform even better. So feel free to leave a comment if you can improve my code.

### Native support

I wanted to email the creators of this fine product, [Christian Cantrell](http://weblogs.macromedia.com/cantrell/ "Visit Mr. Cantrell's weblog") and [Mike Chambers](http://weblogs.macromedia.com/mesh/ "Visit Mr. Chambers' weblog"), but I couldn't find a contactpage on either of the two weblogs. Hopefully they will read this article and include this alteration in future releases of JavaScriptFlashGateway.

