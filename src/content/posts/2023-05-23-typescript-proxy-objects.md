---
date: 2023-05-23
title: How to use Proxy objects in TypeScript
description: What are Proxy objects and how can you use them with TypeScript?
author: harmen-janssen
tableOfContents: true
url: /articles/typescript-proxy-objects
norday: true
---

_Proxy objects_ are one of those obscure JavaScript features that you probably won't encounter much in your day to day production work.  
However, they can really improve the usability of your library. When you've learned how to use them, you might spot new use cases in your projects.

## What is a Proxy object?

A `Proxy` is a stand-in for another object, that is able to intercept operations on the object and change their outcome.

With "operations on the object" we mostly mean reading and writing properties, but there are more, less common operations. An example would be using the `in` operator, or deleting properties using the `delete` keyword. All of these you can catch with your proxy, and in the proxy determine what the outcome should be.

You create a `Proxy` with two parameters:

-   The original object which you want to proxy.
-   A handler object that defines which operations will be intercepted and how to redefine intercepted operations.

A silly example would be the following:

```ts
const harmen = {
    name: "Harmen Janssen",
    company: "GRRR",
    occupation: "Developer",
};

const handler = {
    get(target, prop, receiver) {
        if (prop === "occupation") {
            return "President of the world";
        }
        return target[prop];
    },
};

const myProxy = new Proxy(harmen, handler);
myProxy.name; // "Harmen Janssen"
myProxy.occupation; // "President of the world"
```

As you can see, the Proxy object can be used as a stand-in for the original, but here we intercept references to the `occupation` property to provide our own value.

The _handler_ object can contain a whole bunch of methods that each stand for an operation on the _target_ object. In the example above we implement one such method, `get`, which is executed when you read an object property (`myProxy.name` for instance).

These methods are called _traps_, because they _trap_ the original operation and return their own result.

These traps all receive a specific set of parameters that is applicable to their nature, so it's worth investigating the list of possible traps on MDN.

