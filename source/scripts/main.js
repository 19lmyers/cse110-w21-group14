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
const TIMER_INFO_WORK_PROGRESS_SELECTOR = '#timer-info-work-progress';
const TIMER_INFO_BREAK_PROGRESS_SELECTOR = '#timer-info-break-progress';
const TIMER_INFO_SESSIONS_REMAINING_SELECTOR = "#timer-info-sesions-remaining"
const TIMER_SETTINGS_SELECTOR = '#timer-settings';
const TIMER_SPLASH_SELECTOR = '#timer-splash';
const TIMER_SPLASH_BUTTON_SELECTOR = '#timer-splash-button';
const PHASE_POMODORO = "pomodoro";
const PHASE_SHORT_BREAK = "shortBreak";
const PHASE_LONG_BREAK = "longBreak"
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
      [PHASE_POMODORO]: SEC_05,
      [PHASE_SHORT_BREAK]: SEC_03,
      [PHASE_LONG_BREAK]: SEC_05,
    };
    this.currentStatus = 'stopped';
    this.currentPhase = 'pomodoro';
    this.timeoutId = null;

    // Initialize components
    this.timerText = new TimerText(TIMER_TEXT_SELECTOR, this.pomodoroTimes.pomodoro);
    this.timerButton = new TimerButton(TIMER_BUTTON_SELECTOR);
    this.timerInfo = new TimerInfo(TIMER_INFO_SESSIONS_SELECTOR, TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);
    this.timerSettings = new TimerSettings(TIMER_SETTINGS_SELECTOR);

    this.timerButton.element.addEventListener('buttonPressed', this.toggleTimer.bind(this));
    this.timerSettings.element.addEventListener('settingsChanged', (event)=> {
      this.pomodoroLimit = event.detail.pomodoroLimit;
      this.pomodoroTimes = event.detail.pomodoroTimes;
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
    });
  } /* constructor */

  /**
   * Toggles the state of the timer.
   */
  toggleTimer() {
    switch (this.currentStatus) {
      case 'stopped':
        this.handleStart();

        //TODO: Add this functionality to handleStart()
        /* Clear progress bar if starting from stopped state */ 
        this.timerInfo.progressInfo.clearProgress();
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

      //Progress bar: update progress
      this.timerInfo.progressInfo.startProgress(this.currentPhase, 
        this.pomodoroTimes[this.currentPhase]);

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000, false);
      this.timerButton.buttonText = "END";
    }
  } /* handleStart */

  /**
   * Handles the end of the timer.
   */
  handleEnd(early) {
    this.timerText.end();
    this.timerInfo.progressInfo.stopProgress();
    this.currentStatus = 'stopped';
    this.timerButton.buttonText = "START";

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;

    if (early) {
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
      this.timerInfo.progressInfo.clearProgress(early);
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
    switch (this.currentPhase) {
      case PHASE_POMODORO:
        // Fourth pomodoro: long break
        if (this.numPomodoros % 4 === 3) {
          this.currentPhase = PHASE_LONG_BREAK;
        } else {
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
}

/* <--------------------------------------------------------------------------------------------> */
class TimerInfoProgress {
  constructor(workProgressSelector, breakProgressSelector, sessionsRemainingSelector) {
    this.workProgressElement = document.querySelector(workProgressSelector);
    this.breakProgressElement = document.querySelector(breakProgressSelector);
    this.sessionsRemainingElement = document.querySelector(sessionsRemainingSelector);

    //TODO: Update to support default time or change constructor to be similar to TimerText
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

    //Selects currentProgressBarElemetn based on currentPhase
    if (this.currentPhase == PHASE_POMODORO) {
      this.currentProgressBarElement = this.workProgressElement;
    }
    else if (this.currentPhase == PHASE_SHORT_BREAK || this.curerntPhase == PHASE_LONG_BREAK) {
      this.currentProgressBarElement = this.breakProgressElement;
    }
    else {
      console.log("Error occured during TimerInfoProgress.updateProgress()")
    }

    this.intervalId = setInterval(this.updateProgress.bind(this), 1000);
  } /* startProgress(currentPhase, phaseTotalTime) */
  
  /**
   * Updates the value of currentProgressBarElement based on current time
   */
  updateProgress() {
    console.log("updateProgress()");
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
    console.log("stopProgress()");
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
    document.querySelector('#timer-settings-button').addEventListener('click', this.openSettings.bind(this));
    document.querySelector('#timer-settings-close').addEventListener('click', this.closeSettings.bind(this));
    document.querySelector('#timer-settings-save').addEventListener('click', (event)=>{
      event.preventDefault();
      this.updateSettings();
    });
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
        pomodoroLimit: document.getElementById("pomo-number").value,
        pomodoroTimes: {
          pomodoro: document.getElementById("pomo-length-number").value * 60,
          shortBreak: document.getElementById("short-break-number").value * 60,
          longBreak: document.getElementById("long-break-number").value * 60,
        }
      }
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
window.addEventListener('DOMContentLoaded', function () {
  let timerSplash = new TimerSplash(TIMER_SPLASH_SELECTOR, TIMER_SPLASH_BUTTON_SELECTOR);
  let timerApp = new TimerApp();
});
