---
date: 2019-06-17
title: Redirect www to non-www using CloudFront and Lambda@Edge
description: Redirect your static site to a canonical hostname using Lambda@Edge.
author: harmen-janssen
url: /articles/cloudfront-www-redirect
norday: true
showOutdatedWarning: true
outdatedWarningUrl: /posts/2023/cloudfront-www-redirect
---

We drink the serverless Kool-Aid and are hosting an increasing number of small and large web projects statically on Amazon S3.  
We've written a little <a href="https://github.com/grrr-amsterdam/host-redirect-microservice">microservice to deal with www-redirects in a CloudFront environment</a>.

---

The biggest advantages of a static site are their performance and reliability in terms of uptime.  
An obvious disadvantage is the fact that you cannot serve dynamic content that easily.

We prefer to have a single, canonical hostname for a website and usually redirect www to an [apex domain](https://help.github.com/en/articles/about-supported-custom-domains#apex-domains).

In a traditional project, hosted on Apache for instance, you could use an `.htaccess` file to redirect the visitor from www.example.com to example.com. But where do we store that logic when there's _no web server involved?_

## CloudFront and Lambda@Edge

Amazon allows [Lambda](https://aws.amazon.com/lambda/) functions to be configured as so-called [Lambda@Edge](https://aws.amazon.com/lambda/edge/). They are small functions that are connected to your CloudFront distribution, and called for every HTTP request made. This provides a hook to manipulate the request or the response. This allows you to set cookies or other HTTP headers, or perform redirects.

The following is an example of a small function performing a redirect:

```js
exports.handler = async (event) => {
  // (1)
  const request = event.Records[0].cf.request;

  // (2)
  if (request.headers.host[0].value === "www.example.com") {
    // (3)
    return {
      status: "301",
      statusDescription: `Redirecting to apex domain`,
      headers: {
        location: [
          {
            key: "Location",
            value: `https://example.com${request.uri}`,
          },
        ],
      },
    };
  }
  // (4)
  return request;
};
```

Every Lambda function receives a single argument, the event payload. Its contents are dictated by the type of event that triggers the function. In this case we can extract the HTTP request from the event (1).

This function checks the `Host` header (2), and in case its value equals `www.example.com`, sends a response (3) containing a `Location` header, redirecting the request to `example.com`.

Note that in case the `Host` header does _not_ equal `www.example.com`, the request object is returned unaltered (4) – the function can return both response and request objects.

## Preparing the function for Lambda@Edge

There are a couple of restrictions to take into account:

1. Make sure the function has a _published_ version. This is not strictly necessary for normal use of Lambda functions, but it is when using with CloudFront. Publishing the function can be done in the AWS Console under **Actions**, when viewing your Lambda function. Write down the function <abbr title="Amazon Resource Name">ARN</abbr> including the version. An example would be:  
   `arn:aws:lambda:us-east-1:123456789:function:my-function:3`.
2. No environment variables can be used.
3. The function has to be published in region `us-east-1`.
4. Memory size is limited to 128MB.
5. Function timeout is limited to 5 seconds.
6. The total size of the function code is limited to roughly 19MB (keep an eye on your dependencies 👀).

⚠️ Note that every update to the function requires _a new published version_ and an update _everywhere you configured its ARN_!

It therefore pays to thoroughly test your function using the **Test** action on the Lambda page. There are example CloudFront request function payloads available.

## Prepare an IAM role

You have to create a role to execute the function (configure its ARN on the Lambda page).  
Make sure the following permissions are in place for this role:

1. `lambda:GetFunction`: specify the versioned function ARN as the resource.
2. `lambda:EnableReplication*`: specify the versioned function ARN as the resource.
3. `iam:CreateServiceLinkedRole`.
4. `cloudfront:UpdateDistribution` or `cloudfront:CreateDistribution`.
5. Make sure the role can be assumed by service principals `lambda.amazonaws.com` and `edgelambda.amazonaws.com`.  
   An example role trust policy looks like this:

```
{
   "Version": "2012-10-17",
   "Statement": [
      {
         "Effect": "Allow",
         "Principal": {
            "Service": [
               "lambda.amazonaws.com",
               "edgelambda.amazonaws.com"
            ]
         },
         "Action": "sts:AssumeRole"
      }
   ]
}
```

Add this under the **Trust Relationship** tab in IAM.

Make sure you configure this role's ARN under **Execution role** on the Lambda page in the AWS Console.

📖 [Read the Amazon documentation for the full story](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-edge-permissions.html)

## Configuring CloudFront

If you want to configure this function as Lambda@Edge, follow these steps:

1. Go to your CloudFront distribution in the AWS Console.
2. Under **Behaviors**, create a new behavior, and associate the Lambda function with the distribution. Choose **Viewer Request** as the event type, and add the ARN you wrote down earlier.
3. Wait until the changes have taken effect (might take a short while).
4. Test! If all went well, requests to `www.example.com/foo/bar` will be redirected `example.com/foo/bar`.

## A hostname redirect microservice

For our and your convenience, we published [a little hostname redirecting microservice](https://github.com/grrr-amsterdam/host-redirect-microservice) that takes care of the functional part.  
It's written in Node and can be deployed using the [Serverless framework](https://serverless.com). Serverless is a platform-agnostic framework for setting up Cloud-based functions. It makes it easy to update and deploy your function, and allows you to configure multiple stages for production and staging.

You have to take care of the CloudFront setup yourself, but using the function is straightforward. Configure your hostname redirect rules, as many as you'd like, in a JSON file, like this:

```json
{
  "rules": [
    {
      "origin": "www.example.com",
      "target": "example.com"
    },
    {
      "origin": "www.foo.com",
      "target": "com.bar.www"
    }
  ]
}
```

And deploy using Serverless:

```sh
$ serverless deploy
```

📖 [Read the full documentation on GitHub.](https://github.com/grrr-amsterdam/host-redirect-microservice)

### Discovering the function ARN using the AWS Cli tool

If you're more at home at the command-line, you might want to use the [AWS Cli tool](https://aws.amazon.com/cli/) to discover the function ARN.  
It's a two-step process. Grab the function ARN from this list:

```sh
$ aws lambda list-functions --region=us-east-1
```

Then use it in the next command:

```sh
$ aws lambda list-versions-by-function \
  --function-name arn:aws:lambda:us-east-1:123456789:function:my-function \
  --region=us-east-1
