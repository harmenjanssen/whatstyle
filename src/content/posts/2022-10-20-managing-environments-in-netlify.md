---
date: 2022-10-20
title: How to manage staging and production environments in Netlify
description: Organise your environments like a pro.
author: harmen-janssen
tableOfContents: true
norday: true
url: /articles/managing-environments-in-netlify
---

At GRRR we like to build with [Netlify](https://www.netlify.com/).
Their easy-to-use interface and GitHub integration make setting up new projects a breeze.
However, usually when working with out traditional hosting partners we're used to working with clearly isolated staging and production environments.
How can we manage this same separation in Netlify?

## The challenge

What exactly is the problem with managing environments in Netlify?

1. Different environments might need different environment variables. How can we separate variables meant for staging from those meant for production?
2. How do we control what git branch is being used to build the site?

## Two separate sites

For starters, you can of course create two separate sites within Netlify, and point them to the same repository.
However, that's cumbersome because you obviously will have to manage two sites.

Let's see if we can tackle the challenges within a single website.

## Environment variables

[Netlify now supports _scopes_ and _deploy contexts_ to solve this](https://www.netlify.com/blog/scopes-and-contextual-values-for-environment-variables/). In the Netlify UI you can configure environment variables, and choose between "Same value for all deploy contexts" and "Different value for each deploy context".

This last option allows you to set a distinct value for:

- Production (whatever the default branch is)
- Deploy Previews (automatically created for all Pull Requests)
- Branch deploys (individual branches)
- Local development (when using the Netlify CLI)

Note that this is in Beta, so you have to enable this in [Netlify Labs](https://app.netlify.com/user/labs).  
We can use the setting for Branch deploys to change the value based on a staging or production branch.

📖 [You can configure this in a `netlify.toml` file as well. Read the docs.](https://docs.netlify.com/site-deploys/overview/#deploy-contexts)

## What git commit gets deployed?

In Netlify you specify which branch is your _production branch_ under **Build and deploy** settings.

We use the [Git One Flow branching model](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow), and usually we want the latest release tag to be deployed.
As you can see below, the `main` branch might be ahead of the latest tag:

```
  o---o---o---o---o---o---o---o---o  main
   \                   \
    o v1.0.0            o v1.0.1
```

Traditionally, we configure GitHub Actions to only ever deploy these release tags to production, whereas `main` is suitable for the staging environment.

However, Netlify will deploy `main`. When development is ongoing, the tip of `main` will be ahead of the latest release and might not be suitable for deploy, because it contains work in progress.

So `main` is not suitable to be the production branch, but it's our only branch!

### Tried solutions

- I've tried configuring a tag as the branch from which Netlify deploys: this does not work. This surprised me because branches and tags in git aren't all that different. They're both pointers to a certain commit.
- According to [this answer on Stack Overflow](https://stackoverflow.com/a/65264350) you can use GitHub Actions to trigger the Netlify deploy, and you can limit your GitHub Actions to only trigger on incoming tags.  
  This sounds kind of promising, but even though the deploy will be triggered only for release tags, the actual deploy will still use `main` as build target!
- I was hoping to be able to create a [Build plugin](https://docs.netlify.com/integrations/build-plugins/create-plugins/) for this, but I don't think you can manipulate the git checkout from a build plugin.
- I was hoping to be able to create a build for a specific git object with the [Netlify API](https://open-api.netlify.com/) but that doesn't seem to be possible.

Currently the only way out seems to be to create a specific deploy branch that's always pointing to the latest release.

## Automatically update a branch for every new tag

The strategy we used for this, was to create a `production` branch. After every release tag, we should merge it in `production`, to keep it pointing to the latest release.
This is not a novel idea: it's [a variation on the Git One Flow model](https://www.endoflineblog.com/oneflow-a-git-branching-model-and-workflow#variation-develop-master).

We didn't want to manage a separate branch by hand, however, so we created a GitHub Action to do the work for us.

It's this action below — it creates the `production` branch if it doesn't exist, or merges the tag into it if it does.  
Now we can configure the `production` branch to be the actual _production branch_ at Netlify, and make `main` a _branch deploy_.

```yml
name: Create production release

on:
  push:
    tags:
      - "*"

jobs:
  merge:
    name: Merge commit into production branch
    runs-on: ubuntu-22.04
    env:
      TARGET_BRANCH: production
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.ref_name }}
          fetch-depth: 0

      - name: Create the target branch
        run: |
          if ! git ls-remote --exit-code . "origin/${{ env.TARGET_BRANCH }}" > /dev/null 2>&1; then
            git checkout -b "${{ env.TARGET_BRANCH }}" "${{ github.ref_name }}"
          else
            git branch --track "${{ env.TARGET_BRANCH }}" "origin/${{ env.TARGET_BRANCH }}"
            git checkout "${{ env.TARGET_BRANCH }}"
            git merge --ff-only "${{ github.ref_name }}"
          fi
          git push --set-upstream origin "${{ env.TARGET_BRANCH }}"
```

## In summary

To manage staging and production in a Git One Flow model, you do the following:

1. Configure Netlify to use `production` as the _production branch_. This will end up on your main domain.
2. Configure `main` to be a branch that is also deployed. This will either be deployed to `main-<your-site-name>.netlify.app`, or you can use a custom subdomain if your DNS is managed by Netlify.
3. Configure your environment values based on these branches: use your staging values for the `main` branch, and your production values for `production`.
4. Use our GitHub workflow to manage the `production` branch automatically, so you can forget it even exists.

Voila! That's it, you're all set up.
