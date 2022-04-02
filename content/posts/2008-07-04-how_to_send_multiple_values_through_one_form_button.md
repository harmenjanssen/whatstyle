---
title: "How to send multiple values through one form button"
date: 2008-07-04
author: harmen-janssen
url: /articles/49/how_to_send_multiple_values_through_one_form_button
---

<p>Sometimes you want to have a form with multiple "actions". For instance, in a webshop, you want to list all your products, each paired up with an individual submit button to add that particular product to a shopping cart.</p>
<p>But how can you, on the server-side, differentiate between products?</p>
<p>It gets even more difficult when you have lots of hidden data you wish to send alongside the name or id of the product, but you want to show only one button.</p>
<p>There are a couple of ways to achieve this, all with their own pros and cons. Below I will list some options.</p>

---

## Multiple forms

The easiest way to achieve this, is to use multiple forms in your HTML code, something like this:

```
<div class="product">
	<h2>My product</h2>
	<form action="/shopping-cart" method="post">
		<input name="secret" type="hidden" value="my hidden value"></input>
		<input name="product-id" type="hidden" value="1"></input>
		<input type="submit" value="Add this product to your cart"></input>
	</form>
</div>
<div class="product">
	<h2>My product</h2>
	<form action="/shopping-cart" method="post">
		<input name="secret" type="hidden" value="my hidden value"></input>
		<input name="product-id" type="hidden" value="2"></input>
		<input type="submit" value="Add this product to your cart"></input>
	</form>
</div>
<div class="product">
[...]
</div>
```

This works, because on the click of a button, only the one form is being submitted, so you'll only receive the correct values on the server-side.

The downside, however, is that it's a bit sloppy. Personally, I can't say I'm happy with having so many different forms in my HTML documents.

## The "Image" type button

An ideal solution would be to use the "image" type input field. Create a button-ish graphic, and write an input element like this:

`<input alt="Add this product to your cart" name="my-product" src="my-button.jpg" type="image" value="2|secret|foo"></input>`As you can see, I have abused the `value` attribute to stuff all my hidden data, separated by pipes. On the server-side, all I have to do in my PHP code is this...

```
$hiddenvalues = explode ("|",$_POST["my-product"]);
$product_id = $hiddenvalues[0];
$product_secret = $hiddenvalues[1];
$product_another_secret = $hiddenvalues[2];
```

...in order to fetch all submitted data.

However, Internet Explorer 6 will not allow it. Microsoft's browser does not send data contained inside the "value" attribute of an image-type input element. [See for more information this article by Robert Nyman](http://www.robertnyman.com/2008/03/06/not-all-values-posted-with-a-form-in-ie/).

Damn it.

## Working with arrays

One great thing about forms, is your ability to submit arrays. Consider this bit of HTML:

```
<input name="foo[secret]" type="hidden" value="my hidden value"></input>
<input name="foo[product-id]" type="hidden" value="1"></input>
<input name="foo[submit]" type="submit" value="Add this product to your cart"></input>

<input name="bar[secret]" type="hidden" value="my hidden value"></input>
<input name="bar[product-id]" type="hidden" value="2"></input>
<input name="bar[submit]" type="submit" value="Add this product to your cart"></input>

<input name="baz[secret]" type="hidden" value="my hidden value"></input>
<input name="baz[product-id]" type="hidden" value="3"></input>
<input name="baz[submit]" type="submit" value="Add this product to your cart"></input>
```

On clicking one of the buttons, for instance, the "foo" button, the following gets sent to the server:

```
Array
(
   [foo] => Array
       (
           [secret] => my hidden value
           [product-id] => 1
           [submit] => Add this product to your cart
       )

   [bar] => Array
       (
           [secret] => my hidden value
           [product-id] => 2
       )
   [baz] => Array
       (
           [secret] => my hidden value
           [product-id] => 3
       )
)
```

As you can see, all arrays are sent, but only the "foo" one contains a "submit" key! So, you can loop through the array, and whenever you find the key "submit", you'll know that's the array the user intended to select.

You can do so using code like this:

```
foreach ($_POST as $collection) {
	if (array_key_exists ('submit', $collection)) {
		// this is the one we need
		$secret = $collection['secret'];
		$id = $collection['product-id'];
		break;
	}
}
```

This is the best I could come up with. A possible downside, obviously, is submitting lots of superfluous data and having to loop through all of it.

Let me know what you think about it! I'm curious about other possible techniques.  
Thanks to [Webby](http://www.pagedown.nl) for pointing me in this direction.

