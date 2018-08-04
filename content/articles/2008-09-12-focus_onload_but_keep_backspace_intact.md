---
title: "Focus onload but keep Backspace intact"
date: 2008-09-12
author: harmen-janssen
url: /articles/51/focus_onload_but_keep_backspace_intact
---

{{< intro >}}
<p>A lot of websites try to help you by auto-focusing on an input field on pageload, so you can start typing right away.</p>
<p>Well, thanks so much, you guys couldn't be more helpful.<br>
Except of course that I always use the Backspace key to move back in my history. By focusing on a form field you're essentially disabling some fundamental browser functionality.</p>
{{< /intro >}}

While the whole topic of auto-focusing on a form field is debatable, I have to admit that, yes, sometimes it can be helpful (think [Google](http://www.google.com), where all you do is searching). But every time a site breaks my Backspace key I grunt in discomfort.

So, web developers around the world, please, if you want to use a similar script in the future, use something along the lines of this:

 ```
window.onload = function () {
		// focus on the input field for easy access...
		var input = document.getElementById ('focusme');
		input.focus ();
		// ...but if someone wishes to go back in their history, let them!
		document.onkeydown = function (e) {
			if (!e) {
				var e = window.event;
			}
			if (e.keyCode === 8 && !input.value) {
				history.back();
			}
		};
	};
```

What this script does, is it focuses on the input field, but attaches an `onkeydown` event handler to the `document`, that makes the user travel back in their history whenever Backspace is hit and the input field is empty.

[See this page for an example](http://www.whatstyle.net/examples/backspace_plus_focus.html).

Obviously, it can be extended to remove the document event listener whenever someone's actually types in the form field, or something. But whatever you do or however you use this script, use **something**.

It's the little things that matter in usability, folks.