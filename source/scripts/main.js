/* CONSTANTS */
const MIN_05 = 60 * 5;
const MIN_15 = 60 * 15;
const MIN_25 = 60 * 25;
const SEC_03 = 3; // For testing purposes only
const SEC_05 = 5; // For testing purposes only
const DEFAULT_POMODORO_LIMIT = 5;
const TIMER_TEXT_SELECTOR = '#timer-text';
const TIMER_BUTTON_SELECTOR = 'timer-button';
const TIMER_APP_SELECTOR = '#timer-app';
const TIMER_INFO_SESSIONS_SELECTOR = '#timer-info-sessions';
const TIMER_PROGRESS_SELECTOR = 'timer-progress';
const TIMER_RESET_BUTTON_SELECTOR = '#timer-reset-button';
const TIMER_SETTINGS_SELECTOR = '#timer-settings';
const POMO_NUMBER_SELECTOR = '#pomo-number';
const POMO_SLIDER_SELECTOR = '#pomo-slider';
const POMO_LENGTH_NUMBER_SELECTOR = '#pomo-length-number';
const POMO_LENGTH_SLIDER_SELECTOR = '#pomo-length-slider';
const SHORT_BREAK_NUMBER_SELECTOR = '#short-break-number';
const SHORT_BREAK_SLIDER_SELECTOR = '#short-break-slider';
const LONG_BREAK_NUMBER_SELECTOR = '#long-break-number';
const LONG_BREAK_SLIDER_SELECTOR = '#long-break-slider';
const TIMER_SPLASH_SELECTOR = '#timer-splash';
const TIMER_SPLASH_BUTTON_SELECTOR = '#timer-splash-button';

/* Timer Phases */
const PHASE_POMODORO = 'pomodoro';
const PHASE_SHORT_BREAK = 'shortBreak';
const PHASE_LONG_BREAK = 'longBreak';

/* Timer Sounds */
const TIMER_COMPLETE_SOUND = 'pomo-complete-sound';
const BUTTON_SOUND = 'button-sound';

/* Timer Statuses */
const STATUS_STOPPED = 'stopped';
const STATUS_RUNNING = 'running';
const STATUS_PAUSED = 'paused';

/* Task List */
const TASK_BUTTON_SELECTOR = '#task-button';
const TASK_LIST_CONTAINER_SELECTOR = '#task-list';

/* Focus Task */
const FOCUS_TASK_CONTAINER_SELECTOR = '#focus-task-container';
/* -------------------------------------------------------------------------- */

/* TimerApp class */
class TimerApp {
  /**
   * Contructs a TimerApp, which handles all the logic for the timer.
   */
  constructor() {
    this.numPomodoros = 0;
    this.pomodoroLimit = DEFAULT_POMODORO_LIMIT;
    this.pomodoroTimes = {
      [PHASE_POMODORO]: SEC_05,
      [PHASE_SHORT_BREAK]: SEC_03,
      [PHASE_LONG_BREAK]: SEC_05,
    };
    this.currentStatus = STATUS_STOPPED;
    this.currentPhase = PHASE_POMODORO;
    this.timeoutId = null;

    // Initialize components
    this.timerText = new TimerText(TIMER_TEXT_SELECTOR, this.pomodoroTimes.pomodoro);
    this.timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
    
    // TODO: Remove TimerInfo Class
    /* this.timerInfo = new TimerInfo(TIMER_INFO_SESSIONS_SELECTOR); */
    this.timerProgress = document.querySelector(TIMER_PROGRESS_SELECTOR);
    this.timerProgress.pomodoroTime = this.pomodoroTimes.pomodoro;
    this.timerProgress.breakTime = this.pomodoroTimes.shortBreak;
    this.timerSettings = new TimerSettings(TIMER_SETTINGS_SELECTOR);

    // Event listener for toggling the timer via button
    this.timerButton.addEventListener('buttonPressed', () => {
      if (this.currentStatus === STATUS_RUNNING) {
        let skip = this.currentPhase !== PHASE_POMODORO;
        this.confirmEnd(skip);
      }
      else {
        this.handleStart();
      }
    });

    // Handle finishedFocusTask event
    document.addEventListener('finishedFocusTask', (event) => {
      this.handleEnd(true);
    });

    // Event listener for resetting Pomodoros via button

    // Event listener for changing settings via dialog
    this.timerSettings.element.addEventListener('settingsChanged', (event) => {
      this.pomodoroLimit = event.detail.pomodoroLimit;
      this.pomodoroTimes = event.detail.pomodoroTimes;
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
    });

    // Event listener for page warning
    const buttonList = document.getElementsByClassName('tactile-button');
    for (let i = 0; i < buttonList.length; i++) {
      buttonList[i].addEventListener('click', () => {
        this.playSound(BUTTON_SOUND);
      });
    }
    
    // Event listener for page warning
    window.addEventListener('beforeunload', (event) => {
      if (this.currentStatus === STATUS_RUNNING || this.currentStatus === STATUS_PAUSED) {
        event.preventDefault();
        event.returnValue = '';
      }
    });
  } /* constructor */

