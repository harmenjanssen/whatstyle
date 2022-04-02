---
title: "Dynamically added form elements lose their margins"
date: 2008-09-08
author: harmen-janssen
url: /articles/50/dynamically_added_form_elements_lose_their_margins
---

<p>
I stumbled upon an annoying bug today. When dynamically appending input fields to the DOM, their margins are not as you specified in their respective classes.</p>

---

[See this page for an example](http://www.whatstyle.net/examples/inputstyles.html). The input fields with class "`text`" have a right margin of `50px`.

When a similar input field is appended to the DOM, however, the style is not copied.

A `cloneNode` operation _is_ successful, luckily.

I encountered this bug in both Safari and Firefox. Unfortunately, I haven't had time to check in other browsers.

If you have a solution to this bug, or know more about it, please share it in the comments!

