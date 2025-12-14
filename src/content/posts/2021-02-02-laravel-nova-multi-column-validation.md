---
date: 2021-02-02
title: Validating a multi-column unique key in Laravel Nova
description: How do you incorporate the rules for a unique key consisting of multiple columns in Laravel Nova?
author: harmen-janssen
url: /articles/validating-a-multi-column-unique-key-in-laravel-nova
norday: true
---

If you're working with Laravel, [Nova](https://nova.laravel.com) is a pretty solid CMS option. It offers a lot of control, and you can leverage all the power Laravel and its community have to offer. The solution in this article is no exception: by combining build-in Laravel concepts we can quickly solve our problem.

Validating uniqueness in Nova is no problem. When you install Nova you get a User resource for free, which already includes the right validation rules:

```php
Text::make('Email')
    ->sortable()
    ->rules('required', 'email', 'max:254')
    ->creationRules('unique:users,email')
    ->updateRules('unique:users,email,{{resourceId}}'),
```

This will produce a neat error message whenever a duplicate email address is being submitted:

{{< image src="unique-validation.png" alt="A screenshot a validation error in Laravel Nova." caption="Nova has no problem validating unique single values." >}}

However, what do you do when your unique key is made up of multiple columns?

## Dealing with multiple columns

To set the stage, imagine a **Page** resource. Every page has a **slug**, and a **parent_id**. Every page's URL is determined by its slug, preceded by the slugs of its parent.

In other words, the page "Web development", which is a child of "Services", which is a child of "About Us", will end up with the URL: `/about-us/services/web-development`.

From these rules we can derive a natural constraint. The slug needs to be unique _at the level of its parent_. A slug may appear multiple times, so long as their parent pages are different.

First, let's create a migration to generate the correct table:

```php
Schema::create('pages', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->nullable();
});

// Adding a foreign key to the same table
// while creating it is not possible.
Schema::table('pages', function (Blueprint $table) {
    $table
        ->foreignId('parent_id')
        ->nullable()
        ->references('id')
        ->on('pages');

    // Create compound unique index on parent_id and slug:
    // slugs can only exist once at the same level.
    $table->unique(['parent_id', 'slug']);
});
```

Then we need two fields on the resource, one for slug, one for the parent:

```php
Slug::make('slug')
    ->from('title')
    ->default(''),

BelongsTo::make(
    'parent',
    'parent',
    static::class
)
    ->nullable()
    ->display('title'),
```

Note that we cannot add unique rules to these fields, because we cannot encapsulate the full rule.

Although Laravel _does_ support unique validation using multiple columns, we have no way of setting the extra value in the context of a Nova Resource.

An example of a rule that would work in theory is this:

```php
Slug::make('slug')
    ->from('title')
    ->default('')
    ->rules('unique:pages,slug,{{resourceId}},id,parent_id,???')
```

But as you can see, we cannot offer the value for `parent_id`, because that value won't exist until **after the form is submitted**.

## Using Nova's afterValidation hook

In a Nova resource class, you can implement the `afterValidation` method to do additional validation. The perfect place to add your custom domain logic.

```php
protected static function afterValidation(
    NovaRequest $request,
    $validator
) {
    if ($this->somethingElseIsInvalid()) {
        $validator->errors()->add(
            'field',
            'Something is wrong with this field!'
        );
    }
}
```

As you can see, you can implement this however you want, and add custom errors to the `Validator` instance in case of failure.

Here's the full solution if you're just here to copy and paste:

```php
protected static function afterValidation(
    NovaRequest $request,
    $validator
) {
    $parentId = $request->post('parent');
    $unique = Rule::unique('pages', 'slug')->where(
        'parent_id',
        $parentId
    );
    if ($request->route('resourceId')) {
        $unique->ignore($request->route('resourceId'));
    }

    $uniqueValidator = Validator::make($request->only('slug'), [
        'slug' => [$unique],
    ]);

    if ($uniqueValidator->fails()) {
        $validator
            ->errors()
            ->add(
                'slug',
                'This slug is already taken on this level.'
            );
    }
}
```

Let me break it down so you know what's happening:

```php
$parentId = $request->post('parent');
$unique = Rule::unique('pages', 'slug')->where(
    'parent_id',
    $parentId
);
```

First, we take the value for `parent` from the request's postdata. This is the value that was just submitted in the form.

From this, we create a new unique Rule. The `where` clause will be tacked on to the query.

```php
if ($request->route('resourceId')) {
    $unique->ignore($request->route('resourceId'));
}
```

This handles the update case. If we were to omit these lines, no resource could ever be updated again with the same slug, since the rule would always find a matching record: itself!

With the rule in place, we can create new `Validator` instance, and validate the slug using our custom rule:

```php
$uniqueValidator = Validator::make($request->only('slug'), [
    'slug' => [$unique],
]);

if ($uniqueValidator->fails()) {
    $validator
        ->errors()
        ->add(
            'slug',
            'This slug is already taken on this level.'
        );
}
```

That's it! Using a couple of powerful, native, Laravel concepts we can extend Nova's build-in features to accommodate our own domain rules.

💡 Looking for validating multiple unique columns outside of a Nova context? [Read this article to learn more.](https://www.magutti.com/blog/unique-validation-on-single-and-multiple-columns-in-laravel)

📖 [Read Laravel Nova's validation docs.](https://nova.laravel.com/docs/3.0/resources/validation.html)