  /**
   * Handles the start of the timer.
   */
  handleStart() {
    if (this.currentStatus === STATUS_STOPPED) {
      this.timerText.start();
      this.currentStatus = STATUS_RUNNING;

      // Progress bar: update progress
      this.timerProgress.start(this.currentPhase);

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000, false);
      this.timerButton.setAttribute('data-text', 'END');
    }
  } /* handleStart */

  /**
   * Handles pausing the timer.
   */
  handlePause() {
    this.timerText.stop();
    this.timerProgress.stop();
    this.currentStatus = STATUS_PAUSED;

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  /**
   * Handles continuing the timer.
   */
  handleContinue() {
    if (this.currentStatus === STATUS_PAUSED) {
      this.timerText.start();
      this.timerProgress.start(this.currentPhase);
      this.currentStatus = STATUS_RUNNING;

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000, false);
    }
  }

  /**
   * Handles the end of a Pomodoro session.
   * @param {boolean} early indicates whether the Pomodoro was ended early.
   */
  handleEnd(early) {
    this.timerText.stop();
    this.timerProgress.stop();
    this.currentStatus = STATUS_STOPPED;
    this.timerButton.setAttribute('data-text', 'START');

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;

    // Set document title back to Pomodoro
    document.title = 'Pomodoro';

    if (early && this.currentPhase === PHASE_POMODORO) {
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
      this.timerProgress.clearPomodoroProgress();
    }
    else {
      // Keep cycling through phases until break is finished
      this.timerText.setTime(this.pomodoroTimes[this.cyclePhase()]);

      if (this.currentPhase !== 'pomodoro') {
        this.playSound(TIMER_COMPLETE_SOUND);
        this.handleStart();
      }
      else {
        // Increment number of pomodoros completed after one cycle (pomo + break)
        // TODO: update TIMEREND event
        document.dispatchEvent(new Event('timerEnd'));
        console.log('handleEnd dispatching timerEnd event');
        // TODO: Remove timerInfo class
        /* this.timerInfo.sessionsInfo.sessionsText = ++this.numPomodoros; */
        this.timerProgress.clearPomodoroProgress();
        this.timerProgress.clearBreakProgress();
        if (this.numPomodoros % 4 === 3) {
          this.timerProgress.breakText = 'Long break';
        }
        else {
          this.timerProgress.breakText = 'Short break';
        }
      }
    }
  } /* handleEnd */


  /**
   * Cycles the pomodoro to the next phase, taking into account
   * long and short break cycles. 
   * @return {string} the next phase of the cycle.
   */
  cyclePhase() {
    switch (this.currentPhase) {
      case PHASE_POMODORO:
        // Fourth pomodoro: long break
        if (this.numPomodoros % 4 === 3) {
          this.currentPhase = PHASE_LONG_BREAK;
          this.timerProgress.breakTime = this.pomodoroTimes.longBreak;
        }
        else {
          this.currentPhase = PHASE_SHORT_BREAK;
          this.timerProgress.breakTime = this.pomodoroTimes.shortBreak;
        }
        break;
      case PHASE_SHORT_BREAK:
      case PHASE_LONG_BREAK:
        this.currentPhase = PHASE_POMODORO;
        break;
    }
    return this.currentPhase;
  }

  /**
   * Resets the number of pomodoros completed.
   */
  resetPomodoros() {
    this.numPomodoros = 0;
    this.timerInfo.sessionsInfo.sessionsText = 0;
  } /* resetPomodoros */

  /**
   * Will play a sound or start the sound over if it is already playing
   * @param {*} sound the id of the sound to be played
   */
  playSound(sound) {
    const soundElement = document.getElementById(sound);
    if (soundElement.paused) {
      soundElement.play();
    }
    else {
      soundElement.currentTime = 0;
    }
  } /* playSound */

  /**
   * Handles the logic of confirming ending the session early, including showing
   * the dialog and handling an early end or skip if confirmed.
   * @param {boolean} skip indicates whether the confirm dialog should show 
   * end text (abrupt end during Pomodoro) or skip text (during a break).
   */
  confirmEnd(skip) {
    this.handlePause();

    // Constants for dialog text
    const END_TEXT = `Are you sure you want to end this pomodoro session? Your current 
      Pomodoro will not be saved.`;
    const SKIP_TEXT = `Are you sure you want to end this break? You will still complete 
      your pomodoro session, but skipping breaks is not advised.`;

    let confirmDialog = document.createElement('confirm-dialog');

    // Fill slot header
    let dialogHeader = document.createElement('span');
    dialogHeader.setAttribute('slot', 'header');
    dialogHeader.textContent = 'End Pomodoro Session';
    confirmDialog.appendChild(dialogHeader);

    // Fill slot text
    let dialogText = document.createElement('span');
    dialogText.setAttribute('slot', 'text');
    dialogText.textContent = skip ? SKIP_TEXT : END_TEXT;
    confirmDialog.appendChild(dialogText);

    // Fill slot confirm-button-text
    let dialogConfirm = document.createElement('span');
    dialogConfirm.setAttribute('slot', 'confirm-button-text');
    dialogConfirm.textContent = 'End';
    confirmDialog.appendChild(dialogConfirm);

    // Set confirm action
    confirmDialog.addEventListener('confirmPressed', () => {
      this.handleEnd(true);
    });

    confirmDialog.addEventListener('cancelPressed', () => {
      this.handleContinue();
    });

    document.body.appendChild(confirmDialog);
  } /* confirmEnd */

  /**
   * Handles the logic of confirming the reset of all completed Pomodoros.
   */
  confirmReset() {
    const RESET_TEXT = `Are you sure you want to reset your Pomodoro count? \
    You won't be able to get them back.`;

    let confirmDialog = document.createElement('confirm-dialog');

    // Fill slot header
    let dialogHeader = document.createElement('span');
    dialogHeader.setAttribute('slot', 'header');
    dialogHeader.textContent = 'Reset Pomodoros';
    confirmDialog.appendChild(dialogHeader);

    // Fill slot text
    let dialogText = document.createElement('span');
    dialogText.setAttribute('slot', 'text');
    dialogText.textContent = RESET_TEXT;
    confirmDialog.appendChild(dialogText);

    // Fill slot confirm-button-text
    let dialogConfirm = document.createElement('span');
    dialogConfirm.setAttribute('slot', 'confirm-button-text');
    dialogConfirm.textContent = 'Reset';
    confirmDialog.appendChild(dialogConfirm);

    // Set confirm action
    confirmDialog.addEventListener('confirmPressed', () => {
      this.resetPomodoros();
    });

    document.body.appendChild(confirmDialog);
  } /* confirmReset */
}

