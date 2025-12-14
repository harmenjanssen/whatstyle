---
date: 2022-05-02
title: Statically analyze your Laravel 9 application with PHPStan
description: This article shows how to enrich your Laravel application with type hints so you can reap the benefits of static analysis.
author: harmen-janssen
url: /articles/analyze-your-laravel-9-application-with-phpstan
norday: true
---


Static analysis is a great tool to ensure the integrity of your code. Strongly typed languages get this for free, but since PHP is a dynamically typed language, we have to use tools like PHPStan to reap the same benefits.

## Static analysis?

I will quickly explain what static analysis is and why it is important.

Consider this code:

```php
function greet(string $name): string
{
    return 'Hello ' . $name;
}

greet('Mary'); // prints "Hello Mary"
```

As you can see in the signature of the `greet` function, the parameter is _typed_. We explicitly state that this function requires a string argument.  
PHP will throw an exception when we pass it anything that cannot be safely converted to a string.

When will it throw the exception, though? At runtime, that's when! That's the worst possible time to throw an exception, because by definition it happens _when the application is running_. This means it will bother your users.

Compiled languages like Haskell or TypeScript will analyze your code in the compile step, and warn about possible type inconsistencies.
Because PHP is not compiled, there is not a moment in the lifecycle of a script in which to pick up a possible error like this.

### Meet PHPStan

