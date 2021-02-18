/* TimerApp class */
class TimerApp {
  /**
   * Contructs a TimerApp, which handles all the logic for the timer.
   * @param {*} timerText is a TimerText object.
   * @param {*} timerButton is a selector for the timer's primary start/stop button.
   */
  constructor(timerText, timerButton) {
    this.timerText = timerText;
    this.timerButton = document.querySelector(timerButton);
    this.status = 'ready';
    this.timeoutId = null;

    this.timerButton.addEventListener('click', this.toggleTimer.bind(this));
  }

  /**
   * Toggles the state of the timer.
   */
  toggleTimer() {
    switch (this.status) {
      case 'ready':
        this.handleStart();
        break;
      case 'running':
        this.handleEnd();
        break;
      case 'stopped':
        this.handleReset();
        break;
    }
  }

  /**
   * Handles the start of the timer.
   */
  handleStart() {
    if (this.timeoutId === null) {
      this.timerText.start();
      this.status = 'running';
      this.timerButton.textContent = 'End';

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000);
    }
  }

  /**
   * Handles the end of the timer.
   */
  handleEnd() {
    this.timerText.end();
    this.status = 'stopped';
    this.timerButton.textContent = 'Reset';

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  /**
   * Handles resetting the timer back to its ready position.
   */
  handleReset() {
    this.timerText.reset();
    this.status = 'ready';
    this.timerButton.textContent = 'Start';
  }
}

/* TimerText class */

class TimerText {
  /**
   * Constructs a new TimerText class, which handles the internal timekeeping.
   * @param {*} selector is the selector for the text.
   * @param {*} time is the amount of time set for each iteration.
   */
  constructor(selector, time) {
    this.element = document.querySelector(selector);
    this.current = time;
    this.time = time;
    this.intervalId = null;
  }

  /**
   * Starts the timer.
   */
  start() {
    if (this.intervalId === null) {
      this.element.textContent = this.timeString; // Change timer to full
      this.intervalId = setInterval(this.update.bind(this), 1000);
    }
  }

  /**
   * Ends the timer.
   */
  end() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /**
   * Resets the timer.
   */
  reset() {
    this.current = this.time;
    this.element.textContent = this.timeString;
  }

  /**
   * Updates the timer's state.
   */
  update() {
    this.current--;
    this.element.textContent = this.timeString;
  }

  /**
   * Gets the current time as a mm:ss string.
   */
  get timeString() {
    let currentTime = Math.abs(this.current);
    let min = Math.floor(currentTime / 60);
    let sec = currentTime % 60;
    let minString = min < 10 ? '0' + min : '' + min;
    let secString = sec < 10 ? '0' + sec : '' + sec;
    return this.current < 0 ? `-${minString}:${secString}` : `${minString}:${secString}`;
  }

}

class TimerButton {

}

class TimerSettings {

}

// WIP (progress bar and numPomos info?)
class TimerInfo {

}

/* CONSTANTS */
const MIN_25 = 60 * 25;
const SEC_05 = 5; // For testing purposes only
const TIMER_TEXT_SELECTOR = '#timer-text';
const TIMER_BUTTON_SELECTOR = '#timer-button';
const TIMER_APP_SELECTOR = '#timer-app';

/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.addEventListener('DOMContentLoaded', function () {
  let timerText = new TimerText(TIMER_TEXT_SELECTOR, SEC_05);
  let timerApp = new TimerApp(timerText, TIMER_BUTTON_SELECTOR);
});
