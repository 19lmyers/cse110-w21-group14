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

> - _**Labels**_: [Use labels for categorization + agile point assignment] 
> - Labels will be used to assign point values in order to port the agile process into our github workflow.
>   - Points will be assigned through weekly planning poker.


### Positive Consequences <!-- optional -->

> - Using each project to represent a weekly sprint creates logical workflow organization
> - Agile can be done mostly in github and tracked
> - Since we are breaking down our schedule by week, we can venture more in depth into weekly activity
>   - For example, we're allowed to monitor progress on a weekly basis rather than on the project as a whole.
>     - This allows for flexibility and changing around of tasks, and in a coding environment where people are diving into new languages, this is important
> - The github project automation feature allows us to automate code reviews through pull requests in each of our weekly projects.
>   - Circumvents possible git conflicts.

### Negative Consequences <!-- optional -->

> - Possibly might get cluttered as weeks go on
>   - However this problem can be bypassed by archiving weekly sprints as we finish the tasks.