[PHPStan](https://phpstan.org/) is a static analysis tool for PHP that can check your PHP code and warn about problems _before_ you push your code to production.

In the `greet` function above, the types are clearly defined: the function accepts a string argument, and returns a string response. Sometimes, however, the types don't tell you everything.  
The most straightforward example is an array:

```php
function get_names(): array
{
    return ['John', 'Jane'];
}

$names = get_names();
$greetings = array_map('greet', $names);
```

This code works, but PHP can't know for sure whether the array in fact contains strings. That is why PHPStan allows us to enrich our code with type hints.
These are code comments that contain a more specific type instruction, to tell PHPStan how to interpret the code, in cases where PHP itself is not able to.

```php
/**
 * @return array<string>
 */
function get_names(): array
{
    return ['John', 'Jane'];
}
```

This tells PHPStan that the array returned from the `get_names` function is in fact an array of strings.

PHPStan has helped us in many large codebases to find bugs, or to increase our confidence when refactoring. From here on, I will assume you have a basic knowledge of PHPStan, and focus on Laravel-specific implementations.

📖 [Use the PHPStan documentation if you feel the need to brush up](https://phpstan.org/user-guide/getting-started)

## Setting up static analysis for your Laravel project

Laravel is a very powerful framework, with a lot of magical features. If you know about generics, you might recognize the many idiomatic Laravel objects that employ generics.  
To help PHPStan understand the many magical facets of Laravel, you can use the [Larastan project by Nuno Maduro](https://github.com/nunomaduro/larastan/).

In the latest Laravel release, a lot of support has been added for static analysis, in the form of more specific docblocks. This is great, because it means richer type definitions are coming straight from the source and will be maintained by the framework itself.

Let's start by installing PHPStan and Larastan in our Laravel project:

```sh
composer require phpstan/phpstan nunomaduro/larastan
```

We can run `phpstan analyze` to check our project, but by default it will recursively check all the files in our application, including our dependencies in `vendor`.  
That's not what we want, because we only want to check _our own code_.

Let's create a `phpstan.neon.dist` file in the root of our project, containing some instructions for PHPStan:

```yaml
parameters:
    paths:
        - app
        - database/factories
        - database/seeders
        - routes
        - tests

    level: 9

includes:
    - vendor/nunomaduro/larastan/extension.neon
```

This file tells PHPStan to only check certain directories where we might write any custom code. You can expand this list if there are more relevant directories in your project.
It also tells PHPStan to use level 9, the strictest level available (you may decrease this level to match your static analysis ambitions).

Lastly it includes Larastan's extension file.

So far so good, you're all set up to statically analyze your code.

## Running your first analysis

Go ahead and run `phpstan analyze` in your terminal...

Chances are you didn't get a very nice result. If I run this in a fresh Laravel project, I get an error along the lines of;

```sh
Allowed memory size of 134217728 bytes exhausted
    (tried to allocate 1052672 bytes)
```

Not the best unboxing experience if you ask me. This is why we usually add the following script to `composer.json`:

```json
"scripts": {
    "static-analysis": "phpstan analyse --ansi --memory-limit 512M"
}
```

This will alias `composer static-analysis` to `phpstan analyse`, but also tells it to use a higher memory limit of 512MB.

If you run that command, you will finally complete your first analysis.

### Laravel core warnings

Chances are Laravel will contain _some_ analysis errors out of the box. At the time of writing, there are two errors out of the box on a fresh Laravel installation.

But it might also be that at the time you're reading this the errors are fixed, or they're different ones. Therefore I won't go into those just now. Let's instead move on to some common patterns in Laravel development and how to enrich these with type hints.

## Type-hinting Laravel components

Why do we have to enrich Laravel components with further type hints? As of Laravel 9, the core classes have been marked as generic. That is to say, a Collection isn't just a Collection, it's a _Collection of something_.

Generics allow you to express that. That's a good thing, because they help PHPStan understand your application better. You will get the benefit of knowing what type of model a Query Builder will return, for instance.

📖 [Read the docs about generics](https://phpstan.org/blog/generics-by-examples)

### Type-hinting Collections

Collections are a good place to start. Let's consider a custom collection for the User model:

```php
// app/Collections/UserCollection.php

namespace App\Collections;

use Illuminate\Database\Eloquent\Collection;

class UserCollection extends Collection
{
}
```

Connect it to the User model like this:

```php
// app/Models/User.php

public function newCollection(array $models = []): UserCollection
{
    return new UserCollection($models);
}
```

PHPStan will tell you immediately that this is not the way to go:

```sh
Class "App\Collections\UserCollection" extends generic class
    "Illuminate\Database\Eloquent\Collection" but does not
        specify its types: TKey, TModel
```

That might seem a little daunting. It tells that Collection is a _generic class_, and expects two type variables to be defined: `TKey` and `TModel`.

We can inspect the definition of `Collection` to see what is asked of us:

```php
// file: vendor/laravel/framework/src/Illuminate/Database/Eloquent/Collection.php
/**
 * @template TKey of array-key
 * @template TModel of \Illuminate\Database\Eloquent\Model
 *
 * @extends \Illuminate\Support\Collection<TKey, TModel>
 */
```

We have to provide the type variables `TKey` and `TModel` in our subclass. Those are marked `@template` in the definition.  
In our case we can specify these as `int` and `App\Models\User` respectively. That means it's a Collection _of_ User models, _keyed by_ an integer.

Use a docblock to instruct PHPStan about this:

```php
/**
 * @extends Collection<int,\App\Models\User>
 */
class UserCollection extends Collection
```

If we run `composer static-analysis` again, we're left with one error: `newCollection` doesn't specify the type of array it expects.

This is a nice illustration of the power of static analysis, because if we specify the parameter like this:

```php
/**
 * @param array<int, string> $models
 */
public function newCollection(array $models = []): UserCollection
```

We are immediately warned that a `string` is no valid input for our `UserCollection`! That's great, because it shows PHPStan understands our application and can follow along with our code deep into the stack and keeps providing meaningful feedback about mistakes we might make.

The final definitions of `UserCollection` and `newCollection` should look like this:

```php
/**
 * @extends Collection<int,\App\Models\User>
 */
class UserCollection extends Collection
{
}
```

```php
/**
 * @param array<int, User> $models
 */
public function newCollection(array $models = []): UserCollection
{
    return new UserCollection($models);
}
```

### Type-hinting model relationships

A model's relations can also be type-hinted to provide further insight into the application.

The following demonstrates all variants:

```php
class User extends Model
{
    /**
     * @return HasMany<Post>
     */
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    /**
     * @return HasOne<Profile>
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * @return BelongsTo<Group, User>
     */
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    /**
     * @return BelongsToMany<Group>
     */
    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class);
    }

    /**
     * @return MorphTo<Model, User>
     */
    public function userable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * @return MorphMany<Address>
     */
    public function address(): MorphMany
    {
        return $this->morphMany(Address::class, 'addressable');
    }

    /**
     * @return MorphToMany<Tag>
     */
    public function tags(): MorphToMany
    {
        return $this->morphToMany(Tag::class, 'taggable');
    }
}
```

Note that it's not always clear what the definition should be, but I'm borrowing a lot of knowledge from source diving the [Larastan repository](https://github.com/nunomaduro/larastan/blob/6e74c6eeb0b27227c787917afd559a2d22ec241c/tests/Features/Models/Relations.php).

### Type-hinting QueryBuilders

Query Builders are another component that you might want to extend. Query Builders are also generic, and this is very helpful because it can instruct PHPStan what models can be expected to be returned by its queries.

This requires two components: the custom Query Builder itself, and a `newEloquentBuilder` method on the model. Let's use User again as an example:

```php
// app/Models/User.php

/**
 * @return UserQueryBuilder<User>
 */
public function newEloquentBuilder($query): UserQueryBuilder
{
    return new UserQueryBuilder($query);
}
```

```php
// app/QueryBuilders/UserQueryBuilder.php

namespace App\QueryBuilders;

use Illuminate\Database\Eloquent\Builder;

/**
 * @template TModelClass of \App\Models\User
 * @extends Builder<\App\Models\User>
 */
class UserQueryBuilder extends Builder
{
}
```

### Type-hinting Factories

Another generic class is the Factory. Factories are used to create new models, and you can type-hint your factory to tell PHPStan what model it will return:

```php
/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
}
```

Note, in Laravel 11 you also have to type-hint the `HasFactory` trait in your models. This is because the `HasFactory` trait is a generic trait, and you have to tell PHPStan what class will be used:

```php
class User extends Model
{
    /**
     * @phpstan-use HasFactory<\Database\Factories\UserFactory>
     */
    use HasFactory;
}
```

### Type-hinting scopes

Scopes are useful to prevent repetitive code. You can type-hint scopes to tell PHPStan what model it will return:

```php

use Illuminate\Database\Eloquent\Builder;
use App\Models\User

/**
 * @param Builder<User> $query
 * @return Builder<User>
 */
public function scopePopular(Builder $query): Builder
{
    return $query->where('votes', '>', 100);
}
```

### Type-hinting casts

If you use a custom cast, you have to provide type hints to tell PHPStan what values should be used to set, and what values you can expect to get from, the model's attributes.

For example:

```php
/**
 * @implements CastsAttributes<\App\ValueObjects\Money,int>
 */
class Money implements CastsAttributes
```

Here we tell PHPStan: this `Money` cast will transform attributes into instances of `App\ValueObjects\Money`, and will use `int` to store the value in the database.

## Known issues and caveats

The above practices can, with a little work, make your code more type-safe.

Below are some gotchas to be aware of.

### Avoid collect() for empty collections

When using the `collect()` helper to create an empty colleciton, PHPStan will warn about the following:

```sh
Unable to resolve the template type TKey in call to function collect
Unable to resolve the template type TValue in call to function collect
```

The reason is that without arguments, the parameter to `collect()` defaults to `null`. However, `null` is actually not valid input to `new Collection`, because the type variables `TKey` and `TValue` cannot be extracted from it.

To fix this, either use `new Collection()`, or use `collect([])`.

📖 [Read this Larastan issue for more information](https://github.com/nunomaduro/larastan/issues/1115)

### Using groupBy() will change the structure of the collection

When using `groupBy` you change the structure of a collection.  
For instance:

```php
return User::all()
    ->groupBy('name')
    ->map(fn (Collection $usersWithTheSameName) =>
        $usersWithTheSameName->count());
```

This code will function just fine, but PHPStan does not understand that `groupBy` changes the collection from a collection of users to a _collection of collections of users_.

Therefore it will complain that the function to `map` should expect a `User` argument instead of a `Collection` argument.

You can solve this by explicitly instructing PHPStan about the type, using an intermediate variable:

```php
/**
 * @var Collection<string, Collection<int, User>> $groups
 */
$groups = User::all()
    ->groupBy('name');
return $groups
    ->map(fn (Collection $usersWithTheSameName) =>
        $usersWithTheSameName->count());
```

It's always a shame having to use `@var` documentation to fix these things, but for now it's the way to go in some cases.

## In conclusion

We've used PHPStan and Larastan to make confident changes to large codebases.

Together with a solid test suite, static analysis helps to build trust and allows you to do big refactoring.  
Next to that it will help your IDE better understand your code and help with autocompletion, which will increase your productivity.

At GRRR, static analysis has become part of our template repositories and thereby enhances the codebases of all of our projects.  
Hopefully this article has shown you how to integrate these powerful tools in your own Laravel projects.
