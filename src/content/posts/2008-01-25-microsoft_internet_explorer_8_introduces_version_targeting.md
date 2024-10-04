---
title: "Microsoft Internet Explorer 8 introduces version targeting"
date: 2008-01-25
author: harmen-janssen
url: /articles/40/microsoft_internet_explorer_8_introduces_version_targeting
---

<p>
Wow. Everyone, and I do mean <strong>everyone</strong>, seems to be talking about Microsoft's version targeting system, that's to be introduced in IE8.</p>
<p>MS sure knows how to stir things up. Here's my take on it.</p>

---

### Targeting what now?

For those of you who didn't receive around 100 updates in their RSS readers about this subject the last couple of days, read [the latest article on A List Apart](http://www.alistapart.com/articles/beyonddoctype), by Aaron Gustafson.

In summary, Microsoft will introduce a system in IE8, that enables developers to specify for which rendering engine they've written their code, by means of a `meta` tag that takes the form of `<meta http-equiv="X-UA-Compatible" content="IE=8" />`.  
 Yes, it's shocking. In order for IE8 to support web standards, ([even to a level which passes the Acid2 test, so it seems](http://blogs.msdn.com/ie/archive/2007/12/19/internet-explorer-8-and-acid2-a-milestone.aspx)), you will have to alter your HTML so it tells the browser to actually work to its fullest extend.

### All by its lonesome

Miraculously, Microsoft's browser is, once again, the only browser that needs all this tomfoolery. Since I use a Macintosh in both my work environment as my home, without having installed Windows XP or anything, I don't use IE in my everyday life. I use it only for testing.

Do I, as a result of my choice, encounter broken web pages on a daily basis? No. Every once in a while my Safari won't play well with certain Javascripts, or will display some poorly written CSS, well, _poorly_. If it's really necessary I will switch to Firefox, which renders 99% of the internet correctly.

So I ask you this: if those browsers can provide me with a care-free browsing experience, why can't Internet Explorer? I'm so sick and tired of this. The excuse is, once again, just like it was when [doctype switching](http://www.ericmeyeroncss.com/bonus/render-mode.html "Eric Meyer on the different rendering modes") was introduced, **backwards compatibility**.  
 Again, and I can't stress this enough, if I visit really, really old pages with Firefox, nothing seems broken. Why does Microsoft needs all kinds of trickery to accomplish the same result?

### Whose responsibility is backwards compatibility anyway?

In my day-job, I sometimes design small printed advertisements. I do this using Adobe Photoshop, or Adobe Illustrator. Whenever I mail these designs to whichever company is going to print the stuff, I save these documents as PDF files, 'cause I know from experience the other party can open PDF files. That's _my_ responsibility.

Let's bring this story to the web: whenever I write the code that makes up a website, it's _my_ responsibility to ensure this content gets delivered properly to whatever userbase I'm targeting. Why should Microsoft take this responsibility? Let those old, rickety pages break! I remember Andy Clarke saying something like, <q>people don't expect to be able to watch HD movies on their old, non-HD television sets. Why do they expect the latest CSS magic to work in an old, out-dated browser?</q>. If you ask me, this couldn't be more true. To me, it's logical a newer browser can display more, or different features than an old browser can. Andy Budd makes a similar statement in [his article about this subject](http://www.andybudd.com/archives/2008/01/has_internet_ex/) by saying:

> Imagine if all new media players had to be backward compatible? We'd end up with a device that could play anything from 8mm film right the way through to Blu-ray disks.

### I don't buy it

Besides, I don't buy it. Call me suspicious, but I think, based on previous experiences, that my suspicion is called for when I have doubts about a future IE12 rendering a page _exactly_ like IE7 would now.

Secondly, what happens when someone browsing with IE8 visits a page that has `<meta http-equiv="X-UA-Compatible" content="IE=10" />`? I can only assume we're still going to have to use hacks and conditional comments to provide a fail-safe would this event occur.

### Other solutions

If I have something to say about it; let Microsoft "break the web". Make users upgrade their software. I'm a big fan of collecting DVDs and I know that in a couple of years, my hundreds of DVDs might look a bit silly standing on my shelves, 'cause Blu-ray and HD DVD will probably have taken over by then. Yes, this annoys me. But I am aware of this and I can do nothing but live with it.

The same should be true for browsing software. Make users aware of the fact that their application might need an update in order to display the latest and greatest. And encourage authors to update their code if necessary. I can understand that not everybody can afford this, well, that's too bad. If websites become a product with a lifespan of only 8 years or so, so be it. We see this thing everywhere in our everyday life, maybe it's a good thing if it would enter our industry.

Another solution, the most sensible I've read yet, comes from [Robert Nyman](http://www.robertnyman.com/2008/01/23/version-targeting-in-ie-8-and-an-alternative-path-for-microsoft/), who says:

> Granted, a web browser need to work with bad and invalid code, so that has to be addressed. However, I only think thatâ€™s really valid for Intranets and other closed environments. If you have a public web site, you have to shape up to work with current web standards, accessibility and so on.
>
> Therefore, my suggestions are as follows:
>
> - Offer an official way to have multiple versions of Internet Explorer installed side-by-side. This way, employees in these giant dragon companies can use IE 6, 7 or whatever for work on their internal applications, while they can have a proper web browser for surfing Internet. IE 8 should only go for a standards mode, with no quirks mode support. That will lead to an incredibly lean web browser, much easier work for the IE team adding new things and for web developers coding web sites.
> - If needed, add an option in IE 8 (toolbar button, context menu option) to choose to open a web site in old IE. This means that if thereâ€™s no prior version of IE, a stand-alone version should be installed when the user installs IE 8. If there is indeed a previous version of IE on the system, let it stay there and make the IE 8 installation stand-alone.

And really, dear IE development team, if none of the above is applicable, work the same magic Firefox does. I don't know how they do it, but, as I mentioned above, **I do not encounter broken pages in my everyday browsing behaviour**.  
 If Firefox can do it, you fellas can too.
