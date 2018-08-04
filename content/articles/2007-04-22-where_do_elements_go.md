---
title: "Where do elements go?"
date: 2007-04-22
author: harmen-janssen
url: /articles/24/where_do_elements_go
---

{{< intro >}}
<p>
As a response to <a href="http://www.whatstyle.net/articles/23/less_div_more_html_2#comment1243">Carst van der Molen</a>, who commented on my <a href="http://www.whatstyle.net/articles/23/less_div_more_html_2">latest article</a>, I've written some tests to check where HTML elements go when you're leaving out <code>HTML</code>, <code>HEAD</code> and <code>BODY</code> tags.</p>
{{< /intro >}}

I'm using the word "tags", because it are, in fact, only the tags that are left out of the document. The actual elements are inserted by the user agent.

[Carst van der Molen](http://www.carstvandermolen.nl) made the following interesting statement:

> Besides, I don't think you have any control what goes in the head and what goes in the body, which can be relevant for JavaScript execution if I'm not mistaken.

I've written some quick tests to see what exactly happens to elements when you leave out the popular containing tags.

The first one can be found [here](http://www.whatstyle.net/examples/nohtml1.html). The source is not very complicated, check it out to see what happens in detail. In summary; I've added some random elements to the document and a simple piece of Javascript loops through every element that exists inside the `HEAD` element, after which it prints the `nodeName` of that childnode to the document.

### Test results for Firefox

Interestingly, it apparently just makes some educated guesses of what goes where. `SCRIPT` elements for example, go inside the `HEAD` by default. **Even if the `SCRIPT` element resides at the very bottom of the document source!**. The same is true for `STYLE` elements.

### Test results for Safari

Safari gives back some odd results. The `SCRIPT` elements do not show up in the `HEAD` element! To make it sure they really aren't there, I've written [another script](http://www.whatstyle.net/examples/nohtml3.html). In Firefox, the word "SCRIPT" gets printed two times. In Safari, the page remains empty.

This was very unexpected to me, and I still don't really understand why this happens.

### Test results for Internet Explorer

IE versions 5, 6 and 7 all give the same results as Firefox.

### Test results for Opera

Opera does not give any results. It shows an empty document. This probably means it's a little more strict when reading the DOM than other browsers and does not make the left-out elements available to Javascript.

### Final results

It looks like Carst had a fair point when questioning the control one's having over where elements go. The best thing to do is probably just to add the `HTML`, `HEAD` and `BODY` tags to your document when writing HTML. On the other hand; I can't think of much examples where I absolutely need to know whether elements exist in the `HEAD` or the `BODY`. 9 times out of 10 I reference elements either by tag-name or id.

In conclusion I want to point out that the W3C validator makes the same educated guesses Firefox makes. Validate [the following example](http://www.whatstyle.net/examples/nohtml2.html) and you'll see the validator tells you it's an invalid document (due to a `STYLE` element being placed outside the `HEAD` element). If, however, the `STYLE` element comes before any other element that is considered to reside inside the `BODY`, it does actually validate.