```

This will show you ARNs of all the published versions.

## Troubleshooting

Because there are plenty of restrictions and a lot of configuration, there's a lot that can go wrong.  
Luckily, AWS does a good job of reporting errors. First of all, if the Lambda restrictions are not met, as listed above, you can't even add the function to the Behaviors of your CloudFront distribution. This is good, because it tells you exactly what to change.

Also, the errors you get in the browser are usually pretty descriptive. So pay attention to the accompanying text you get next to your HTTP error codes.

Here's a list of errors I've encountered in the wild:

- **503 Service Temporarily Unavailable**: The `handler` property of the function was misconfigured.  
  📖 [Read the Amazon docs for configuration details.](https://docs.aws.amazon.com/lambda/latest/dg/programming-model-v2.html)
- **502 Bad Gateway**: This usually means the output of your function is incorrect, you're trying to modify a read-only header, or there's a runtime error. The good news is, in most cases there will be an accompanying error message explaining the problem.

---

Going serverless requires a new way of thinking about this stuff, and I know from experience you can spend many days Googling for stuff you didn't even have to think about last year when working on traditionally hosted websites.

But it's definitely worth it; you'll end up with a super-solid, scalable and very secure setup that won't require a web server, OS updates and security patches.

Hopefully this tutorial has saved you a day of Googling!
