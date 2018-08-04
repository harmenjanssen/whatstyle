---
title: "CSS Tricks episode 1: 100% width in a variable width container"
date: 2008-06-29
author: harmen-janssen
url: /articles/48/css_tricks_1_100_percent_width_in_a_variable_width_container
---

{{< intro >}}
<p>
I'm extremely busy these days. Busy working my dayjob, where lots of clients ask for my attention, and busy planning to move to another appartment in the coming weeks.</p>
<p>
Because of that, Whatstyle hasn't seen any big articles nor updates for a long time now. Because of that, I've decided to start a series of small articles with quick solutions in the field of <abbr title="Cascading Style Sheets">CSS</abbr>. Every time I solve some problem that might be unusual, difficult, or interesting, I'll write up an example and explain it here. Something you can then add to your toolbox, in the back of your head, so you can easily implement it and move on the next issue.</p>
<p>
Today the article's about giving <strong>an absolutely positioned element</strong> a 100% width when it's <strong>variable width parent</strong> has padding on the sides.</p>
{{< /intro >}}

Source order control
--------------------

Lately I'm working real hard on creating a logical source order in my <abbr title="HyperText Markup Language">HTML</abbr> files. Main content always comes first, followed by some optional secondary and/or tertiary content. Navigation elements always come last in my documents. It is then the job of <abbr title="Cascading Style Sheets">CSS</abbr> to make sure the navigation ends up in the right place.

Most of the time I achieve this using absolute positioning, pulling the content that's near to the bottom up to the top of the screen. There are, however, some problems with that technique, because the absolutely positioned content loses context and isn't aware anymore of its surrounding elements, and vice versa.

100% width and padding
----------------------

Take a look at the following <abbr title="Cascading Style Sheets">CSS</abbr>:

 ```
#container {
	position: relative;
	width: 600px;
	padding: 0 10px;
}
#child {
	position: absolute;
	top: 0;
	left: 10px;
	width: 600px;
}
```

This works, [see for yourself](http://www.whatstyle.net/examples/css-tricks/borderpadding/borderpadding-0.html). But what if we change some values to variable units? Something like this:

 ```
#container {
	position: relative;
	width: 80%;
	padding: 0 3em;
}
#child {
	position: absolute;
	top: 0;
	left: 3em;
	width: 100%;
}
```

As you probably understand, I cannot set an exact width in pixels on the `#child`, because I can never know the exact width of the parent. The result of the above attempt however, [is the child spilling out of the container](http://www.whatstyle.net/examples/css-tricks/borderpadding/borderpadding-1.html).

What to do now?

Use borders for padding
-----------------------

If your container has a solid background, you can use borders instead of padding to achieve the exact same layout.

Change your <abbr title="Cascading Style Sheets">CSS</abbr> like this:

 ```
#container {
	position: relative;
	width: 80%;
	padding: 0;
	border: 3em solid #fff;
	border-width: 0 3em;
}
#top {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
}
```

What I've done here is remove the padding on the parent and replace it with borders of the same width. [Presto, the child is contained within its parent again](http://www.whatstyle.net/examples/css-tricks/borderpadding/borderpadding-2.html).

This works because borders always render _outside_ an element, as opposed to padding, which happens on the inside. Using this technique, I don't have to think of the width of the child element as `75% - 3em = ?`. The width isn't altered at all in the last example, because I used borders instead of padding, while the final layout remains the same.

Remember this one, it's so stunningly easy to implement, with so little side-effects, that I think this trick deserves a place in the back of your head.