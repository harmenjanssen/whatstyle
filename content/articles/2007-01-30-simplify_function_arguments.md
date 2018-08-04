---
title: "Simplify function arguments"
date: 2007-01-30
author: harmen-janssen
url: /articles/16/simplify_function_arguments
---

{{< intro >}}
<p>Sometimes functions ask for a lot of arguments (or <i>parameters</i>). Even when using functions you've written yourself, it's sometimes hard to keep track of the order in which the arguments are expected.</p>
<p>In this article I will explain a technique that makes argument-order redundant and might make your programming life easier.</p>
{{< /intro >}}

### Argue a lot

 I'm going to take the build-in PHP function `array_multisort` as an example. If you take a look at the [second example of this function in the PHP manual](http://www.php.net/array_multisort), you'll see it can expect a horrible lot of arguments:

 ```
<?php $ar = array(
       array("10", 11, 100, 100, "a"),
       array(  1,  2, "2",  3,  1)
     );
array_multisort($ar[0], SORT_ASC, SORT_STRING,
               $ar[1], SORT_NUMERIC, SORT_DESC);
var_dump($ar);
??>
```

I don't know about you, but I'm the kind of lazy programmer that's not going to learn that argument-order by heart. So every time I want to use `array_multisort`, I have to look at php.net.

This is no problem at all, php.net is a great manual, but when you have a lot of functions, or if you work object oriented, you keep looking up source files to figure out in which order your object expects its arguments.

### Objectify!

Take a look at this example function for creating a yummy lunch:

 ```
function makeYummyLunch ( $cupsOfCoffee, $sugarlumps, $milk, $typeOfBagel, $eggs)
{
	/* secret recipe for making great lunch omitted */
}
```

Personally I like my lunch with 2 cups of coffee, both with 2 lumps of sugar, no milk. Maybe I have a creamcheese bagel and 2 eggs. I would make my yummy lunch like this:

 `makeYummyLunch ( 2, 2, null, 'creamcheese', 2);`Without documentation, I could end up with creamcheese flavoured coffee, with 2 spoonfuls of milk and no sugar! The solution is creating an object, which properties represent all the arguments. In Javascript this is really easy:

 ```
var lunch = { }; // create object literal
lunch.cupsOfCoffee	= 2;
lunch.sugarlumps	= 2;
lunch.milk			= null;
lunch.typeOfBagel	= 'creamcheese';
lunch.eggs			= 2;
```

You then modify the function to accept only the one object...

 ```
function makeYummyLunch ($lunch)
{
	/* secret recipe for making great lunch omitted */
}
```

... and call it like this:

 `makeYummyLunch (lunch);`You can then access the arguments like `lunch.eggs`, `lunch.cupsOfCoffee`, et cetera.

In PHP you can't create objects that easily, but you can use associative arrays to get the same result:

 ```
$lunch = array ();
$lunch['cupsOfCoffee']	= 2;
$lunch['sugarLumps']	= 2;
$lunch['milk']			= null;
$lunch['typeOfBagel']	= 'creamcheese';
$lunch['eggs']			= 2;
```

Inside the body of the function, you can then access all arguments like `$lunch['eggs']` and `$lunch['cupsOfCoffee']`.

If you simplify your API (Application Programming Interface) like this, you can code faster and more efficient.

Enjoy your lunch.