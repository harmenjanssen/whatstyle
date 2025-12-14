---
title: Challenges with doing recursion in PHP
date: 2018-07-29
description: Struggles and successes.
author: harmen-janssen
url: /articles/php-recursion
norday: true
---

Recursion is a tried and true programming technique that's been around since forever. In some languages, like Haskell or Lisp, it comes natural.  
Others not so much. PHP brings its own set of challenges to the table in this regard.  
Personally, the more I use recursion, the more naturally it comes to me. Which in itself is sort of recursive, I guess.

## The problem with recursion in PHP

The problem is not recursion itself. PHP is perfectly capable of having a function call itself.  
Take this function for calculating the middle characters of a string:

```php
function middle_char(string $str): string {
    return strlen($str) <= 2
        ? $str
        : middle_char(substr($str, 1, -1));
}
```

I think this is very elegant and easy to understand, and PHP will run it no problem.

The real problem is in the way PHP references variables and functions. A function defined as a variable is something fundamentally different from a function defined using the `function` keyword.
This is a real shame because it means functions are still no real first-class citizens of the language.

Most problematic in the context of recursion is the fact that [a closure](http://php.net/manual/en/functions.anonymous.php) cannot reference itself by name:

```php
$middle_char = function(string $str): string {
    return strlen($str) <= 2
        ? $str
        : $middle_char(substr($str, 1, -1));
}
```

This will trigger an `undefined variable` error, since `$middle_char` is undefined within the context of the closure.  
There's no way around it, like giving the function an internal name, which is a perfectly viable solution in JavaScript:

```php
// This would be a syntax error:
$middle_char = function middle_char(string $str): string {
  // ...
}
```

## Internal functions

Recursion is often very helpful as an internal helper function.

In Haskell it's very common to see a function named `go` that's scoped to the outer function and does the heavy lifting.

For example, [this Haskell WikiBook](https://en.wikibooks.org/wiki/Haskell/Recursion#Loops,_recursion,_and_accumulating_parameters) defines the factorial function like this:

```haskell
factorial n = go n 1
    where
    go n res
        | n > 1     = go (n - 1) (res * n)
        | otherwise = res
```

Since Haskell does not support loops, `go` is often used to be the looping construct.

An example in PHP where a `go` function would be super useful, is the `repeat` function that I'm adding to [Garp\Functional](https://github.com/grrr-amsterdam/garp-functional) (our functional utility library for PHP):

```php
function repeat(int $times, callable $fn) {
    $go = function($args, $times, $fn, $result = []) {
        return count($result) === $times
            ? $result
            : $go(
                $args,
                $times,
                $fn,
                concat(
                    [$fn(...$args)],
                    $result
                )
            );
    }

    return function(...$args) use ($times, $fn, $go): array {
        return $go($args, $times, $fn);
    };
}
```

`repeat` will return a function that calls the original function a set number of times and accumulates the results in an array.  
I think it's a fine solution which clearly separates the concerns of accumulating the results and actually determining a single result.

**However**, the above won't work, because of the reasons outlined in the previous section. `$go` is a variable and thus cannot reference itself.

I briefly tossed around the idea of making it an actual, regular function, like this:

```php
function repeat(int $times, callable $fn) {
    function go($args, $times, $fn, $result = []) {
        return count($result) === $times
            ? $result
            : $go(
                $args,
                $times,
                $fn,
                concat(
                    [$fn(...$args)],
                    $result
                )
            );
    }

    return function(...$args) use ($times, $fn): array {
        return go($args, $times, $fn);
    };
}
```

It's not exactly idiomatic to nest functions like that in PHP, but then again, I'm afraid I already moved a fair bit outside idiomatic PHP.

More importantly though, **this also won't work**.  
PHP will throw the surprising error `PHP Fatal error: Cannot redeclare Garp\Functional\go()`. PHP doesn't really care _where_ you define a function, but running a function body twice will also try to redeclare any internal functions. In other words: the above function can only be called once.

A rather unelegant solution to the problem could be:

```php
function repeat(int $times, callable $fn) {
    if (!function_exists('Garp\Functional\go')) {
        function go( /* ... */ ) {
            // ...
        }
    }
    // ...
}
```

But I couldn't stomach that.

As an aside: note how I have to pass in a string – another very bothering detail of PHP. A function cannot be referenced by name, I cannot pass around `strtoupper` for instance, I have to pass a **string** containing the word `"strtoupper"`, which results in yet another category of unelegant code.

Anyway, back to my closure solution.

It occurred to me that it might work if I could just figure out a way to pass `$go` to itself.

I ended up with the following:

```php
function repeat(int $times, callable $fn): callable {
    $go = function (array $args, callable $recur, array $result = []) use ($fn, $times): array {
        return count($result) === $times
            ? $result
            : $recur(
                $args,
                $recur,
                concat(
                    [$fn(...$args)],
                    $result
                )
            );
    };
    return function (...$args) use ($go): array {
        return $go($args, $go);
    };
}
```

This actually works! Technically, the function `$go` is no longer recursive.  
It does not call itself, it calls a function that was passed in as an argument, and **happens to be a reference to itself**.

This is a fundamental difference and precisely the reason the above _does_ work. Note how a third parameter to `$go` has been introduced by the name of `$recur`.  
Instead of `$go` calling itself recursively, it calls the passed-in function `$recur`.

I still wasn't completely happy though.  
For one thing, my actual function was called `$accumulateResults`, so the final call read like `return $accumulateResults($args, $accumulateResults);`.  
A bit of a tongue-twister. Also, it felt a bit like a leaky abstraction.

More importantly, I've been reading up on the Y Combinator lately, and this solution started to smell an awful lot like the Y Combinator.

## The Y Combinator

The Y Combinator is regarded by many as one of the most beautiful constructs in programming. Its purpose it to make a non-recursive functions recursive.

It stems from the Lambda Calculus, whose simple set of limited rules are greatly benefited by the existence of the Y Combinator.

The simplest definition in code would not be one in PHP, but I think it's the following, in Haskell:

```haskell
Y :: (a -> a) -> a
Y f = f (Y f)
```

This is adapted from [the Wikipedia page on fixed-point combinators](https://en.wikipedia.org/wiki/Fixed-point_combinator#Fixed_point_combinators_in_lambda_calculus).

I'm not going to delve too deeply into this, check out the links at the end of this article for far better explanations than I could offer.  
In a nutshell: `Y` will take a function, which returns a function, that will call the first function, passing itself as an argument.

The important takeaway is that using functions like this (or _combinators_, as they're called), allows you to abstract away the actual problem-solving. It gives you a handle to reference whenever encountering these types of problems. Instead of glueing together a self-referencing closure like I did above, it's valuable to be able to recognize this as the problem the Y Combinator was designed to solve.

I quickly found [a working solution in PHP](https://php100.wordpress.com/2009/04/13/php-y-combinator/), which I cleaned up a bit to my liking, ending up with the following:

```php
function Y($F): callable {
    $y = function (callable $f) {
        return $f($f);
    };
    return $y(
        function (callable $f) use ($F) {
            return $F(
                function (...$args) use ($f) {
                    return ($f($f))(...$args);
                }
            );
        }
    );
}
```

The final `repeat` function looks like this:

```php
function repeat(int $times, callable $fn): callable {
    $accumulate = Y(
        function($recur) use ($fn, $times) {
            return function(array $args, array $result = []) use ($fn, $times, $recur): array {
                return count($result) === $times
                    ? $result
                    : $recur(
                        $args,
                        concat(
                            [$fn(...$args)],
                            $result
                        )
                    );
            };
        }
    );

    return function (...$args) use ($accumulate): array {
        return $accumulate($args);
    };
}
```

Whether this is better than a loop, or a `reduce` with more conditionals, or any of the variations above depends entirely on your frame of reference I guess.  
What we've gained though, is a reliable way to use recursion when using a closure, which is a valuable tool in our toolbox.  
I know this is not the first time I encounter this problem, and I'm happy I'll be able to use the Y Combinator the next time.

I would've liked it more if PHP wouldn't require as much syntactic noise. Especially the `use` statements hurt a little.  
If only PHP was able to peek at a parent scope. Sigh.

If you dig that `repeat` function, make sure to check out [Garp\Functional](https://github.com/grrr-amsterdam/garp-functional), where `repeat` is just one of many, many utility functions that might boost your productivity.

## Further reading

- [This article explains the Y Combinator really well, using Scala.](https://mvanier.livejournal.com/2897.html)
- [This video (and accompanying series) also provides a really clear explanation of the subject.](https://www.youtube.com/watch?v=9T8A89jgeTI)
