---
title: "Quick PHP Tip: passing by reference creates array keys"
date: 2009-04-29
author: harmen-janssen
url: /articles/59/passing-by-reference-creates-array-keys
---

<p>Another little <abbr title="Php: Hypertext Preprocessor">PHP</abbr> tip that could save you a couple of debugging hours.</p>

---

Consider the following code, and notice I use the ampersand character to [fetch the value by reference](http://php.net/references):

```
<?php $a = array('a' =?> 1, 'b' => 2);
	$c = &$a['c'];
	print_r($a);
?>
```

Shockingly, this won't give you a notice or warning. Instead, it'll output this array:

```
Array
(
   [a] => 1
   [b] => 2
   [c] =>
)
```

This might have disastrous results, if your code works with those array keys one way or another. So be warned, and learn to love functions such as [`array_key_exists`](http://php.net/array_key_exists) and [`empty`](http://php.net/empty).

