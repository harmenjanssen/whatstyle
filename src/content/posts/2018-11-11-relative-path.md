---
title: Npx is cool... but why not use a relative $PATH?
date: 2018-11-11
description: Use a flexible $PATH to resolve executables in any language.
author: harmen-janssen
url: /articles/relative-path
norday: true
---

<a href="https://www.npmjs.com/package/npx">npx</a> is a nice tool. But you can solve the local packages problem with a relative path as well.
And you can apply that to any package manager in any language!

---

## What's npx?

`npx` is a tool that's bundled with NPM.
Ordinarily, users would install a tool like Webpack or Gulp globally on their system, and then use it in various web projects.
The trouble with this approach, however, is that you cannot support two projects needing two different versions of a globally installed package.

`npx` solves this by executing commands from the project's local node modules, before looking elsewhere for the binary:

```sh
$ cd my-project
$ npx gulp
```

This would execute the `gulp` executable that's in the node modules folder of `my-project`.

### Other languages, other package managers

Of course this is a solution specific to the Nodejs ecosystem.
We work with a variety of languages, however, for instance PHP.

With PHP, the package manager is called [Composer](https://getcomposer.org/), and it works similar to NPM.
It also supports global and local packages, which poses the same kinds of problems.
Ruby has [gems](https://rubygems.org/) – same difference.

## A catch-all solution: a relative $PATH

You can solve all this by adding a relative path to your `$PATH`. What?

### Relative vs absolute

Consider the following two paths:

```
/usr/local/bin

./node_modules/.bin
```

The first path contains a leading slash. This signifies an absolute path. Wherever you are on your system, executing `cd /usr/local/bin` will bring you to the exact same location.

The second path is relative. It starts with a dot (`.`). The dot signifies "my current location".
Executing `cd ./node_modules/.bin` inside folder `my-project` will bring you to the node modules' binary directory of `my-project`.
Executing the same command inside folder `my-other-project` will move you to the directory _relative_ to `my-other-project`.

And therein lies the solution.

### Modifying your $PATH

A quick refresher: your `$PATH` is a global variable on your system, containing the paths to folders where executables are stored.

When you execute `ls my-project`, `ls` is the name of the program you want to execute, and `my-project` its argument.
How does your shell know what `ls` is or where to find the executable to run? It knows because the folder containing the `ls` program is specified in your `$PATH`.

Your `$PATH` can contain many paths. You can modify it in the standard configuration file supported by your shell, for instance `.bashrc` or `config.fish`.
The following would be an example of how to modify your `$PATH` when using the Bash shell:

```bash
export PATH=./node_modules/.bin:./vendor/bin:$PATH
```

This adds the path `./node_modules/.bin` and `./vendor/bin` to the `$PATH` (respectively the binary directories of NodeJS projects and PHP projects).

Things to note:

1. The paths are separated by a colon. This is Bash-specific, other shells might use different syntax or commands.
2. The existing `$PATH` variable is included at the end. If we would omit that, the `$PATH` from then on would _only_ contain our custom paths, and you wouldn't even be able to execute `ls`, since you removed its executable directory from the `$PATH`!

Now, whenever we execute the following, it will find the `gulp` executable in the `node_modules` directory of the current project, and execute it:

```bash
$ gulp
```

The same works with PHP packages:

```bash
$ phpunit
```

This would look up `phpunit` inside `./vendor/bin`.

Great!

## npx auto-install feature

In all fairness, there's another feature of `npx` that's not easily mimicked: it auto-installs any missing package it needs:

```sh
$ npx gulp
```

This would run `gulp` even when it's not installed on your system, as a one-off command invocation, which is a pretty neat feature if you need it.
