class TimerSettings extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    let wrapper = document.createElement('div');
    wrapper.setAttribute('class', 'dialog');

    wrapper.innerHTML = `
			<div class="dialog-content">
				<form id="timer-settings-form">
					<fieldset>
						<legend>Choose your Pomodoro lengths:</legend>

						<label for="pomo-length-number">Length of Pomodoro (min):</label>
						<div>
							<input id="pomo-length-number" name="pomo-length-number" type="number" min="1" 
                max="60" value="25" required>
							<input id="pomo-length-slider" name="pomo-length-slider" type="range" min="1" 
                max="60" value="25" required>
						</div>

						<label for="short-break-number">Length of short break (min):</label>
						<div>
							<input id="short-break-number" name="short-break-number" type="number" min="1" 
                max="60" value="5" required>
							<input id="short-break-slider" name="short-break-slider" type="range" min="1" 
                max="60" value="5" required>
						</div>
						<label for="long-break-number">Length of long break (min):</label>
						<div>
							<input id="long-break-number" name="long-break-number" type="number" min="1" 
                max="60" value="15" required>
							<input id="long-break-slider" name="long-break-slider" type="range" min="1" 
                max="60" value="15" required>
						</div>
					</fieldset>

					<button type="button" class="close-button">Close</button>
					<button type="submit" class="save-button">Save</button>

					<hr>

					<h2>What is the Pomodoro Method?</h2>
					<p>Traditionally, the Pomodoro method is a cycle between a period of concentrated and
             uninterrupted work, known as a pomodoro, followed by a short break (and a long break
             every fourth cycle). This app expands upon the Pomodoro method while adhering to its
             fundamental philosophy, including customizable session times for pomodoros and breaks,
             task logging and estimations, and more. 
          </p>

          <h2>How should I use this app?</h2>
          <p>
						Simply get ready and press the button to begin! This will start counting down from the
            pomodoro time allotted (25 minutes by default). Note that once the button is pressed,
            you cannot end the timer without losing your progress on the current pomodoro. After a
            pomodoro is complete, you will automatically transition into the break period (5 and 15
            minutes for short and long breaks by default), after which the current work session will
            end. You can also use the task feature to log tasks you need to complete and the
            estimated number of pomodoros to complete it.
          </p>
			</div>`;

    this.pomoLengthNumber = wrapper.querySelector(POMO_LENGTH_NUMBER_SELECTOR);
    this.pomoLengthSlider = wrapper.querySelector(POMO_LENGTH_SLIDER_SELECTOR);

    this.shortBreakNumber = wrapper.querySelector(SHORT_BREAK_NUMBER_SELECTOR);
    this.shortBreakSlider = wrapper.querySelector(SHORT_BREAK_SLIDER_SELECTOR);

    this.longBreakNumber = wrapper.querySelector(LONG_BREAK_NUMBER_SELECTOR);
    this.longBreakSlider = wrapper.querySelector(LONG_BREAK_SLIDER_SELECTOR);

    // Add event listeners for pomo length
    this.pomoLengthNumber.addEventListener('input', () => {
      this.updateSlider(this.pomoLengthNumber, this.pomoLengthSlider);
    });
    this.pomoLengthSlider.addEventListener('input', () => {
      this.updateSlider(this.pomoLengthSlider, this.pomoLengthNumber);
    });

    // Add event listeners for short break length
    this.shortBreakNumber.addEventListener('input', () => {
      this.updateSlider(this.shortBreakNumber, this.shortBreakSlider);
    });
    this.shortBreakSlider.addEventListener('input', () => {
      this.updateSlider(this.shortBreakSlider, this.shortBreakNumber);
    });

    // Add event listeners for long break length
    this.longBreakNumber.addEventListener('input', () => {
      this.updateSlider(this.longBreakNumber, this.longBreakSlider);
    });
    this.longBreakSlider.addEventListener('input', () => {
      this.updateSlider(this.longBreakSlider, this.longBreakNumber);
    });

    wrapper.querySelector('.close-button')
      .addEventListener('click', () => this.closeSettings());
    wrapper.querySelector('#timer-settings-form')
      .addEventListener('submit', (event) => {
        event.preventDefault();
        this.updateSettings();
        this.closeSettings();
      });

    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'styles/timer-settings.css');

    this.shadowRoot.append(wrapper, style);

  }

  /**
   * Will update a number to match the value on a slider or vice versa depending on the 
   * order of parameters.
   * @param {*} updated is the number or slider that the user manually updated
   * @param {*} toUpdate the number or slider that should be updated to match
   */
  updateSlider(updated, toUpdate) {
    const newValue = updated.value;
    toUpdate.value = newValue;
  }

  /**
   * Opens settings screen.
   * @param {object} pomodoroTimes is an object containing the current
   * pomodoro, short break, and long break times.
   */
  openSettings(pomodoroTimes) {
    this.shadowRoot.querySelector('.dialog').style.visibility = 'visible';

    this.pomoLengthNumber.value = pomodoroTimes[PHASE_POMODORO] / 60;
    this.pomoLengthSlider.value = pomodoroTimes[PHASE_POMODORO] / 60;

    this.shortBreakNumber.value = pomodoroTimes[PHASE_SHORT_BREAK] / 60;
    this.shortBreakSlider.value = pomodoroTimes[PHASE_SHORT_BREAK] / 60;

    this.longBreakNumber.value = pomodoroTimes[PHASE_LONG_BREAK] / 60;
    this.longBreakSlider.value = pomodoroTimes[PHASE_LONG_BREAK] / 60;
  }

  /**
   * Closes settings screen.
   */
  closeSettings() {
    this.shadowRoot.querySelector('.dialog').style.visibility = 'hidden';
  }

  /**
   * Dispatches event to update settings.
   */
  updateSettings() {
    let settingsChangedEvent = new CustomEvent('settingsChanged', {
      detail: {
        pomodoroTimes: {
          pomodoro: this.pomoLengthNumber.value * 60,
          shortBreak: this.shortBreakNumber.value * 60,
          longBreak: this.longBreakNumber.value * 60,
        },
      },
    });
    this.dispatchEvent(settingsChangedEvent);
  }
}

customElements.define('timer-settings', TimerSettings);

module.exports = TimerSettings;
