---
title: "Styling quotations"
date: 2006-08-23
author: harmen-janssen
url: /articles/4/styling_quotations
---

<p>
I've always liked the way most standards-compliant browsers display inline quotations (marked up with <code>&lt;q&gt;</code>). In case you don't have such a browser at your disposal; it's an easy concept to grasp, these browsers put quotation-marks around the text like this:
</p>
<img src="https://www.whatstyle.net/examples/quote.jpg" alt="A picture of how inline quotations look in standards-compliant browsers" width="283" height="30">

---

<ins datetime="2006-08-27">**Warning: the technique described in this article should not be used. Make sure to read my [edit](#edit "Read the edit").**</ins>

Internet Explorer however, does not use this default styling. But since you probably want quotation marks around your quotations, you've got two options:

1. Insert the quotes yourself like this:

```
  <q>
  <strong>"</strong> To be or not to be. <strong>"</strong>
  </q>
```

2. Don't bother about semantics and use different markup.

Since I'm advocating accessible coding in my articles, option 2 is out of the question. Semantic markup really helps assistive devices, so it shouldn't be abandoned.

Option 1 however, looks allright in Internet Explorer, but in most other browsers you end up with a double set of quotation marks, like this:

![A picture showing the awkward double set of quotation marks in standards-compliant browsers](https://www.whatstyle.net/examples/double_quote.jpg) That just looks plain silly. Luckily, this is easy to overcome using the following <abbr title="Cascading Style Sheets">CSS</abbr>:

```
q:before,
q:after {
	content: "";
	}
```

And that's that. IE won't understand the `:before` and `:after` pseudo-selectors, more advanced browsers will cut the default quotation marks off. It's a small problem, with an easy solution, but tiny details like this can really be a finishing touch.

### Edit: turns out I was wrong

As pointed out to me in the comments, the W3C certainly has a different opinion on the matter. Explorer is wrong and this time it isn't the author's job to rectify their mistake. Related reading, as provided by Sébastien Guillon:

- [http://www.w3.org/TR/<abbr title="HyperText Markup Language">HTML</abbr>4/struct/text.<abbr title="HyperText Markup Language">HTML</abbr>\#h-9.2.2](http://www.w3.org/TR/html4/struct/text.html#h-9.2.2 "The W3C recommendation on quotes")
- [http://acjs.net/weblog/2005/06/10/language_specific_styling_quotation_marks/index.<abbr title="Php: Hypertext Preprocessor">PHP</abbr>](http://acjs.net/weblog/2005/06/10/language_specific_styling_quotation_marks/index.php "An in-depth article on quotations in specific languages")
- [http://sebastienguillon.com/journal/2005/07/guillemets-francais-en-<abbr title="Cascading Style Sheets">CSS</abbr>](http://sebastienguillon.com/journal/2005/07/guillemets-francais-en-css "Read Sébastien's own article on the matter")
