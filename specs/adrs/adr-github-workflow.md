# Our GitHub Workflow

* Status: Accepted
* Deciders: Luke, Gary, Jacob, Justin, Jenny, Mon, Jackson, Mahkameh (Harshi was expected to be absent this meeting)
* Updated: 2021-02-15

#### Technical Story: 
Since we are supposed to use github as our workflow manager, we need to create a way to logically manage our backlog while visually displaying our progress and splitting up tasks.
At this point in the project we were still using miro to make most of our decisions and kept a decisions backlog on there. We want to transfer over to github
to enable one-destination logging and also integrate our workflow directly with development progress.

[Issue 37](https://github.com/19lmyers/cse110-w21-group14/issues/31)

## Context and Problem Statement

> We need to find a way to take advantage of githubs workflow features (projects and issues) to create a system that will support our transition into the development phase.

> How should we set up our issues? Should we make each issue a task? What about labels?

> How about projects and milestones? How can this be done in a way that promotes productivity yet is logically accessible?

## Decision Drivers

> - Github workflow must be visually attractive to promote usage
>   - We can't structure issues in a way that visually overloads people otherwise it won't be used.
>     - Need apt organization that supports our roadmap and weekly sprints
> - Want a system that makes sense for our development cycle
>   - Should support code reviews, pair development, and agile practices.

## Considered Options

> #### Projects
> - [1 Project for every weekly sprint, Projects represent categories]
>   - Projects will simply serve as categories for our issues
>   - Will create new projects weekly
>   - Keep a roadmap project that is updated based on weekly sprints
>   - Categories within the project will be used to organize issues
>     - Automated to include code reviews.
> - [1 Project for every role, projects represent categories]
>   - Have a development, design, pipeline, and testing project
>   - each issue will be contained within its respective role.

> #### Issues
> - [Each issue represents a task]
>   - Issue descriptions will be used to break down tasks to set standards for development
>   - Each issue should contain a description, checklist
>   - Issues should be moved to pending review when 

> #### Labels
> - [Use labels for categorization + agile point assignment]

## Decision Outcome

We chose
> _**Projects**_: [1 Project for every weekly sprint, Projects represent categories] because:
> - Using projects as categories allows us to keep issues organized neatly and under 1 tab.
> - Creating a project for each weekly sprint allows our group members to access a single project every week
>   - Prevents information overload and keeps members focused on what exactly they have to get done every sprint.
> - Chose to create weekly milestones to not only direct the weekly sprint, but also to keep a visually appealing tracker of weekly progress
>   - Helps maintain motivation and creates a sense of accomplishment on a weekly basis.
>     - Every week starts anew, creates a sense of freshness.
> - Supports our project roadmap which is based on a weekly basis.

> _**Issues**_: [Each issue represents a task] because:
> - Most logical way to represent our tasks
> - Issue descriptions will be used to break down our tasks to set standards for development

- _**Tasks**_: [Use labels for categorization + agile point assignment] 


### Positive Consequences <!-- optional -->

> - keeps repo branches simple
>   - having too many branches adds to complexity and this should limit the creation of too many branches
> - allows for checks on development work

### Negative Consequences <!-- optional -->

> - simplicity may compromise repo organization if content is directly pushed to master incorrectly
> - removes the extra layer of security provided by option 1

## Pros and Cons of the Options <!-- optional -->

### [Branching will be split up into dev branches, pipe, and other]
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

### [Only task-based dev branches will be created]
> - branches will be created only for development, one per pair per task.
>   - e.g: if gary and jacob are working on timer functionality, all progress would be pushed to gary-jacob-timerfunc.
> - all other content changes would be directly pushed to master
> - keeps branching simple yet also effective
>   - we may not need the extra security checks of option 1 for a group and project this size
> - by separating branches based on who is working on it and the task at hand, this allows every pair to work on their tasks simultaneously
> - separating dev branches allows us to keep the repo up to date and track everyone's progress without waiting for one group to finish
> - however, this can allow for issues to occur on the master branch since no security checks are available for non development content
>   - this probably won't be an issue since all group content decisions should be made during group meetings.
