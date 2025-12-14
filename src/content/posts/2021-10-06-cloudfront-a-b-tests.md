---
date: 2021-10-06
title: Performing A/B tests on static websites using Cloudfront and Lambda@Edge
description: How do you perform A/B experiments when your site is static?
author: harmen-janssen
norday: true
url: /articles/cloudfront-a-b-tests
---

<p>Although using the JAMStack solves a lot of problems by simplifying your architecture, it also comes with its own challenges.</p>
<p>One such challenge is A/B testing. Where do you put your decision-making logic if there's no server?</p>
<p>In this article I will explain how to setup A/B testing in a serverless architecture.</p>

## A note on A/B testing

Note that there are different solutions for different types of experiments. Simple A/B tests, such as switching a piece of copy, trying out a new call-to-action format or re-arranging your menu items, _might_ be simple enough to do client-side.

We've successfully employed several of this type of A/B tests by swapping the DOM nodes with JavaScript.  
However, in order to avoid a big layout shift, this is only viable when the experiment is small enough that the switch isn't noticable by your visitors.

For this article I will be considering **full-page experiments**, where making the change client-side would result in a jarring effect. Examples might include trying out a new donation form or trying out large visual hero images on promo pages.

## The setup

To get to the core of the problem, I will be assuming some things about your setup:

1. You already have a static site.
2. The static site is being served using CloudFront.
3. In your static site, you build two pages: the original, and _the variant_.
4. Both pages are registering something useful at your analytics package, so you can actually measure the effects of the test.

## Outlining the solution

Let's say you want to try a new contact form, to gather more leads. The original page is at `/contact`, but your new (better?) form is at `/contact-b`. Your navigation will keep pointing to `/contact`: you don't have to link to `/contact-b` anywhere.

When a visitor is being directed to `/contact`, our function will pick up the request.

1. First, it will check for the existence of an _experiment cookie_.
2. Is no cookie available? Then we have to determine whether this person will visit the original, or the variant page.
3. After deciding the visitor's fate, we place the cookie, and redirect the person back to `/contact`.
4. We start at (1) again, but now the cookie is there, and will determine where the visitor ends up.

## Implementing the solution

In CloudFront we can use functions to act upon different events. In this case we want to respond to the _Viewer Request_ event.

📖 [Read the CloudFront documentation on events](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-cloudfront-trigger-events.html)

We can process the event in NodeJS using this script:

```js
const EXPERIMENT_COOKIE_NAME = "My-Experiment";

const getRandomVariation = () => {
  const diceRoll = Math.random();
  return diceRoll > 0.5 ? "A" : "B";
};

const parseExperimentCookie = (cookieHeader) => {
  const cookies = cookieHeader.value.split(";");
  const cookie = cookies.find((cookieValue) =>
    cookieValue.includes(EXPERIMENT_COOKIE_NAME),
  );
  const value = cookie.split("=");
  return value[value.length - 1];
};

const findExperimentCookie = (cookies) => {
  const cookie = cookies.find((cookie) =>
    cookie.value.includes(EXPERIMENT_COOKIE_NAME),
  );
  return cookie ? parseExperimentCookie(cookie) : undefined;
};

module.exports = async (event) => {
  const request = event.Records[0].cf.request;
  const headers = request.headers;

  if (request.uri !== "/contact") {
    // Do not process if this request is not an A-B test.
    return request;
  }

  headers.cookie = headers.cookie || [];

  // Try to find the variation in the experiment cookie.
  const experimentVariation = findExperimentCookie(headers.cookie);

  // No cookie is found, determine the variation randomly.
  if (!experimentVariation) {
    const variation = getRandomVariation();
    const response = {
      status: 302,
      headers: {
        "cache-control": [
          {
            key: "Cache-Control",
            value: "no-store",
          },
        ],
        "set-cookie": [
          {
            key: "Set-Cookie",
            value: `${EXPERIMENT_COOKIE_NAME}=${variation}`,
          },
        ],
        location: [
          {
            key: "Location",
            value: request.uri,
          },
        ],
      },
    };
    return response;
  }
  // At this point there's always a cookie for this experiment.
  const destinationUri =
    experimentVariation === "A" ? "/contact" : "/contact-b";
  // Update the URI and return the request.
  request.uri = destinationUri;
  return request;
};
```

