---
title: "Javascript function return values"
date: 2007-07-03
author: harmen-janssen
url: /articles/31/javascript_function_return_values
---

{{< intro >}}
<p>
<a href="http://www.sitepoint.com/forums/showthread.php?t=488994">This thread on Sitepoint today</a> made clear to me that not everyone understands how return values work in Javascript. I decided to write up an explanation.</p>
{{< /intro >}}

### Return values

First off; any programming language I know off uses functions, and every programming language I know off lets you <dfn>`return a value`</dfn>. Returning a value means that the variable assigned to the executed function will actually be assigned to the outcome of that function's computing. Don't worry if this sounds complicated, this example will illustrate it perfectly:

 ```
function getDouble (number){
	var doubl = number+number;
	return doubl;
}
	
var num = 4;
var doub = getDouble(num);
```

This simple function doubles its first parameter and returns it. This means that the value of the variable `doubl` now contains the number 8.

What confuses some beginning Javascript coders (or Actionscript coders for that matter) is the use of parentheses. In what situations do I want to use parentheses?

### Functions as data

In Javascript (and again, also in Actionscript) functions are also data. When parentheses are left out, like this...

`var doub = getDouble;`...the variable `doubl` holds a reference to the function `getDouble`. You can execute it like this:

 `doub();`Now this seems obvious maybe, but it gets more complicated when you're using event handlers. Take a look at these two lines of code, which look deceivingly similar:

 ```
window.onload = myFunction();
window.onload = myFunction;
```

In the first line, parentheses are added to the function, making it <dfn>a function call</dfn>. The function is executed immediately and its return value is assigned to the `onload` property of the `window` object. Let's extend that example (note that this code is executed in the `HEAD` of an HTML document):

 ```
function makeElementInvisible (){
		document.getElementById('myId').style.display = 'none';
	}
	window.onload = makeElementInvisible();
```

This code will fail miserably, because the function is executed immediately, it starts looking for an element with an `id` of "myId", which does not exist at the time and therefore it cannot alter the element's `style` property.

The second line, however, transfers the data of the function `makeElementInvisible` to the `window`'s `onload` property. Just as with the `var doub = getDouble;` example above, `window.onload` is now equivalent to executing `makeElementInvisible`, and because it's an event handler, it gets executed only when the window is loaded entirely.

### Sending parameters

 So, to sum up, if you don't want to set the return value of a function to a property, but a reference to the **function itself**, don't use parentheses. For instance:

 `myElement.onclick = myFunction;`But what if you want to send parameters to the function? Don't you **need** parentheses for that?  
Well, yes.

In such cases, you can assign an anonymous function to a property, which executes the desired function, _with_ parameters. Example:

 ```
myElement.onclick = function (){
	myFunction (parameter1,parameter2);
}
```

 I hope that clarified things a bit. Just remember; when assigning event handlers, you very, _very_ rarely need to use parentheses. [In this post on Sitepoint](http://www.sitepoint.com/forums/showpost.php?p=3461286&postcount=5) I illustrate a situation in which it might be handy to use a function's return value, instead of the function itself, but as I said over there:

> \[...\] this is almost never necessary (and there are, IMHO, more readable ways of accomplishing the same.).