---
title: "Displaying search results with PHP"
date: 2006-08-30
author: harmen-janssen
url: /articles/6/displaying_search_results_with_php
---

{{< intro >}}
<p>
In this article I will explain how I've accomplished the look of my search results when someone uses the search box on the right. I'm not talking about styling through CSS, but about formatting them on the server-side.
</p>
{{< /intro >}}

### It's all about context

 The first time I uploaded my Search page, it displayed the summaries of articles found using your keywords, in the same way they appear on the [homepage](http://www.whatstyle.net "See the homepage"). I then started thinking how I could improve that look. From my point of view, it's better (and more logical) to not show just a random bit of text associated to the articles found (in this case the introduction), but to show a snippet of the article which contains the keyword, so users may scan over the results even quicker.

 It makes sense. Also, people are used to the concept, almost every search engine does the same. So, without further ado;

### Cutting up the pieces

 I've written a class, `Chunk.php`, which takes three arguments: **the subject string, a maximum amount of characters and an array of search words**. The Chunk class is very easy to use, see the example below:

 ```
require ('Chunk.php');

$summ = $row['articleText'];
$ch = new Chunk ($summ,300,$words);
$summ = nl2br($ch->get());
```

 The variable `$summ` will now contain a snippet of 300 characters long, containing one of the words in the array (the first match it finds). I've set up a small [test case](http://www.whatstyle.net/examples/search_results.html "View the example") (Javascript required!) for you to test its behaviour.

 As you can see, the Chunk class tries to make a match with one of the words in the array and when it does, it takes the 300 characters surrounding it and outputs this snippet using the `Chunk->get()` method.

### Under the hood

Here I will provide some insight in what the Chunk class actually does to your string.

 ```
$len = count($searchTerms);
$chunk = '';
for ($i = 0; $i 

<p>
As you can see, Chunk loops through the <code>$searchTerms</code> array (the third argument of the constructor method) in order to see if one of the words matches a word in the given string. When it does, it saves the position of that string in the variable <code>$pos</code>, using PHP's built-in function <code>strpos()</code>.
</p>
<p>
It then calculates if that position minus half the maximum amount of characters is less than zero...
</p>
if (($pos - ($maxChar/2)) 

<p>
...in order to decide wether or not it should append "..." to the  start of the string. The same goes for the back of the string. Using <code>substr()</code> it then cuts the snippet out of the string you applied as the first argument and breaks the loop.
</p>
<p>
If no match is found in the array, the class returns a snippet starting at position 0 of your string:
</p>
if ($chunk == '')
{
	$chunk = substr($str,0,$maxChar).'...';
}

<h3>Highlighting search terms</h3>
<p>
This is an important bit, you may not want this to happen in your situation, so pay attention. Since I don't want any HTML to come through, I use <code>strip_tags()</code> to remove every tag from the string (for extra security, you oughtta use <a href="http://nl2.php.net/manual/en/function.htmlentities.php" title="See php.net's resources on htmlentities()"><code>htmlentities()</code></a> or <a href="http://nl2.php.net/manual/en/function.htmlspecialchars.php" title="See php.net's resources on htmlspecialchars()"><code>htmlspecialchars()</code></a> on top of that).
</p>
<p>
After removing any HTML I again loop through the <code>$searchTerms</code> array, and replace any occurance of the words therein with a <code>span</code>-tag of the class "match". This way, I can highlight the words one searched for using CSS. But, if you don't want this to happen, this is the bit of code you should remove or comment out:
</p>
$chunk = strip_tags ($chunk);
foreach ($searchTerms as $term)
{
	$chunk = str_replace ($term,"<span class="\"match\"">$term</span>",$chunk);
}

<p>
Last but not least, the <code>get()</code> method of the Chunk class returns the created chunk:
</p>
function get ()
{
	return $this->chunk;
}


<p>
And that's it! The Chunk class can be downloaded <a href="http://www.whatstyle.net/examples/Chunk.rar" title="Download it!">here</a> as a RAR-archive. From my point of view, it couldn't be any simpler, but you might think otherwise. Feel free to <a href="http://www.whatstyle.net/contact.php" title="Contact me">contact me</a> with questions or leave a comment.
</p>
```