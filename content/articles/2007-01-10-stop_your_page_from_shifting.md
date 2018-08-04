---
title: "Stop your page from shifting!"
date: 2007-01-10
author: harmen-janssen
url: /articles/14/stop_your_page_from_shifting
---

{{< intro >}}
<p>
You know content, right? When it gets really really long, your friendly browser provides you with a scrollbar so you can access that content.</p>
<p>But sometimes, your content is not really really long. Your browser then does not display a scrollbar, for it's superfluous. It's a great system, really, but it <i>does</i> make your content shift from left to right and back when you browse different pages.</p>
<p>Read on if you want to stop this from happening.</p>
{{< /intro >}}

 It's dead simple really. Just throw in the following CSS:

 ```
html { height: 100%; }
body { height: 100.1%; }
```

That's it!

I know there are more challenging obstacles in web development, but this is something designers have asked me to do a couple times lately, so I thought I'd share.