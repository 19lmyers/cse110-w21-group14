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

> - **Variable and Property Names**:
>   - lowerCamelCase
>   - hungarian naming
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
> - **Class Names**:
>   - UpperCamelCase
>     - Allows us to differentiate a property from a class.
> - **Braces**:
>   - Braces required after every control statement
>   - Braces required for single line functions
> - **Column limit**:
>   - 80
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
>     - E.G.: canReceive(), isStarted(), startCountdown
>     - always use a verb as a *descriptive* prefix
> - File separator

## Decision Outcome

We chose


### Positive Consequences <!-- optional -->

> 

### Negative Consequences <!-- optional -->

> 
