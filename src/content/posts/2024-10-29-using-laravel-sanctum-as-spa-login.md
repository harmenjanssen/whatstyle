---
date: 2024-10-29
title: How to use Laravel Sanctum for SPA authentication
description: Learn how to set up and use Laravel Sanctum for secure SPA authentication in your projects.
author: harmen-janssen
tableOfContents: true
url: /articles/how-to-use-laravel-sanctum-for-spa-authentication
norday: true
---

[Laravel Sanctum](https://laravel.com/docs/11.x/sanctum) is a package that provides a way to either do token-based authentication (for APIs), or SPA authentication.  
Setting it up can be tricky, so in this article I will point you in the right direction.

## What is SPA authentication?

[In a headless setup](/posts/2019/case-study-serverless-architecture-for-the-ocean-cleanup/), the front-end is decoupled from the back-end.
It runs as a standalone application, and communicates with the back-end via an API.
For most of our static site projects, there's no need to setup authentication, because the API is only accessed at build-time, when the static pages are rendered.
In some cases, however, an application might support user login for personalization, or to access protected resources.
For example, in some of our projects we offer a preview mode, where administrators can see a preview of their content before it's published.

In those cases, we need to setup authentication.
There are many ways to do this, but in this article I will show you how to use Laravel Sanctum for SPA authentication.
This allows you to conveniently manage all users and permissions in your Laravel back-end.

[Laravel's documentation](https://laravel.com/docs/11.x/sanctum) talks about both token-based authentication and SPA authentication.
For this article, we will focus on SPA authentication.

## Setting up Laravel Sanctum

### Installation

Start by installing Laravel Sanctum via Composer:

```bash
composer require laravel/sanctum
```

Next, publish the Sanctum configuration file:

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

Also publish your CORS configuration file:

```bash
php artisan config:publish cors
```

Make sure to add the required paths to your CORS configuration file:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
```

The `api/*` path is required if you wish to access your API client-side from your SPA.
More on `sanctum/csrf-cookie` later.

Also enable `supports_credentials` in the same file:

```php
'supports_credentials' => true,
```

We will need this when authenticating on the front-end.

### Setting up your domains

Note that your front-end and back-end should run on the same top-level domain.
However, you can use different subdomains.

For example: `example.com` and `api.example.com` will work, but `example.com` and `api.anotherexample.com` will not.

In your `config/sanctum.php` file, find the `stateful` configuration key, and add your domains.
This is necessary to ensure cookies are shared across these domains.
Make sure to include any port numbers you're using!

Next, find your `SESSION_DOMAIN` environment variable.
Update it so it starts with a period (`.`) and includes your top-level domain:

```php
SESSION_DOMAIN=.example.com
```

For localhost, use `.localhost`, and omit the port number.

### Install the required middleware

In Laravel 11, add this one-liner to your `bootstrap/app.php` file:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->statefulApi();
})
```

If your project is based on older Laravel versions, you can add the Sanctum middleware to your `api` middleware group in `app/Http/Kernel.php`:

```php
protected $middlewareGroups = [
    'web' => [
        // ...
    ],
    'api' => [
        // ...
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    ]
];
```

### Setup a login route in your back-end

Create a `LoginController` in your Laravel app.
Here's a simple example that does the job:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class LoginController
{
    public function authenticate(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);
        if (!Auth::attempt($credentials)) {
            return response()->json(
                [
                    'message' => 'Invalid credentials',
                ],
                401
            );
        }

        $user = Auth::user();

        return response()->json([
            'id' => $user?->id,
            'name' => $user?->name,
            'message' => 'User authenticated successfully',
        ]);
    }
}
```

Note that this controller will only attempt to login the user.
It has no functionality to show a login form, or register users.
The form is a responsibility of your front-end application, and registering users is out of scope for this article.  
In the final section of this article we will show you how to piggyback on Laravel Nova's user management.

Register your route in the `routes/api.php` file:

```php
Route::post('/login', [LoginController::class, 'authenticate']);
```

### Implement authentication in your SPA

So far so good.
You're all setup to call your API and implement authentication from your SPA.

Create a login form in your front-end application, accepting an email address and password.
When the user submits the form, send a POST request to your Laravel back-end with the user's credentials.
Because Laravel uses [CSRF protection](https://laravel.com/docs/11.x/csrf), you need to send a CSRF token with your request.
Use the aforementioned `sanctum/csrf-cookie` route to obtain this token.

Here's a working example in JavaScript to handle the user's login:

```js
// Tip: store this value in your .env file.
const apiRoot = "https://api.example.com";

const handleSubmit = async (event) => {
  event.preventDefault();

  // First, fetch the CSRF token.
  await fetch(`${apiRoot}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
  // The request has placed the cookies in document,
  // due to the credentials: include option.
  const xsrfToken = getCookie(document.cookie, "XSRF-TOKEN");
  if (!xsrfToken) {
    throw new Error("No XSRF token found");
  }

  // Now, send a request to your LoginController.
  const formdata = new FormData(event.target);
  const login = await fetch(`${apiRoot}/api/login`, {
    body: formdata,
    credentials: "include",
    headers: {
      "X-XSRF-TOKEN": xsrfToken.value,
    },
    method: "POST",
    mode: "cors",
  });
  if (!login.ok) {
    throw new Error("Login failed");
    return;
  }

  // You can now use the user's data to personalize the page,
  // or redirect to a protected route.
  // The user's id will be in the login response.
};
```

Here's the `getCookie` function:

```js
function getCookie(cookieString, name) {
  const cookies = cookieString.split(";").map((cookieDeclaration) => {
    const [key, value] = cookieDeclaration.trim().split("=");
    return { key, value: decodeURIComponent(value) };
  });
  return cookies.find((cookie) => cookie.key === name);
}
```

With this submit handler you should be able to successfully authenticate the user.
It will return their ID to the front-end for use in future API calls, but that in itself is not required to identify the user: identifying the user is done via the session cookie, which is now shared between your front-end and back-end.  
Make sure you always send **the CSRF token** with your requests, and also to add the `credentials: "include"` property to your fetch requests, otherwise the calls won't be made on your user's behalf.

## Protect your API routes

You can now finetune authorization of your API routes using Laravel's policies.

One exception to take into account is when you want to share authentication between your regular and API routes.
In our case we used [Laravel Nova](https://nova.laravel.com/) to manage our content and our users.
It made sense to us to allow users that login to Nova to also be able to use that same session when viewing the API.

However, after logging into Nova, I was still being redirected to the login page when trying to access the API.

I was stuck on this for a while, but the solution actually makes a lot of sense: use the same session-related middleware in the "api" group as in your "web" group.

For example, your middleware `api` group should look something like this:

```php
protected $middlewareGroups = [
    'web' => [
        // ...
    ],

    'api' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        // ...
    ],
];
```

This ensures that the session cookie is stateful across your web and your api routes.
Logging into Laravel Nova will allow your users to view the API as well, as long as your policies support this.

## In conclusion

Reading back over this article, setting up Laravel Sanctum is not that daunting of a task.
However, getting the details right can be tricky; using the right middleware, configuring the correct session domain, figuring out how to read and pass along the cookies on the front-end.

Hopefully this article will guide you through all the required steps, and allow you to get this fundamental authentication layer out of the way quickly.

Now you can focus on building your application!
