---
date: 2024-02-26
title: How to use map, filter, and reduce in JavaScript
description: A tutorial about the three most important functions in JavaScript.
author: harmen-janssen
tableOfContents: true
url: /articles/how-to-use-map-filter-and-reduce-in-javascript
norday: true
---

How to explain the functions `map`, `filter`, and `reduce`?
Why even focus on these functions? Why do these specifically need explaining?

Let's start with that last question.

## Why map, filter, and reduce?

These functions are a fundamental part of working with _data_. And when programming, you're basically juggling data all the time.  
Specifically, arrays of data.

You're transforming an array of items into another array of items.  
Or you might be selecting items from an array that meet certain criteria.

This happens so often in programming, that it's nice to have functions specifically for this purpose.

Of course, as with all problems in programming, there are a million ways to solve these.

One very common way that beginners often get taught to do this is by using _loops_.  
For example, you could write a `for` loop to iterate over a list of items, and do whatever you want with each item:

```js
for (var i = 0; i < items.length; i++) {
  var item = items[i];
  // do something with the item: transform it, remove it, etc.
}
```

This is such a classic programming example, I could write it in my dreams.  
And yet, I never write it in my waking hours.

Why not? Because `map`, `filter`, and `reduce` give me a very expressive _handle_ to reason about these problems.  
With _handle_ I mean a name to describe the problem.
With these functions on hand, I have a shared vocabulary to share my intent with my colleagues.  
I can say: "I'm mapping this list from X to Y", and they will know what I mean.

The `for` loop is very anonymous. I have to inspect the contents of the loop block to understand what's happening, whereas a `map` or `filter` call immediately expressesd the purpose of that piece of code.

Furthermore, the loop requires more code to do the same thing.  
For instance, in order to create a new array with only selected items, I will have to create that array beforehand, and add an item to it on every iteration.  
To my mind, these are a lot of moving parts that I need to keep in my head.  
As you will see, when mapping and filtering, all of that is implicit.

This tutorial will try to explain these functions to you, to allow you to use and recognize these same handles and benefit from their expressive power.

### 💡 Disclaimer