So how does this work? Let's break down the script into sections:

```js
const request = event.Records[0].cf.request;
const headers = request.headers;

if (request.uri !== "/contact") {
  // Do not process if this request is not an A-B test.
  return request;
}
```

1. First things first: every request your website makes is going to flow through this function. Most of them have nothing to do with A/B tests!  
   So the first thing to do is determining whether we should do any work at all. If not, return the incoming request unchanged.

```js
headers.cookie = headers.cookie || [];

// Try to find the variation in the experiment cookie.
const experimentVariation = findExperimentCookie(headers.cookie);
```

2. Now we know we're in an experiment situation. Use these functions to figure out if there's an existing cookie:

```js
const parseExperimentCookie = (cookieHeader) => {
  const cookies = cookieHeader.value.split(";");
  const cookie = cookies.find((cookieValue) =>
    cookieValue.includes(EXPERIMENT_COOKIE_NAME),
  );
  const value = cookie.split("=");
  return value[value.length - 1];
};

const findExperimentCookie = (cookies) => {
  const cookie = cookies.find((cookie) =>
    cookie.value.includes(EXPERIMENT_COOKIE_NAME),
  );
  return cookie ? parseExperimentCookie(cookie) : {};
};
```

Note that this contains maybe a little more code than you would expect because CloudFront cookie headers might be in an array, but then the individual cookie headers might also contain multiple cookies, separated by a semicolon.  
 In any case, read this over carefully, or just copy the code. In the end, it will find the cookie's value for you.

```js
// No cookie is found, determine the variation randomly.
if (!experimentVariation) {
  const variation = getRandomVariation();
  const response = {
    status: 302,
    headers: {
      "cache-control": [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
      "set-cookie": [
        {
          key: "Set-Cookie",
          value: `${EXPERIMENT_COOKIE_NAME}=${variation}`,
        },
      ],
      location: [
        {
          key: "Location",
          value: request.uri,
        },
      ],
    },
  };
  return response;
}
```

3. This part will determine the variation for this particular visitor. We use this function to do so:

```js
const getRandomVariation = () => {
  const diceRoll = Math.random();
  return diceRoll > 0.5 ? "A" : "B";
};
```

Note that this will divide traffic 50/50, but of course you can choose any fraction you'd like.  
The following lines return a response object. This particular response object takes care of 3 things:

- It sets the cookie.
- It ensures this response is never cached (since every visitor should perform a unique diceroll).
- It redirects the visitor to the original URI.

```js
// At this point there's always a cookie for this experiment.
const destinationUri = experimentVariation === "A" ? "/contact" : "/contact-b";
// Update the URI and return the request.
request.uri = destinationUri;
return request;
```

4. Lastly, we are redirected back to the same URI, and we should have a valid experiment cookie.
   We can now change the `uri` property of the request, based on the variation, and return the request back to CloudFront.

## Configuring the function at CloudFront

Having written our function, we can now implement it as a Lambda@Edge function. You should configure this function to respond to a _Viewer Request_ event.

I've written before about how to configure a Lambda@Edge function at CloudFront.  
Please follow [this section about preparing your function for Lambda@Edge](/posts/cloudfront-www-redirect/#preparing-the-function-for-lambdaedge), and you should be good to go!

Note that for this to work, one very important piece of configuration is the _CloudFront cookie whitelist_.  
If you do not whitelist your cookie, this function can never work!

## Wrapping up

I've tried to boil down this function to the core, for educational purposes. Of course, you can expand on this concept however you like.

For example, we store the variations in the cookie in JSON format to be able to run multiple experiments at the same time. Also, you could store the A/B tests in a DynamoDB database in order to make them manageable from your CMS. Once the basics are there, you can do all kinds of crazy things!

When all is said and done, you should be able to visit your target URL and might end up at the variant page. Exciting! Let the results flood in and may they influence your decisions wisely. 🙏
