---
title: "Fighting spam using MySQL and PHP"
date: 2006-12-27
author: harmen-janssen
url: /articles/13/fight_spam_with_mysql_and_php
---

{{< intro >}}
<p>Spam is a terrible, terrible thing. And I'm not even talking about spam emails. Luckily, I don't receive a lot of Viagra, free offers or casino coupons in my mailbox, so when that happens, I just send them straight to the trash bin.</p>
<p>I'm talking about comment spam. This form of spamming is even worse, 'cause it's out in the open, where everyone can read it, polluting innocent websites that have got nothing to do whatsoever with that malicious content.</p>
<p>In this article I will provide a way to arm yourself against this criminal behaviour.</p>
{{< /intro >}}

How spam bots work
------------------

 I'm not exactly an expert, but it's obvious that spam machines target a specific script of yours, send their malicious variables through either POST or GET and repeat that action over and over again. You can't stop them from finding out what variables your script expects and under which names they go.

 You can always check for header information, like this...

 ```
if ($_SERVER['HTTP_REFERER'] != 'http://www.foo.bar)
{
  exit ("That's wrong!");
}
```

 ...but that's unreliable. Spam bots are able to mimic these values and you will receive spam all the same.

You can't stop these machines sending stuff to your script, so what _can_ you do?

Expect the unexpected
---------------------

 Spam machines are configured to send variables with names and patterns of which it knows for sure that your script will accept them. The best you can do, is undo this guess work and make the variables you send highly dynamic.

I have developed a way to create random variables that are different on every page refresh. That way, spam bots can never guess how to formulate the right string. It's best if you use a database to do this, but an array of values will work just as well. The advantage of using a database is that it (most likely) will expand over time, so more and more string combinations become available just by updating your content.

PHP and MySQL to the rescue
---------------------------

So, here goes. Pick a table in your database, it doesn't matter what's in it. I'm using my article database in this example, the "articleTitle" in particular:

 ```
$sql		= "SELECT id,articleTitle FROM ".ARTICLE_TABLE." ORDER BY RAND() LIMIT 1";
$result		= $db->query($sql);
$row		= $result->fetch();
$trap_key	= md5 ($row['articleTitle']);
$trap_value = strtoupper ( md5 ($row['articleTitle']) . substr (md5 ($row['articleTitle']),11));
$trap_key2	= md5 ('trap_id');
$trap_id	= $row['id'];
```

 As you can see, I fetch one random title from my database using MySQL's `RAND ( )` function. With that random string I construct a key and a value, using a little [MD5](http://www.php.net/md5). I obscure the value even more by concatenating a substring of itself.

This is the HTML I produce using these values:

 ```
<input name="<?php echo $trap_key;?>" type="hidden" value="<?php echo $trap_value;?>"></input>
<input name="<?php echo $trap_key2;?>" type="hidden" value="<?php echo $trap_id;?>"></input>
```

You can check the source of this page; the value is different on every page refresh. Now spam bots will never know what variables to pass to my script!

The receiving end
-----------------

 Of course, my script needs to figure out if the submitted string is a correct combination of identifier and value. On the receiving end almost the exact same bit of code takes place:

 ```
$sql		= "SELECT MD5(articleTitle) AS hash FROM ".ARTICLE_TABLE." WHERE id = '" . $_POST[md5('trap_id')] . "'";
$result		= $db->query($sql);
$row		= $result->fetch();
$hash		= $row['hash'];
	
if (!isset ($_POST[$hash]) || $_POST[$hash] != strtoupper ( $hash . substr ($hash,11)))
{
	exit ("Your comment could not be submitted due to security measures.");
}
```

Using MySQL's `MD5 ( )` function, I fetch the article's title where the id is the same as was send by the form. I then construct the value in the same way as was done on the other end of the form and check to see if they are the same:

```
if (!isset ($_POST[$hash]) || $_POST[$hash] != strtoupper ( $hash . substr ($hash,11)))
{
	exit ("Your comment could not be submitted due to security measures.");
}
```

And now, we wait
----------------

 The script is running for a couple of days now, and so far I did not receive a single spam comment. I keep my fingers crossed though, spam bots might need a couple of days to adapt to the new form and maybe I will start receiving spam all the same in a couple of weeks. But I think not. Logically, this ought to work pretty well.

 I will post an update as soon as I've found enhancements or bugs, and I would be happy to receive your feedback on this technique.