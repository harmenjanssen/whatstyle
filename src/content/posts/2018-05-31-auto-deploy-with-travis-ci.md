---
title: "Auto-deploy with Travis CI"
date: 2018-05-31
author: harmen-janssen
url: /articles/auto-deploy-with-travis-ci
norday: true
---

An auto-deploy strategy using Travis CI and Git tags.

---

If you don't know: [Travis CI](https://travis-ci.com/) is a Continuous Integration tool that can build, test and deploy your projects. We've been using it for many years primarily for building and testing our projects and have recently started using it for deployment as well.

In this article I'm not making assumptions about your deployment strategy. We're currently using [Capistrano](http://capistranorb.com/) for most projects. Sometimes, a simple AWS S3 sync script does the trick.  
We often wrap this up in a `MakeFile` to provide a uniform interface to the various tools we use.  
`make deploy` does the trick nicely.

The `MakeFile` sets up the environment to do a successful deploy: `bundle install`, `composer install`, `npm install`, whatever you need. This is exactly what Travis needs in order to deploy, since it starts up a clean slate every time.

It doesn't really matter what you use, as long as your deployment strategy involves something that can be scripted, and, in order to fully benefit from this article, accepts some kind of Git reference as the thing that's going to be deployed.

## Why?

There's a lot that needs to be done when deploying a modern web application. Building frontend assets, testing the build, migrating your database, distributing assets to a CDN, turning on maintenance mode for the duration of the deploy, installing dependencies, making a snapshot or backup, busting cache... your mileage may vary, but the list goes on.

It's a good thing to script all these steps, and also a good thing to have an automated process glue these scripts together.

Also, differences in software version might yield a different build from work station to work station.  
Sure, lock files take care of this, but still, I can come up with a few scenarios that'll go unnoticed but will yield different output.

## Setting up Travis auto-deploy for staging

Travis has excellent deploy support. You can use branches as hooks, or use any shell script you can think of to determine wether a certain build should be deployed.
Travis has got a lot of documentation about that which I'm not going to repeat here.

[You can browse Travis' documentation to read up on the specifics](https://docs.travis-ci.com/user/deployment).

Here's an example of how you would deploy any build that happens on the `master` branch:

```yaml
deploy:
  - provider: script
    skip_cleanup: true
    script: $TRAVIS_BUILD_DIR/make deploy staging
    on:
      branch: master
```

We use this script to deploy all changes made on the `master` branch automatically to the staging server.

As you can see, this deploy is rather unrestricted. Any commit to the `master` branch will automatically be deployed to staging. We like it that way. The staging environment is a constant reflection of our primary branch.

## Setting up Travis auto-deploy for production

For production however, you want control over what specific version is going to be deployed.

[We already use tags extensively in our Git workflow](/posts/git-branches-workflow/), to explicitly mark production versions, so it made sense to build upon this.  
The following configuration will consider any build tagged with something ending in `-release` as a build fit for production and will thus deploy it:

```yaml
deploy:
  - provider: script
    skip_cleanup: true
    script: $TRAVIS_BUILD_DIR/make deploy production $TRAVIS_TAG
    on:
      tags: true
      condition: "$TRAVIS_TAG =~ -release$"
```

It's all in the condition: `$TRAVIS_TAG =~ release$` is a bash conditional that returns `true` when the given tag ends in `-release`.

[We configured Capistrano to prohibit deploys to production without a tag explicitly passed as a commandline argument.](https://github.com/grrr-amsterdam/garp3/blob/master/deploy/tasks/git.cap)

So with all that in place, we can tag any commit with a suffixed `-release` tag, and use that as a deploy hook for Travis.

```sh
$ git tag 1.12.34-release
$ git push origin --tags
```

Travis will pick up on the tag, catch the `-release` suffix and churn out a deploy to production. Great!  
I don't even need Capistrano on my machine physically, all deployment is now automated and predictable.

## Troubleshooting

Travis won't deploy any build that fails. Which is a good thing.  
But sometimes a build fails because there's a network error and your dependencies cannot be installed. Or something else goes wrong that's not really a reflection on the quality of the build but just happens because it's a bad day.

In those cases the easiest solution is to use the Rebuild option in Travis' web or commandline interface.
