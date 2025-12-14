---
date: 2025-06-12
title: Only run GitHub Actions when certain files have changed
description: Learn how to make your GitHub Actions step conditional based on certain file changes.
author: harmen-janssen
norday: true
url: /articles/only-run-github-actions-when-certain-files-have-changed
---

At Norday, we are a big fan of [monorepos](https://en.wikipedia.org/wiki/Monorepo).  
We're also big users of [GitHub Actions](https://norday.tech/posts/2022/how-grrr-uses-github-actions/).  
In fact, all our projects are deployed using GitHub Actions.  
To **staging** servers we usually deploy automatically when a Pull Request is merged into `main`.  
**Production** servers require a certain **git tag** to deploy.

However, in a monorepo, where many different microservices live, running auto-deploy can be a little wasteful.  
If I change files in **directory A**, I definitely want **service A** to deploy, but I don't want **service B** to deploy.

That's why I wrote a little reusable workflow that checks if the changed files are in a certain directory.  
Other workflows can use this workflow to conditionally run steps based on the changed files.

## The workflow

For those of you who need a quick copy-and-paste, here is the entire workflow in full:

```yaml
name: Check Path Changes

on:
  workflow_call:
    inputs:
      path_to_check:
        required: true
        type: string
        description: "Path prefix to check for changes"

    outputs:
      should_run:
        description: "Whether the calling workflow should run based on path changes"
        value: ${{ jobs.check_changes.outputs.should_run }}

jobs:
  check_changes:
    name: "Check for changes in ${{ inputs.path_to_check }}"
    runs-on: ubuntu-latest
    outputs:
      should_run: ${{ steps.check.outputs.should_run }}
    steps:
      - name: Check for changes
        id: check
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          # For manual triggers, always run
          if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
            echo "should_run=true" >> "${GITHUB_OUTPUT}"
            echo "Running due to manual trigger"
            exit 0
          fi

          # Get the head commit SHA that triggered this workflow
          HEAD_SHA="${{ github.sha }}"

          # Find PRs associated with this commit using GitHub API
          echo "Finding PRs associated with commit ${HEAD_SHA}..."
          curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
            -H "Accept: application/vnd.github.v3+json" \
            "https://api.github.com/repos/${{ github.repository }}/commits/${HEAD_SHA}/pulls" > associated_prs.json

          # Check if we found associated PRs
          PR_COUNT=$(jq 'length' associated_prs.json)
          if [[ "${PR_COUNT}" -gt 0 ]]; then
            echo "Found ${PR_COUNT} associated PR(s)"
            
            PR_NUMBER=$(jq -r '.[0].number' associated_prs.json)
            echo "Using PR #${PR_NUMBER}"
            
            # Get changed files in this Pull Request
            curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
              -H "Accept: application/vnd.github.v3+json" \
              "https://api.github.com/repos/${{ github.repository }}/pulls/${PR_NUMBER}/files" > pr_files.json
            
            # Extract filenames to a separate file for later use
            jq -r '.[].filename' pr_files.json > changed_files.txt
          else
            echo "No associated PRs found for commit ${HEAD_SHA}, cannot determine changes reliably"
            echo "Defaulting to allowing the workflow to run"
            echo "should_run=true" >> "${GITHUB_OUTPUT}"
            exit 0
          fi

          if grep -q "^${{ inputs.path_to_check }}/" changed_files.txt; then
            echo "Changes found in directory:"
            grep "^${{ inputs.path_to_check }}/" changed_files.txt
            echo "should_run=true" >> "${GITHUB_OUTPUT}"
          else
            echo "No changes in directory '${{ inputs.path_to_check }}'"
            # Set output to false so that dependent jobs will also be skipped
            # This is important as a fallback in case cancellation doesn't happen immediately
            echo "should_run=false" >> "${GITHUB_OUTPUT}"
            
            # Try to cancel the workflow via API for visual feedback in the GitHub UI
            echo "Cancelling workflow since no changes detected..."
            curl -s -X POST \
              -H "Authorization: token ${GITHUB_TOKEN}" \
              -H "Accept: application/vnd.github.v3+json" \
              "https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/runs/${{ github.run_id }}/cancel"
          fi
```

To explain how this works, let's break it down into smaller chunks:

### 1. Determine the type of event

First, we need to know what kind of event triggered this workflow.

```sh
if [[ "${{ github.event_name }}" == "workflow_dispatch" ]]; then
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
    echo "Running due to manual trigger"
    exit 0
fi
```

If a user runs the workflow manually using the GitHub interface, we never want to skip the workflow.  
Running from the GitHub interface triggers a **workflow_dispatch** event.  
We use this to differentiate between manual and automated triggers.

### 2. Get all the Pull Requests containing this commit

Next, we have to find the Pull Request that contains the commit that triggered this workflow.

```sh
# Get the head commit SHA that triggered this workflow
HEAD_SHA="${{ github.sha }}"

# Find PRs associated with this commit using GitHub API
echo "Finding PRs associated with commit ${HEAD_SHA}..."
curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${{ github.repository }}/commits/${HEAD_SHA}/pulls" > associated_prs.json
```

💡 Note that this workflow only really makes sense when your company uses Pull Requests for code changes.  
If not, you should use another strategy to find the relevant changes.

### 3. Collect the changed files from the Pull Request

Now that we have all Pull Requests associated with the commit, we can get the changed files involved.  
Note that it's theoretically possible to find multiple Pull Requests.  
In our case, we'll just use the first one, because that matches our workflow.  
However, if it's relevant for you to inspect all Pull Requests, you could alter the script to loop through all matches and merge their changed files into a single list.

```sh
echo "Found ${PR_COUNT} associated PR(s)"

PR_NUMBER=$(jq -r '.[0].number' associated_prs.json)
echo "Using PR #${PR_NUMBER}"

# Get changed files in this Pull Request
curl -s -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${{ github.repository }}/pulls/${PR_NUMBER}/files" > pr_files.json

# Extract filenames to a separate file for later use
jq -r '.[].filename' pr_files.json > changed_files.txt
```

💡 Note that we make extensive use of [jq](https://jqlang.org/), a command-line tool for working with JSON.  
In the last line of this snippet, we add all changed filenames to a `changed_files.txt` file.

### 4. Check if the directory has changed

```sh
if grep -q "^${{ inputs.path_to_check }}/" changed_files.txt; then
    echo "Changes found in directory:"
    grep "^${{ inputs.path_to_check }}/" changed_files.txt
    echo "should_run=true" >> "${GITHUB_OUTPUT}"
else
    echo "No changes in directory '${{ inputs.path_to_check }}'"
    # Set output to false so that dependent jobs will also be skipped
    # This is important as a fallback in case cancellation doesn't happen quickly
    echo "should_run=false" >> "${GITHUB_OUTPUT}"
fi
```

Last but not least, we use **grep** to check whether the given directory name is present in our `changed_files.txt` file.  
If it is, we know that the Pull Request touched files in that directory, and we update `should_run` to `true`.

This output can then be used by calling workflows to determine whether they want to run or not.

📖 [Read the GitHub documentation about output parameters](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/workflow-commands-for-github-actions#setting-an-output-parameter)

### 5. Cancel the workflow

Lastly, after setting the output, we will try to cancel the current workflow:

```sh
# Try to cancel the workflow via API for visual feedback in the GitHub UI
echo "Cancelling workflow since no changes detected..."
curl -s -X POST \
    -H "Authorization: token ${GITHUB_TOKEN}" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/${GITHUB_REPOSITORY}/actions/runs/${{ github.run_id }}/cancel"
```

This is not strictly necessary, but it will give you some nice visual feedback when looking at your workflow runs.

If you don't cancel, your deploy workflow will show up with a green checkmark, even though its deploy steps were skipped.  
I like this cherry on top because it gives me an immediate visual indicator of whether this specific run was actually a deploy or not.

## Usage

Now that we have our reusable workflow, we can use it in other workflows.

Let's say you have a deploy workflow looking roughly like this:

```yaml
jobs:
  deploy:
    name: "Deploy"
    run: |
      # your deploy logic goes here
      echo "Deploying..."
    with:
      environment: staging

    secrets: inherit
```

You can now add a `check_changes` job to this workflow to determine whether it should be skipped or not.  
Let's assume this deploy workflow deploys **service A** and therefore should only run if files in the directory **directory A** were changed.

Add this job to your list of jobs:

```yaml
check_changes:
  name: "Check for changes in directory A"
  uses: ./.github/workflows/check-path-changes.yml
  permissions:
    actions: write # Needed to cancel the workflow run
    contents: read # Needed to access commit data
    pull-requests: read # Needed to access Pull Requests
  with:
    path_to_check: "directory A"
```

Now that this job will be run as part of your deploy workflow, you can use the `should_run` output in your actual deploy job:

```yaml
deploy:
  name: "Deploy"
  run: |
    # your deploy logic goes here
    echo "Deploying..."
  with:
    environment: staging
  needs: [check_changes]
  if: ${{ needs.check_changes.outputs.should_run == 'true' }}
  secrets: inherit
```

Note that this adds a `needs` property, and an `if` property.  
The `needs` property instructs the `deploy` job to wait for the `check_changes` job to complete, so it can use the job's output.  
The `if` property instructs the `deploy` job to only run if the `check_changes` job determined that the directory was changed.

The complete deploy workflow now looks like this:

```yaml
jobs:
  check_changes:
    name: "Check for changes in directory A"
    uses: ./.github/workflows/check-path-changes.yml
    permissions:
      actions: write # Needed to cancel the workflow run
      contents: read # Needed to access commit data
    with:
      path_to_check: "directory A"
  deploy:
    name: "Deploy"
    run: |
      # your deploy logic goes here
      echo "Deploying..."
    with:
      environment: staging
    needs: [check_changes]
    if: ${{ needs.check_changes.outputs.should_run == 'true' }}
    secrets: inherit
```

## In conclusion

Having a reusable workflow like this in your toolbox allows you to make your workflows more robust.  
Other than deploys, there are of course a lot of other use cases, such as running your unit tests only when something changed in a specific directory.

Running CI workflows all the time is very good for our applications, and will improve trust and reliability in our code.

However, all that cloud computing is currently one the biggest threats to our planet.  
Being able to skip a couple unnecessary workflows will help reduce the amount of energy we use, and feels like something we should take seriously.

I hope this article was helpful for you.  
Let me know what you think!
