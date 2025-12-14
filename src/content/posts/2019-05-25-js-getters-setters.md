---
date: 2019-05-25
title: How to use JavaScript getters and setters
description: A quick primer on JavaScript getters and setters.
author: harmen-janssen
url: /articles/js-getters-setters
norday: true
---

Getters and setters in JavaScript are a neat little feature, that might not be so widely known. This article is a quick reference on how to use them.

---

## What are getters and setters?

In JavaScript, any object can have properties, and those properties can be read from the object, and usually modified as well, by code using that object.

```js
const greetPerson = (person) => {
  return `Hi, ${person.name}!`;
};

const alice = {
  name: "Alice",
};
const bob = {
  name: "Bob",
};

greetPerson(alice); // "Hi, Alice!"
greetPerson(bob); // "Hi, Bob!"
```

Consider if we change our object structure just a little bit:

```js
const alice = {
  firstName: "Alice",
  lastName: "Bobson",
};

const bob = {
  firstName: "Bob",
  lastName: "Aliceson",
};
```

We have to update our `greetPerson` function, because it no longer has access to `person.name` – that property has been removed in favor of two separate ones!

```js
const greetPerson = (person) => {
  return `Hi, ${person.firstName} ${person.lastName}!`;
};

greetPerson(alice); // "Hi, Alice Bobson!"
greetPerson(bob); // "Hi, Bob Aliceson!"
```

Fair enough.

But oh no! A person comes along who doesn't fit our model:

```js
const prince = {
  firstName: "Prince",
};

greetPerson(prince); // "Hi, Prince !"
```

Notice the yucky extra space at the end? Pah!  
Back to the drawing board:

```js
const greetPerson = (person) => {
  return `Hi, ${person.firstName}${
    person.lastName ? " " + person.lastName : ""
  }!`;
};

greetPerson(prince); // "Hi, Prince!"
```

Much better.

Except it's far removed from the simple little function we started out with.
And what happens when someone comes along who only shares their last name?

A JavaScript _getter_ is a way of accessing a "virtual" property. From the outside it looks like we're accessing another property, but in truth we're calling a getter function.

```js
const greetPerson = (person) => {
  return `Hi, ${person.name}!`;
};

const alice = {
  firstName: "Alice",
  lastName: "Bobson",
  get name() {
    return [this.firstName, this.lastName].join(" ");
  },
};

greetPerson(alice); // "Hi, Alice Bobson!"
```

Whoa! What happened there?

The `get name` syntax on the object defines a _getter_. It means: _anytime someone asks for the **property** `name` on this object, give them the **return value** of this **function**_.

The same thing works with the keyword `set`. If we define `set name`, we can define a function that's called anytime someone modifies the property `name` on our object:

```js
const alice = {
  firstName: "Alice",
  lastName: "Bobson",
  get name() {
    return [this.firstName, this.lastName].join(" ");
  },
  set name(fullName) {
    const [firstName, lastName] = fullName.split(" ");
    if (firstName) {
      this.firstName = firstName;
    }
    if (lastName) {
      this.lastName = lastName;
    }
  },
};

alice.name = "Bob Aliceson";
alice.firstName; // "Bob"
alice.lastName; // "Aliceson"
```

## What's the point?

Honestly, a lot of times it won't matter.

In most applications, it doesn't matter whether you call `object.setName(name)` or `object.name = name` – both are a perfectly fine API.

Getters and setters are mostly a pretty neat way of working with an API outside your control, that just _expects_ a property, but where you would like to insert a little bit of extra business logic.

It does allow for some interesting optimizations. For instance, you can cache properties of an object.

Consider a user's preferences for your UI. You can create an object to keep their preferences, and silently storing them in `localStorage` to persist them between sessions:

```js
const preferences = {
  attributes: JSON.parse(localStorage.getItem("preferences")),

  set prefersDarkMode(value) {
    this.attributes.prefersDarkMode = value;
    this.persist();
  },

  get prefersDarkMode() {
    return this.attributes.prefersDarkMode;
  },

  set animations(value) {
    this.attributes.animations = value;
    this.persist();
  },

  get animations() {
    return this.attributes.animations;
  },

  persist() {
    localStorage.setItem("preferences", JSON.stringify(this.attributes));
  },
};

if (preferences.prefersDarkMode) {
  // ...
}

// In response to the user toggling a switch:
preferences.prefersDarkMode = false;

// preferences will automatically be stored in localStorage
```

Another example would be to lazy-load a property by making the getter asynchronous and have it return a Promise.

## Dynamically defining getters and setters

The _preferences_ example contains a lot of repetition. For every preference we have to define a getter and setter, and duplicate the persisting logic.  
We can use `Object.defineProperty` to overcome this repetition:

```js
const preferences = {
  attributes: JSON.parse(localStorage.getItem("preferences")),
  persist() {
    // ...
  },
};

const preferenceOptions = ["animations", "prefersDarkMode", "..."];
preferenceOptions.forEach((preferenceOption) => {
  Object.defineProperty(preferences, preferenceOption, {
    set(value) {
      this.attributes[preferenceOption] = value;
      this.persist();
    },
    get() {
      return this.attributes[preferenceOption];
    },
  });
});
```

This way we generalize the persisting and getting of properties, allowing for easy modification of our business logic.

[Read up on Object.defineProperty on MDN.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

## Caveats

Perhaps obvious to some, but worth mentioning nonetheless: you cannot define a getter, _and_ a property of the same name.

Something like this would result in a recursive never-ending loop:

```js
const alice = {
  name: "Alice Bobson",
  get name() {
    return this.name;
  },
};
```

The getter will take precedence, but within the getter, `this.name` still resolves to the getter and will therefore keep calling itself ad infinitum.

## Browser compatibility

Getters and setters are not a new feature, and browser support is solid. IE9 and up support this and every modern browser does too.
