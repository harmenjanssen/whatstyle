---
date: 2021-11-29
title: Making TypeScript's Partial type work for nested objects
description: The Partial type is a great idea, but doesn't work for nested objects. This article will show you how to fix that.
author: harmen-janssen
url: /articles/making-typescript-partial-work-for-nested-objects
norday: true
---

## TL;DR?

If you're just here to copy the type definition, [jump to the conclusion](#in-conclusion) and copy away. ✊

Without further ado...

## Meet TypeScript's Partial type

There are functions in which you do not want to pass or accept the full object, but rather a subset of its properties. An example would be a database update function.

Consider this fictional `User` type:

```ts
interface User {
    id: number;
    firstName: string;
    lastName: string;
}
```

We could write the update function like this:

```ts
function updateUser(data: User) {
    // Update here.
}
```

But this will require us to always pass a _full_ `User` object.
We would rather be able to _just_ pass the attributes of the user that changed, like this:

```ts
updateUser({ lastName: "Johnson" });
```

However, TypeScript won't accept this, because this is not a `User`, it's an arbitrary object with a `lastName` property! Of course we can escape using the `any` type, but that won't give us any of TypeScript's benefits.

Luckily, TypeScript provides so-called _Utility Types_, one of which is the `Partial` type.

We can use it to fix our `updateUser` function:

```ts
function updateUser(data: Partial<User>) {
    // Update here.
}
```

Awesome! This works: the function will accept an object consisting of some or all of `User`'s properties.

📖 [Read the TypeScript documentation on the Partial type](https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype)

## Complicating things with nested objects

All right, now let's turn up the heat on poor `Partial`.

Let's say our `User` type contains nested objects:

```ts
interface User {
    id: number;
    firstName: string;
    lastName: string;
    address: {
        street: string;
        zipcode: string;
        city: string;
    };
}
```

Our `updateUser` function will still work, and you can definitely omit the `address` property, but what you _can't do_, is pass a partial `address` object. This will fail:

```ts
updateUser({
    address: {
        city: "Amsterdam",
    },
});
```

TypeScript will yell at you:

```
Type '{ city: string; }' is missing the following properties
  from type '{ street: string; zipcode: string; city: string; }':
    street, zipcode
```

From this we can conclude that `Partial` allows you to _omit any property from the original interface_, but you cannot _change the shape of the values_. Any nested object should be in the original shape, and thus contain all of its properties.

We can fix this by re-creating the `Partial` type.

Let's take a look at the `Partial` type's definition:

```ts
type Partial<T> = { [P in keyof T]?: T[P] };
```

What's going on here?

`keyof` is a so-called _type operator_. It produces a union type of all the keys of an object. For example:

```ts
type Point = { x: number; y: number };
type P = keyof Point;
```

`P` in this example is equivalent to `type P = "x" | "y"`.

📖 [Read the TypeScript manual on the keyof type operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)

Another relevant keyword in the `Partial` definition is `in`. It can be used to define a _Mapped Type_.

```ts
type Point = { x: number; y: number };
type P = {
    [Property in keyof Point]: {
        value: number;
        units: "px" | "em" | "rem";
    };
};
```

In this example `P` is a type that supports objects looking like this:

```ts
const foo: P = {
    x: { value: 42, units: "px" },
    y: { value: 999, units: "rem" },
};
```

📖 [Read the TypeScript manual on Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)

Last but not least, the little question mark in the `Partial` type definition might have escaped your attention but is actually the most important part of the definition. It makes properties optional, which is the _raison d'être_ of the `Partial` type!

Now that we have a solid understanding of the definition, we can see clearly that nothing in this type would allow partial nested objects. Let's come up with our own type to fix this. We will call it `Subset` since `Partial` is taken.

```ts
type Subset<K> = {
    [attr in keyof K]?: K[attr] extends object ? Subset<K[attr]> : K[attr];
};
```

This looks a little daunting, but look closely, and you'll see that most of it is equivalent to the original `Partial` type.

```ts
[attr in keyof K]?:
```

This part again means: create a type containing all properties of `K`, and make all of them optional.

The definition of the value is a little more convoluted:

```ts
K[attr] extends object ? Subset<K[attr]> : K[attr];
```

This value takes the form of a JavaScript ternary operator. TypeScript allows dynamic structures like this thanks to a feature called _Conditional Types_. Conditional Types allow you to inspect a given parameter and create a logic branch in the definition of your type.

Here's an example to illustrate this behavior:

```ts
interface Point {
    x: number;
    y: number;
}
type Point3D<P> = P extends Point
    ? {
          [key in keyof P]: P[key];
      } & {
          z: number;
      }
    : never;
```

When given a `Point`, this `Point3D` generic type will take all properties from the given type `P`, and add a `z` property. But given any other type, it's defined as `never`.

📖 [Read the TypeScript manual on Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

With this, we can take another look at the property values of our `Subset` type:

```ts
[attr in keyof K]?: K[attr] extends object ? Subset<K[attr]> : K[attr];
```

This says: for every property of type `K`, see whether its value extends `object`, and if so, make it _also a `Subset`_, otherwise just copy its definition from the original.

And with that, we can update our `updateUser` function to be:

```ts
function updateUser(data: Subset<User>) {
    // Update here.
}
```

Now the function will allow any partial `User` object, and even respect partial nested objects. Great!

{{< image src="helpful-editor.png" alt="Screenshot showing a code editor helpfully offering suggestions for available attributes." caption="Now my editor can be extra helpful!" >}}

### Update October 2022

One more optimization came to us from reader Michael Dahm on [Twitter](https://twitter.com/micdah/status/1580531114657316865). Michael noticed that our implementation does not allow for properties to be either an object or null/undefined in the partial implementation.

He suggests this format:

```ts
type Subset<K> = {
    [attr in keyof K]?: K[attr] extends object
        ? Subset<K[attr]>
        : K[attr] extends object | null
        ? Subset<K[attr]> | null
        : K[attr] extends object | null | undefined
        ? Subset<K[attr]> | null | undefined
        : K[attr];
};
```

This fixes that problem and with that, is a more robust implementation altogether. Thanks Michael!

## In conclusion

```ts
type Subset<K> = {
    [attr in keyof K]?: K[attr] extends object
        ? Subset<K[attr]>
        : K[attr] extends object | null
        ? Subset<K[attr]> | null
        : K[attr] extends object | null | undefined
        ? Subset<K[attr]> | null | undefined
        : K[attr];
};
```

This type probably looks very complicated to beginning TypeScript developers, but when broken down, the parts refer to well-documented behaviors and concepts.

TypeScript is an amazingly expressive language, which enables you to come up with highly dynamic interfaces that perfectly adhere to the rules of your application.

The profit, in the end, is in your editor, which will tell you exactly what's expected and help you do the right thing.