/* TimerText class */
class TimerText {
  /**
   * Constructs a new TimerText class, which handles the internal timekeeping.
   * @param {*} selector is the selector for the text.
   * @param {*} time is the initial time for the TimerText to display.
   */
  constructor(selector, time) {
    // Initialize intervalId for timeout functions
    this.intervalId = null;

    // Store arguments
    this.element = document.querySelector(selector);
    this.time = time;

    // Display initialized time
    this.element.textContent = this.timeString;
  } /* constructor */

  /**
   * Starts the timer.
   */
  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(this.update.bind(this), 1000);

      // Set document title to current time
      document.title = `Pomodoro - ${this.timeString}`;
    }
  } /* start */

  /**
   * Updates the timer's state.
   */
  update() {
    this.time--;
    this.element.textContent = this.timeString;

    // Set document title to current time
    document.title = `Pomodoro - ${this.timeString}`;
  } /* update */


  /**
   * Stops the timer.
   */
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  } /* stop */

  /**
   * Sets the timer to the desired value (in seconds).
   * Only works if the timer is stopped.
   * @param {Number} newTime is the time in seconds.
   */
  setTime(newTime) {
    if (this.intervalId === null) {
      this.time = newTime;
      this.element.textContent = this.timeString;
    }
  } /* time */

  /**
   * Gets the current time as a mm:ss string.
   */
  get timeString() {
    let currentTime = Math.abs(this.time);
    let min = Math.floor(currentTime / 60);
    let sec = currentTime % 60;
    let minString = min < 10 ? '0' + min : '' + min;
    let secString = sec < 10 ? '0' + sec : '' + sec;
    return this.time < 0 ? `-${minString}:${secString}` : `${minString}:${secString}`;
  } /* timeString */
}

/* TODO: remove TimerInfo class 
class TimerInfo {
  /**
   * Constructs a new TimerInfo class, which holds a TimerInfoSessions
   * object and a TimerInfoProgress object.
   * @param {*} sessionsSelector: selector for the sessions element
   * @param {*} workProgressSelector: selector for the work progress element
   * @param {*} breakProgressSelector: selector for the break progress element
   * @param {*} sessionsRemainingSelector: selector for the sessions remaining element
   
  constructor(sessionsSelector, workProgressSelector, breakProgressSelector,
    sessionsRemainingSelector) {
    this.sessionsInfo = new TimerInfoSessions(sessionsSelector);
  }

} /* Timer Info Class */

/* TODO: Remove TimerInfoSessions 
class TimerInfoSessions {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }

  set sessionsText(numPomodoros) {
    this.element.textContent = numPomodoros;
  }
} /* Timer Info Sessions */

/* TimerInfoProgress */
/* <-------------------------------------------------------------------------------------------> */

