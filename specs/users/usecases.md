# Pomodoro Timer Use Case
| Elements |  |
|:-:|-|
| Use Case Example | Student schedules time to study |
| Actor | College Student |
| Use Case Overview | It is Thursday afternoon. The student's class just ended and their next class is in 2 hours. The student wants to spend that 2 hours at the library studying. |
| Trigger | Student WANTS to focus |
| Precondition | At least 30 minutes of study time | 

### Basic Flow: How Pomodoro Timer Works
| Steps |  |
|-|-|
| Description | The scenario describes the situation where all four pomos are completed without interruptions. |
| 1 | Students sets the Pomodoro Web Application to four pomos. Student clicks 'START'. |
| 2 | 25-Minute Timer for a work session begins. Student begins their task. |
| 3 | 25-Minute Timer ends. 5-Minute Timer for a short break begins. Student takes a short break (i.e. drink water, go to the restroom, stretch, etc.) |
| 4 | 5-Minute Timer ends. A second 25-Minute Timer for a work session begins. Student continues their task. Steps 3 and 4 repeat to fourth 25-Minute Timer. |
| 5 | Fourth 25-Minute Timer ends. 15-Minute Timer for long break begins. Student takes a longer break. |
| Termination Outcome | Student completed four pomos (or 1 Pomodoro cycle or 2 hours and 10 minutes). |

### Alternative Flow: Timer stopped
| Steps |  |
|-|-|
| Description | The scenario describes the situation when the student stops the timer at any time due to being finished or unable to continue. |
| 2A1, 3A1, 5A1 | 25-Minute or 5-Minute or 15-Minute Timer is counting down. Student clicks 'STOP'. |
| 2A2, 3A2, 5A2 | Timer ends and resets to default screen. |
| Termination Outcome | Student ends Pomodoro Timer manually. |

### Alternative Flow: Need different times
| Steps |  |
|-|-|
| Description | The scenario describes the situation when the student needs different lengths of time for work sessions, short breaks, or long breaks, or more pomos. |
| 2B1 | 25-Minute is counting down. Student clicks 'STOP'. |
| 2B2 | Timer ends and resets to default screen. |
| 2B3 | Student clicks 'SETTINGS'. 'SETTINGS' Screen opens. |
| 2B4 | Student changes time for work sessions and/or short breaks and/or long breaks and/or number of pomos. |
| 2B5 | Students clicks 'SAVE'. Timer screen reflects new changes. |
| 2B6 | Refer to step 1. |
| Termination Outcome | Student changes settings and starts back again with the basic flow with the new times. |