const {
  SEC_03,
  SEC_05,
  TIMER_BUTTON_SELECTOR,
  PHASE_POMODORO,
  PHASE_SHORT_BREAK,
  PHASE_LONG_BREAK,
  TimerApp,
} = require('../source/scripts/main.js');

beforeEach(() => {
  document.body.innerHTML =
    '<div id="timer-splash">' + 
      '<button id="timer-splash-button">ENTER</button>' + 
    '</div>' + 
      '<section id="timer-app">' +
        '<div id="timer-circle">' +
          '<span id="timer-text">25:00</span>' +
          '<button id="timer-button">START</button>' +
        '</div>' +
      '</section>' +
      '<section id="timer-info">' +
        '<p><span id="timer-info-sessions">0</span> Pomodoros completed</p>' +
			'<ul id="progress-bar-container">' +
				'<li id="progress-step-1"></li>' +
				'<progress id="timer-info-work-progress" value=0.01></progress>' +
				'<li id="progress-step-2"></li>' +
				'<progress id="timer-info-break-progress" value=0.01></progress>' +
				'<li id="progress-step-3"></li>' +
				'<p id="timer-info-sessions-remaining">x1</p>' +
			'</ul>' +
		  '</section>' +
      '<button id="timer-reset-button"></button>' +
      '<button id="timer-settings-button"></button>' +
      '<div id="timer-settings" class="dialog">' +
        '<div class="dialog-content">' +
          '<form id="timer-settings-form">' +
              '<label for="pomo-number">Number of Pomodoros:</label>' +
                '<input id="pomo-number" name="pomo-number" type="number" min="1" max="25" value="5">' +
                '<input id="pomo-slider" name="pomo-slider" type="range" min="1" max="25" value="5">' +
              '<label for="pomo-length-number">Length of Pomodoro (min):</label>' +
                '<input id="pomo-length-number" name="pomo-length-number" type="number" min="5" max="120" value="25">' +
                '<input id="pomo-length-slider" name="pomo-length-slider" type="range" min="5" max="120" value="25">' +
              '<label for="short-break-number">Length of short break (min):</label>' +
                '<input id="short-break-number" name="short-break-number" type="number" min="1" max="25" value="5">' +
                '<input id="short-break-slider" name="short-break-slider" type="range" min="1" max="25" value="5">' +
              '<label for="long-break-number">Length of long break (min):</label>' +
                '<input id="long-break-number" name="long-break-number" type="number" min="1" max="50" value="15">' +
                '<input id="long-break-slider" name="long-break-slider" type="range" min="1" max="50" value="15">' +
            '<button id="timer-settings-close" type="button">Close</button>' +
            '<button id="timer-settings-save" type="submit">Save</button>' +
            '</form>' +
        '</div>' +
      '</div>';

    jest.useFakeTimers();
});

test('creates a new timer', () => {
  const timerApp = new TimerApp();

  expect(TimerApp).toBeTruthy();
  expect(timerApp.currentPhase).toBe(PHASE_POMODORO);
});

test('timer button starts timer', () => {
  const timerApp = new TimerApp();
  const timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
  const spy = jest.spyOn(timerApp, 'handleStart');

  timerButton.click();

  expect(spy).toHaveBeenCalledTimes(1);
});

test('wait 5 seconds before ending pomo', () => {
  const timerApp = new TimerApp();
  timerApp.handleStart();

  expect(setTimeout).toHaveBeenCalledTimes(1);
  expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), SEC_05 * 1000, false);
});

test('schedules short break after pomo', () => {
  const timerApp = new TimerApp();  
  timerApp.handleStart();

  jest.advanceTimersByTime(SEC_05 * 1000);
  
  expect(timerApp.currentPhase).toBe(PHASE_SHORT_BREAK);
});

test('schedules pomo after short break', () => {
  const timerApp = new TimerApp();
  timerApp.handleStart();

  jest.advanceTimersByTime((SEC_05 + SEC_03) * 1000);
  
  expect(timerApp.currentPhase).toBe(PHASE_POMODORO);
});

test('schedules long break after 4 cycles', () => {
  const timerApp = new TimerApp(); 
  timerApp.numPomodoros = 3;
  timerApp.handleStart();

  jest.advanceTimersByTime((SEC_05 + SEC_03) * 1000);
  
  expect(timerApp.currentPhase).toBe(PHASE_LONG_BREAK);
});

test('schedules pomo after long break', () => {
  const timerApp = new TimerApp(); 
  timerApp.currentStatus = PHASE_LONG_BREAK;
  timerApp.handleStart();

  jest.advanceTimersByTime(SEC_03 * 1000);
  
  expect(timerApp.currentPhase).toBe(PHASE_POMODORO);
});

test('restarts timer after premature ending', () => {
  const timerApp = new TimerApp();
  timerApp.handleStart();

  jest.advanceTimersByTime(SEC_05 * 1000);

  timerApp.toggleTimer();

  expect(timerApp.numPomodoros).toBe(1);
  expect(timerApp.currentPhase).toBe('pomodoro');
});

test('reset button resets pomo count', () => {
  const timerApp = new TimerApp();
  timerApp.numPomodoros = 3;
  timerApp.resetPomodoros();

  expect(timerApp.numPomodoros).toBe(0);
});
