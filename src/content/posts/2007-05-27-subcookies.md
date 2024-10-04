---
title: "Take your cookies to the next level with Subcookies"
date: 2007-05-27
author: harmen-janssen
url: /articles/28/subcookies
---

<p>Cookies provide an easy way to save some user data. They can be a nice aid in usability, as they give you a way of remembering certain choices made by the user.</p>
<p>Browsers have placed some restrictions on the storage capacity of a cookie, though. They usually allow only 20 cookies to be stored per domain or server. To circumvent this problem, I'll explain a technique called "subcookies" to you and show you an easy Javascript way of accessing the so-called subcookies.</p>
<ins datetime="2007-05-28">The article has been down for a day, unfortunately, due to a <abbr title="Php: Hypertext Preprocessor">PHP</abbr> error. I'm terribly sorry! The article is fixed now, do check it out :)</ins>

---

### Access to regular cookies

First, let's take a quick look at the `cookiejar` object. An object I've written to provide easy access to cookies. First of all; the functionality of the object is written by Peter-Paul Koch ([http://www.quirksmode.org/js/cookies.<abbr title="HyperText Markup Language"><abbr title="HyperText Markup Language">HTML</abbr></abbr>](http://www.quirksmode.org/js/cookies.html)). All I did was wrap it all in one object and add automatic escaping of cookie data. Credit where credit's due, eh? :)

The cookiejar object has three methods:

```
bake: function(cookieName,cookieValue,days,path){
fetch: function(cookieName){
crumble: function(cookieName){
```

The `bake` method creates a new cookie. Parameters are the name of the cookie, the value of the cookie, the days (as an integer) after which the cookie will expire and the path in which the cookie is accessible.  
 The `fetch` method is used to get the value of a given cookie. It takes one parameter; the name of the cookie. Lastly, the `crumble` method destroys a cookie, which name is given in the only parameter.

#### Example:

```
// set a cookie named 'admin' with a value of 'Harmen' to expire after 2 days
cookiejar.bake ('admin', 'Harmen', 2);

// alert the value of the cookie named 'admin'
alert (cookiejar.fetch('admin'));

// remove the cookie
cookiejar.crumble('admin');
```

### Access to subcookies

The principle behind <dfn>subcookies</dfn> is simple: store multiple values in one cookie. That way, you can store more data without exceeding the browser limit of 20 cookies per domain or server.

It's important to separate your name/value pairs with certain custom characters (characters that are unlikely to appear in a cookie's value). For instance, let's look at these cookies:

```
admin_name=Harmen
admin_age=22
admin_homepage=whatstyle.net
```

If we use subcookies to store this data, our cookie could look like this:

`admin=name:Harmen/age:22/homepage:whatstyle.net`Notice I use a colon (":") as the name/value separator, and a slash as the subcookie separator ("/").

Now I can store as much data as I'd like, unrestricted by the browser's cookie limit!

### Drawbacks

Before looking at the `subcookiejar` object, there are some things to keep in mind when using subcookies. First, domains (or servers) are only allowed to store 4KB of data (4096 characters). Yes, you could save all your data inside one cookie, but don't overdo it.

Second, some care must be taken in picking separating characters. In the `cookies.js` file you can download at the bottom of this page, I use `<em>$$:$$</em>` as a name/value separator and `<em>$$/$$</em>` as the subcookie separator. These character combinations are highly unlikely to be found inside actual cookie values. Always think about your separators. A separator which appears inside your cookie data will split up the value. Consider, for instance, this cookie:

`admin_homepage=http://www.whatstyle.net`If I were to use the slash and colon mentioned above, the value would break on the "http://" prefix.

### The `subcookiejar` object

The `subcookiejar` object sports the same `bake`, `fetch` and `crumble` methods the `cookiejar` object does, but they take different parameters.

 <dl> <dt>`bake (cookieName,subcookieObj,days,path)`</dt> <dd>Sets a new cookie, subcookie-style. <dl> <dt>`cookieName`</dt> <dd>The name of the cookie</dd> <dt>`subcookieObj`</dt> <dd>An object which members represent the subcookie's name. The value of that member will be the value of the subcookie.</dd> <dt>`days`</dt> <dd>The days (as an integer) after which the cookie will expire.</dd> <dt>`path`</dt> <dd>The path that has access to this cookie.</dd> </dl> </dd> <dt>`fetch (cookieName,subcookieName)`</dt> <dd>The `fetch` method fetches the value of the subcookie named `<ins>subcookieName</ins>` inside cookie `<ins>cookieName</ins>`.</dd> <dt>`crumble (cookieName,subcookieName,days,path)`</dt> <dd>Unfortunately, crumbling a given subcookie works different from crumbling a regular cookie. It loops through all the values inside the given cookie (named `<ins>cookieName</ins>`), until it finds the subcookie named `<ins>subcookieName</ins>`. It removes this subcookie from the data and _creates a new cookie containing all other name/value pairs present in the cookie._ Therefore, you have also have to provide `days` and `path` parameters, which, naturally, function in the same way as they do in the `bake` method. **Note that you can delete the entire cookie with `cookiejar.crumble`**</dd> </dl>That's all there is to it! You can access the separators through `subcookiejar.subcookieSeparator` and `subcookiejar.nameValueSeparator` if you'd like to change those.

#### Example:

```
// create the 'cookie' object

var c = {
	name : 'Harmen',
	age : 22,
	homepage : http://www.whatstyle.net
};

// create the cookie

subcookiejar.bake ('admin', c, 2);

// alert the subcookie 'name'

alert (subcookiejar.fetch('name'));

// crumble only the subcookie 'age'

subcookiejar.crumble ('admin','age',2);

// crumble entire cookie

cookiejar.crumble('admin');
```

### Download the file

You can download [the entire `cookies.js` file](http://www.whatstyle.net/examples/cookies.js) and use it freely. Do leave a comment and tell me what you think of this technique, or tell me how I can improve it.

<ins datetime="2008-05-09">Note: I've written an updated version to this script. [Click here to download Version 2](http://www.whatstyle.net/examples/cookies2.js), or [click here to read the new article.](http://www.whatstyle.net/articles/46/subcookies_v2/)</ins>

