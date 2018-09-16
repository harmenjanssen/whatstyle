---
title: "Be careful when fetching width!"
date: 2007-07-26
author: harmen-janssen
url: /articles/35/be_careful_when_fetching_width
---

{{< intro >}}
<p>I stumbled across a little oddity today. It kept me busy for longer than I would've liked, so I thought I'd share (although you're probably not very likely to run into the problem, since it's not a very common situation).</p>
{{< /intro >}}

Consider this little bit of code:

 `<img alt="My picture" src="mypic.jpg" style="width:200px;" width="500"></img>`If you want to fetch the width of that image, like this...

 `alert(myImage.width);`...it will actually give you the width as declared in the CSS rule, e.g. the rendered width! It makes sense, as this is the actual rendered width, but it can really be a pain in the butt when you're trying to access the `width` attribute instead of the rendered width. [View the source of this example for some proof](http://www.whatstyle.net/examples/imgwidth.html).

As I said; you're probably not likely to run into the problem, but it's good to know about it. You never know.

It can be easily worked around by the way, by using the W3C standard method `getAttribute`.
