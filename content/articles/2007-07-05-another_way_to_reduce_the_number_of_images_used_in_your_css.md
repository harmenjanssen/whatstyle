---
title: "Another way to reduce the number of images used in your CSS"
date: 2007-07-05
author: harmen-janssen
url: /articles/32/another_way_to_reduce_the_number_of_images_used_in_your_css
---

{{< intro >}}
<p>
I did some fairly obvious pondering today. In a website I'm currently working on two images are used for some pagination links. Simple images representing a white arrow on a colored background.</p>
<p>There's one image for the regular link state, and one image for the link's <code>hover</code> state, which is the same except for the differently colored background.</p>
<p>It just hit me I could do this with only <strong>one</strong> image.</p>
{{< /intro >}}

These are two images that work in the same way:

 ![The image for a regular link](http://www.whatstyle.net/examples/pic1-normal.jpg) ![The image for a hovered link](http://www.whatstyle.net/examples/pic1-hover.jpg)The CSS for the link would be something like this:

 ```
a {
width: 100px;
height: 100px;
display: block;
}
a { background: url(pic1-normal.jpg) no-repeat; }
a:hover { background: url(pic1-hover.jpg) no-repeat; }
```

But, I can achieve the exact same effect using only one image, let's say a PNG, with a transparent background, and use CSS like this:

 ```
a {
width: 100px;
height: 100px;
display: block;
}
a { background: #000 url(pic1.png) no-repeat; }
a:hover { background-color: #f00; }
```

Like I said; this is all very obvious and nothing new, but sometimes it's good to read a reminder. Check out [this page to see a comparison](http://www.whatstyle.net/examples/arrowbg.html).

### Related reading:

- If anything, use [CSS Sprites](http://www.alistapart.com/articles/sprites/)
- [A more fancy example](http://www.alistapart.com/articles/supereasyblendys) by Matthew O'Neill