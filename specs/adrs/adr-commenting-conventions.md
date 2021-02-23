# Commenting Conventions

* Status: Accepted 
* Deciders: Gary, Justin, Jacob, Jackson, and Jenny (Others couldn't attend meeting due to scheduling conflicts but were updated!)
* Updated: 2021-02-18

#### Technical Story: 
This week marks the beginning of our implementation. However, it's become apparent that we have no established conventions for our code so everyone is kind of doing their own thing.

## Context and Problem Statement
In order to keep our team working as a cohesive unit and to prevent the creation of a frankenstein code base, we've decided to establish some coding conventions as soon as possible.   
Which standards should we set?


## Decision Drivers
- Need to set apt commenting standards to improve readability and organization
- Necessary to generate uniform documentation through our pipeline.

## Considered Options
**General**:
- COMMENT AS YOU CODE!
  - This helps you think about what is being inputted and outputted from your code.
    - Usually leads to better, faster coding and since we're making commenting mandatory, it doesn't make sense to wait anyway.

#### HTML:
- Use comments to describe structure where possible.

#### JavaScript:
- Include the `@fileoverview` comment at the top of every new file explaining precisely what the file is used for.
  - Include uses and dependencies for help with tracing when something breaks.
  - [only if we're modularizing our js](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- Always start JSDoc headers with /** and end with */ each on their own line
  - so no `/** @tag text` just `/**`
- 1 tag per line for JSDocs
- All functions must be commented with [@param](https://jsdoc.app/tags-param.html) and [@returns](https://jsdoc.app/tags-returns.html) tags.
- Should all functions include an [@example](https://jsdoc.app/tags-example.html) tag?
- After the closing curly brace of a function, end with `/* funcName */`
  - to allow for commenting out code if necessary while testing
- Function calls: parameters should be commented if passing in general or nondescriptive variables.
  - For example: `startCountdown(25 /* timerLength */, true /* isCountEnabled */)`

#### CSS:

## Decision Outcome

**We chose**   

#### HTML:
- Use comments to describe structure where possible.

#### JavaScript:
**JSDoc Commenting**
- Always start JSDoc headers with `/**` and end with `*/` each on their own line
  - so no `/** @tag text` just `/**`
- *All* functions with parameters include an `@example` tag
**Functions**
- After the closing curly brace of a function, end with `/* funcName */`
  - to allow for commenting out code if necessary while testing
**Function Calls**
- Function calls: parameters should be commented if passing in general or nondescriptive variables
  - For example: `startCountdown(25 /* timerLength */, true /* isCountEnabled */)`

Consider for code base phase:
- [Property comments](https://google.github.io/styleguide/jsguide.html#jsdoc-property-comments)

