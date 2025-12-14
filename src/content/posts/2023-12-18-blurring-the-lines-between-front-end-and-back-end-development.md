---
date: 2023-12-18
title: "Blurring the lines between front-end and back-end development"
description: An end-of-year reflection on our development team.
author: harmen-janssen
tableOfContents: false
url: /articles/blurring-the-lines-between-frontend-and-backend-development
norday: true
---

It's the end of the year, and I would like to reflect a bit on something that stood out for me in 2023.

At GRRR, like many other agencies, we generally divide the development team in front-end and back-end developers.
Some people are a little more full stack than others, and they might move more fluidly from traditional front-end to back-end tasks.

Not every project is the same.
Therefore, the workload is not split evenly between the two teams.
Some projects don't update styles a lot after the initial release — for these projects maintenance mostly consists of back-end work.
Other projects are very lightweight on the back-end, and most development happens on the front-end.

Although very natural and not at all unique, this sometimes leads to planning challenges, with developers feeling either too busy or too idle at times.

## Focus weeks versus support weeks

This year, we implemented a new agency-wide planning strategy.
In order to create more structure and focus, we now work in two-week sprints of focus on a single project.
This means developers can largely ignore other projects, incoming client requests, and other distractions for two weeks, and focus on a single project.
The two weeks are followed by a week of support, where developers can work on smaller tasks, support requests, and other things that don't require a longer stretch of focus.

We approach this Kanban-style, with a pile of tickets that gets picked up from top to bottom.
This turned out to be a great way to create more focus, while still ensuring that support requests are handled in a timely manner.

This setup, however, highlighted the problem of uneven workloads between front-end and back-end developers.
In a support week, a back-end developer might have a lot of work, while a front-end developer has very little to do.
It all depends on the tickets in the pile.

A wonderful thing happened, however.  
The developers started to roam into that grey area between front-end and back-end.

As a result, people felt more productive, and the quality of the work actually improved.
In what way?

For example: A front-ender might not have all the inherent experience to fix a back-end bug.
This required a lot of communication with a back-end developer.
People started pair programming, and it quickly became obvious where gaps in the documentation existed.

This then led to a lot of improvements in our documentation, and a lot of knowledge sharing.
People gained confidence in their ability to fix bugs, and enjoyed work that might have been originally classified as not their responsibility.

I've since heard from front-end developers who've found joy in Laravel development and started to deepen their understanding by browsing Laracasts tutorials.

I think it's great — and also very natural — that people develop an interest in all aspects of web development, and feel enabled to contribute.
This works, because we follow a strict _code review_ workflow at GRRR.
Every new feature is reviewed by a colleague.

This of course ensures that an experienced developer has checked the work before it's merged.
But it's also an opportunity for both the reviewer and the reviewee to learn.

An experienced developer might use the pull request as a kind of "show and tell" for a junior colleague to learn from.  
A junior developer gets useful input on their contribution, and can learn from the feedback.

### AI

AI is worth mentioning here.
Thanks to tools like [GitHub Copilot](https://github.com/features/copilot), we can quickly transform code from a familiar language into an unfamiliar language.
Or we can ask it to quickly create the skeleton of a new function, as a starting point.
This helps tremendously when working in a language you're not familiar with.

Remember that the code is still reviewed by a colleague, so it's not like we're blindly accepting the suggestions from the AI and put them in production.

## Presentations

Another thing that has helped to create more understanding between disciplines, is the introduction of a _Tech Monthly_.
Every month, someone in the development team presents a topic of their choice.
No exceptions, everyone has to present when it's their turn.

Doesn't have to be a big thing, it can be just a 15 minute presentation on something you've learned, or something you're interested in.

We did not split the team in two when we present front-end or back-end topics.  
We also don't dumb the content down for the other discipline.

For example: This means that we taught back-end developers about CSS scroll timeline animations, and we showed front-end developers how to setup an AWS-based hosting architecture.

As a result, people have a better understanding of what their colleagues are working on, and they can better appreciate the challenges they face.
Also, from their unique perspective, they can provide useful feedback and suggestions, that might be an _out of the box_ thought for more experienced people.

## In conclusion

We've seen a lot of benefits from a more fluid approach to front-end and back-end development.
There are definitely still vast areas where the developers will work on their specific expertise — and that's a good thing.
But we've seen that there's also a grey area in the middle where people can roam freely, and that's a good thing too.

It made me wonder about _development_ in general.
What makes a certain task a back-end or a front-end task?

Is it a back-end task when it involves your CMS?  
Is it a front-end task when it's Javascript?  
Can a front-end Javascript developer work on a back-end Javascript task?  
If your design system is organized with variables and mixins, would a back-end developer be able to deliver value in your stylesheets?

From the experience we've had this year, I think a lot of work is _just development_.
The programming language doesn't really make something front-end or back-end, because a lot of maintenance work is done in the context of a lot of existing code.
That means that even someone without a full grasp of a given language can at least _make changes_ by looking at the surrounding code.

Also, it's absolutely paramount to have good documentation and to have automated workflows.
Especially workflows that are not tied to a specific developer's machine.

[By moving a lot of this work to GitHub Actions](/posts/2022/how-grrr-uses-github-actions/), for instance, we've enabled people to perform certain actions without having to setup their local machines or have deep knowledge of the individual steps in a process.

As a team, this means that we're more confident and productive.
For some of us it sparked an interest in a new discipline, and for others it was a way to deepen their understanding of the full stack.

And to the project management team, we're now a more flexible, agile group that can handle a wider range of work.

As the team lead, I'm very proud of this development, and I'm looking forward to seeing how this will evolve in the future.
