---
title: "Nested lists bug"
date: 2006-08-26
author: harmen-janssen
url: /articles/5/nested_lists_bug
---

<p>
I found me a quirk today! When implementing my search page, I noticed an awkward bug in Internet Explorer 6 and 7. It's got to do with nested lists in the first list-item. Read on for an example and a solution.
</p>

---

### The missing number

Check out the following ordered list in IE and, for instance, Firefox:

1. <dl> <dt>Beer</dt> <dd>An alcoholic beverage</dd> </dl>
2. <dl> <dt>Coffee</dt> <dd>A hot, black beverage</dd> </dl>
3. <dl> <dt>Orange juice</dt> <dd>A fresh, orange beverage</dd> </dl>

You see? IE doesn't show the number preceding the first list-item! The same goes for the bullets in unordered lists by the way.

This strange behaviour only occurs when the first child of the list-item is a list. It occurs with any list, ordered, unordered and definition lists. It can be solved by putting any element before the nested list. It may even be a text-node. The example below shows the same list, only with the letter "A" preceding the nested `dl`.

1. A <dl> <dt>Beer</dt> <dd>An alcoholic beverage</dd> </dl>
2. <dl> <dt>Coffee</dt> <dd>A hot, black beverage</dd> </dl>
3. <dl> <dt>Orange juice</dt> <dd>A fresh, orange beverage</dd> </dl>

As you can see, the first list-item has its number back. **Note: I've used the letter "A" here for clarity, but it might as wel be a no-break space (` `)**.

### Extra markup sucks

` ` is of course not a very heavy load of extra markup, but it isn't supposed to be there either, not to speak of empty `span`-elements, for instance. Still, something _has_ to precede the nested list. Therefore, in my first solution I used [Conditional Comments](http://www.quirksmode.org/css/condcom.html "Read about conditional comments") to send an empty `span`-element to Explorer only. I found an even better solution by accident actually, when I was trying to prevend the nested list from starting on a new line in IE.

### The solution

It's dead simple really, adding the following style rules solves the problem:

```
li dl,
li ul,
li ol {
	display: inline;
	}
```

Last but not least, view source for the proof:

1. <dl style="display: inline;"> <dt>Beer</dt> <dd>An alcoholic beverage</dd> </dl>
2. <dl style="display: inline;"> <dt>Coffee</dt> <dd>A hot, black beverage</dd> </dl>
3. <dl style="display: inline;"> <dt>Orange juice</dt> <dd>A fresh, orange beverage</dd> </dl>

### Edit: it's not over yet...

I have been testing some more, and unfortunately, the following combination of nested lists is not fixed by the solution above...

```
<ol>
	<li><ul><li>Item</li></ul></li>
	<li><ul><li>Item</li></ul></li>
</ol>
```

...instead, it screws up the numbering completely, giving both list-items a number 1. Adding a preceding element (in my test-case an empty `span`) works, but only when the `display: inline` rule is not applied, leaving you with nested lists that start on a new line.

Of course this is not always bad, but I couldn't tell you how to solve it. I've tried different things, but strange things keep happening. Adding some text (or again, a ` `) even turns the nested unordered list into an ordered list, which should manually be changed back using the CSS rule `ol li ul { list-style-type: disc; }`. This sounds like a solution, but again, it bumps the nested list down a line (also in Firefox).

Too bad! I would like to hear about a solution, if any. I've run out of ideas.

