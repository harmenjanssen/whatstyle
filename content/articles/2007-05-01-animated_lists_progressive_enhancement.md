---
title: "Animated lists: Graceful degradation using CSS 3"
date: 2007-05-01
author: harmen-janssen
url: /articles/25/animated_lists_progressive_enhancement
---

{{< intro >}}
<p>I like to think of creative ways to provide <a href="http://www.digital-web.com/articles/fluid_thinking/" title="Read more about graceful degradation at Digital Web">graceful degradation</a>; <q>If Javascript is disabled, is there a CSS way to use the 
features Javascript would provide?</q>. Most of the time, the answer, sadly, is &quot;No&quot;.</p>
<p>With CSS 3 however, it's a lot easier to provide gimmicky stuff without having to write Javascript, and therefore, it's easier to 
provide graceful degradation. <strong>Note: the example in this article will only work in browsers that support (parts of) the CSS 3 
spec, such as Firefox.</strong></p>
{{< /intro >}}

First, let me show you the final version of my example. [Check it out here](http://www.whatstyle.net/examples/swapping_lists.html). This version has the right Javascript and CSS in place. You can click the links at the bottom of the page to see a new list get into the "viewport" in an animated fashion.

### Bare bones: the HTML

The HTML page is quite simple, really. You can view the stripped-down version (without any CSS or Javascript) [here](http://www.whatstyle.net/examples/swapping_lists_bare.html).

As you can see, it's a simple setup of five different lists. Easy to read, easy to access, and fairly semantic (although a purist could argue all items should belong to the same list.). Note that the links at the bottom of the page link to anchors instead of new pages.

### More flair: CSS 2.1

I've provided [another version of the page here](http://www.whatstyle.net/examples/swapping_lists_css2.1.html). It contains some simple style rules to spice up the document. Nothing really fancy is going on here, I've created a small "viewport" that can show one list at a time, using these style-rules:

 ```
#list-overlay {
	position: absolute;
	height: 100px;
	clip: rect(0,152px,132px,0px);
	overflow: visible;
}
#list-overlay ul {
	position: relative;
	width: 150px;
	float: left;
	list-style: none;
	border: 1px solid #000;
	padding: 0; 
	margin: 0;
}
```

### Behaviour: CSS 3

[In the next example](http://www.whatstyle.net/examples/swapping_lists_css3.html), I've used CSS 3 to create some behaviour, that you would usually find inside a Javascript. Remember the links in the HTML? Those pointed to anchors inside the same document. Anchors that corresponded with the `id` attributes of the different lists in the page.

Thanks to the very useful [`:target`](http://www.w3.org/TR/css3-selectors/#target-pseudo) pseudo-selector, I can serve different style-rules to the targeted element. I use this pseudo-selector to bring the targeted list into view.  
 The following code shows how:

 ```
#list-overlay ul + ul:target { left: -152px; }
#list-overlay ul + ul + ul:target { left: -304px; }
#list-overlay ul + ul + ul + ul:target { left: -456px; }
#list-overlay ul + ul + ul + ul + ul:target { left: -608px; }
```

As you can see, all functionality from the final example is now in place. The only thing missing is the fancy animation.

### Behaviour: Javascript

Again, [here is the final example](http://www.whatstyle.net/examples/swapping_lists.html), with Javascript's only enhancement being the animation. I'm not going to discuss the entire Javascript here, you can fetch it from the page. I've added a decent amount of comments, so you should be able to figure out what's going on.

### Graceful degradation

Hopefully I've proved with this example that CSS 3 brings us closer to true graceful degradation. A website does not have to be "All or nothing", or "Enhanced or dull". Sometimes an intermediate level of enhancement is available and especially in the case of CSS 3, you can get very close to your final Javascripted result, without touching a line of script.