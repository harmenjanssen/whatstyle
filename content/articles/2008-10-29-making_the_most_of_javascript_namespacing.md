---
title: "Making the most of Javascript namespacing"
date: 2008-10-29
author: harmen-janssen
url: /articles/53/making_the_most_of_javascript_namespacing
---

{{< intro >}}
<p>
<a href="http://www.robertnyman.com/2008/10/29/javascript-namespacing-an-alternative-to-javascript-inheritance/">Today's article by Robert Nyman about Javascript namespacing</a> remembered me about my own approach, which I've been using for quite a few projects now.</p>
<p>If you have no clue about Javascript namespacing, go and read <a href="http://www.robertnyman.com/2008/10/29/javascript-namespacing-an-alternative-to-javascript-inheritance/">Robert's article</a>. I'll wait.</p>
{{< /intro >}}

Back? Good :)

The Javascript single namespace approach is, in my opinion, a great thing. I have used it quite a lot and have even set up a code snippet in [Textmate](http://www.macromates.com) which I use as a spring board for _every single script_ I've written over the past months.  
 After reading Robert's article, I realized more people might benefit from the way I approach this design pattern. Here goes...

### Automatically initializing your namespace

My script files always look a little something like this:

 ```
// when developing for the XYZ Corporation:
var XYZCorp = {
	// modules go here
};

XYZCorp.init ();
```

**Every** module used on the website resides inside the global XYZCorp object. After defining the `XYZCorp` object, I execute its `init` function. This `init` function looks a little something like this:

 ```
// when developing for the XYZ Corporation:
var XYZCorp = {
	init: function () {
		for (var i in this) {
			if (typeof this[i].init == 'function') {
				this[i].init ();
			}
		}
	}
};

XYZCorp.init ();
```

That's it! I loop through all members of the global `XYZCorp` object, and if a member contains an `init` method, I execute it, successfully firing up the module.

This is a very easy approach, which can be reused over and over and over again, and if you ever wish to append a new module to the site, just stuff it inside the global namespace and give it an `init` method. Here's an example:

 ```
// ...
myModule: {
	init: function () {
		this.say ('myModule initiated!');
	},
	say: function (msg) {
		alert (msg);
	}
},
// ...
```

If you would like to use my template in Textmate, just copy the following code into a new snippet inside the Bundle Editor:

 ```
/**
 * ---------------------------
 * Client: ${1:client-name}
 * URL: ${2:client-url}
 * Author: ${3:author-name}
 *
 * ---------------------------
 */

/**
 * General namespace
 */
var ${4:global-namespace} = {
	/**
	 * Initialize all objects
	 */
	init: function () {
		for (var i in this) {
			if (typeof this[i].init == 'function') {
				this[i].init ();
			}
		}
	},
	$5
};

/**
 * Initialize general namespace
 */
$4.init ();
```

Then assign it to a Tab Trigger and make sure you point the Scope Selector to `source.js`.