/* TimerSettings */
/* <--------------------------------------------------------------------------------------------> */
class TimerSettings {
  constructor(settingsSelector) {
    this.element = document.querySelector(settingsSelector);
    document.querySelector('#timer-settings-button')
      .addEventListener('click', this.openSettings.bind(this));
    document.querySelector('#timer-settings-close')
      .addEventListener('click', this.closeSettings.bind(this));
    document.querySelector('#timer-settings-save')
      .addEventListener('click', (event) => {
        event.preventDefault();
        this.updateSettings();
      });

    this.pomoNumber = document.querySelector(POMO_NUMBER_SELECTOR);
    this.pomoSlider = document.querySelector(POMO_SLIDER_SELECTOR);

    this.pomoLengthNumber = document.querySelector(POMO_LENGTH_NUMBER_SELECTOR);
    this.pomoLengthSlider = document.querySelector(POMO_LENGTH_SLIDER_SELECTOR);

    this.shortBreakNumber = document.querySelector(SHORT_BREAK_NUMBER_SELECTOR);
    this.shortBreakSlider = document.querySelector(SHORT_BREAK_SLIDER_SELECTOR);

    this.longBreakNumber = document.querySelector(LONG_BREAK_NUMBER_SELECTOR);
    this.longBreakSlider = document.querySelector(LONG_BREAK_SLIDER_SELECTOR);

    this.pomoNumber.addEventListener('input', this.updateSlider.bind(this,
      POMO_NUMBER_SELECTOR, POMO_SLIDER_SELECTOR));
    this.pomoSlider.addEventListener('input', this.updateSlider.bind(this,
      POMO_SLIDER_SELECTOR, POMO_NUMBER_SELECTOR));

    this.pomoLengthNumber.addEventListener('input', this.updateSlider.bind(this,
      POMO_LENGTH_NUMBER_SELECTOR, POMO_LENGTH_SLIDER_SELECTOR));
    this.pomoLengthSlider.addEventListener('input', this.updateSlider.bind(this,
      POMO_LENGTH_SLIDER_SELECTOR, POMO_LENGTH_NUMBER_SELECTOR));

    this.shortBreakNumber.addEventListener('input', this.updateSlider.bind(this,
      SHORT_BREAK_NUMBER_SELECTOR, SHORT_BREAK_SLIDER_SELECTOR));
    this.shortBreakSlider.addEventListener('input', this.updateSlider.bind(this,
      SHORT_BREAK_SLIDER_SELECTOR, SHORT_BREAK_NUMBER_SELECTOR));

    this.longBreakNumber.addEventListener('input', this.updateSlider.bind(this,
      LONG_BREAK_NUMBER_SELECTOR, LONG_BREAK_SLIDER_SELECTOR));
    this.longBreakSlider.addEventListener('input', this.updateSlider.bind(this,
      LONG_BREAK_SLIDER_SELECTOR, LONG_BREAK_NUMBER_SELECTOR));
  }

  /**
   * Will update a number to match the value on a slider or vice versa depending on the 
   * order of parameters
   * @param {*} updated is the number or slider that the user manually updated
   * @param {*} toUpdate the number or slider that should be updated to match
   */
  updateSlider(updated, toUpdate) {
    const newValue = document.querySelector(updated).value;
    document.querySelector(toUpdate).value = newValue;
  }

  openSettings() {
    this.element.style.visibility = 'visible';
  }

  closeSettings() {
    this.element.style.visibility = 'hidden';
  }

  updateSettings() {
    let settingsChangedEvent = new CustomEvent('settingsChanged', {
      detail: {
        pomodoroLimit: document.querySelector(POMO_NUMBER_SELECTOR).value,
        pomodoroTimes: {
          pomodoro: document.querySelector(POMO_LENGTH_NUMBER_SELECTOR).value * 60,
          shortBreak: document.querySelector(SHORT_BREAK_NUMBER_SELECTOR).value * 60,
          longBreak: document.querySelector(LONG_BREAK_NUMBER_SELECTOR).value * 60,
        },
      },
    });
    this.element.dispatchEvent(settingsChangedEvent);
  }
}

/* TimerSplash */
/* <--------------------------------------------------------------------------------------------> */
class TimerSplash {
  constructor(splashSelector, splashButtonSelector) {
    this.element = document.querySelector(splashSelector);
    this.show();
    document.querySelector(splashButtonSelector).addEventListener('click', this.close.bind(this));
  }

  show() {
    this.element.style.visibility = 'visible';
  }

  close() {
    this.element.style.visibility = 'hidden';
  }
}

