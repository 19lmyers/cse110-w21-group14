class TimerText extends HTMLElement {
  constructor() {
    super();

    // Initialize properties
    this.time = 0;
    this.intervalId = null;

    this.attachShadow({mode: 'open'});

    let wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <span class="minute">${this._minString}</span>
    :
    <span class="second">${this._secString}</span>
    `;

    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'styles/timer-text.css');

    this.shadowRoot.append(wrapper, style);
  } /* constructor */

  /**
   * Starts the timer.
   */
  start() {
    if (this.intervalId === null) {
      this.intervalId = setInterval(this._update.bind(this), 1000);

      // Set document title to current time
      document.title = `Pomodoro - ${this.timeString}`;
    }
  } /* start */

  /**
   * Updates the timer's state.
   */
  _update() {
    this.time--;

    let shadow = this.shadowRoot;
    shadow.querySelector('.minute').textContent = this._minString;
    shadow.querySelector('.second').textContent = this._secString;

    // Set document title to current time
    document.title = `Pomodoro - ${this.timeString}`;
  } /* update */


  /**
   * Stops the timer.
   */
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
  } /* stop */

  /**
   * Sets the timer to the desired value (in seconds).
   * Only works if the timer is stopped.
   * @param {Number} newTime is the time in seconds.
   */
  setTime(newTime) {
    if (this.intervalId === null) {
      this.time = newTime;

      let shadow = this.shadowRoot;
      shadow.querySelector('.minute').textContent = this._minString;
      shadow.querySelector('.second').textContent = this._secString;
    }
  } /* time */

  /**
   * Gets the current time as a mm:ss string.
   */
  get timeString() {
    return this.time < 0 ? `-${this._minString}:${this._secString}` :
      `${this._minString}:${this._secString}`;
  } /* timeString */

  /**
   * Gets the current minute as a string (always positive).
   */
  get _minString() {
    let currentTime = Math.abs(this.time);
    let min = Math.floor(currentTime / 60);
    return min < 10 ? '0' + min : '' + min;
  } /* get minuteString */

  /**
   * Gets the current second as a string (always positive).
   */
  get _secString() {
    let currentTime = Math.abs(this.time);
    let sec = currentTime % 60;
    return sec < 10 ? '0' + sec : '' + sec;
  } /* timeString */
}

customElements.define('timer-text', TimerText);
