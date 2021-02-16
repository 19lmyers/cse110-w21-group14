# Github Branching Conventions

* Status: Accepted
* Deciders: Luke, Gary, Jacob, Justin, Jenny, Mon, Jackson, Mahkameh (Harshi was absent this meeting but came up with the branching by pairs)
* Date: 2021-02-15

Technical Story: At this point in the project, we did not yet have concrete branching standards set in place,
so this decision is an attempt to provide structure for when we start development.
[Issue Link](https://github.com/19lmyers/cse110-w21-group14/issues/37)

## Context and Problem Statement

> We want branching to follow a uniform standard in order to increase repo readability, promote logical organization, and prevent pair development conflicts. How should we accomplish this?

## Decision Drivers

> - Multiple people working on the same file at the same time can lead to countless git issues if done incorrectly
>   - Need a branching system to split up work and also prevent unnecessary merge issues
> - A standard will help create a uniform, organized repo that is easily accessible by people who are foreign to the project.
> - Should support reviews and code checking before merged.
> - Since everything in the project is being recorded on github, we may need more than simply code development branches

## Considered Options

> - [option 1]: Branching will be split up into three different parts:
>   - other
>     - under the other branch, changes to the general repo (which consists mainly of admin/ and specs/) will be pushed here and pend review.
>     - having this branch allows us to add another security check for repo content changes outside of development.
>       - allows for pipeline managers to have maintain organization of repo by checking if files are being placed into the right spot by members
>   - pipe
>     - under the pipe branch, changes to the pipeline (which consists mainly of .github/workflows) will be pushed and pend review.
>     - also allows for checks by other pipeline managers before being merged.
>   - dev branches:
>     - dev branches will be made per partner per task.
>       - eg if gary and jackson are working on timer-functionality, the branch gary-jackson-timerfunc would contain these changes.
>     - separation like this would allow for all groups to work on their individual tasks while keeping all progress updated on the repo.
> - [option 2]
> - [option 3]

> * [MADR](https://adr.github.io/madr/) 2.1.0 - The Markdown Architectural Decision Records
> * [Michael Nygard's template](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions) - The first incarnation of the term "ADR"
> * [Sustainable Architectural Decisions](https://www.infoq.com/articles/sustainable-architectural-design-decisions) - The Y-Statements
> * Other templates listed at <https://github.com/joelparkerhenderson/architecture_decision_record>
> * Formless - No conventions for file format and structure

## Decision Outcome

Chosen option: "[option 1]", because [justification. e.g., only option, which meets k.o. criterion decision driver | which resolves force force | … | comes out best (see below)].
> Chosen option: "MADR 2.1.0", because
>
> * Implicit assumptions should be made explicit.
>  Design documentation is important to enable people understanding the decisions later on.
>  See also [A rational design process: How and why to fake it](https://doi.org/10.1109/TSE.1986.6312940).
> * The MADR format is lean and fits our development style.
> * The MADR structure is comprehensible and facilitates usage & maintenance.
> * The MADR project is vivid.
> * Version 2.1.0 is the latest one available when starting to document ADRs.

### Positive Consequences <!-- optional -->

* [e.g., improvement of quality attribute satisfaction, follow-up decisions required, …]
* …

### Negative Consequences <!-- optional -->

* [e.g., compromising quality attribute, follow-up decisions required, …]
* …

## Pros and Cons of the Options <!-- optional -->

### [option 1]

[example | description | pointer to more information | …] <!-- optional -->

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]
* … <!-- numbers of pros and cons can vary -->

### [option 2]

[example | description | pointer to more information | …] <!-- optional -->

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]
* … <!-- numbers of pros and cons can vary -->

### [option 3]

[example | description | pointer to more information | …] <!-- optional -->

* Good, because [argument a]
* Good, because [argument b]
* Bad, because [argument c]
* … <!-- numbers of pros and cons can vary -->

## Links <!-- optional -->

* [Link type] [Link to ADR] <!-- example: Refined by [ADR-0005](0005-example.md) -->
* … <!-- numbers of links can vary -->
