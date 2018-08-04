---
title: "Disable fancy errors in CakePHP"
date: 2009-07-21
author: harmen-janssen
url: /articles/61/disable_fancy_errors_in_cakephp
---

{{< intro >}}
<p>Here at work we often go crazy because of <a href="http://www.cakephp.org">CakePHP</a>'s "helpful" displaying of error messages.</p>
<p>They are littered with HTML and, even worse, Javascript and provide an often superfluous stack trace, which makes it harder to read the actual error message.</p>
{{< /intro >}}

If you just want readable, plain text error messages in your projects, add the following to `/app/config/bootstrap.php`:

 ```
function displayErrorWithoutCrap() {
	// returning false here means the internal PHP error handler will take over again and display a neat, clean error
	return false;		
}
set_error_handler('displayErrorWithoutCrap');
```

And if the Cake guys could make this configurable in their next release, that would just be awesome.