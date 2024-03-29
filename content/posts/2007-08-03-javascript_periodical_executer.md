---
title: "Javascript Periodical Executer"
date: 2007-08-03
author: harmen-janssen
url: /articles/36/javascript_periodical_executer
---

<p>
When writing Javascript, you sometimes want to execute a certain function repeatedly (for instance, when creating a bit of animation, or when pinging for new messages in an AJAX chat application).</p>
<p>This involves calls to <code>setTimeout</code> or <code>setInterval</code> and usually repeatedly checking some conditions.</p>
<p>For simple, periodically executed calls to your custom functions, I have now written an easy extension to the <code>Function</code> prototype.</p>

---

### How does it work?

First of all, this is the complete code, which you can copy or download [here](http://www.whatstyle.net/examples/periodicalExecuter.js "Download the entire source code"):

```
Function.prototype.executePeriodically = function (){
	var s = this;
	if (typeof arguments[0].callee != 'undefined'){
		var arquments = arguments[0];
	} else {
		var arquments = arguments;
	}

	var delay = arquments[0];
	var timesToExecute = arquments[1];
	this.__INTERVAL__ = null;

	var args = [];
	for (var i=2; i<arquments.length; i++){ args.push(arquments[i]); }

	s.apply(this,args);

	if (this.__INTERVAL__)
		clearTimeout(this.__INTERVAL__);

	if (--timesToExecute > 0){
		this.__INTERVAL__ = setTimeout (function (){
			arquments[1] = timesToExecute;
			s.executePeriodically(arquments);
		},delay);
	}
	return s;
}
```

Especially for beginning Javascript programmers, this may look mighty complex, but I'll walk you through it line by line.

```
Function.prototype.executePeriodically = function (){
```

First of all, this functionality extends the `Function` prototype, so you can use it as if it was natively supported by Javascript.

```
var s = this;
if (typeof arguments[0].callee != 'undefined'){
	var arquments = arguments[0];
} else {
	var arquments = arguments;
}
```

On the first line, I save a reference to `this`, as to not get confused later on. Also, I check to see if the first entry in the `arguments` array has a `callee` property. This is important later on, when I'm going to call the function for the second (or more) time. Based on this `if` statement, I create the `arquments` variable, which contains either the `arguments` array, or the first entry thereof. Don't worry, you'll see why later on.

```
var delay = arquments[0];
var timesToExecute = arquments[1];
this.__INTERVAL__ = null;
```

Then, I fetch and create some useful variables, namely **the delay between execution cycles** and **the maximum number of times this should be executed**. Also, I create a property to contain our interval.

```
var args = [];
for (var i=2; i<arquments.length args.push="" i="" s.apply="">
```

This code creates an array with the remaining parameters. Remember, the first two are the interval and the maximum number of executions you wish to invoke.

Then, using `apply ()`, we execute the original function for the first time. I use `apply ()` here for the simple reason I can toss in the parameters as an array. This is useful because I can not know at this point how many parameters the code using this functionality is going to give me. With execution number one done, we're almost there. I will now check to see if we have to execute the function again.

```
if (this.__INTERVAL__)
	clearTimeout(this.__INTERVAL__);
```

First, just to make sure, I cancel any interval that's currently running.

```
if (--timesToExecute > 0){
	this.__INTERVAL__ = setTimeout (function (){
		arquments[1] = timesToExecute;
		s.executePeriodically(arquments);
	},delay);
}
```

Next, I check to see if (`timesToExecute` minus 1) is larger than zero (note that the decrement operator **`--`** automatically subtracts 1 from the variable). If so, I first replace `timesToExecute` with its new, decremented version in the `arquments` array, after which I execute the function again (through `executePeriodically()`).

This time, however, I cannot send every single parameter, because, again, I do not know how many parameters will eventually be thrown in by developers using this functionality. Therefore, I send only a single parameter: the entire `arquments` array.

Remember the first, somewhat odd, `if` statement? After the first time the function gets executed, the only parameter to this function will be the previously used `arquments` array. This array will have a `callee` property (which references the executing function), so by checking for that property, my logic will know whether to use the genuine `arguments` array, or the first entry of that array, which finally results in pretty much the same array of parameters.

Important to note is the decrementing of the `timesToExecute` variable. Because this variable is getting subtracted by 1 every execution cycle, eventually it will become zero and the code knows there's no need to execute the function again.

## How to use?

Easy! Let's say you have a simple function which creates a paragraph containing the text "Bar":

```
function foo (str){
	var div = document.getElementById('dump');
	var p = document.createElement('p');
	p.appendChild(document.createTextNode(str));
	div.appendChild(p);
}
```

If you want to execute this function 5 times, every 500 milliseconds, you can do this:

```
window.onload = function (){
	foo.executePeriodically(500,5,'bar');
}
```

Simple, eh?

## Extending

Of course, this function might be a bit too simple. For instance, most of the time you want to check certain conditions for every iteration, instead of executing a function a set number of times. It would be easy to extend the functionality to except another parameter containing a certain expression, and write some check to see if the expression evaluates to `true`. Also, some kind of `cancelExecution` method would be nice, so you can quit execution from outside the function.

I might write that some other day :-)
