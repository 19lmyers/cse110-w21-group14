/**
 * COPY/PASTED FROM TIMER-TEST BRANCH
 * timerTest.js: A test for timer functionality that uses one button.
 * 
 * The current implementation uses the prototype pattern for a timer and timerButton to avoid
 * polluting the global namespace (ie. having startTimer, endTimer, handleStartTimer...) and
 * avoid using global variables (everything is decalared onLoad instead of as a global variable).
 * However, there are certain optimizations (listed below) that will help it comply with modern
 * JavaScript ES6 standards. One crititcal philosophy this follows (although not perfect, see below)
 * is that the button controls everything about the timer; the timer does not start of stop itself.
 * 
 * If you plan to use this for implementation, make sure to do the following changes:
 * - Change prototype declarations to class declarations (same browser coverage, better readability)
 * - Change innerHTML to textContent (better security)
 * - Use string literals (ie. `${var}`) in currentToString function
 * - timer.end() is currently called twice; can we reduce it to only once?
 *   - Relevant: Maybe separate timer.end() into timer.end() and timer.reset(), then make
 *               early into a variable for timer (eg. endedEarly)
 * 
 * More optimizations are probably possible.
 */

/* TimerApp class */
class TimerApp {
  constructor(timerText, timerButton) {
    this.timerText = timerText;
    this.timerButton = document.querySelector(timerButton);
    this.status = 'ready';
    this.timeoutId = null;

    this.timerButton.addEventListener('click', this.toggleTimer.bind(this));
  }

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

  handleStart() {
    if (this.timeoutId === null) {
      this.timerText.start();
      this.status = 'running';
      this.timerButton.textContent = 'End';

      // Set natural timeout duration
      this.timeoutId = setTimeout(this.handleEnd.bind(this), this.timerText.time * 1000);
    }
  }

  handleEnd() {
    this.timerText.end();
    this.status = 'stopped';
    this.timerButton.textContent = 'Reset';

    // Clear natural duration and reset ID
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }

  handleReset() {
    this.timerText.reset();
    this.status = 'ready';
    this.timerButton.textContent = 'Start';
  }
}

/* TimerText class */

class TimerText {
  constructor(selector, time) {
    this.element = document.querySelector(selector);
    this.current = time;
    this.time = time;
    this.intervalId = null;
  }

  start() {
    if (this.intervalId === null) {
      this.element.textContent = this.timeString; // Change timer to full
      this.intervalId = setInterval(this.update.bind(this), 1000);
    }
  }

  end() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  reset() {
    this.current = this.time;
    this.element.textContent = this.timeString;
  }

  update() {
    this.current--;
    this.element.textContent = this.timeString;
  }

  get timeString() {
    let currentTime = Math.abs(this.current);
    let min = Math.floor(currentTime / 60);
    let sec = currentTime % 60;
    let minString = min < 10 ? '0' + min : '' + min;
    let secString = sec < 10 ? '0' + sec : '' + sec;
    return this.current < 0 ? `-${minString}:${secString}` : `${minString}:${secString}`;
  }

}

/* CONSTANTS */
const MIN_25 = 60 * 25;
const SEC_05 = 5; // For testing purposes only
const TIMER_TEXT_SELECTOR = '#timerText';
const TIMER_BUTTON_SELECTOR = '#timerButton';
const TIMER_APP_SELECTOR = '#timerApp';

/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.addEventListener('DOMContentLoaded', function () {
  let timerText = new TimerText(TIMER_TEXT_SELECTOR, SEC_05);
  let timerApp = new TimerApp(timerText, TIMER_BUTTON_SELECTOR);
});
