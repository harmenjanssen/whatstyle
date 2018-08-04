---
title: "A quick note on unobtrusive Javascript"
date: 2007-03-01
author: harmen-janssen
url: /articles/19/a_quick_note_on_unobtrusive_javascript
---

{{< intro >}}
<p>
For Javascript to work truely unobtrusive, a webpage should remain usable at all times. This means that a page should work if:
</p>
<ul>
 <li>Javascript is enabled</li>
 <li>Javascript is disabled</li>
 <li>The required Javascript function is unavailable</li>
</ul>
{{< /intro >}}

### "Javascript is enabled"

 Obviously, this is the responsibility of the client-side programmer. Don't code stuff that doesn't work!

### "Javascript is disabled"

 Don't rely on Javascript to be available! This means: don't fill an `a` element's `href` attribute with stuff like `javascript:doStuff();`, or just with `#`.

 Always use the right value, e.g. the URL you want to anchor to point to. People who have Javascript disabled can then still visit your pages.

### "The required Javascript function is unavailable"

 This is a different kind of beast. What if only half of Javascript's native functions is available? This scenario is most likely to happen on intranets that make use of firewalls or other security systems.

 It's even possible a user has limited Javascript a bit himself, so webpages won't interfere with his browsing experience. But how can you be sure a certain function is available?

### Testing before executing

 I almost always start my DOM scripts with the following:

 ```
var W3CDOM = (document.getElementsByTagName && document.getElementById && document.createElement);
if (!W3CDOM) return false;
```

 I've seen the "`var W3CDOM = ...`" convention once at [Peter-Paul Koch's Quirksmode](http://www.quirksmode.org) and adopted this good practice. This checks if your favourite DOM manipulation functions are available before starting the script and using them.

### Use return values

 To get back at the `a` element example; most of the time you can use a function's return value to determine wether or not to proceed. Take this bit of HTML:

 `<a href="http://www.whatstyle.net" onclick="return !window.open('http://www.whatstyle.net');">Click me!</a>` As you can see, the onclick event on this `a` element _returns the inverted return-value of the `window.open` function._

That's quite a mouth-full. What it means is this:  
 I take the return-value of `window.open` (either true or false) and invert that using the `NOT operator` "`!`".  
 In other words: if `window.open` returns `true`, `!` makes it `false`, and vice versa.

 As you probably know, this piece of code...

 `<a href="http://www.whatstyle.net" onclick="return false;">Click me!</a>`...will get a user nowhere, because the default action of the link (travelling through hyperspace to another location) is disabled, while this...

 `<a href="http://www.whatstyle.net" onclick="return true;">Click me!</a>`...acts as your regular link. Taking these facts into account, the event handler above will return `false` if `window.open` is successfully executed, and thus open a new browser window while keeping the original window in the current place (instead of opening a new window containing Whatstyle.net **AND** travelling to Whatstyle.net in the original window).  
 Naturally, when `window.open` fails to execute, the event handler will return `true`, sending the user effectively to the correct location in the same browser window. Yay! Everyone can enjoy your content.

 An example can be found [here](http://www.whatstyle.net/examples/popupreturn.php). Testing is easy; just disable Javascript and see what happens. Testing for unavailable methods is harder, so for your convenience, I've also created a [second example](http://www.whatstyle.net/examples/popupreturn2.php), which includes the following code:

```
<script type="text/javascript">
	window.open = null;
</script>
```

 Presto; a call to `window.open` will always return `false`, but your content is still available to all.