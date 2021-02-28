/* CONSTANTS */
const MIN_05 = 60 * 5;
const MIN_15 = 60 * 15;
const MIN_25 = 60 * 25;
const SEC_01 = 1; // For testing purposes only
const SEC_03 = 3; // For testing purposes only
const SEC_05 = 5; // For testing purposes only
const DEFAULT_POMODORO_LIMIT = 5;
const TIMER_TEXT_SELECTOR = '#timer-text';
const TIMER_BUTTON_SELECTOR = 'timer-button';
const TIMER_APP_SELECTOR = '#timer-app';
const TIMER_INFO_SESSIONS_SELECTOR = '#timer-info-sessions';
const TIMER_INFO_WORK_PROGRESS_SELECTOR = '#timer-info-work-progress';
const TIMER_INFO_BREAK_PROGRESS_SELECTOR = '#timer-info-break-progress';
const TIMER_INFO_SESSIONS_REMAINING_SELECTOR = '#timer-info-sesions-remaining';
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
const PHASE_POMODORO = 'pomodoro';
const PHASE_SHORT_BREAK = 'shortBreak';
const PHASE_LONG_BREAK = 'longBreak';
const STATUS_STOPPED = 'stopped';
const STATUS_RUNNING = 'running';
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
    this.timerInfo = new TimerInfo(TIMER_INFO_SESSIONS_SELECTOR,
      TIMER_INFO_WORK_PROGRESS_SELECTOR, TIMER_INFO_BREAK_PROGRESS_SELECTOR,
      TIMER_INFO_SESSIONS_REMAINING_SELECTOR);
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

    // Event listener for resetting Pomodoros via button
    document.querySelector(TIMER_RESET_BUTTON_SELECTOR).addEventListener('click', () => {
      this.confirmReset();
    });

    // Event listener for changing settings via dialog
    this.timerSettings.element.addEventListener('settingsChanged', (event) => {
      this.pomodoroLimit = event.detail.pomodoroLimit;
      this.pomodoroTimes = event.detail.pomodoroTimes;
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
    });

    // Event listener for page warning
    window.addEventListener('beforeunload', (event) => {
      if (this.currentStatus === STATUS_RUNNING) {
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
      this.timerInfo.progressInfo.clearProgress();
      this.timerInfo.progressInfo.startProgress(this.currentPhase,
        this.pomodoroTimes[this.currentPhase]);

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000, false);
      this.timerButton.setAttribute('data-text', 'END');
    }
  } /* handleStart */

  /**
   * Handles the end of a Pomodoro session.
   * @param {boolean} early indicates whether the Pomodoro was ended early.
   */
  handleEnd(early) {
    if (this.currentStatus === STATUS_RUNNING) {
      this.timerText.end();
      this.timerInfo.progressInfo.stopProgress();
      this.currentStatus = 'stopped';
      this.timerButton.setAttribute('data-text', 'START');

      // Clear natural duration and reset ID
      clearTimeout(this.timeoutId);
      this.timeoutId = null;

      // Set document title back to Pomodoro
      document.title = 'Pomodoro';

      if (early) {
        if (this.currentPhase !== 'pomodoro') {
          this.timerInfo.sessionsInfo.sessionsText = ++this.numPomodoros;
        }
        this.currentPhase = 'pomodoro';
        this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
        this.timerInfo.progressInfo.clearProgress(early);
      }
      else {
        // Keep cycling through phases until break is finished
        this.timerText.setTime(this.pomodoroTimes[this.cyclePhase()]);

        if (this.currentPhase !== 'pomodoro') {
          this.handleStart();
        }
        else {
          // Increment number of pomodoros completed after one cycle (pomo + break)
          this.timerInfo.sessionsInfo.sessionsText = ++this.numPomodoros;
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
        }
        else {
          this.currentPhase = PHASE_SHORT_BREAK;
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
   * Handles the logic of confirming ending the session early, including showing
   * the dialog and handling an early end or skip if confirmed.
   * @param {boolean} skip indicates whether the confirm dialog should show 
   * end text (abrupt end during Pomodoro) or skip text (during a break).
   */
  confirmEnd(skip) {
    // Constants for dialog text
    const END_TEXT = `Are you sure you want to end this pomodoro session? Your current 
      Pomodoro will not be saved.`;
    const SKIP_TEXT = `Are you sure you want to end this break? You will still complete 
      your pomodoro session, but skipping breaks is not advised`;

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
   * Ends the timer.
   */
  end() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  } /* end */

  /**
   * Sets the timer to the desired value (in seconds).
   * Only works if the timer is stopped.
   * @param newTime
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

class TimerInfo {
  /**
   * Constructs a new TimerInfo class, which holds a TimerInfoSessions
   * object and a TimerInfoProgress object.
   * @param {*} sessionsSelector: selector for the sessions element
   * @param {*} workProgressSelector: selector for the work progress element
   * @param {*} breakProgressSelector: selector for the break progress element
   * @param {*} sessionsRemainingSelector: selector for the sessions remaining element
   */
  constructor(sessionsSelector, workProgressSelector, breakProgressSelector,
    sessionsRemainingSelector) {
    this.sessionsInfo = new TimerInfoSessions(sessionsSelector);
    this.progressInfo = new TimerInfoProgress(workProgressSelector, breakProgressSelector,
      sessionsRemainingSelector);
  }

}

class TimerInfoSessions {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }

  set sessionsText(numPomodoros) {
    this.element.textContent = numPomodoros;
  }
}

/* <-------------------------------------------------------------------------------------------> */
class TimerInfoProgress {
  constructor(workProgressSelector, breakProgressSelector, sessionsRemainingSelector) {
    this.workProgressElement = document.querySelector(workProgressSelector);
    this.breakProgressElement = document.querySelector(breakProgressSelector);
    this.sessionsRemainingElement = document.querySelector(sessionsRemainingSelector);

    // TODO: Update to support default time or change constructor to be similar to TimerText
    this.time = MIN_25;
    this.totalTime = MIN_25;
    this.currentProgressBarElement = this.workProgressElement;
    this.intervalId = null;
  } /* constructor(workProgressSelector, breakProgressSelector) */

  /**
   * Starts the updating of currentPhase's progress bar based on phase and time.
   * @param {*} currentPhase : currentPhase stored in this.currentPhase
   * @param {*} phaseTotalTime : phaseTotalTime stored in this.totalTime and this.time
   */
  startProgress(currentPhase, phaseTotalTime) {
    this.currentPhase = currentPhase;
    this.time = phaseTotalTime;
    this.totalTime = phaseTotalTime;

    // Selects currentProgressBarElemetn based on currentPhase
    if (this.currentPhase == PHASE_POMODORO) {
      this.currentProgressBarElement = this.workProgressElement;
    }
    else if (this.currentPhase == PHASE_SHORT_BREAK || this.currentPhase == PHASE_LONG_BREAK) {
      this.currentProgressBarElement = this.breakProgressElement;
    }
    else {
      console.log('Error occured during TimerInfoProgress.updateProgress()');
    }

    this.intervalId = setInterval(this.updateProgress.bind(this), 1000);
  } /* startProgress(currentPhase, phaseTotalTime) */

  /**
   * Updates the value of currentProgressBarElement based on current time
   */
  updateProgress() {
    console.log('updateProgress()');
    this.time--;
    this.currentProgressBarElement.value = this.currentProgressValue;
  } /* updateProgress() */

  /**
   * Gets the current progress in decimal form.
   */
  get currentProgressValue() {
    return ((this.totalTime - this.time) / this.totalTime);
  } /* currentProgressValue() */

  /**
   * stopProgress: Stops the updating of the currentPhase's progress bar.
   */
  stopProgress() {
    console.log('stopProgress()');
    clearInterval(this.intervalId);
    this.intervalId = null;
  } /* stopProgress */

  /**
   * clearProgress: Clears any current progress within both progress bars
   */
  clearProgress() {
    this.workProgressElement.value = 0;
    this.breakProgressElement.value = 0;
  } /* clearProgress() */

  /**
   * updateSessionsRemaining: Updates sessions remaining on progress bar
   * @param {int} pomosRemaining: number of Pomodoros remaining
   */
  updateSessionsRemaining(pomosRemaining) {
    this.sessionsRemainingElement.textcontent = pomosRemaining;
  }
}

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

/* -------------------------------------------------------------------------- */

/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.addEventListener('DOMContentLoaded', function() {
  let timerSplash = new TimerSplash(TIMER_SPLASH_SELECTOR, TIMER_SPLASH_BUTTON_SELECTOR);
  let timerApp = new TimerApp();
});

/* Task List */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */


/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.addEventListener('DOMContentLoaded', function () {
  let timerSplash = new TimerSplash(TIMER_SPLASH_SELECTOR, TIMER_SPLASH_BUTTON_SELECTOR);
  let timerApp = new TimerApp();
});



/* Task List */
/* -------------------------------------------------------------------------- */
class TaskList {
  /**
   * TaskList(): constructs the task list
   */
  constructor() {
    this.loadTaskList();

  }

  /**
   * loadTaskList(): loads task list from local storage.
   */
  loadTaskList() {

  }

  /**
   * toggleTaskList(): toggles visibility of task list
   */
  toggleTaskList() {

  }

  /**
   * createTask(): creates a new task
   */
  createTask(taskName, pomoEstimate, pomoActual, isTaskDone) {

  }

  /**
   * editTask(): edits an existing task
   */
  editTask() {
    //Update tasks 
    this.storeTask();
  }
  
  /**
   * storeTask(): handles task storage in local storage
   */
  storeTask() {

  }

  /**
   * deleteTask(): deletes an existing task from local storage and task list.
   */
  deleteTask() {

  }

}

class Task {
  /**
   * Task(taskName, pomoEstimate, pomoActual):
   * @param {string} taskName: name of task being constructed.
   * @param {integer} pomoEstimate: estimated pomos for task being constructed.
   * @param {integer} pomoActual: pomos used for task being constructed.
   * @param {boolean} isTaskDone: true if task done, false if not.
   */
  constructor(taskName, pomoEstimate, pomoActual, isTaskDone) {
    this.taskName = taskName;
    this.pomoEstimate = pomoEstimate;

    this.pomoActual = 0;
  }

  /**
   * setTaskName(): sets the name of the task
   * @param {string} taskName: name of the task
   */
  setTaskName(taskName) {
    this.taskName = taskName;
  }

  /**
   * setTaskPomoEstimate(): sets the estimated number of pomos for this task.
   * @param {integer} pomoEstimate: number of estimated pomos for this task
   */
  setPomoEstimate(pomoEstimate) {
    this.pomoEstimate = pomoEstimate;
  }
  /**
   * setTaskPomoActual() 
   * @param pomoActual: number of pomos actually being used for this task
   */
  setTaskPomoActual(pomoActual) {
    this.pomoActual = pomoActual;
  }
}