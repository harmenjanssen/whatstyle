---
title: "Use less DIV, use more HTML - Part Deux"
date: 2007-03-29
author: harmen-janssen
url: /articles/23/less_div_more_html_2
---

<p>
<a href="http://arjaneising.nl/">Arjan Eising</a> posted an interesting comment to my <a href="http://www.whatstyle.net/articles/22/less_div_more_html">previous article</a>:</p>
<blockquote>
<p>
Nice job done on this... but what will happen when you don't use the body element for instance? While it is not needed to markup your text valid...
</p>
</blockquote>
<p>This article provides an answer.</p>

---

As I expected, the techniques presented in "Use less DIV, use more HTML" work fine in documents where the `BODY` or `HTML` elements are omitted.

I'm not entirely sure how this works, but as I understand it; modern browsers add these elements when rendering your document. Don't take my word for it, I'm not at all sure about the technical details behind this.

Word of warning: when omitting `BODY` or `HTML` in XHTML, these examples won't work. [Anne van Kesteren](http://www.annevankesteren.nl) says [here](http://annevankesteren.nl/2004/10/standards):

> When you are really using XHTML, which is different from most XHTML you just have to make sure you got the namespace right and the rest is up to you. Note that when you are leaving out an element in (real) XHTML (I dislike to put the term "real" in front of it) it really isn't there, this is different from HTML when you can try to leave out an element by omitting it's start and end tags, but it will be there.

Last but not least, the actual example can be found [here](http://www.whatstyle.net/examples/nobody.html). I created another example [here](http://www.whatstyle.net/examples/nobody2.html) that uses a more complicated CSS selector, that, to me, proves there are indeed a `HTML`, `HEAD` and `BODY` element available in the document.

