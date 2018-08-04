---
title: "Formatting CSS, how not to do it"
date: 2008-03-09
author: harmen-janssen
url: /articles/43/formatting_css_how_not_to_do_it
---

{{< intro >}}
<p>
Every once in a while, I stumble across a piece of <abbr title="Cascading Style Sheets">CSS</abbr> and I think, <q>Now that's a handy method of formatting, I'm gonna try that in my next project</q>.</p>
<p>
One of those formatting styles is nesting your <abbr title="Cascading Style Sheets">CSS</abbr> rules according to the nesting level of the <abbr title="HyperText Markup Language">HTML</abbr> elements you target. I've tried it once, but never again.</p>
{{< /intro >}}

Let me first give an example of what I mean. Let's say you're writing <abbr title="Cascading Style Sheets">CSS</abbr> for the following bit of <abbr title="HyperText Markup Language">HTML</abbr>;

 ```
<div id="myWidget">
	<h2>This is my widget</h2>
	<ul>
		<li><a href="#">Foo</a></li>
		<li><a href="#">Bar</a></li>
		<li><a href="#">Baz</a></li>
	</ul>
	<p>Lorem ipsum</p>
</div>
```

 A clean way of formatting your <abbr title="Cascading Style Sheets">CSS</abbr> would be to nest and indent your rules according to these <abbr title="HyperText Markup Language">HTML</abbr> elements, like this;

 ```
#myWidget {}
	#myWidget h2 {}
	#myWidget ul {}
		#myWidget ul li {}
			#myWidget ul li a {}
	#myWidget p {}
```

 It's clean and easy to scan, and easy to edit, obviously.

 The trouble is, though, that in order to keep it this easy to scan, you have to keep specifying the entire "path" to the element. This would mess it up:

 ```
#myWidget {}
	#myWidget h2 {}
	#myWidget ul {}
			#myWidget a {}
	#myWidget p {}
```

Now it doesn't conform to your own formatting standards anymore.

But what happens if you keep specifying the entire path? You get too specific. Imagine you want to style the links in `myWidget` differently on one page, which you identify by an `id` in the `body` tag. You can only overwrite your existing style rules by doing this:

 `body#theOtherId #myWidget ul li a {}` Believe me; this becomes tedious pretty fast. And this is a very simple example. If you have a complex design, with a complex set of style rules and you have to use lots of `div`s, you quickly find yourself typing ridiculously long strings of space-separated ids.

### What's a good way of formatting <abbr title="Cascading Style Sheets">CSS</abbr>, then?

 Well, to each his own, obviously. And don't get me wrong, I've seen the above approach on several sites, it's obviously all about personal preference.

I, myself, write my styles like this nowadays (meaning the slightly old <abbr title="Cascading Style Sheets">CSS</abbr> on this website is a little different in formatting);

 ```
selector {
	property: value;
}

another-selector {
	property: value;
}
```

Nothing special really. I keep it all in one file, for two reasons:

1. It's less HTTP requests
2. I always know where to look for certain styles
 
The only thing I include is a global reset stylesheet ([preferably a reset stylesheet by Eric Meyer](http://meyerweb.com/eric/thoughts/2008/01/15/resetting-again/)), at the top of my main file.

Different sections I split by comments, like this:

 ```
/**
 *	General styles for elements and common classes/IDs
 */
```

These comments are always in English, even though I only work with Dutch developers. I do this because I like the fact that someone might take a peek at my styles, to learn from them.

Another tip: create a comment at the top of your file, containing all the hexadecimal color codes you use and a definition of what that color looks like and maybe where it's used, like this:

 ```
/**
 *	Color guide:
 *
 *	- #e5bfd6	= light pink	(border secondary content)
 *	- #96005a	= dark pink		(navigation)
 *	- #7a9283	= seagreen		(breadcrumbs)
 *	- #a1a1a5	= grey			(search-form)
 *	- #dee4e0	= light grey	(border intro)
 *	- #ffcc00	= dark yellow	(poll vote count)
 *	- #3399cc	= blue			(poll vote count alternative)
 */
```

Unless you're a mathematical wizard who can clearly see the seagreen that is `#7a9283`, this'll save you a trip or two back to your browser or image editing program.

 If you're interested, you can [view this stylesheet to see all the above mentioned formatting standards in place](http://tap-uitvaart-ouwerkerk.nl/css/screen.css). It's the style sheet from [one of my latest projects](http://tap-uitvaart-ouwerkerk.nl).

 In the end, it's all a matter of personal preference. I'm interested in your way of formatting. Leave a comment and tell me about it!