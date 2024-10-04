---
title: "CSS Trick: Remove borders from linked images"
date: 2009-08-18
author: harmen-janssen
url: /articles/63/css-trick-remove-borders-from-linked-images
---

<p>Here's a nice little <abbr title="Cascading Style Sheets">CSS</abbr> trick I cooked up today when talking to <a href="http://twitter.com/heliumworkx">@heliumworkx</a>.</p>
<p>You know how you sometimes use <code>border-bottom</code> to style links? Then you must be familiar with situations where there's an image inside a link on which the border looks really stupid. Unfortunately there's no <abbr title="Cascading Style Sheets">CSS</abbr> selector that targets links containing an <code>img</code> element, so a sprinkle of magic is needed in order to hide the border.</p>

---

It's a tiny sprinkle, really. Lookit;

```
a img {
	position: relative;
	top: 5px;
	margin-top: -5px;
	border: 0;
}
```

That's it! First of all, the `border: 0;` line removes the border browsers put on linked images by default. The real trick is in the positioning.

By pushing the image down 5 pixels, using the `position` and `top` properties, the image effectively masks the parent link's border.

However, this also means your image is placed 5 pixels below anything that it would usually be neatly aligned with. That's where `margin-top` comes in. The negative value of `-5px` pulls the image _and_ the containing links 5 pixels up again, putting it back in its original place.

Easy, eh? [Check the example here if you wish to see some real source code](http://www.whatstyle.net/examples/css-tricks/imageborderlink.html).