📖 [See the list of handler functions on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy#handler_functions)

## When do you need Proxy objects?

A Proxy object is probably not something that you truly _need_. It's not often a requirement to solve a problem, but it can be the cherry on top of your API.  
I will show some examples of implementations I've written recently to give you an idea.

This blog already contains a post about [JavaScript getters and setters](/posts/js-getters-setters/). These are great when you want to give objects a "virtual" property that is **known** beforehand. The following examples use `Proxy` objects to solve the case where you want to use virtual properties that are **unknown** beforehand.

### Overcoming React's conditional hooks limitation

In a recent React project, we fetched settings from the server. We created a custom `useSetting` hook for this:

```tsx
return (
    <header>
        <h1>{useSetting("pageTitle")}</h1>
    </header>
);
```

This worked out mostly okay, but as you may know, React doesn't like it when hooks are called conditionally.  
Something like this will show a warning:

```tsx
return (
    <>
        {useSetting("shouldShowTitle") && (
            <header>
                <h1>{useSetting("pageTitle")}</h1>
            </header>
        )}
    </>
);
```

You will have to refactor your code to read like this:

```tsx
const pageTitle = useSetting("pageTitle");

return (
    <>
        {useSetting("shouldShowTitle") && (
            <header>
                <h1>{pageTitle}</h1>
            </header>
        )}
    </>
);
```

To overcome this limitation, I used a `Proxy` to mask our function calls as an object. This prevents the React warning:

```ts
export default function useSettings() {
    const settings = useContext(SettingsContext);
    const settingsFactory = readSettingFactory(settings);

    return new Proxy(
        {},
        {
            get(_, name) {
                return settingsFactory(name);
            },
        }
    );
}
```

We can now use settings as if they were stored in a plain-old JavaScript object, instead of a React hook:

```tsx
const settings = useSettings();

return (
    <header>
        <h1>{settings.pageTitle}</h1>
    </header>
);
```

**Be careful**: React has good reasons to warn against using hooks conditionally! Make sure you know what you're doing when circumventing warnings like this.

Note that this is a very good use case for a _caching layer_. You might have to do some expensive querying to get the settings from the server.  
In the `Proxy` object you can fetch the results and cache them. Subsequent calls for properties can be returned from cache.

### Providing a sane default

Undefined properties on an object will always return `undefined`:

```ts
console.log(harmen.age); // undefined
```

That's a fine rule, but you _do_ have to keep it in mind when working with optional properties. When passing values along in your app, you would have to write code to account for every value that might possibly be `undefined`. That's a bit cumbersome and not a very nice API. And when you're using TypeScript, you might lose that sense of security that types usually provide.

You could type up your functions like this:

```ts
function calculateAgeInSeconds(age: number | undefined);
```

But in most cases it's nicer to use consistent, reliable types.

In a recent project we stored a visitor's filter choices in localStorage, to restore upon their next visit. However, we couldn't know beforehand which sections of the site the user had visited and therefore they might or might not have that particular set of filter choices in storage.

After working with this, my code was riddled with these cumbersome expressions: `userChoices[identifier] || {}`.

```tsx
<MyOtherComponent filterChoices={userChoices[identifier] || {}} />
```

```tsx
<p>Active filters: {countFilterChoices(userChoices[identifier] || {})}</p>
```

It's very explicit, which I usually like. But it's also very easy to do wrong. I like APIs that are easy to guess and where my fellows don't have to remember to tack ` || {}` onto every expression.

I solved this by writing a very short `Proxy` object that provided that `{}` fallback:

```ts
filterChoices: new Proxy(
    filterChoices,
    {
        get(target, prop) {
            return target[prop] || {};
        },
    }
),
```

Again: just a very small adjustment, but one that makes it easier for my colleagues to fall into the [Pit of Success](https://blog.codinghorror.com/falling-into-the-pit-of-success/).

### A mock object for Storage

In another recent project, I wrote a little utility to [memoize](https://en.wikipedia.org/wiki/Memoization) function calls in `localStorage` or `sessionStorage`.  
In order to unit test this, I wanted to be independent of an actual browser implementation of such a Storage layer, and therefore wrote a mock implementation to use in my unit tests. `Storage` is actually a pretty complex object, where fixed properties and methods are mixed with virtual properties named after whatever you've stored in there. In this case a `Proxy` was my only option to recreate a realistic `Storage`-like object.

It's a little bit more complex than the other examples so I'll leave it here for you to peruse but won't go into the details:

```ts
const mockStorageProvider: Storage = new Proxy<Storage>(
    {
        _internalStorage: {} as {
            [key: string]: any;
        },
        get length() {
            return this._internalStorage.length;
        },
        key(index: number) {
            return Object.keys(this._internalStorage)[index] || null;
        },
        getItem(key: string) {
            return this._internalStorage[key];
        },
        setItem(key: string, value: any) {
            this._internalStorage[key] = value;
        },
        removeItem(key) {
            delete this._internalStorage[key];
        },
        clear() {
            this._internalStorage = {};
        },
    },
    {
        has(target, prop) {
            if (typeof prop !== "string") {
                return false;
            }
            return prop in target._internalStorage || prop in target;
        },
        get(target, prop) {
            if (typeof prop !== "string") {
                return undefined;
            }
            return target._internalStorage[prop] || target[prop] || undefined;
        },
    }
);
```

## TypeScript-specific considerations

In usual scenarios, TypeScript will understand that the `Proxy` should be considered an instance of the type of the original object.

For example:

```ts
interface User {
    name: string;
    occupation: string;
    age: number;
}

const harmen: User = {
    name: "Harmen Janssen",
    occupation: "Developer",
    age: 38,
};

const myProxy = new Proxy(harmen, {});
```

If you would inspect `myProxy` in your editor here, TypeScript would actually tell you it's of type `User`.

So far so good!

Your _handler_ object is extremely powerful. If you want, you can completely disregard the `target` object and return whatever you want from its trap functions. Or, as you might recall from my settings example above, I used an empty object as a stand-in to mask my function calls.

In that case, maybe the original type is not valid for your proxy. TypeScript wouldn't be able to tell that the results from the handler function will change the semantics of your type.

`Proxy` is [generic](https://www.typescriptlang.org/docs/handbook/2/generics.html), however, so you can tell TypeScript the type of the resulting object:

```ts
const settings = new Proxy<MySettingsType>(
    {},
    {
        get(target, property) {
            // ...
        },
    }
);
```

Note that the given target object has to be compatible with the given type variable, otherwise it still won't work.

---

Hopefully you've gotten a pretty good idea of when to use a `Proxy` object.

Make sure to check out the Proxy documentation on MDN, because it can be a complex subject with a lot of edge cases if you go beyond what I discussed in this article!

📖 [Check out the documentation on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
