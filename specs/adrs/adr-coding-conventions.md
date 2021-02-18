# Our GitHub Workflow

* Status: Pending
* Deciders: 
* Updated: 2021-02-17

#### Technical Story: 
This week marks the beginning of our implementation. However, it's become apparent that we have no established conventions for our code so everyone is kind of doing their own thing.

## Context and Problem Statement
In order to keep our team working as a cohesive unit and to prevent the creation of a frankenstein code base, we've decided to establish some coding conventions as soon as possible.
Which standards should we set?


## Decision Drivers

> - Need standards to circumvent messy code and maintain uniformity
> - Standards must make testing easy
> - Necessary for maintaining a constant level of readability
>   - Need to make sure this constant level of readability isn't "unreadable"

## Considered Options

> #### Javascript:
> - **Variables and Properties**:
>   - USE `const` BY DEFAULT unless value needs to be changeable then use `let`.
>     - Stops lazy coding and also allows for meaningful distinction between runtime and compiletime variables.
>   - lowerCamelCase
>   - hungarian naming
>   - arrays: do not use `new Array(1,2,3)` to initaite a new array.
>     - instead, since java handles typecasting under the hood, just do `let variableName = [1, 2, 3];`.
>   - use descriptive names. 
>     - DO NOT ABBREVIATE unless you're proposing a group-wide abbreviation
>       - prioritizes readability over horizontal space.
>       - can create annoying line-wrapping issues.
>     - if so, propose an abbreviation inside the dev channel so other people can follow if accepted.
>   - Constants declared in all caps
>     - Note in javascript, just because you use `const` does not mean your variable is a constant
>       - E.G: const startCountdown = startCountDown('25') sets a constant pointer to the function, doesn't mean that the function cannot be changed.
>   - No magic variables even within for loops.
>     - If you're using a variable to iterate through a loop, name the variable according to what each iteration represents.
>   - Declare variables as close as possible to when they are going to be used. remember to keep in mind the [TDZ](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#temporal_dead_zone_tdz)

> - **Class Names**:
>   - UpperCamelCase
>     - Allows us to differentiate a property from a class.
> - **Braces**:
>   - Braces required after every control statement
>   - Braces required for single line functions
> - **Column limit**:
>   - 100
>   - Code wrapping:
>     - Break at the highest operation possible.
>       - E.G: `let timeLeft = calc(currentTime + 2500 + 30currentTime / 4)` should be broken down into:                    
>       `let timeLeft =`                                                                  
>       ` calc(currentTime + 2500 + 30currentTime / 4)`
> - **Whitespace**:
>   - Use [google's whitespacing conventions](https://google.github.io/styleguide/jsguide.html#formatting-whitespace)
>   - 1 line white space between logical groupings of properties within a function.
> - **Function names**:
>   - Action naming:
>     - E.G.: canReceive(), isStarted(), startCountdown()
>     - always use a verb as a *descriptive* prefix
> - File separator

> #### HTML
> - Remove [optional tags](https://html.spec.whatwg.org/multipage/syntax.html#syntax-tag-omission)?
> - Always use `"` instead of \` when creating attributes.
> - **ID/Class Names**:
>   - kebab-case
> - never include inline css or javascript. keep html file solely for html.
> - always provide the `alt` attribute for media.
> - always use html elements for their original purpose. no html "hacking" for css.

> #### CSS
> - omit 0s in front of decimals (.8 vs 0.8)
> - use full caps hexadecimal for colors
>   - colors ported from figma will be in this format
> - Separate css rules aka `body { color: #FFFFFF }` and `html { background: #FFFFFF }` with 1 line of white space.
> - use single quotes instead of double quotes for property + selectors.
> - do not include double quotes when using url.
> - [validate](https://jigsaw.w3.org/css-validator/) code.

## Decision Outcome

We chose
>   - lowerCamelCase
> - **Column limit**:
>   - 100
>   - use descriptive names. 
>     - DO NOT ABBREVIATE unless you're proposing a group-wide abbreviation
>       - prioritizes readability over horizontal space.
>       - can create annoying line-wrapping issues.
>     - if so, propose an abbreviation inside the dev channel so other people can follow if accepted.
>   - Constants declared in all caps
>     - Note in javascript, just because you use `const` does not mean your variable is a constant
>       - E.G: const startCountdown = startCountDown('25') sets a constant pointer to the function, doesn't mean that the function cannot be changed.
>   - Use [google's whitespacing conventions](https://google.github.io/styleguide/jsguide.html#formatting-whitespace)
> - **Function names**:
>   - Action naming:
>     - E.G.: canReceive(), isStarted(), startCountdown()
>     - always use a verb as a *descriptive* prefix
> - Have a file separator based on functionality/logical separation of files
> - Class Naming:
>   - UpperCamelCase

> #### HTML
> - Always use " instead of ' when creating attributes.
> - Use kebab case
> - Separate functionality (keep html file only html)
> - always provide the `alt` attribute for media.

> #### CSS:
> - keep leading 0s in front of decimals (0.8)
>   - will help maintain readability at a glance.
> - use full caps hexadecimal for colors
>   - colors ported from figma will be in this format
> - Transparency:
>   - use rgba
> - Separate css rules aka `body { color: #FFFFFF }` and `html { background: #FFFFFF }` with 1 line of white space.
> - use double quotes for property + selectors.
> - [validate](https://jigsaw.w3.org/css-validator/) code.