/* Task List */
/* ---------------------------------------------------------------------------------------------- */
class TaskList {
  /**
   * TaskList(taskButtonElement, taskListContainerElement): Constructs the task list using the task
   * button and the task list container.
   * @param {*} taskButtonSelector: the selector for the show task list button
   * @param {*} taskListContainerSelector: selector for the task list revealed by task button element
   */
  constructor(taskButtonSelector, taskListContainerSelector) {
    /* 
     * Needs to hold task list button selector
     * Task list div
     * Input fields (for taskName, taskEstimatedPomos)
     */

    // Task List Button
    // TODO: change to shadow dom element when using components
    this.taskButtonElement = document.querySelector(taskButtonSelector);
    this.taskButtonElement.addEventListener('click', (event) => {
      event.preventDefault();
      this.toggleTaskList();
    });

    // TODO: change to shadow dom element when using components
    this.taskListContainerElement = document.querySelector(taskListContainerSelector);
    this.taskListContainerElement.style.visibility = 'hidden';

    // Construct task input element
    this.taskInputElement = document.createElement('div');
    this.taskInputElement.id = 'task-input-container';
    
    this.taskNameInput = document.createElement('input');
    this.taskNameInput.id = 'task-name-input';
    this.taskNameInput.type = 'text';
    this.taskNameInput.placeholder = 'Type task to complete here...';

    this.taskPomoEstimateInput = document.createElement('input');
    this.taskPomoEstimateInput.id = 'task-pomo-estimate-input';
    this.taskPomoEstimateInput.type = 'number';
    this.taskPomoEstimateInput.min = '0';
    this.taskPomoEstimateInput.value = '0';
    this.taskPomoEstimateInput.placeholder = '0';

    this.taskPomoEstimateInputLabel = document.createElement('label');
    this.taskPomoEstimateInputLabel.for = 'task-pomo-estimate-input';
    this.taskPomoEstimateInputLabel.id = 'pomo-estimate-label';
    this.taskPomoEstimateInputLabel.textContent = 'Estimated Pomos';

    this.taskAddButton = document.createElement('button');
    this.taskAddButton.id = 'task-add-button';
    this.taskAddButton.innerHTML = '<img src="./assets/input-task-add-button.svg">';
    
    this.taskInputElement.appendChild(this.taskNameInput);
    this.taskInputElement.appendChild(this.taskPomoEstimateInputLabel);
    this.taskInputElement.appendChild(this.taskPomoEstimateInput);
    this.taskInputElement.appendChild(this.taskAddButton);
    this.taskListContainerElement.appendChild(this.taskInputElement);

    // Construct section to hold tasks
    this.tasksSection = document.createElement('section');
    this.tasksSection.id = 'tasks-section';

    this.notDoneTasksSection = document.createElement('section');
    this.notDoneTasksSection.id = 'not-done-tasks-section';

    this.doneTasksSection = document.createElement('section');
    this.doneTasksSection.id = 'done-tasks-section';
    
    this.tasksSection.appendChild(this.notDoneTasksSection);
    this.tasksSection.appendChild(this.doneTasksSection);

    this.taskListContainerElement.appendChild(this.tasksSection);
   
    // EVENT Handlers
    // Handle create task when enter is pressed on keyboard
    window.addEventListener('keydown', (e) => {
      if(e.which == 13){
        this.createTask(this.taskNameInput.value,
          this.taskPomoEstimateInput.value,
          this.taskListContainerElement);
          this.taskNameInput.value = ''; 
          this.taskPomoEstimateInput.value = '';
      }
    })
    // EVENT Handlers
    // Handle create task when add button is clicked
    this.taskAddButton.addEventListener('click', (event) => {
      this.createTask(
        this.taskNameInput.value,
        this.taskPomoEstimateInput.value,
        this.taskListContainerElement);
        
      // Clear values after creating task
      this.taskNameInput.value = ''; // TODO: check this
      this.taskPomoEstimateInput.value = '';
    });

    
    // Handle BEFOREUNLOAD event by storing tasks into local storage
    window.addEventListener('beforeunload', (event) => {
      this.storeTaskList();
    }, false);

    // Handle NOFOCUSTASK event by toggling task list
    document.addEventListener('noFocusTask', (event) => {
      this.toggleTaskList();
      console.log('TaskList handled noFocusTaskEvent');
    });

    // Handles the CHOOSETASK event by clearing all current focus tasks on task list and setting new
    document.addEventListener('chooseTask', (event) => {
      // Remove all current focus tasks
      while (this.taskListContainerElement.querySelector('*[focus]')) {
        this.taskListContainerElement.querySelector('*[focus]').removeAttribute('focus');
      }
      // Set chosen task as current focus task
      event.detail.task.setAttribute('focus', 'true');
      this.toggleTaskList();
    });

    // Handles the TASKCHECKBOX event
    document.addEventListener('taskCheckboxUpdate', (event) => {
      if (event.detail.checkboxValue == true) {
        this.doneTasksSection.appendChild(event.detail.task);
        event.detail.task.classList.remove('task-not-done');
        event.detail.task.classList.add('task-done');
      }
      else {
        this.notDoneTasksSection.appendChild(event.detail.task);
        event.detail.task.classList.remove('task-done');
        event.detail.task.classList.add('task-not-done');
      }
    });

    // After constructing task list element, load all tasks from local storage.
    this.loadTaskList();
  }

  /**
   * storeTaskList(): stores list of tasks into local storage as under the key "task-list".
   */
  storeTaskList() {
    let tasksToBeStored = [];
    Array.from(this.taskListContainerElement.getElementsByClassName('task')).forEach((task) => {
      let taskValues = {
        name: task.querySelector('.task-name').value,
        pomoActual: task.querySelector('.task-pomo-actual').textContent,
        pomoEstimate: task.querySelector('.task-pomo-estimate').value,
        isDone: task.querySelector('.task-checkbox').checked,
      };
      tasksToBeStored.push(taskValues);
      localStorage.setItem('task-list', JSON.stringify(tasksToBeStored));
    });
    if (tasksToBeStored.length == 0) {
      localStorage.removeItem('task-list');
    }
  }

  /**
   * loadTaskList(): loads task list from local storage.
   */
  loadTaskList() {
    if (localStorage.getItem('task-list') != null) {
      JSON.parse(localStorage.getItem('task-list')).forEach((task) => {
        const newTask = new Task(
          task.name,
          task.pomoEstimate,
          task.pomoActual,
          task.isDone,
        );
        
        if (task.isDone == false) {
          newTask.appendTask(this.notDoneTasksSection);
        }
        else {
          newTask.appendTask(this.doneTasksSection);
        }
      });
    }
  }

  /**
   * toggleTaskList(): toggles visibility of task list
   */
  toggleTaskList() {
    if (this.taskListContainerElement.style.visibility == 'visible') {
      this.taskListContainerElement.style.visibility = 'hidden';
    }
    else {
      this.taskListContainerElement.style.visibility = 'visible';
    }
  }

