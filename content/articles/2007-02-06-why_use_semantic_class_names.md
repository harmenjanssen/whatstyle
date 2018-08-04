---
title: "Why use semantic class names?"
date: 2007-02-06
author: harmen-janssen
url: /articles/17/why_use_semantic_class_names
---

{{< intro >}}
<p>In the <a href="http://www.whatstyle.net/articles/15/new_dutch_accessibility_law">new Dutch accessibility law</a> I recently linked to, one of the guidelines is <q>Use semantic and descriptive classnames and ids</q>.</p>
<p>Why? A lot of web standards / accessibility advocates talk about this subject and everyone mutually agrees that this indeed should be pursued. I don’t get it… why should I care?</p>
{{< /intro >}}

### Who cares, really?

 I don’t believe users will take a peek at your source code to see if the content they’re looking at is contained in markup with meaningful class names. As far as I know there are no user agents flabbergasting their users with information about class names or ids. Therefore, I don’t really understand how it could possibly hurt accessibility to give an element a class name like "`sidebar`". The moment browsers or screen-readers care for class names, I will really think twice before picking a non-descriptive name, but I don’t think that moment is there yet. I’m not even sure if it would be a good idea for user-agents to care about that stuff. It would be like a Java compiler that throws an error if it doesn’t agree with the name of the interface you’re using.

 Of course, when a page is completely redesigned by a new developer, it’s easier for him or her to work with names like "`latest_news`", "`additional_information`" and such, but making stuff easier to maintain shouldn’t be part of an accessibility law.

### A bit too much?

I understand it fits in the whole semantics-paradigm and it feels like a natural thing to do, but maybe it’s a little extreme. Also, I don’t believe, especially when using Content Management Systems, that every piece of content can be predefined. When content managers can choose for themselves which content to put where, you could name every element on a page "`additional_content`" and it would all be semantically correct!

I would love to hear other arguments than "easier maintenance". If there really are good reasons, I will stand corrected and take it like a man.