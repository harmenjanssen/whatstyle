---
title: "Image popups that fit"
date: 2006-08-23
author: harmen-janssen
url: /articles/3/image_popups_that_fit
---

First of all; popup windows should not be used. They're annoying, unfriendly thingies that should only be used as a last resort. Jakob Nielsen even states it the number 2 Web Design Mistake in his <a href="http://www.useit.com/alertbox/990530.html" title="See what Mr. Nielsen has to say">Top Ten</a>. So don't use 'em! There are <a href="http://www.huddletogether.com/projects/lightbox2/" title="Lightbox JS v2.0 by Lokesh Dhakar">much</a> <a href="http://codylindley.com/Javascript/257/thickbox-one-box-to-rule-them-all" title="ThickBox by Cody Lindley">better</a> <a href="http://amix.dk/greybox/demo.html" title="GreyBox by Amir Salihefendic">alternatives</a> anyway. But if you really, <em>really</em> want to use popups, this article provides you with a handy approach.

---

### Don't rely on Javascript

Popup windows require Javascript. Javascript, being a client side scripting language and all, can be turned off by the user. Never rely on it.

Using bogus destinations in your links will get you nowhere:

`<a href="#">click to open a window</a>` With Javascript turned off, nothing will happen and your audience will be confused and thus annoyed. Besides, Google won't spider your precious content, since it's not available in the `href` attribute. So instead, use something like this:

`<a href="path/to/content/">click to see some content</a>` This way, users with Javascript turned off will still be able to view your content. _These are basic fundamentals when it comes to Javascript popups, [A List Apart](http://www.alistapart.com/articles/popuplinks/ "Read more about popup basics") features more information if things are still unclear._

### Popping up images

We now have the basics all sorted out, let's focus on images. Regardless of popups being evil, they're still being used quite a lot by graphic artists, photographers et cetera in order to show their work in greater detail. As is especially the case with dynamic content, you might not know beforehand which dimensions to use when popping up images. The script below uses basic Javascript to calculate the image's dimensions before opening the new window. This will ascertain a perfect fit, as can be seen in this [example](http://www.whatstyle.net/examples/popups1.html "View the example").

All files can be [downloaded](http://www.whatstyle.net/examples/popups.rar "Download the package") as a RAR-archive.

### Javascript calculations

I'm going to be very brief in my explanation and just explain the general structure of the code. The script is pretty basic anyway and is written as a plug-and-play solution to be used by even the biggest development dummy.

```
function initPopups ()
{
	var W3CDOM = (document.getElementById && document.getElementsByTagName);
	if (!W3CDOM) return;
	var as = getElementsByClass ('popup',document,'a');
	for (var i = 0; i  0)
		{
			as[i].onclick = function ()
			{
				var imgsrc = this.href;
				var img = new Image();
				img.src = imgsrc;
				img.onload = function ()
				{
					var dims = [img.width,img.height];
					popImage(dims,imgsrc);
				}
				return false;
			}
		}
	}
}
```

This function is used to initialise the script. It uses [Dustin Diaz](http://www.dustindiaz.com/getelementsbyclass/ "Dustin Diaz's getElementsByClass function")'s `getElementsByClass` method to fetch all `a`-elements with a "popup" class. It then assigns an `onclick` event handler to all of them which creates a new Image-object, with a `src` attribute containing the link's `href` value.

Take special care in this bit of code:

```
img.onload = function ()
{
	var dims = [img.width,img.height];
	popImage(dims,imgsrc);
}
```

You can't fetch information about the image before it has completely loaded. Therefore, I assign an onload handler which triggers the next function:

```
function popImage (dims,imgsrc)
{
	var width = dims[0];
	var height = dims[1];
	var win = window.open ('image.html?url='+imgsrc,'popwin','width='+width+',height='+height);
}
```

This function then pops up a window as big as the image so it fits nicely inside. _image.html_ fetches the URL of the image from the `GET-variable` "url" and creates an image element. In my example I added some extra functionality for closing the window by clicking on the image and displaying a message you can do so by mousing over the image.

```
window.onload = function ()
{
	var img = document.createElement ('img');

	var url = window.location.href.split('?');
	var imgsrc = url[1].substring(4);

	img.src = imgsrc;
	img.alt = '';

	var body = document.getElementsByTagName('body')[0];
	body.appendChild(img);

	var p = document.createElement ('p');
	p.id = 'close';
	p.appendChild(document.createTextNode ('Click to close window'));

	body.appendChild(p);

	img.style.cursor = 'pointer';
	img.onmouseover = function ()
	{
		p.style.display = 'block';
	}
	img.onmouseout = function ()
	{
		p.style.display = 'none';
	}
	img.onclick = function ()
	{
		window.close ();
	}
}
```

### Some things to keep in mind

Note that in _image.html_ I added some CSS rules to cancel out the default margin of the `body` element. I did this because the default margin would otherwise shove the image over the window borders, undoing everything we've achieved.

Also, the script is run within the `onload` event handler of the `window` object:

`window.onload = initPopups;` When using multiple scripts on your pages, that are all initialised in the `onload` handler, remember that only one method can be assigned to an event handler at a time. You can solve this problem with the following code:

```
window.onload = generalInit;
function generalInit ()
{
	initPopups();
	someOtherFunction();
}
```

To work, then! Upload the files to your server, include the following markup in your pages...

`<a class="popup" href="someBigImage.jpg"><img alt="" src="someSmallImage.jpg"></img></a>`...and include _popup.js_ in the `head` of your document...

`<script src="popup.js" type="text/javascript"></script>`...but remember, kids: **use 'em sparingly!**