  /**
   * createTask(): creates a new task
   * @param {string} taskName: name of task being constructed.
   * @param {number} pomoEstimate: estimated pomos for task being constructed.
   * @param {*} taskListContainerElement: container for added tasks.
   */
  createTask(taskName, pomoEstimate, taskListContainerElement) {
    if (taskName == '') {
      // Encourage user to give tasks accurate descriptions
      let confirmDialog = document.createElement('confirm-dialog');

    // Fill slot header
    let dialogHeader = document.createElement('span');
    dialogHeader.setAttribute('slot', 'header');
    dialogHeader.textContent = 'NAME YOUR TASK!';
    confirmDialog.appendChild(dialogHeader);

    // Fill slot text
    let dialogText = document.createElement('span');
    dialogText.setAttribute('slot', 'text');
    dialogText.textContent = 'Try to give an accurate task name to work on';
    confirmDialog.appendChild(dialogText);

    // Fill slot confirm-button-text
    let dialogConfirm = document.createElement('span');
    dialogConfirm.setAttribute('slot', 'confirm-button-text');
    dialogConfirm.textContent = 'WILL DO!';
    confirmDialog.appendChild(dialogConfirm);

    confirmDialog.cancelText = '';
    document.body.appendChild(confirmDialog);
    }
    else if (pomoEstimate > 4) {
    let confirmDialog = document.createElement('confirm-dialog');

    // Fill slot header
    let dialogHeader = document.createElement('span');
    dialogHeader.setAttribute('slot', 'header');
    dialogHeader.textContent = 'INVALID POMO ESTMATE!';
    confirmDialog.appendChild(dialogHeader);

    // Fill slot text
    let dialogText = document.createElement('span');
    dialogText.setAttribute('slot', 'text');
    dialogText.textContent = 'Number must be between 0-4, consider breaking your task up';
    confirmDialog.appendChild(dialogText);

    // Fill slot confirm-button-text
    let dialogConfirm = document.createElement('span');
    dialogConfirm.setAttribute('slot', 'confirm-button-text');
    dialogConfirm.textContent = 'GOT IT!';
    confirmDialog.appendChild(dialogConfirm);

    confirmDialog.cancelText = '';
    document.body.appendChild(confirmDialog);
    }
    else {
      const newTask = new Task(taskName, pomoEstimate, 0, false);
      newTask.appendTask(this.notDoneTasksSection);
    }
  }
}

/* FocusTask */
/* ---------------------------------------------------------------------------------------------- */
class FocusTask {

  /**
   * constructor(focusTaskContainerSelector): constructs the focus task div
   * @param {*} focusTaskContainerSelector: selector to get focusTaskContainer element
   */
  constructor(focusTaskContainerSelector) {
    this.focusTaskContainer = document.querySelector(focusTaskContainerSelector);
    this.focusTaskContainer.className = 'no-focus-task';
    this.focusTaskContainer.id = 'focus-task-container';
    
    this.focusTaskIsDone = document.createElement('input');
    this.focusTaskIsDone.type = 'checkbox';
    this.focusTaskIsDone.checked = false;
    this.focusTaskIsDone.id = 'focus-task-checkbox';

    this.focusTaskName = document.createElement('p');
    this.focusTaskName.textContent = 'Choose a focus task';
    this.focusTaskName.id = 'focus-task-name';

    this.focusTaskPomoActual = document.createElement('p');
    this.focusTaskPomoActual.textContent = 0;
    this.focusTaskPomoActual.id = 'focus-task-pomo-actual';

    this.focusTaskPomoEstimate = document.createElement('p');
    this.focusTaskPomoEstimate.textContent = 0;
    this.focusTaskPomoEstimate.id = 'focus-task-pomo-estimate';

    this.focusTaskContainer.appendChild(this.focusTaskIsDone);
    this.focusTaskContainer.appendChild(this.focusTaskName);
    this.focusTaskContainer.appendChild(this.focusTaskPomoActual);
    this.focusTaskContainer.appendChild(this.focusTaskPomoEstimate);

    // EVENT HANDLERS:
    // Handle focusTaskContainer CLICK event:
    this.focusTaskContainer.addEventListener('click', (event) => {
      if (event.target.className == 'no-focus-task') {
        // Dispatch noFocusTaskEvent to document
        const noFocusTaskEvent = new Event('noFocusTask', {bubbles: true});
        if (event.target.id == 'focus-task-checkbox') {
          const finishedNoFocusTaskEvent = new Event('noFocusTask', {bubbles: true});
          document.dispatchEvent(finishedNoFocusTaskEvent);
          console.log('focusTask dispatched finishedNoFocusTask event to document');
        }
        document.dispatchEvent(noFocusTaskEvent);

        // TODO: delete
        console.log('FocusTask dispatched noFocusTask event to document');
      }
    });

    // Handle focusTaskIsDone check event:
    this.focusTaskIsDone.addEventListener('change', (event) => {
      if (event.target.checked == true) {
        // TODO: JSDocs headers for events
        const finishedFocusTaskEvent = new CustomEvent('finishedFocusTask', {
          bubbles: true,
          detail: event.target.parentElement.className},
        );
        document.dispatchEvent(finishedFocusTaskEvent);

        // TODO: delete task output
        console.log('FocusTask dispatched finishedFocusTask event with detail ' +
        event.target.parentElement.className);

        this.clearFocusTask();
      }
    });

    // Handle CLEARFOCUSTASK event
    document.addEventListener('clearFocusTask', (event) => {
      this.clearFocusTask();
      console.log('clearing focus task');
    });
   
    // Handle focusCheckboxUpdate event
    // TODO: rename event and decide whether or not to clear focus task if value is changed.
    document.addEventListener('focusCheckboxUpdate', (event) => {
      this.focusTaskIsDone.checked = event.detail;
    });

    // Handle document CHOOSETASK event
    document.addEventListener('chooseTask', (event) => {
      this.setFocusTaskName(event.detail.name);
      this.setFocusTaskPomoActual(event.detail.pomoActual);
      this.setFocusTaskPomoEstimate(event.detail.pomoEstimate);
      this.setFocusTaskIsDone(event.detail.isDone);

      // TODO: delete task output
      console.log('FocusTask handled chooseTaskEvent');
    });

    // Handle document TIMEREND event
    document.addEventListener('timerEnd', (event) => {
      this.setFocusTaskPomoActual(parseInt(this.focusTaskPomoActual.textContent) + 1);
    });
  } /* constructor */