In functional programming and [Category Theory](https://en.wikipedia.org/wiki/Category_theory), these functions are part of a larger set of algebraic data structures, like `Functor`, `Applicative`, and `Monad`.

I am aware of this, and if you are too, you are not the intended audience for this article!
This article is aimed at people unfamiliar with these concepts, and who want to get a pragmatic handle on these functions in their everyday programming life. Therefore I will skip this nuance, and will point people to [Professor Frisby's Mostly Adequate Guide To Functional Programming](https://mostly-adequate.gitbook.io/mostly-adequate-guide/) if they wish to explore further. ❤️

## Map

Mapping is explained as **transforming** data from one shape to another.
Let's visualize it like this:

<pre style="font-size:1.2em">
[🍎, 🍎, 🍎, 🍎, 🍎] => [🍐, 🍐, 🍐, 🍐, 🍐]
</pre>

An important characteristic of mapping an array is that the resulting array will have the _same length as the original_.  
In other words: you cannot **add** or **remove** items from the array using `map`.

The transformation is defined by the function you pass to `map`.  
This function is then applied to **every item** in the list.

This silly example will transform every apple into a pear:

```js
const apples = ["🍎", "🍎", "🍎", "🍎", "🍎"];
const pears = apples.map((apple) => {
  return "🍐";
});
```

Another example could be to add taxes to a list of prices:

```js
const prices = [10, 20, 30, 40, 50];
const taxedPrices = prices.map((price) => {
  return price * 1.21;
});
```

In this case we've used the function's parameter to calculate the new value.

Just as in our `for` loop example, `map` will go over every item in the list, and execute the callback function. It _passes_ the current item _into_ the function as a parameter, and **whatever is returned from the function is added to a new list**.

### 👉 Quick sidebar about immutability

Those last two words are pretty important: `map`, `filter` and `reduce` all return a _new list_.  
This means that in the above example, `prices` is still `[10, 20, 30, 40, 50]`.
`taxedPrices` is a completely separate list, existing at the same time _next_ to `prices`.

For instance, in an e-commerce product, that means I can show `prices` in the product listing, but `taxedPrices` in the shopping cart. The fact that I changed the prices to create `taxedPrices` doesn't affect the original list at all and I can still use their original values in my interface.

This is another big advantage of using these functions over loops: even though critics will tell you arrays in Javascript are not completely immutable, these functions do promote _an immutable style of programming_.
This is nice because data is not being changed left and right, but copies of the data are made, before performing the change.

Because it's a lot easier to see where changes are happening, your code becomes easier to debug.

👈 Back to the tutorial!

---

In conclusion:

> `map` takes a list, and gives you a _new list_ **of the same length**, where every item has been _transformed_ by a callback function.

## Filter

Filtering is explained as **selecting** items from a list that meet certain criteria.
Let's visualize it like this:

<pre style="font-size:1.2em">
[🍎, 🍐, 🍎, 🍐, 🍎] => [🍎, 🍎, 🍎]
</pre>

As you can see, the resulting array can be _shorter_ than the original array.  
In fact, making an array shorter than the original is often the exact purpose of filtering!

The criteria for selecting items is defined by the function you pass to `filter`:

```js
const fruits = ["🍎", "🍐", "🍎", "🍐", "🍎"];
const apples = fruits.filter((fruit) => {
  return fruit === "🍎";
});
```

Just like `map`, `filter` will go over every item in the list, and execute the callback function.
Every time the function returns [a _truthy_ value](https://developer.mozilla.org/en-US/docs/Glossary/Truthy), the item is added to a **new list**.

In the example above, the callback function is:

```js
(fruit) => {
  return fruit === "🍎";
};
```

This function will return `true` if and only if the given fruit is an apple.  
That means the resulting new array will contain only apples.

In conclusion:

> `filter` takes a list, and gives you a _new list_ **of the same or shorter length**, containing every item that meets the criteria defined by a callback function.

## Reduce

Oof. Now we're getting into the weeds.  
`reduce` is a bit of a wildcard, and it's the hardest one to explain, because it's the most versatile.

Let's visualize it like this:

<pre style="font-size:1.2em">
[🍎, 🍐, 🍎, 🍐, 🍎] => 🍷
</pre>

`reduce` can completely change the _shape_ of the data. That means that _even though the input is always an array_, the output can be whatever you imagine! It could be another array, but it could also be a number, a boolean, a Date object, or anything else.

When is that applicable?

1. When you want to transform a list into a _single value_.

For instance when calculating the sum of a list of numbers:

<pre style="font-size:1.2em">
[8, 10, 5, 19] => 42
</pre>

2. When you want to _increase_ the length of an array.

For example, when you want to _flatten_ a list of lists:

<pre style="font-size:1.2em">
[[🍎], [🍐, 🍐], [🍌]] => [🍎, 🍐, 🍐, 🍌]
</pre>

Or in any other case where `map` and `filter` are simply not applicable.

`reduce` is sometimes criticized for being hard to understand, and for being hard to read.  
Frankly, that's fair. Looking at the average `reduce` function requires you to keep just as much moving parts in your head as in the `for` loop I critized at the beginning of this article!

Still, it's worth understanding `reduce`, and you can be the judge of when to use it in your projects.  
And of course gaining some experience with it will slowly make it more familiar.

Let's look at the sum example:

```js
const numbers = [8, 10, 5, 19];
const sum = numbers.reduce((total, current) => {
  return total + current;
}, 0);
```

As you can see, `reduce` itself takes two arguments: the callback function, and an _initial value_.  
In the example above, `0` is the initial value, and the callback function is defined as:

```js
(total, current) => {
  return total + current;
};
```

As you can see, the callback function also receives two parameters: `total` and `current`.  
This is, in my opinion, where much of the confusion comes from. `current` is easy: it's the current item in the list, in the same way as `map` and `filter` pass every item in the list to the function.

But where does `total` come from?

The answer is: `total` is the _result of the previous iteration_ of the callback function. The _initial value_ is used in the first iteration, when no previous iterations have been performed yet.

Let's illustrate this for our sum example, to drive home the point:

```js
const numbers = [8, 10, 5, 19];
const sum = numbers.reduce((total, current) => {
  return total + current;
}, 0);
```

1. First iteration, `total` is equal to `0`, since that's the initial value. `current` is `8`, as it's the first item in our list.
2. Second iteration, `total` is equal to `8`, since that's the result of the previous iteration (`0 + 8`). `current` is `10`, the second item in the list.
3. Third iteration, `total` is equal to `18`, since that's the result of the previous iteration (`8 + 10`). `current` is `5`, the third item in the list.
4. Fourth iteration, `total` is equal to `23`, since that's the result of the previous iteration (`18 + 5`). `current` is `19`, the fourth and last item in the list.
5. `reduce` is done, there are no more items in the list, and the last iteration returned `23 + 19`, meaning the resulting value, `sum`, is equal to `42`.

Phew! As you can see, `reduce` is a bit of a handful.  
Where `map` and `filter` are well-defined handles that, with some experience, you can internalize and use without much thought, `reduce` is a bit more of a puzzle, mostly because its result is custom to your needs every time.

In conclusion:

> `reduce` takes a list, and gives you a _new value_, that might or might not be a new list.

## Iteration for the sake of iteration

I sometimes see beginners use `map` purely for its iterative nature.  
For example, when you want to perform an action for every item in a list, but you don't care about the result, you can use `map` and simply ignore the resulting list:

```js
const items = [1, 2, 3, 4, 5];
items.map((item) => localStorage.setItem(`item-${item}`, item));
```

While this is valid JavaScript code, you will lose some of the expressive power of these functions. What happens above is what in functional programming is called a _side effect_. Meaning it triggers an effect _elsewhere_, outside the scope of the function.  
In this case the effect is that it stores items in `localStorage`.

What I like about `map` is the fact that it returns a _new list_.  
**Assignment**, in other words _storing a value in a variable_, is part of the reason to use `map` in the first place.  
In our example, where we're only interested in the side effect, I would prefer to use `forEach`:

```js
const items = [1, 2, 3, 4, 5];
items.forEach((item) => localStorage.setItem(`item-${item}`, item));
```

`forEach` is nothing more than an iterator. It returns nothing. Using `forEach` therefore clearly signals that we're not interested in the result of the iteration, but only in the side effect.  
Side effects are by definition a bit harder to reason about, so it's very nice to have a bit of code signal to us clearly that the _intent_ is to perform a side effect!

Again, much of this is motivated by a desire to write code that explains itself through the concepts captured in the names used.

## Concluding

I hope you have a good grasp on these three functions now, with a clear idea of when to use which.

In conclusion, I would like to admit that there are more parameters to JavaScript's native `map`, `filter` and `reduce` functions. I've omitted these here because they are not essential to understanding the core concept. But please take a look at the following MDN pages to get a more complete picture:

- [Array.prototype.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Array.prototype.filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)

Obviously there are a lot more functions in the JavaScript standard library that are worth exploring, but these three functions are at the core of them all, so learning them yields the most benefit.

In fact, a fun experiment could be to see if you can implement functions like `find`, `some`, `every`, `flatMap`, and `sort` using only `map`, `filter`, and `reduce`.

Good luck, and have fun!
