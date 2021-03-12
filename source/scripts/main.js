/* CONSTANTS */
const MIN_05 = 60 * 5;
const MIN_15 = 60 * 15;
const MIN_25 = 60 * 25;
const TIMER_TEXT_SELECTOR = 'timer-text';
const TIMER_BUTTON_SELECTOR = 'timer-button';
const TIMER_PROGRESS_SELECTOR = 'timer-progress';
const TIMER_SETTINGS_SELECTOR = 'timer-settings';
const SETTINGS_BUTTON_SELECTOR = '#settings-button';
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
    this.pomodoroTimes = {
      [PHASE_POMODORO]: MIN_25,
      [PHASE_SHORT_BREAK]: MIN_05,
      [PHASE_LONG_BREAK]: MIN_15,
    };
    this.currentStatus = STATUS_STOPPED;
    this.currentPhase = PHASE_POMODORO;
    this.timeoutId = null;

    // Store components
    this.timerText = document.querySelector(TIMER_TEXT_SELECTOR);
    this.timerText.setTime(this.pomodoroTimes[PHASE_POMODORO]);

    this.timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
    this.timerButton.buttonAction = () => {
      if (this.currentStatus === STATUS_RUNNING) {
        let skip = this.currentPhase !== PHASE_POMODORO;
        this.confirmEnd(skip);
      }
      else {
        this.handleStart();
      }
    };
    
    this.timerProgress = document.querySelector(TIMER_PROGRESS_SELECTOR);

    // Handle finishedFocusTask event
    document.addEventListener('finishedFocusTask', (event) => {
      this.handleEnd(true);
    });

    this.timerSettings = document.querySelector(TIMER_SETTINGS_SELECTOR);
    // Event listener for settings button
    document.querySelector(SETTINGS_BUTTON_SELECTOR)
      .addEventListener('click', () => this.timerSettings.openSettings(this.pomodoroTimes));
    // Event listener for changing settings via dialog
    this.timerSettings.addEventListener('settingsChanged', (event) => {
      this.pomodoroTimes = event.detail.pomodoroTimes;
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
    });

    // Event listener for sounds
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
      // Begin timer text and set status
      this.timerText.start();
      this.currentStatus = STATUS_RUNNING;
      this.timerButton.buttonText = 'END';

      // (Re)set progress bar
      switch (this.currentPhase) {
        case PHASE_POMODORO:
          this.timerProgress.clear();
          this.timerProgress.pomodoroTime = this.pomodoroTimes[PHASE_POMODORO];
          break;
        case PHASE_SHORT_BREAK:
          this.timerProgress.breakTime = this.pomodoroTimes[PHASE_SHORT_BREAK];
          break;
        case PHASE_LONG_BREAK:
          this.timerProgress.breakTime = this.pomodoroTimes[PHASE_LONG_BREAK];
          break;
      }
      // Change progress break text
      if (this.numPomodoros % 4 === 3) {
        this.timerProgress.breakText = 'Long Break';
      }
      else {
        this.timerProgress.breakText = 'Short Break';
      }
      // Start progress bar
      this.timerProgress.start(this.currentPhase);

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000, false);
    }
  } /* handleStart */

  /**
   * Handles pausing the timer.
   */
  handlePause() {
    // Stop timers and set status
    this.timerText.stop();
    this.timerProgress.pause();
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
      // Start timers up again and set status
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
    // Stop timers and set status
    this.timerText.stop();
    this.timerProgress.stop();
    this.currentStatus = STATUS_STOPPED;
    this.timerButton.buttonText = 'START';

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;

    // Set document title back to Pomodoro
    document.title = 'Pomodoro';

    // Check if Pomodoro was cut off
    if (early && this.currentPhase === PHASE_POMODORO) {
      this.timerText.setTime(this.pomodoroTimes[this.currentPhase]);
      this.timerProgress.clear();
    }
    else {
      // Keep cycling through phases until break is finished
      this.timerText.setTime(this.pomodoroTimes[this.cyclePhase()]);

      if (this.currentPhase !== PHASE_POMODORO) {
        // Start break
        this.playSound(TIMER_COMPLETE_SOUND);
        this.handleStart();
      }
      else {
        // Dispatch timerEnd event
        document.dispatchEvent(new Event('timerEnd'));

        // Increment number of pomodoros completed after one cycle (pomo + break)
        this.numPomodoros++;
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

    // Set actions
    confirmDialog.confirmAction = () => this.handleEnd(true);
    confirmDialog.cancelAction = () => this.handleContinue();

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
    confirmDialog.confirmAction = () => this.resetPomodoros();

    document.body.appendChild(confirmDialog);
  } /* confirmReset */
}

/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.addEventListener('DOMContentLoaded', function() {
  let timerApp = new TimerApp();
});

