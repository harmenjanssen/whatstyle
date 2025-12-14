---
date: 2021-07-30
title: How to ensure only a single model has a certain value in Laravel?
description: What if only a single record in your database is allowed to have a certain value for a given property?
author: harmen-janssen
url: /articles/ensure-single-model-value-in-laravel
norday: true
---

In every other project I encounter this problem, and although it's not particularly challenging, I have to look up every single step every time I have to solve it.

Here's a quick tutorial, by me, to future me.

## The problem

There are loads of scenarios in which your business logic allows only a single model in the database to contain a certain property value.

Some examples include:

- A table of news articles in which only a single one can be highlighted.
- A collection of users, of which only a single one can be appointed the contact person for certain emails.
- Answers to a question, of which only a single one can be the "pinned" answer.

In these cases your CMS will most likely contain a checkbox that will flip this property from _yes_ to _no_ per model.  
It's very important that in case of _yes_, no other models contain _yes_!

---

Let's stick with the highlighted news article example. Consider a table of articles with a boolean column `is_highlighted`. At any given time, only a single article can be the highlighted article!

Here's what you do.

## The model

Using the `$dispatchesEvents` property of a model, you can specify _lifecycle events_. These are events that are dispatched when **saving**, **deleting** or **retrieving** a model.

We can use the `saving` event to listen for changes in the model. It'll be dispatched before _inserting_ and _updating_ a model.

```php
namespace App\Models;

use App\Events\SavingArticle;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $casts = [
        'is_highlighted' => 'boolean',
    ];

    protected $dispatchesEvents = [
        'saving' => SavingArticle::class,
    ];
}
```

Events are an elegant way of decoupling business logic from your model and dividing functionality in bite-sized, condensed pieces that are easy to understand at a glance, as you'll see in the next sections.

📖 [Read the Laravel documentation about model events](https://laravel.com/docs/8.x/eloquent#events)

## The event

You can easily create the event class using Artisan:

```sh
$ php artisan make:event SavingArticle
```

This will create an object scaffolding for you.  
We don't have to add a lot to it, but the final class should look like this:

```php
namespace App\Events;

use App\Models\Article;
use Illuminate\Queue\SerializesModels;

class SavingArticle
{
    use SerializesModels;

    public Article $article;

    public function __construct(Article $article)
    {
        $this->article = $article;
    }
}
```

As you can see, an event object is a fairly shallow object that's used to transport values from the model to any listeners. It'll receive the model being updated in the constructor. In our case that's all we need.

📖 [Read more about defining Laravel events](https://laravel.com/docs/8.x/events#defining-events)

## The listener

Now that we have an event object, we need something to listen for the event. Again, Laravel helps out with an Artisan command:

```sh
$ php artisan make:listener EnsureSingleHighlight
```

This will scaffold a _listener_ class. We will want to tweak it so it looks like this:

```php
namespace App\Listeners;

use App\Events\SavingArticle;
use App\Models\Article;

class EnsureSingleHighlight
{
    public function handle(SavingArticle $event): void
    {
        if (!$event->article->is_highlighted) {
            return;
        }
        Article::where('id', '!=', $event->article->id)->update([
            'is_highlighted' => false,
        ]);
    }
}
```

A listener needs a single `handle` method, which will receive the event object as defined above. Because we made the model a public property of the event class, the listener can easily read its values.

From there we can run an `UPDATE` query, which removes the highlight from any models that are not the one currently being saved.

Almost there!

## The Service Provider

Last but not least, we can glue listener to event in the `EventServiceProvider`. In Laravel, this is the place where all event listeners are registered.

Map the event to the listener inside its `$listen` array:

```php
namespace App\Providers;

use App\Events\SavingArticle;
use App\Listeners\EnsureSingleHighlight;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        SavingArticle::class => [EnsureSingleHighlight::class],
    ];
}
```

💡 Note that the values in this array are arrays as well. That way, you can specify multiple listeners for a single event, and create a truly decoupled application.

## All done!

And that's it!  
This will ensure only a single model in your table will ever contain a `true` value for the `is_highlighted` property.

You can stretch this concept and use events and listeners in all kinds of ways to ensure database integrity.
