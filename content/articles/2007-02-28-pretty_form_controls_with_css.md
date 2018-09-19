---
title: "Pretty form controls with CSS"
date: 2007-02-28
author: harmen-janssen
url: /articles/18/pretty_form_controls_with_css
---

{{< intro >}}
<p>
As Roger Johansson proves in his article(s) on <a href="http://www.456bereastreet.com/archive/200409/styling_form_controls/" title="See what Roger's got to say">styling form controls</a>, you are very limited when it comes to spicing up form controls.</p>
<p>
There are some sites around that provide an alternative, but these techniques rely heavily on Javascript to swap the normal form control with an image.</p>
<p>With the <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr>3 pseudo-class <code>:checked</code> as my weapon of choice, I'll provide a way to make checkboxes pretty using <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr> only (and tell you in which browsers it goes wrong).</p>
{{< /intro >}}

### The semantic layer

 I want to start with a semantic layer. A good hack should be built upon the same foundation you would use in the regular scenario. This means regular `input` elements, combined with regular `label` elements.

 ```
```
<fieldset> <legend>Check some boxes</legend> <input id="foo_field" name="test[]" type="checkbox" value="foo"></input><label for="foo_field">Foo</label> <input id="bar_field" name="test[]" type="checkbox" value="bar"></input><label for="bar_field">Bar</label> <input id="baz_field" name="test[]" type="checkbox" value="baz"></input><label for="baz_field">Baz</label> <input name="subm" type="submit" value="Submit"></input></fieldset>The label's `for` attribute corresponds to the input's `id`, as to provide a way to focus on the field by clicking the label, something that this technique relies heavily upon, as I will explain later.

So far we have a regular form, nothing special. I'm going to use <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr> to make these regular checkboxes look like these:

 ![An unchecked box](https://www.whatstyle.net/examples/bullet.gif) ![A checked box](https://www.whatstyle.net/examples/bullet_checked.gif)(The icons are part of an icon set provided by [Paul Armstrong](http://paularmstrongdesigns.com))

### The presentational layer

 Because labels can be used to focus on an input element, I can use them to mimic the actual controls. Check out the <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr>:

 ```
fieldset {
	overflow: hidden;
	position: relative;
	}
input[type=checkbox] { 
	position: absolute;
	left: -999em;
	}
input[type=checkbox] + label {
	display: block;
	height: 16px;
	padding-left: 25px;
	background: url(bullet.gif) top left no-repeat;
	}
input[type=checkbox]:checked + label {
	background-image: url(bullet_checked.gif);
	}
```

 First, I throw out the actual checkbox. Thanks to `left: -999em;`, they are shoved out of the fieldset, effectively making them invisible. Then I use the labels to act as a container for the checkbox-image.

 Thanks to the `:checked` pseudo-class and the [sibling selector](http://www.w3.org/TR/REC-CSS2/selector.html#adjacent-selectors), I can differentiate between a checkbox's `checked` and normal state!

Check [this example](http://www.whatstyle.net/examples/checkboxes.php) to see it in action. The same thing works great for radio-buttons by the way. Of course, it wouldn't be a proper <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr> experiment if there weren't some nasty issues involved...

### Browser issues

#### Working browsers

 The technique works in the latest versions of Firefox, Opera and Camino, as well as Netscape and Mozilla. No problems whatsoever.

#### Internet Explorer 6

My <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr> is a little too advanced for IE6. It understands almost none of my <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr> rules (due to the heavy use of [attribute selectors](http://www.w3.org/TR/REC-CSS2/selector.html#attribute-selectors)).

The good thing is; the form remains unstyled and therefore usable. You could easily load up a different stylesheet using a Conditional Comment, or even place the IE style-rules before the advanced style-rules in the same stylesheet. Easy to work around.

#### Internet Explorer 7

The crappy thing about IE7 is that it does understand all my <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr> rules, except for the vital `:checked` pseudo-class. So everything looks good, and even works good (when you click some checkboxes and hit submit, you'll see the values get to the other side of the form anyway), but the "behaviour" of the checkbox is gone.

No worries though; just load up an additional stylesheet in a conditional comment and you can display the checkboxes the regular way.

#### Safari

Safari is nasty on this one. Just like IE7, it doesn't support the `:checked` pseudo-class, but what's even worse; labels in Safari do not provide the handy click-and-focus method they do in other browsers! So unlike IE7, Safari won't even send the proper values back after submitting.

[Chris Cassell has written a nice Javascript](http://www.chriscassell.net/log/2004/12/19/add_label_click.html), of which I think it's good practice to include it in every site that contains form controls anyway. It solves the click-and-focus problem, but I won't get the pretty checking and unchecking behaviour unless I also script some alternative to the `:checked` pseudo-class. A pity.

 <ins datetime="20070228"> **Edit:** I just found [this article](http://www.ibloomstudios.com/article1/) that provides a way to hack Safari. I'm not a big fan of <abbr title="Cascading Style Sheets">CSS</abbr> hacks, but you could use this to fork different style-rules to Safari and fix the technique if you want. Remember though; the minute Apple removes this bug from Safari, your forms will break. </ins>### So, will you use it?

I know I won't. At least not on regular sites, e.g. sites that should not break in Apple's browser.

IE's faulty behaviour can be worked around (did I mention conditional comments?), but Safari's faulty behaviour will require scripting. If I wanted to solve this through scripting, I wouldn't have gone through the hassle of typing all those <abbr title="Cascading Style Sheets"><abbr title="Cascading Style Sheets">CSS</abbr></abbr>3 style-rules.

 Too bad, though, because I think this technique is much cleaner than any Javascript alternative.
