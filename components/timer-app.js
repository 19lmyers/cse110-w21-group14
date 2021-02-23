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


/* TIMER CLASS */

class Timer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({ mode: 'open' });


  }


}

/**
 * Constructor for Timer object.
 * @param {String} selector: The element for the timer.
 * @param {Number} time: The number of seconds on the timer.
 */
function Timer(selector, time) {
  this.selector = selector;
  this.current = time;
  this.time = time;
  this.intervalId = null;
}

/**
 * Timer.prototype.start starts the timer if it hasn't already been started.
 */
Timer.prototype.start = function () {
  if (this.intervalId === null) {
    document.querySelector(this.selector).innerHTML = this.currentToString(); // Change timer to full
    this.intervalId = setInterval(() => this.update(), 1000);
  }
}

/**
 * Timer.prototype.end stops the timer and resets values.
 * @param {boolean} early: States if the timer was stopped early.
 */
Timer.prototype.end = function (early) {
  clearInterval(this.intervalId);
  this.intervalId = null;
  this.current = this.time;
  if (early) {
    document.querySelector(this.selector).innerHTML = this.currentToString();
  }
}

/**
 * Timer.prototype.update updates the current time on the timer and ends the timer
 * if time is naturally up.
 */
Timer.prototype.update = function () {
  this.current--;
  document.querySelector(this.selector).innerHTML = this.currentToString();
  if (this.current === 0) {
    this.end(false);
  }
}

/**
 * Timer.prototype.toString returns the current timer value as a string.
 */
Timer.prototype.currentToString = function () {
  let min = Math.floor(this.current / 60);
  let sec = this.current % 60;
  let minString = min < 10 ? '0' + min : '' + min;
  let secString = sec < 10 ? '0' + sec : '' + sec;
  return minString + ':' + secString;

}

/* TIMERBUTTON PROTOTYPE */

/**
 * Constructor for TimerButton object.
 * @param {Timer} timer: The Timer object controlled by the TimerButton.
 * @param {String} selector: The HTML element representing the TimerButton.
 */
function TimerButton(timer, selector) {
  this.timer = timer;
  this.timerButton = document.querySelector(selector);
  this.timeoutId = null; // ID for natural timeout 

  // Event handlers (to pass this and add/remove event listeners correctly)
  this.startHandler = this.handleStart.bind(this);
  this.endHandler = this.handleEnd.bind(this, true);

  // Attach start functionality to button
  this.timerButton.addEventListener('click', this.startHandler);
}

/**
 * Handles the timer's start functionality.
 */
TimerButton.prototype.handleStart = function () {
  this.timer.start();

  // Replace event listeners and update button
  this.timerButton.removeEventListener('click', this.startHandler);
  this.timerButton.addEventListener('click', this.endHandler);
  this.timerButton.innerHTML = 'End';

  // Set natural duration
  this.timeoutId = setTimeout(() => this.handleEnd(false), this.timer.time * 1000);
}

/**
 * Handles the timer's end functionality.
 * @param {boolean} early: Indicates whether the timer is ended early.
 */
TimerButton.prototype.handleEnd = function (early) {
  this.timer.end(early);

  // Replace event listeners and update button
  this.timerButton.removeEventListener('click', this.endHandler);
  this.timerButton.addEventListener('click', this.startHandler);
  this.timerButton.innerHTML = 'Start';

  // Clear natural durationa and reset ID
  clearTimeout(this.timeoutId);
  this.timeoutId = null;
}

/* CONSTANTS */
const MIN_25 = 60 * 25;
const SEC_05 = 5; // For testing purposes only
const TIMER_SELECTOR = '#timer';
const TIMER_BUTTON_SELECTOR = '#timerButton'

/**
 * To be executed when the page loads.
 * Currently initializes the timer and button.
 */
window.onload = function () {
  let timer = new Timer(TIMER_SELECTOR, SEC_05);
  let timerButton = new TimerButton(timer, TIMER_BUTTON_SELECTOR);
}