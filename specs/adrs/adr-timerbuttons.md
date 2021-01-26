# Timer Buttons

* Status: Accepted

## Context and Problem Statement

We want to implement a Pomodoro timer with the correct features. What buttons should the interface have?

## Considered Options

* Play, Stop, Reset
* Start, Pause, Stop, Restart
* Start and End

## Decision Outcome

Chosen option: Start and End, because
* The Pomodoro Timer cannot have be paused
* Instead of having a reset option, we can implement it together when it stops
* *End* sounds better than *Stop* since the application essentially finishes and needs to start again