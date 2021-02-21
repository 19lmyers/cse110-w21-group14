/* CONSTANTS */
const MIN_05 = 60 * 5;
const MIN_15 = 60 * 15;
const MIN_25 = 60 * 25;
const SEC_01 = 1; // For testing purposes only
const SEC_03 = 3; // For testing purposes only
const SEC_05 = 5; // For testing purposes only
const DEFAULT_POMODORO_LIMIT = 5;
const TIMER_TEXT_SELECTOR = '#timer-text';
const TIMER_BUTTON_SELECTOR = '#timer-button';
const TIMER_APP_SELECTOR = '#timer-app';
const TIMER_INFO_SESSIONS_SELECTOR = '#timer-info-sessions';
const TIMER_INFO_PROGRESS_SELECTOR = '#timer-info-progress';
const TIMER_SETTINGS_SELECTOR = '#timer-settings';
const TIMER_SPLASH_SELECTOR = '#timer-splash';
const TIMER_SPLASH_BUTTON_SELECTOR = '#timer-splash-button';

/* -------------------------------------------------------------------------- */

/* TimerApp class */
class TimerApp {
  /**
   * Contructs a TimerApp, which handles all the logic for the timer.
   * @param {*} timerText is a TimerText object.
   * @param {*} timerButton is a selector for the timer's primary start/stop button.
   */
  constructor() {

    // Assign default values
    this.numPomodoros = 0;
    this.pomodoroLimit = DEFAULT_POMODORO_LIMIT;
    this.pomodoroTimes = {
      pomodoro: SEC_05,
      shortBreak: SEC_01,
      longBreak: SEC_03,
    };
    this.currentStatus = 'stopped';
    this.currentPhase = 'pomodoro';
    this.timeoutId = null;

    // Initialize components
    this.timerText = new TimerText(TIMER_TEXT_SELECTOR, this.pomodoroTimes.pomodoro);
    this.timerButton = new TimerButton(TIMER_BUTTON_SELECTOR);
    this.timerInfo = new TimerInfo(TIMER_INFO_SESSIONS_SELECTOR, TIMER_INFO_PROGRESS_SELECTOR);
    this.timerSettings = new TimerSettings(TIMER_SETTINGS_SELECTOR);

    this.timerButton.element.addEventListener('buttonPressed', this.toggleTimer.bind(this));
  } /* constructor */

  /**
   * Toggles the state of the timer.
   */
  toggleTimer() {
    switch (this.currentStatus) {
      case 'stopped':
        this.handleStart();
        break;
      case 'running':
        this.handleEnd(true);
        break;
    }
  } /* toggleTimer */

  /**
   * Handles the start of the timer.
   */
  handleStart() {
    if (this.currentStatus === 'stopped') {
      this.timerText.start();
      this.currentStatus = 'running';

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000, false);
      this.timerButton.buttonText = 'End';
    }
  } /* handleStart */

  /**
   * Handles the end of the timer.
   */
  handleEnd(early) {
    this.timerText.end();
    this.currentStatus = 'stopped';
    this.timerButton.buttonText = 'Start';

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;

    if (early) {
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
    } else {
      // Keep cycling through phases until break is finished
      this.timerText.setTime(this.pomodoroTimes[this.cyclePhase()]);

      if (this.currentPhase !== 'pomodoro') {
        this.handleStart();
      } else {
        // Increment number of pomodoros completed after one cycle (pomo + break)
        this.numPomodoros++;
      }
    }

  } /* handleEnd */

  cyclePhase() {
    if(this.currentPhase === 'pomodoro'){
      documente.getElementById('timer-info-sessions').innerHTML++;
    }
    switch (this.currentPhase) {
      case 'pomodoro':
        // Fourth pomodoro: long break
        if (this.numPomodoros % 4 === 3) {
          this.currentPhase = 'longBreak';
        } else {
          this.currentPhase = 'shortBreak';
        }
        break;
      case 'shortBreak':
      case 'longBreak':
        this.currentPhase = 'pomodoro';
        break;
    }
    return this.currentPhase;
  }
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
    }
  } /* start */

  /**
   * Updates the timer's state.
   */
  update() {
    this.time--;
    this.element.textContent = this.timeString;
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

class TimerButton {
  /**
   * Constructs a TimerButton object, which propogates presses and can be set.
   * @param {} selector 
   */
  constructor(selector) {
    this.element = document.querySelector(selector);

    this.element.addEventListener('click', () => {
      let buttonPressedEvent = new Event('buttonPressed');
      this.element.dispatchEvent(buttonPressedEvent);
    });
  }

  set buttonText(text) {
    this.element.textContent = text;
  }

}

class TimerInfo {
  /**
   * Constructs a new TimerInfo class, which holds a TimerInfoSessions
   * object and a TimerInfoProgress object.
   * @param {*} sessionsSelector 
   * @param {*} progressSelector 
   */
  constructor(sessionsSelector, progressSelector) {
    this.sessionsInfo = new TimerInfoSessions(sessionsSelector);
    this.progressInfo = new TimerInfoProgress(progressSelector);
  }
}

class TimerInfoSessions {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }
}

class TimerInfoProgress {
  constructor(selector) {
    this.element = document.querySelector(selector);
  }
}

class TimerSettings {
  constructor(settingsSelector) {
    this.element = document.querySelector(settingsSelector);

    document.querySelector('#timer-settings-button').addEventListener('click', this.openSettings.bind(this));
    document.querySelector('#timer-settings-close').addEventListener('click', this.closeSettings.bind(this));
  }

  openSettings() {
    this.element.style.visibility = 'visible';
  }

  closeSettings() {
    this.element.style.visibility = 'hidden';
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
window.addEventListener('DOMContentLoaded', function () {
  let timerSplash = new TimerSplash(TIMER_SPLASH_SELECTOR, TIMER_SPLASH_BUTTON_SELECTOR);
  let timerApp = new TimerApp();
});
