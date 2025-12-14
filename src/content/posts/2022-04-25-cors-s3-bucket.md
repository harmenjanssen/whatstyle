---
date: 2022-04-25
title: How to set CORS headers on your S3 bucket
description: CORS rules can be finicky. This post is a quick reminder of how to open up your bucket using CORS.
author: harmen-janssen
url: /articles/how-to-set-cors-headers-on-your-s3-bucket
norday: true
---

CORS rules can be finicky. This post is a quick reminder of how to open up your bucket using CORS.

## Prerequisites

This post is targeted at static websites or files hosted on an Amazon S3 bucket.  
I'm assuming you want to open up your bucket, for instance because you're storing images that you wish to load into a `canvas` element, or maybe you're storing a JSON file that you want to fetch client-side.

Of course you can adjust the settings to allow for more granular access.

## Amazon S3 CORS Settings

We'll be using the following set of rules in our example:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "POST"]
    }
  ]
}
```

Note that this opens up the bucket completely, with no restrictions on origin. This means everyone will be able to get at your data.  
You have to decide whether this is appropriate for your use case!

The easiest way to update your CORS policy at Amazon is using the [AWS CLI tool](https://aws.amazon.com/cli/).

In order to do so, store the above snippet in a JSON file, `s3-cors.json`, and run the following:

```sh
aws s3api put-bucket-cors \
    --profile my-profile \
    --bucket my-bucket \
    --cors-configuration file://s3-cors.json
```

Alternatively, you can do this from the AWS Console.  
Log into your account, find your bucket, and look for the _Permissions_ tab:

{{< image src="aws-console-s3-permissions.jpg" alt="The S3 Permissions tab on the Amazon Console website." caption="" >}}

Find the heading **Cross-origin resource sharing (CORS)**, and there you can paste your CORS rules.

📖 [Read the Amazon S3 documentation on bucket permissions](http://docs.aws.amazon.com/AmazonS3/latest/UG/EditingBucketPermissions.html)

## One more thing about CloudFront

Of course, all of the above is rather straightforward and if that was all there was to it, I would've sufficed to keep this on a personal post-it note.

However, in the real world things are hardly ever so simple. One common configuration is to use CloudFront to serve your bucket contents behind a custom domain, using SSL.

Header forwarding in particular can cause quite a bit of head scratching, since it's not always clear why your carefully constructed CORS rules _are still not being picked up by the browser!_

When using CloudFront, you have to whitelist all headers that you want forwarded to the origin.  
In particular, for our example, the following headers are required:

- `Origin`
- `Access-Control-Request-Method`
- `Access-Control-Request-Headers`

📖 [Read a complete rundown on how to set this up in the AWS Console](https://aws.amazon.com/premiumsupport/knowledge-center/no-access-control-allow-origin-error/)

Having whitelisted these headers, you're all set up and your client-side code will finally be able to `fetch()` your content.

### CloudFront Response Header Policies

Note that CloudFront also offers the option of attaching _Response Header Policies_ to a distribution. In that way you can configure CORS headers completely independent of the bucket, which might suit your use case better.

📖 [Check out Amazon's documentation on response header policies](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/creating-response-headers-policies.html)
