class TimerProgress extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({mode: 'open'});

    let progress = document.createElement('ul');
    progress.innerHTML = `
      <li id="progress-pomodoro">
        <div>
          <span class="progress-dot"></span>
          <p>Work Time</p>
        </div>
        <progress value="0"></progress>
      </li>
      <li id="progress-break">
        <div>
          <span class="progress-dot"></span>
          <p>Short Break</p>
        </div>
        <progress value="0"></progress>
      </li>
      <li id="progress-done">
        <div>
          <span class="progress-dot"></span>
          <p>Next Cycle!</p>
        </div>
      </li>`;

    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', './styles/timer-progress.css');
    shadow.append(progress, style);

    // Set properties
    this.pomodoroProgress = shadow.querySelector('#progress-pomodoro progress');
    this.breakProgress = shadow.querySelector('#progress-break progress');
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
          this.pomodoroDot = true;
          break;
          this.timerProgress.pomodoroDot = true;
          break;
        case PHASE_SHORT_BREAK:
          this.currentProgressBarElement = this.breakProgress;
          this.breakDot = true;
          break;
        case PHASE_LONG_BREAK:
          this.currentProgressBarElement = this.breakProgress;
          this.breakDot = true;
          break;
      }

      this.intervalId = setInterval(this.update.bind(this), 1000);
    }
  } /* start */

  /**
   * Updates the value of currentProgressBarElement based on current time
   */
  update() {
    this.currentProgressBarElement.value++;
  } /* update */

  /**
   * stopProgress: Stops the updating of the currentPhase's progress bar.
   */
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
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
    this.shadowRoot.querySelector('#progress-break p').textContent = text;
  }

  /**
   * clearPomodoroProgress: Clears the pomodoro progress bar.
   */
  clearPomodoroProgress() {
    this.pomodoroProgress.value = 0;
    this.pomodoroDot = false;
  } /* clearPomodoroProgress() */

  /**
   * clearBreakProgress: Clears the break progress bar.
   */
  clearBreakProgress() {
    this.breakProgress.value = 0;
    this.breakDot = false;
  } /* clearBreakProgress() */

  /**
   * Sets the completion status for the pomodoro (first) dot.
   * @param {boolean} complete indicates whether the dot should be filled.
   */
  set pomodoroDot(complete) {
    let pomodoroDot = this.shadowRoot.querySelector('#progress-pomodoro .progress-dot');

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
  set breakDot(complete) {
    let breakDot = this.shadowRoot.querySelector('#progress-break .progress-dot');

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
  set doneDot(complete) {
    let doneDot = this.shadowRoot.querySelector('#progress-done .progress-dot');

    if (complete) {
      doneDot.classList.add('complete');
    }
    else {
      doneDot.classList.remove('complete');
    }
  }
}

customElements.define('timer-progress', TimerProgress);
