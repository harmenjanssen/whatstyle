---
title: "Picking units"
date: 2006-08-11
author: harmen-janssen
url: /articles/1/picking_units
---

{{< intro >}}
<p>
CSS provides a lot of different units to measure with. Of course there are <code>pixel</code>, <code>point</code> and <code>centimeter</code> (among others), which are fairly regular. Other interesting units are <code>em</code> and <code>percent</code>. The one big difference between those units is both <code>em</code> and <code>percent</code> are relative, as opposed to the absolute <code>pixel</code> and <code>point</code>. In this article I will provide some insight on the pros and cons of both groups.
</p>
{{< /intro >}}

### Relative vs Absolute

 In theory, it's better to use relative values in order to provide some more accessibility. Most major browsers come with an option to scale text on a webpage. This is of course ideal for visually impaired users, who need bigger text in order to read things properly. Hell, I myself use it sometimes on sites with poor contrast or a ridiculously small font-size.

 This is where the danger of using `px` comes in. While most browsers are able to resize pixel-based font-sizes properly, the biggest player in the game, Internet Explorer, lacks this ability. `10px` will stay `10px` no matter what you do. Therefore, in order to provide maximum cross-browser accessibility, you should set font-sizes using `em`, `percent`, or one of the keywords `"smaller", "small", "large"` et cetera. But how much is `1em` then? Due to its relative nature, it might be 11 pixels, 9.1 pixels, or .17 inch. You have to have a base font-size in order to use `em`.

 Your base-size can be the browser's default. Most browsers ship with a 16 pixel default size. You can also use keywords, like I do with Whatstyle:

 ```
body {
	font-size: small;
	}
```

 Since the 16 pixel default is rather large for most people, I now base my font-sizes on the default `small` font-size as set by the browser. This works, because `em` relies on a set size in a parent element. For instance, considering the following HTML and CSS...

 ```
div.someClass {
	font-size: 10px;
	}
div.someOtherClass {
	font-size: 15px;
	}
p {
	font-size: 2em; 
	}
```

 ```
<div class="someClass">
	<p>Some text</p>
</div>

<div class="someOtherClass">
	<p>Some other text</p>
</div>
```

 ...we can state that the first paragraph contains text of 20 pixels big, whereas the second paragraph contains text of 30 pixels big. [See this effect in action](http://www.whatstyle.net/examples/pick_units.html "See this effect in action").

### Clients and designers

 Once you've made yourself familiar with the use of relative font-sizes, you will irrevocably run into other obstacles: clients and graphical designers. Clients may have their own house style with predetermined, fixed font-sizes. Designers may have carefully arranged the typography on a website and want a pixel-perfect copy of their Photoshop mock-up to appear online. Both clients and designers are right, in fact. The visual appearance of a website is very important and can make a difference in how people react on the company behind the website.

 Luckily, there's no need to make choices. You can be greedy and take the best of two worlds. I recently read [this article on Gigadesign](http://www.gigadesign.be/2005/05/tekst-vormgeven-met-em/ "Read about this technique on Gigadesign.be") **(note: the article is in Dutch)**, which provides a simple solution to this problem.

### The solution

 Using a simple calculation, we can set the base font-size (`1em`) to `10px`: **16px - 62.5% = 10px**. Apply this calculation in your CSS like this...

 ```
body {
	font-size: 62.5%;
	}
```

 ...and from now on `1em` will be `10px`. Being more specific:

- `.8em = 8px`
- `1em = 10px`
- `1.2em = 12px`
- `2em = 20px`
- et cetera
 
 Don't believe me? Take a look at this [example](http://www.whatstyle.net/examples/pick_units2.html "The proof").

### Nesting elements

 As easy as this might seem, care must be taken when considering inheritence. Take a look at the following CSS:

 ```
li {
	font-size: .83em;
	}
```

 All text in a list-item will now be `8.3px`, but when nesting one list-item in another, the font-size of text inside the second list-item will be `8.3px`, reduced by `.83em`, leaving `6.8px` as a result.

 To solve this we have to overwrite the default value of `inherit`:

 ```
li li {
	font-size: 1em;
	}
```

 This way the nested list-item's text will once again be `8.3px`.

### Going beyond text

 CSS provides numerous ways to make websites more accessible. Taking `em`-units in consideration, we can create flexible layouts. A good example of so-called "elastic" design can be found at [this](http://www.csszengarden.com/063 "Visit this example of elastic layout at the CSS Zen Garden") contribution to the CSS Zen Garden, by [Patrick Griffiths](http://www.htmldog.com/ "Visit Patrick's website"). Try and increase or decrease the text-size in your browser and watch the layout scale along.

 So there you have it; no more talk about dropping support for 800\*600 resolution monitors! Using CSS you can create websites for _everyone_.