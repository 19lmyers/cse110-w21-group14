class TimerProgress extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({mode: 'open'});

    let progress = document.createElement('ul');
    progress.innerHTML = `
      <div>
        <span class="progress-dot"></span>
        <p>Work Time</p>
      </div>
      <progress id="progress-pomodoro" value="0"></progress>
      <div>
        <span class="progress-dot"></span>
        <p>Short Break</p>
      </div>
      <progress id="progress-break" value="0"></progress>
      <div>
        <span class="progress-dot"></span>
        <p>Next Cycle!</p>
      </div>`;

    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', './styles/timer-progress.css');
    shadow.append(progress, style);

    // Set properties
    this.pomodoroProgress = shadow.querySelector('#progress-pomodoro');
    this.breakProgress = shadow.querySelector('#progress-break');
    this.currentProgressBarElement = this.pomodoroProgress;
    this.intervalId = null;
  } /* constructor */

  /**
   * Starts the updating of currentPhase's progress bar based on phase and time.
   * Only one of the two progress bars can be on at any given time.
   * @param {*} phase : Phase whose progress bar to start.
   */
  start(phase) {
    if (this.intervalId === null) {
      switch (phase) {
        case PHASE_POMODORO:
          this.currentProgressBarElement = this.pomodoroProgress;
          this._pomodoroDot = true;
          break;
        case PHASE_SHORT_BREAK:
          this.currentProgressBarElement = this.breakProgress;
          this._breakDot = true;
          break;
        case PHASE_LONG_BREAK:
          this.currentProgressBarElement = this.breakProgress;
          this._breakDot = true;
          break;
      }

      this.intervalId = setInterval(this._update.bind(this), 1000);
    }
  } /* start */

  /**
   * Updates the value of currentProgressBarElement based on current time
   */
  _update() {
    this.currentProgressBarElement.value++;
  } /* update */

  /**
   * Pauses the updating of the currentPhase's progress bar.
   */
  pause() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  /**
   * stopProgress: Stops the updating of the currentPhase's progress bar.
   */
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;

    if (this.currentProgressBarElement === this.breakProgress) {
      this.breakProgress.value = this.breakProgress.max;
      this._doneDot = true;
    }
  } /* stop */

  /**
   * Sets the total time for the pomodoro progress bar.
   * @param {Number} time is the time to set (in seconds).
   */
  set pomodoroTime(time) {
    this.pomodoroProgress.max = time;
  } /* set pomodoroTime */

  /**
   * Sets the total time for the break progress bar.
   * @param {Number} time is the time to set (in seconds).
   */
  set breakTime(time) {
    this.breakProgress.max = time;
  } /* set breakTime */

  set breakText(text) {
    this.shadowRoot.querySelector('#progress-pomodoro + div p').textContent = text;
  }

  /**
   * Clears all progress bars and dots.
   */
  clear() {
    this.pomodoroProgress.value = 0;
    this.breakProgress.value = 0;
    this._pomodoroDot = false;
    this._breakDot = false;
    this._doneDot = false;
  }

  /**
   * Sets the completion status for the pomodoro (first) dot.
   * @param {boolean} complete indicates whether the dot should be filled.
   */
  set _pomodoroDot(complete) {
    let pomodoroDot = this.shadowRoot.querySelector('.progress-dot');

    if (complete) {
      pomodoroDot.classList.add('complete');
    }
    else {
      pomodoroDot.classList.remove('complete');
    }
  }

  /**
   * Sets the completion status for the break (second) dot.
   * @param {boolean} complete indicates whether the dot should be filled.
   */
  set _breakDot(complete) {
    let breakDot = this.shadowRoot.querySelector('#progress-pomodoro + div .progress-dot');

    if (complete) {
      breakDot.classList.add('complete');
    }
    else {
      breakDot.classList.remove('complete');
    }
  }

  /**
   * Sets the completion status for the done (third) dot.
   * @param {boolean} complete indicates whether the dot should be filled.
   */
  set _doneDot(complete) {
    let doneDot = this.shadowRoot.querySelector('#progress-break + div .progress-dot');

    if (complete) {
      doneDot.classList.add('complete');
    }
    else {
      doneDot.classList.remove('complete');
    }
  }
}

customElements.define('timer-progress', TimerProgress);

module.exports = TimerProgress;
