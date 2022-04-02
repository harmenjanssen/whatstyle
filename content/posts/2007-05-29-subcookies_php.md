---
title: "Subcookies, the PHP version"
date: 2007-05-29
author: harmen-janssen
url: /articles/29/subcookies_php
---

<p>As a follow-up to my last article, <a href="http://www.whatstyle.net/articles/28/subcookies">Take your cookies to the next level with Subcookies</a>, I wrote a PHP equivalent.</p>

---

You can [download the PHP file here as a Zip archive](http://www.whatstyle.net/examples/CookieJar.zip). The file contains two classes: `CookieJar` and `SubCookieJar`. Both work in the same way as their Javascript counterparts from the previous article. There are a few things to notice though:

- All methods are static. This means you can use them like this:

  ```
  CookieJar::bake('admin','Harmen',2);

  CookieJar::crumble('admin');
  ```

- The `subcookieObj` parameter in `SubCookieJar::bake` is an associative array, looking something like this:

  ```
  $subcookies = array (
  'name'=>'Harmen',
  'age'=>22,
  'homepage'=>'whatstyle.net'
  );
  ```

Also, note this little oddity:

```
if (CookieJar::fetch('admin'))
	CookieJar::crumble('admin');

SubCookieJar::bake('admin',array('name'=>'Harmen','age'=>22,'homepage'=>'whatstyle.net'),2);
$a = SubCookieJar::fetch('admin','name');
$b = SubCookieJar::fetch('admin','homepage');
$c = SubCookieJar::fetch('admin','age').'';

SubCookieJar::crumble('admin','age',2);
$d = CookieJar::fetch('admin');

print $a;
print '<br></br>';
print $b;
print '<br></br>';
print $c;
print '<br></br>';
print $d;
```

**The variable `$c` will not contain a value!** I'm not sure why, 'cause I fetched the value before crumbling the subcookie, but it's not there. If anyone knows why this happens, please let me know.

For more information about the principles of subcookies, read my [last article](http://www.whatstyle.net/articles/28/subcookies).

