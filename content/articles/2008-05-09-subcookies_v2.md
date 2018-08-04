---
title: "Subcookies V2"
date: 2008-05-09
author: harmen-janssen
url: /articles/46/subcookies_v2
---

{{< intro >}}
<p>
My <a href="http://www.whatstyle.net/articles/28/subcookies">Subcookies</a> article from May the 27th of last year has proven to be my most popular bit of writing.</p>
<p>A year after publishing, <a href="http://www.whatstyle.net/articles/28/subcookies#comment1777">"C" has requested an update</a>.
</p>
<p>I have now rewritten my cookies script, fixing some issues pointed out by "C", and added some security as pointed out by <a href="http://www.whatstyle.net/articles/28/subcookies#comment1766">Jim Thomson</a>.
</p>
{{< /intro >}}

### Notable changes:

_Note; for a complete rundown of the original script, read [Subcookies](http://www.whatstyle.net/articles/28/subcookies)._

- The `subcookiejar.fetch ()` method now returns an object literal (or, as the cool kids say, "JSON") if the second parameter is left undefined. This means that by doing the following... ```
  // bake a new cookie
  subcookiejar.bake ('admin', {
    name: 'Harmen',
    age: 23,
    homepage: 'http://www.whatstyle.net'
  }, 2);
  
  // fetch it
  var admin = subcookiejar.fetch ('admin');
  ```
  
   ...you can fetch the admin's values by doing something like this: ```
  alert (admin.name);
  alert (admin.age);
  alert (admin.homepage);
  ```
- If the second parameter is given, however, `subcookiejar.fetch` will return either `null` if the requested subcookie is not available, or just that subcookie.
- Also, it is now possible to append to existing cookies. If, after executing the code above, I execute the following code... ```
  subcookiejar.bake ('admin', {
   city: 'Harderwijk',
   country: 'The Netherlands'
  }, 2);
  ```
  
   ...the result will be a combined object containing both the new data and the existing data: ```
  {
   name: 'Harmen',
   age: 23,
   homepage: 'http://www.whatstyle.net',
   city: 'Harderwijk',
   country: 'The Netherlands'
  }
  ```
  
   Note that you will overwrite the existing values if you use this technique.
 
 Other changes consist purely of improving some code, comments and security checks.

So, [the new version can be downloaded here](http://www.whatstyle.net/examples/cookies2.js). Go and grab it, it's free!

As always, I'd love to hear feedback. If you have any, do let me know.  
 And C, sorry to keep you waiting ;).