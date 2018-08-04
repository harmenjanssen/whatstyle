---
title: "Whatstyle is renewed!"
date: 2006-12-02
author: harmen-janssen
url: /articles/10/whatstyle_is_renewed
---

{{< intro >}}
<p>
Phew, the new version is finally up and running. It took me a while, but here we are.
</p>
<p>
To you friendly visitors not much has changed, but the back-end has undergone some pretty big alterations. Read on to learn more...
</p>
{{< /intro >}}

### The cons of not having a Content Management System

 The first version of Whatstyle didn't sport a <abbr title="Content Management System">CMS</abbr>, basically because I didn't feel like developing one (plus I didn't have the time). I figured, <q>Since I know about <abbr title="HyperText Markup Language">HTML</abbr>, there is no need for me to spend time automating the thing</q>.

 This worked to a certain extend, I hard-coded all my articles, there were no worries whatsoever. But every time I updated a single thing, I had to update `n` pages. After a while, I got tired of this and started working on a <abbr title="Content Management System">CMS</abbr>.

 Unfortunately (and of course, fortunately at the same time), projects kept coming in and I didn't have all the time in the world to work on Whatstyle, which was frustrating because I had some good articles up my sleeve.

### The updates

#### Content management

There is of course the Content Management System. With the danger of sounding too "Web 2.0", it's still in Beta. A lot of stuff still needs to be done, but it's now in a state good enough for me to finally write some new articles.

#### Pretty code examples

 Using [Dunstan Orchard](http://www.1976design.com/blog/ "Visit Dunstan's website")'s excellent [Code formatting script](http://www.1976design.com/blog/archive/site-news/2004/02/19/form-redesign/) my code examples are now better looking and, in my opinion, more usable.

 I added a sprinkle of <abbr title="Php: Hypertext Preprocessor">PHP</abbr> magic to his script in order to syntax-color my examples. (**Note:** this is one of the things that's unfinished; the syntax-coloring is far from complete and doesn't cover every language and/or keyword).

#### Now with <abbr title="Really Simple Syndication">RSS</abbr>!

 You can now subscribe to my <abbr title="Really Simple Syndication">RSS</abbr> feed to stay up to date. I wanted to implement this for a long time, ever since I, myself, had discovered the magic of this great format.

Sam van Dongen made me special-thank him for Photoshopping the <abbr title="Really Simple Syndication">RSS</abbr> stamp in the header.

#### Archives

 All articles are now saved in a convenient and usable way. You can search the [archive](http://www.whatstyle.net/articles.php) to find articles by date or category.

#### Pretty <abbr title="Uniform Resource Locator">URL</abbr>S

 I now use Apache's `mod_rewrite` module to rewrite my <abbr title="Uniform Resource Locator">URL</abbr>s. That way, articles are easier to bookmark and link to.

 The difficult part was that my old <abbr title="Uniform Resource Locator">URL</abbr>s were conveniently spidered by Google, so every time I were to be found on Google, the innocent visitor would be confronted with my 404 page. Therefore, I also included rewrite rules for all the old <abbr title="Uniform Resource Locator">URL</abbr>s.

### Your feedback

 I am now shamelessly giving you the responsibility to inform me of any erroneous or unexpected behaviour Whatstyle gives you. Since every article had to be updated by hand (due to some difference in formatting and automating-scripts) there are no doubt still some bugs left I'm unaware of. I would really appreciate it if you, either by e-mailing me or leaving a comment, could provide some feedback on such errors. Of course, you may also reply to congratulate me and wish me luck ;)