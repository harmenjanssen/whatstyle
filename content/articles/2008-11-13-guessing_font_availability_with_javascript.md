---
title: "Guessing font availability with Javascript "
date: 2008-11-13
author: harmen-janssen
url: /articles/54/guessing_font_availability_with_javascript
---

{{< intro >}}
<p>Recently I wanted to use an uncommon font in a website, but the site was too image-rich to use <a href=”http://www.mikeindustries.com/blog/sifr/”>sIFR</a>, (loading time made for an uneasy user experience).</p>
<p>I decided to add the font anyway in my stylesheet, and provide a “lo-fi” experience, for people who didn’t have the font handy.</p>
<p>The lo-fi version however, should mimic the style of the uncommon font as good as possible.</p>
<p>Sometimes, though, that’s easier said than done.</p>
{{< /intro >}}

### The problem

The font in question was [Copperplate Gothic Light](”http://en.wikipedia.org/wiki/Copperplate_Gothic”). I had chosen the classic [Times New Roman](”http://en.wikipedia.org/wiki/Times_New_Roman”) as my backup font (playing it safe), but Times in no way mimics Copperplate.

The only similarity between the two fonts is the fact that they’re both [Serifs](”http://en.wikipedia.org/wiki/Serif”).

In order for me to make Times look like Copperplate, I had to at least display the text in `small-caps`.

This is where the first obstacle presented itself: using CSS, I cannot specify a different `font-variant` for my number one choice than for my fall-back font.  
 Consider this piece of CSS:

 ```
h2 {
	font-family: