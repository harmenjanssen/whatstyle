---
title: " Use less DIV, use more HTML"
date: 2007-03-26
author: harmen-janssen
url: /articles/22/less_div_more_html
---

{{< intro >}}
<p>
I always try to write my <abbr title="HyperText Markup Language">HTML</abbr> as clean as possible. This means, among other things, the following:
</p>
<ul>
 <li>Always try and find the most semantic elements and attributes for the job</li>
 <li>Don't use too many redundant <code>div</code> elements, none if possible</li>
</ul>
<p>The latter item will be the subject of this article. I've been playing around with using the <code><abbr title="HyperText Markup Language">HTML</abbr></code> element in my <abbr title="Cascading Style Sheets">CSS</abbr> rules lately, and it turns out to be one helluva flexible element. We really have to start using <code>BODY</code> and <code><abbr title="HyperText Markup Language">HTML</abbr></code> as the block-level elements they are!</p>
{{< /intro >}}

Most developers that know what they're doing won't litter their documents with unnecessary divisions.   
 There's one `div` that's always returning in most <abbr title="Cascading Style Sheets">CSS</abbr>-based layouts though: the "container" div.

### Get rid of your container!

The container is used for a lot of different purposes. It makes it easy to center content for example. Instead of doing...

 `h1,h2,p,ul,ol, [...] { margin: 0 auto; }`...you can do...

 `#container { width: 90%; margin: 0 auto; }`The thing is, all your elements are already contained in a "container" element: `body`. And that body is also contained within a "container" element: `<abbr title="HyperText Markup Language">HTML</abbr>`!

So, from this moment on, whenever you want to center content, you don't need to include a container division, just copy the <abbr title="Cascading Style Sheets">CSS</abbr> in [this example](http://www.whatstyle.net/examples/double_bg/centerbody.htm).  
 It's cleaner, it has less code, and therefore; less clutter and lower maintenance.

The above works because, just like `h4`, `p`, `ol` and `pre`, the `<abbr title="HyperText Markup Language">HTML</abbr>` element is just a block-level element. That means you can style it in any way you would style a simple paragraph.

### Adding images

There's more: to me, adding background-images is by far the easiest if you add them to the `body` element. An image placed at `background-position: bottom;` will **always** be at the bottom of the page, for example.  
 But if you think about it; if you want an image to appear at the bottom of the visual stacking order, why do you never see anyone do this:

 `html { background: #fff url(my_background.gif) top left no-repeat; }``<abbr title="HyperText Markup Language">HTML</abbr>` is the lowest possible element in the stacking order there is, so it makes sense, doesn't it?

It works in exactly the same way it would as if you add the image to the `body` element. In fact, taking this in consideration; a common <abbr title="HyperText Markup Language">HTML</abbr> document provides two of those nice, omnipresent style hooks for adding imagery!

[This example](http://www.whatstyle.net/examples/double_bg/double_bg2.htm) shows this interesting effect. The repeating clouds would usually be attached to the body, leaving the grassy footer to be attached to a redundant `div` element. There's no need for that! Not at all! Use `<abbr title="HyperText Markup Language">HTML</abbr>`!

### Applying existing ideas

I've prepared [another example](http://www.whatstyle.net/examples/double_bg/double_bg3.htm) in which I use Dan Cederholm's excellent [Faux Columns](http://alistapart.com/articles/fauxcolumns/) technique. Normally, I would add another `div` to encapsulate the columns, and attach the faux column image to that element, but with my new-found respect for the `<abbr title="HyperText Markup Language">HTML</abbr>` element, I can now add the faux column to the `body`, leaving `<abbr title="HyperText Markup Language">HTML</abbr>` wide open for a "regular" background-image.

### Browser support

As with every new <abbr title="Cascading Style Sheets">CSS</abbr> hocus-pocus, it's interesting to know in which browser it goes wrong. I've tested in the following browsers...

- Firefox 2
- Safari
- Camino
- Opera 9
- Internet Explorer 6
- Internet Explorer 7
 
...and I'm actually just baffled. It works. Everywhere. I've found no bugs or irregularities whatsoever.

### If you love <abbr title="HyperText Markup Language">HTML</abbr> so much, why don't you marry it?

I've got nothing against the occasional `div`. Me and the divisions get along just fine. I just think that every now and again, someone should emphasize the importance of semantic <abbr title="HyperText Markup Language">HTML</abbr>. Lots of developers who convert from table-based layouts to div-based layouts actually think the `div` element is some kind of replacement for tables and litter their documents with it, using it to contain all sorts of content. I merely want to point out that a division should only be used when you _need_ it, not as a replacement for more semantic elements, and certainly not _by default._

 <ins datetime="2007-03-29">Inspired by Arjan's comment to this article, [I wrote a follow-up article](http://www.whatstyle.net/articles/23/less_div_more_html_2), providing an answer to his question.</ins>