  /**
   * setFocusTaskName: sets the new focus task name
   * @param {string} taskName : name of the new focus task
   */
  setFocusTaskName(taskName) {
    this.focusTaskName.textContent = taskName;
    this.focusTaskContainer.className = 'focus-task';
  } /* setFocusTaskName */

  /**
   * setFocusTaskPomoActual: sets the amount of pomodoros used for the focus task
   * @param {number} taskPomoActual : pomodoros used for focus task
   */
  setFocusTaskPomoActual(taskPomoActual) {
    this.focusTaskPomoActual.textContent = taskPomoActual;
  } /* setFocusTaskPomoActual */

  /**
   * setFocusTaskPomoEstimate: sets the estimated pomos for the focus task
   * @param {*} taskPomoEstimate 
   */
  setFocusTaskPomoEstimate(taskPomoEstimate) {
    this.focusTaskPomoEstimate.textContent = taskPomoEstimate;
  } /* setFocusTaskPomoEstimate */

  /**
   * setFocusTaskIsDone: sets whether or not the focus task is finished
   * @param {boolean} done
   */
  setFocusTaskIsDone(done) {
    this.focusTaskIsDone.checked = done;
  }

  /**
   * clearFocusTask(): clears the focus task values
   */
  clearFocusTask() {
    this.focusTaskName.textContent = 'Choose a focus task';
    this.focusTaskPomoActual.textContent = 0;
    this.focusTaskPomoEstimate.textContent = 0;
    this.focusTaskContainer.className = 'no-focus-task';
  } /* clearFocusTask */
  
}
/* Task */
/* ---------------------------------------------------------------------------------------------- */
class Task {
  /* 
   * Styling: 
   * task, focus-task, and task-done, task-not-done, task-save-button, task-edit-button
   */
  /**
   * Task(taskName, pomoEstimate, pomoActual):
   * @param {string} taskName: name of task being constructed.
   * @param {number} pomoEstimate: estimated pomos for task being constructed.
   * @param {number} pomoActual: pomos used for task being constructed.
   * @param {boolean} isTaskDone: true if task done, false if not.
   */
  constructor(taskName, pomoEstimate, pomoActual, isTaskDone) {
    // create task container
    this.taskContainerElement = document.createElement('div');
    this.taskContainerElement.className = 'task';

    this.taskEditButton = document.createElement('button');
    this.taskEditButton.innerHTML = "<img src='./assets/task-edit-button.svg'>";
    this.taskEditButton.className = 'task-edit-button';

    this.taskRemoveButton = document.createElement('button');
    this.taskRemoveButton.innerHTML = "<img src='./assets/task-delete-button.svg'>";
    this.taskRemoveButton.className = 'task-delete-button';

    this.taskNameField = document.createElement('input');
    this.taskNameField.type = 'text';
    this.taskNameField.value = taskName;
    this.taskNameField.className = 'task-name';

    this.taskPomoEstimateValue = document.createElement('input');
    this.taskPomoEstimateValue.type = 'number';
    this.taskPomoEstimateValue.value = pomoEstimate;
    this.taskPomoEstimateValue.className = 'task-pomo-estimate';

    this.taskPomoActualValue = document.createElement('p');
    this.taskPomoActualValue.textContent = pomoActual; // Default actual pomo used when created is 0
    this.taskPomoActualValue.className = 'task-pomo-actual';

    this.taskIsDone = document.createElement('input');
    this.taskIsDone.type = 'checkbox';
    this.taskIsDone.className = 'task-checkbox';
    this.taskIsDone.checked = isTaskDone;

    if (isTaskDone == true) {
      this.taskContainerElement.className = 'task task-done';
    }
    else {
      this.taskContainerElement.className = 'task task-not-done';
    }

    // Append to task container
    this.taskContainerElement.appendChild(this.taskIsDone);
    this.taskContainerElement.appendChild(this.taskNameField);
    this.taskContainerElement.appendChild(this.taskPomoActualValue);
    this.taskContainerElement.appendChild(this.taskPomoEstimateValue);
    this.taskContainerElement.appendChild(this.taskEditButton);
    this.taskContainerElement.appendChild(this.taskRemoveButton);

    // Disable fields
    this.taskPomoEstimateValue.setAttribute('disabled', 'true');
    this.taskNameField.setAttribute('disabled', 'true');
    
    // Add event listeners
    // TODO: Check if listener for check boxes update styling correctly
    this.taskIsDone.addEventListener('input', (event) => {
      if (event.target.checked == false) {
        this.taskContainerElement.className = 'task task-not-done';
      }
      else {
        this.taskContainerElement.className = 'task task-done';
      }

      if (this.taskContainerElement.hasAttribute('focus')) {
        document.dispatchEvent(new CustomEvent('focusCheckboxUpdate', {
          detail: this.taskIsDone.checked,
        }));
      }

      this.emitTaskCheckboxUpdateEvent();
    });
 
    // Handle Events
    // Handles taskEditButton CLICK event
    // TODO: Disable task edit button if has class "focus-task"
    this.taskEditButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.editTask();
    });

    // Handles taskRemoveButton CLICK event
    this.taskRemoveButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.removeTask();
    });

    // Handles taskContainerElement CLICK event
    this.taskContainerElement.addEventListener('click', (event) => {
      if (event.target.className == 'task-name' &&
          this.taskEditButton.className == 'task-save-button') {
        return;
      }
      if (event.target.className == 'task-name') {
        console.log(event.target);
        const chooseTaskEvent = new CustomEvent('chooseTask', {
          detail: {
            name: this.taskNameField.value,
            pomoActual: this.taskPomoActualValue.textContent,
            pomoEstimate: this.taskPomoEstimateValue.value,
            isDone: this.taskIsDone.checked,
            task: this.taskContainerElement,
          },
        });

        // Dispatch choose task event if name or estimate or actual is clicked.
        document.dispatchEvent(chooseTaskEvent);

        // TODO: delete
        console.log('Task dispatched chooseTaskEvent with detail ' +
                JSON.stringify(chooseTaskEvent.detail));
      }
    });

    // Handles document timerEnd event
    document.addEventListener('timerEnd', (event) => {
      if (this.taskContainerElement.hasAttribute('focus')) {
        this.taskPomoActualValue.textContent = parseInt(this.taskPomoActualValue.textContent) + 1;
      }
    });
    
    // Handles FINISHEDFOCUSTASK event
    document.addEventListener('finishedFocusTask', (event) => {
      if (this.taskContainerElement.hasAttribute('focus')) {
        this.taskIsDone.checked = true;
        this.emitTaskCheckboxUpdateEvent();
        this.taskContainerElement.removeAttribute('focus');
      }
    });
  }

  /**
   * emitTaskCheckboxUpdateEvent(): dispatches the taskCheckBox event to document
   */
  emitTaskCheckboxUpdateEvent() {
    const taskCheckboxUpdateEvent = new CustomEvent('taskCheckboxUpdate', {
      detail: {
        task: this.taskContainerElement,
        checkboxValue: this.taskIsDone.checked,
      },
    });

    document.dispatchEvent(taskCheckboxUpdateEvent);
    console.log('emitTaskCheckboxUpdateEvent dispatched taskCheckboxUpdate event');
  }

  /**
   * appendTask(taskListContainerElement): Appends a task to a task list container 
   * @param {*} taskParent: element that contains this task
   */
  appendTask(taskParent) {
    taskParent.appendChild(this.taskContainerElement);
    this.taskParent = taskParent;
  }

  /**
   * editTask(): toggles editing of task
   */
  editTask() {
    // TODO: If can't style with only classes, manually switch images.
    if (this.taskNameField.hasAttribute('disabled')) {
      this.taskNameField.removeAttribute('disabled');
      this.taskEditButton.className = 'task-save-button';
      this.taskEditButton.innerHTML = "<img src='./assets/task-edit-button.svg'>";
      // TODO: Handle updating stored tasks;
    }
    else {
      this.taskNameField.setAttribute('disabled', 'true');
      this.taskEditButton.className = 'task-edit-button';
      this.taskEditButton.innerHTML = "<img src='./assets/task-edit-button.svg'>";
      
      const updateTaskEvent = new CustomEvent('updateTask', {
        detail: {
          name: this.taskNameField.value,
          pomoActual: this.taskPomoActualValue.textContent,
          pomoEstimate: this.taskPomoEstimateValue.value,
          isDone: this.taskIsDone.checked,
          task: this.taskContainerElement,
        },
      });
      document.dispatchEvent(updateTaskEvent);

      console.log('EditTask dispatched updateTask event');
    }
  }

  /**
   * removeTask(): deletes an existing task from local storage and task list.
   */
  removeTask() {
    if (this.taskContainerElement.hasAttribute('focus')) {
      const clearFocusTaskEvent = new Event('clearFocusTask');
      document.dispatchEvent(clearFocusTaskEvent);

      console.log('Task dispatched clearFocusTask event');
    }
    this.taskContainerElement.remove();
  }

}

/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.addEventListener('DOMContentLoaded', function() {
  let timerSplash = new TimerSplash(TIMER_SPLASH_SELECTOR, TIMER_SPLASH_BUTTON_SELECTOR);
  let timerApp = new TimerApp();
  let taskList = new TaskList('#task-button', '#task-list');
  let focusTask = new FocusTask('#focus-task-container');
});

