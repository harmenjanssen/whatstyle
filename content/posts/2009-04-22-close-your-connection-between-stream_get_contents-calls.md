---
title: "Quick PHP Tip: close your connection between stream_get_contents calls"
date: 2009-04-22
author: harmen-janssen
url: /articles/58/close-your-connection-between-stream_get_contents-calls
---

<p>Here's a quick solution to a problem I encountered which might save you some headaches.</p>

---

When fetching data from a remote location, for instance a web service (like the one [Last.fm](http://last.fm) provides), you can use the native PHP function [`stream_get_contents`](http://php.net/stream_get_contents).

This method works fairly simple, as shown in the following code snippet:

```
<?php $handle = fsockopen($myHostName);
	fwrite($handle, 'my message');
	$response = stream_get_contents($handle);
	fclose($handle);
??>
```

This code opens a socket connection to a certain host, sends 'my message' to it, and retrieves the response data using `stream_get_contents`. Easy!

Just a warning, though: if you send consecutive messages to the same host, using the same handle, `stream_get_contents` will return an empty string as the response.

I'm not sure why this happens, but I've noticed this behavior in two different use cases and can therefore safely say it's got something to do with the function, not the web service.

To prevent this from happening, just make sure you use a fresh handle each time you communicate with the remote host:

```
<?php // send message 1...
	$handle = fsockopen($myHostName);
	fwrite($handle, 'my message');
	$message1 = stream_get_contents($handle);
	fclose($handle);

	// send message 2...
	$handle = fsockopen($myHostName);
	fwrite($handle, 'my second message');
	$message1 = stream_get_contents($handle);
	fclose($handle);
??>
```

As an aside, I've been working on a handy `SocketConnection` class that's part of a package of classes which communicate with various social networks. More on that later. I intend to release it to the public domain, I'm just not sure yet in what form.

In the meantime, take note of this little technique, it'll save you some precious debugging time.

