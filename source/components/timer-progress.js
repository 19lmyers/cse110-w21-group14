class TimerProgress extends HTMLElement {
  constructor() {
    super();

    let shadow = this.attachShadow({mode: 'open'});

    let progress = document.createElement('ul');
    progress.innerHTML = `
      <li id="progress-pomodoro">
        <span class="progress-dot"></span>
        <div>
          <p>Work Time</p>
          <progress value="0"></progress>
        </div>
      </li>
      <li id="progress-break">
        <span class="progress-dot"></span>
        <div>
          <p>Short Break</p>
          <progress value="0"></progress>
        </div>
      </li>
      <li id="progress-finish">
        <p>Done!</p>
        <span class="progress-dot"></span>
      </li>`;

    let style = document.createElement('style');
    style.innerHTML = `
      ul {
        display: flex;
        list-style-type: none;
        min-width: 400px;
      }

      li {
        display: flex;
      }

      div {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      progress::-webkit-progress-bar {
        background-color: #BDE1E9;
        box-shadow: inset 0px 2px 1px rgba(0, 0, 0, 0.25);
      }

      progress[value]::-webkit-progress-value {
        background-color: #243D51;
        border-radius: 1px;
      }

      progress {
        margin: 30px 0px;
        height: 4px;
      }

      p {
        min-width: fit-content;
      }

      span {
        margin: auto 0px;
        font-size: 0;
        line-height: 0;
        letter-spacing: 0;

        width: 30px;
        height: 30px;
        background-color: #BDE1E9;
        box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 50%;
      }`;

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
          break;
        case PHASE_SHORT_BREAK:
          this.currentProgressBarElement = this.breakProgress;
          break;
        case PHASE_LONG_BREAK:
          this.currentProgressBarElement = this.breakProgress;
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
  } /* clearPomodoroProgress() */

  /**
   * clearBreakProgress: Clears the break progress bar.
   */
  clearBreakProgress() {
    this.breakProgress.value = 0;
  } /* clearBreakProgress() */
}

customElements.define('timer-progress', TimerProgress);
