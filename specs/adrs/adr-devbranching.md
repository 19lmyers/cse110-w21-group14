# Github Branching Conventions

* Status: Accepted
* Deciders: Luke, Gary, Jacob, Justin, Jenny, Mon, Jackson, Mahkameh (Harshi was absent this meeting but came up with the branching by pairs)
* Date: 2021-02-15

Technical Story: At this point in the project, we did not yet have concrete branching standards set in place,
so this decision is an attempt to provide structure for when we start development.
[Issue Link](https://github.com/19lmyers/cse110-w21-group14/issues/37)

## Context and Problem Statement

 We want branching to follow a uniform standard in order to increase repo readability, promote logical organization, and prevent pair development conflicts. How should we accomplish this?

## Decision Drivers

 - Multiple people working on the same file at the same time can lead to countless git issues if done incorrectly
   - Need a branching system to split up work and also prevent unnecessary merge issues
 - A standard will help create a uniform, organized repo that is easily accessible by people who are foreign to the project.
 - Should support reviews and code checking before merged.
 - Since everything in the project is being recorded on github, we may need more than simply code development branches

## Considered Options

 - [Branching will be split up into dev branches, pipe, and other]
 - [Only task-based dev branches will be created]

## Decision Outcome

 Chosen option: "[Only task-based dev branches will be created]", because
 - for a project and group our size, we won't really need extra checks on any other content
   - all content outside of development should be done during group meetings
   - shouldn't have issues with master 
   - pipeline changes will not occur frequently, so a pipe branch probably isn't necessary
 - branching per pair per task allows for continuous progress updates to the repo
   - pairs can and will commit any progress to their respective branches, allowing for an up to date repo

### Positive Consequences <!-- optional -->

> - keeps repo branches simple
>   - having too many branches adds to complexity and this should limit the creation of too many branches
> - allows for checks on development work

### Negative Consequences <!-- optional -->

> - simplicity may compromise repo organization if content is directly pushed to master incorrectly
> - removes the extra layer of security provided by option 1

## Pros and Cons of the Options <!-- optional -->

### [Branching will be split up into dev branches, pipe, and other]
   - other
     - under the other branch, changes to the general repo (which consists mainly of admin/ and specs/) will be pushed here and pend review.
     - having this branch allows us to add another security check for repo content changes outside of development.
       - allows for pipeline managers to have maintain organization of repo by checking if files are being placed into the right spot by members
   - pipe
     - under the pipe branch, changes to the pipeline (which consists mainly of .github/workflows) will be pushed and pend review.
     - also allows for checks by other pipeline managers before being merged.
   - dev branches:
     - dev branches will be made per partner per task.
       - eg if gary and jackson are working on timer-functionality, the branch gary-jackson-timerfunc would contain these changes.
     - separation like this would allow for all groups to work on their individual tasks while keeping all progress updated on the repo.

### [Only task-based dev branches will be created]
 - branches will be created only for development, one per pair per task.
   - e.g: if gary and jacob are working on timer functionality, all progress would be pushed to gary-jacob-timerfunc.
 - all other content changes would be directly pushed to master
 - keeps branching simple yet also effective
   - we may not need the extra security checks of option 1 for a group and project this size
 - by separating branches based on who is working on it and the task at hand, this allows every pair to work on their tasks simultaneously
 - separating dev branches allows us to keep the repo up to date and track everyone's progress without waiting for one group to finish
 - however, this can allow for issues to occur on the master branch since no security checks are available for non development content
   - this probably won't be an issue since all group content decisions should be made during group meetings.
