const {
  SEC_01,
  SEC_03,
  SEC_05,
  TIMER_TEXT_SELECTOR,
  TIMER_BUTTON_SELECTOR,
  TIMER_INFO_WORK_PROGRESS_SELECTOR,
  TIMER_INFO_BREAK_PROGRESS_SELECTOR,
  TIMER_INFO_SESSIONS_REMAINING_SELECTOR,
  TIMER_SETTINGS_SELECTOR,
  POMO_NUMBER_SELECTOR,
  POMO_LENGTH_NUMBER_SELECTOR,
  SHORT_BREAK_NUMBER_SELECTOR,
  LONG_BREAK_NUMBER_SELECTOR,
  TIMER_SPLASH_SELECTOR,
  TIMER_SPLASH_BUTTON_SELECTOR,
  PHASE_POMODORO,
  PHASE_SHORT_BREAK,
  PHASE_LONG_BREAK,
  TimerText,
  TimerSettings,
  TimerSplash,
  TimerInfoProgress,
  TimerApp
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
        '<progress id="timer-info-work-progress" value=0></progress>' +
        '<li id="progress-step-2"></li>' +
        '<progress id="timer-info-break-progress" value=0></progress>' +
        '<li id="progress-step-3"></li>' +
        '<p id="timer-info-sessions-remaining">x1</p>' +
      '</ul>' +
    '</section>' +
    '<button id="timer-reset-button"></button>' +
    '<button id="timer-settings-button"></button>' +
    '<div id="timer-settings" class="dialog">' +
      '<div class="dialog-content">' +
        '<form id="timer-settings-form">' +
          '<input id="pomo-number" name="pomo-number" type="number" min="1" max="25" value="5">' +
          '<input id="pomo-slider" name="pomo-slider" type="range" min="1" max="25" value="5">' +
          '<input id="pomo-length-number" name="pomo-length-number" type="number" min="5" max="120" value="25">' +
          '<input id="pomo-length-slider" name="pomo-length-slider" type="range" min="5" max="120" value="25">' +
          '<input id="short-break-number" name="short-break-number" type="number" min="1" max="25" value="5">' +
          '<input id="short-break-slider" name="short-break-slider" type="range" min="1" max="25" value="5">' +
          '<input id="long-break-number" name="long-break-number" type="number" min="1" max="50" value="15">' +
          '<input id="long-break-slider" name="long-break-slider" type="range" min="1" max="50" value="15">' +
          '<button id="timer-settings-close" type="button">Close</button>' +
          '<button id="timer-settings-save" type="submit">Save</button>' +
        '</form>' +
      '</div>' +
    '</div>';

    jest.useFakeTimers();
});

describe('splash screen', () => {
  test('loads timer splash screen and app', () => {
    window.dispatchEvent(new Event('DOMContentLoaded'));

    expect(TimerSplash).toBeTruthy();
    expect(TimerApp).toBeTruthy();
  });

  test('enter button closes splash screen', () => {
    const timerSplash = new TimerSplash(TIMER_SPLASH_SELECTOR, TIMER_SPLASH_BUTTON_SELECTOR);
    const splashButton = document.querySelector(TIMER_SPLASH_BUTTON_SELECTOR);

    splashButton.click();

    expect(getComputedStyle(timerSplash.element)).toHaveProperty('visibility', 'hidden');
  });
});

describe('timer app', () => {
  test('creates a new timer', () => {
    const timerApp = new TimerApp();
  
    expect(TimerApp).toBeTruthy();
    expect(timerApp.currentPhase).toBe(PHASE_POMODORO);
  });

  test('when timer begins, start progress bar', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp.timerInfo.progressInfo, 'startProgress');

    timerApp.handleStart();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(expect.any(String), expect.any(Number));
  });

  test('when timer runs out, stop progress bar', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp.timerInfo.progressInfo, 'stopProgress');

    timerApp.handleEnd();

    expect(spy).toHaveBeenCalled();
  });

  test('when timer ends early, clear progress bar', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp.timerInfo.progressInfo, 'clearProgress');

    timerApp.handleEnd(true);

    expect(spy).toHaveBeenCalled();
  });

  test('wait 5 seconds before ending pomo', () => {
    const timerApp = new TimerApp();
    
    timerApp.handleStart();

    expect(setTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), SEC_05 * 1000, false);
  });
});

describe('pomo cycle', () => {
  test('schedules short break after pomo', () => {
    const timerApp = new TimerApp();  

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_05 * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_SHORT_BREAK);
  });

  test('schedules pomo after short break', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime((SEC_05 + SEC_03) * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_POMODORO);
  });

  test('schedules long break after 4 cycles', () => {
    const timerApp = new TimerApp(); 
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime((SEC_05 + SEC_03) * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_LONG_BREAK);
  });

  test('schedules pomo after long break', () => {
    const timerApp = new TimerApp(); 
    timerApp.currentPhase = PHASE_LONG_BREAK;

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_05 * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_POMODORO);
  });
});

describe('timer text', () => {
  test('timer text displays pomo time', () => {
    const timerApp = new TimerApp();

    expect(timerApp.timerText).toHaveProperty('timeString', '00:05');
  });

  test('timer text displays short break time', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_05 * 1000);

    expect(timerApp.timerText).toHaveProperty('timeString', '00:03');
  });

  test('timer text displays long break time', () => {
    const timerApp = new TimerApp();
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_05 * 1000);

    expect(timerApp.timerText).toHaveProperty('timeString', '00:05');
  });

  test('timer text displays negative time', () => {
    const timerText = new TimerText(TIMER_TEXT_SELECTOR, -50);

    expect(TimerText).toBeTruthy();
    expect(timerText).toHaveProperty('timeString', '-00:50');
  });

  test('timer text starts time', () => {
    const timerText = new TimerText(TIMER_TEXT_SELECTOR, 5);

    timerText.start();

    expect(setInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });

  test('timer text updates time', () => {
    const timerText = new TimerText(TIMER_TEXT_SELECTOR, 5);

    timerText.update();

    expect(timerText).toHaveProperty('time', 4);
  });

  test('timer text ends timer', () => {
    const timerText = new TimerText(TIMER_TEXT_SELECTOR, 5);

    timerText.end();

    expect(timerText).toHaveProperty('intervalId', null);
  });

  test('ignores start timer if already running', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp.timerText, 'start');
    timerApp.currentStatus = 'running';

    timerApp.handleStart();

    expect(spy).not.toHaveBeenCalled();
  });

  test('ignores start timer text if already running', () => {
    const timerText = new TimerText(TIMER_TEXT_SELECTOR, 5);
    const spy = jest.spyOn(window, 'setInterval');
    timerText.intervalId = true;

    timerText.start();

    expect(spy).not.toHaveBeenCalled();
  });

  test('ignores set timer text if already running', () => {
    const timerText = new TimerText(TIMER_TEXT_SELECTOR, 5);
    timerText.intervalId = true;

    timerText.setTime(10);

    expect(timerText).toHaveProperty('time', 5);
  });
});

describe('pomo counting', () => {
  test('increments pomo count after short break', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime((SEC_05 + SEC_03) * 1000);
    
    expect(timerApp).toHaveProperty('numPomodoros', 1);
  });

  test('increments pomo count after long break', () => {
    const timerApp = new TimerApp();
    timerApp.currentPhase = PHASE_LONG_BREAK;

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_05 * 1000);
    
    expect(timerApp).toHaveProperty('numPomodoros', 1);
  });

  test('increments pomo count when end during short break', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime((SEC_05 + SEC_01) * 1000);
    timerApp.handleEnd(true);
    
    expect(timerApp).toHaveProperty('numPomodoros', 1);
  });

  test('increments pomo count when end during long break', () => {
    const timerApp = new TimerApp();
    timerApp.currentPhase = PHASE_LONG_BREAK;

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_01 * 1000);
    timerApp.handleEnd(true);
    
    expect(timerApp).toHaveProperty('numPomodoros', 1);
  });

  test('does not increment pomo count when end during pomo', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_01 * 1000);
    timerApp.handleEnd(true);
    
    expect(timerApp).toHaveProperty('numPomodoros', 0);
  });
});

describe('timer buttons', () => {
  test('start button starts timer', () => {
    const timerApp = new TimerApp();
    const timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
    const spy = jest.spyOn(timerApp, 'handleStart');

    timerButton.click();

    expect(spy).toHaveBeenCalled();
  });

  test('end button restarts timer after confirmed', () => {
    const timerApp = new TimerApp();
    const timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
    const spy = jest.spyOn(timerApp, 'handleEnd');
    window.confirm = jest.fn(() => true)
    
    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_01 * 1000);
    timerButton.click();

    expect(spy).toHaveBeenCalled();
    expect(timerApp).toHaveProperty('currentPhase', 'pomodoro');
  });

  test('end button does not restart timer after cancelled', () => {
    const timerApp = new TimerApp();
    const timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
    const spy = jest.spyOn(timerApp, 'handleEnd');
    window.confirm = jest.fn(() => false)
    
    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_01 * 1000);
    timerButton.click();

    expect(spy).not.toHaveBeenCalled();
    expect(timerApp).toHaveProperty('currentPhase', 'pomodoro');
  });

  test('reset button resets pomo count after confirmed', () => {
    const timerApp = new TimerApp();
    const resetButton = document.querySelector('#timer-reset-button');
    const spy = jest.spyOn(timerApp, 'resetPomodoros');
    timerApp.numPomodoros = 3;
    window.confirm = jest.fn(() => true)

    resetButton.click();

    expect(spy).toHaveBeenCalled();
    expect(timerApp).toHaveProperty('numPomodoros', 0);
  });

  test('reset button does not reset pomo count after cancelled', () => {
    const timerApp = new TimerApp();
    const resetButton = document.querySelector('#timer-reset-button');
    const spy = jest.spyOn(timerApp, 'resetPomodoros');
    timerApp.numPomodoros = 3;
    window.confirm = jest.fn(() => false)

    resetButton.click();

    expect(spy).not.toHaveBeenCalled();
    expect(timerApp).toHaveProperty('numPomodoros', 3);
  });

  test('reset button resets timer after confirmed', () => {
    const timerApp = new TimerApp();
    const resetButton = document.querySelector('#timer-reset-button');
    window.confirm = jest.fn(() => true)
    
    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_01 * 1000);
    resetButton.click();

    expect(timerApp.timerText).toHaveProperty('time', SEC_05);
  });

  test('reset button does not reset timer after cancelled', () => {
    const timerApp = new TimerApp();
    const resetButton = document.querySelector('#timer-reset-button');
    window.confirm = jest.fn(() => false)
    
    timerApp.handleStart();
    jest.advanceTimersByTime(SEC_01 * 1000);
    resetButton.click();

    expect(timerApp.timerText).toHaveProperty('time', 4);
  });
});

describe('progress bar', () => {
  test('starts progress bar at pomo', () => {
    const infoProgress = new TimerInfoProgress(TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);
    const workProgressElement = document.querySelector(TIMER_INFO_WORK_PROGRESS_SELECTOR);

    infoProgress.startProgress(PHASE_POMODORO, 5);

    expect(infoProgress).toHaveProperty('currentProgressBarElement', workProgressElement);
  });

  test('starts progress bar at short break ', () => {
    const infoProgress = new TimerInfoProgress(TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);
    const breakProgressElement = document.querySelector(TIMER_INFO_BREAK_PROGRESS_SELECTOR);

    infoProgress.startProgress(PHASE_SHORT_BREAK, 5);

    expect(infoProgress).toHaveProperty('currentProgressBarElement', breakProgressElement);
  });

  test('starts progress bar at long break ', () => {
    const infoProgress = new TimerInfoProgress(TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);
    const breakProgressElement = document.querySelector(TIMER_INFO_BREAK_PROGRESS_SELECTOR);

    infoProgress.startProgress(PHASE_LONG_BREAK, 5);

    expect(infoProgress).toHaveProperty('currentProgressBarElement', breakProgressElement);
  });

  test('updates progress bar', () => {
    const infoProgress = new TimerInfoProgress(TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);

    infoProgress.updateProgress();

    expect(infoProgress.currentProgressBarElement).toHaveProperty('value', ((60 * 25) - (60 * 25 - 1))/(60 * 25));
  });

  test('stops progress bar', () => {
    const infoProgress = new TimerInfoProgress(TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);

    infoProgress.stopProgress();

    expect(infoProgress).toHaveProperty('intervalId', null);
  });

  test('clears progress bar', () => {
    const infoProgress = new TimerInfoProgress(TIMER_INFO_WORK_PROGRESS_SELECTOR,
      TIMER_INFO_BREAK_PROGRESS_SELECTOR, TIMER_INFO_SESSIONS_REMAINING_SELECTOR);
    const workProgressElement = document.querySelector(TIMER_INFO_WORK_PROGRESS_SELECTOR);
    const breakProgressElement = document.querySelector(TIMER_INFO_BREAK_PROGRESS_SELECTOR);
    
    infoProgress.clearProgress();

    expect(workProgressElement).toHaveProperty('value', 0);
    expect(breakProgressElement).toHaveProperty('value', 0);
  });
 });

describe('settings', () => {
  test('settings button opens settings', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    const settingsButton = document.querySelector('#timer-settings-button');

    settingsButton.click();

    expect(getComputedStyle(settings.element)).toHaveProperty('visibility', 'visible');
  });

  test('close button closes settings', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    const closeButton = document.querySelector('#timer-settings-close');

    closeButton.click();

    expect(getComputedStyle(settings.element)).toHaveProperty('visibility', 'hidden');
  });

  test('save button triggers update', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    const saveButton = document.querySelector('#timer-settings-save');
    const spy = jest.spyOn(settings, 'updateSettings');

    saveButton.click();

    expect(spy).toHaveBeenCalled();
  });

  test('save button updates settings', () => {
    const timerApp = new TimerApp();
    const saveButton = document.querySelector('#timer-settings-save');
    document.querySelector(POMO_NUMBER_SELECTOR).value = 50;
    document.querySelector(POMO_LENGTH_NUMBER_SELECTOR).value = 20;
    document.querySelector(SHORT_BREAK_NUMBER_SELECTOR).value = 10;
    document.querySelector(LONG_BREAK_NUMBER_SELECTOR).value = 30;

    saveButton.click();

    expect(timerApp).toHaveProperty('pomodoroLimit', '50');
    expect(timerApp.pomodoroTimes).toMatchObject({
      pomodoro: 1200,
      shortBreak: 600,
      longBreak: 1800
    })
  });

  test('error thrown when pomo text input outside of range', () => {
    const settingsForm = document.querySelector('#timer-settings-form');

    document.querySelector(POMO_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();

    document.querySelector(POMO_NUMBER_SELECTOR).value = 30;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();
  });

  test('error thrown when pomo length text input outside of range', () => {
    const settingsForm = document.querySelector('#timer-settings-form');

    document.querySelector(POMO_LENGTH_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();

    document.querySelector(POMO_LENGTH_NUMBER_SELECTOR).value = 150;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();
  });

  test('error thrown when short break text input outside of range', () => {
    const settingsForm = document.querySelector('#timer-settings-form');

    document.querySelector(SHORT_BREAK_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();

    document.querySelector(SHORT_BREAK_NUMBER_SELECTOR).value = 30;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();
  });

  test('error thrown when long break text input outside of range', () => {
    const settingsForm = document.querySelector('#timer-settings-form');

    document.querySelector(LONG_BREAK_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();

    document.querySelector(LONG_BREAK_NUMBER_SELECTOR).value = 100;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(document.querySelector('input:invalid'))).toBeTruthy();
  });

  test('pomo text input changes slider pomo value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.pomoNumber.value = 10;

    settings.pomoNumber.dispatchEvent(new Event('input'));

    expect(settings.pomoSlider).toHaveProperty('value', '10');
  });

  test('pomo slider input changes pomo text value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.pomoSlider.value = 10;

    settings.pomoSlider.dispatchEvent(new Event('input'));

    expect(settings.pomoNumber).toHaveProperty('value', '10');
  });

  test('pomo length text input changes slider pomo length value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.pomoLengthNumber.value = 15;

    settings.pomoLengthNumber.dispatchEvent(new Event('input'));

    expect(settings.pomoLengthSlider).toHaveProperty('value', '15');
  });

  test('pomo slider input changes pomo text value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.pomoLengthSlider.value = 15;

    settings.pomoLengthSlider.dispatchEvent(new Event('input'));

    expect(settings.pomoLengthNumber).toHaveProperty('value', '15');
  });

  test('short break text input changes slider short break value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.shortBreakNumber.value = 20;

    settings.shortBreakNumber.dispatchEvent(new Event('input'));

    expect(settings.shortBreakSlider).toHaveProperty('value', '20');
  });

  test('short break slider input changes short break text value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.shortBreakSlider.value = 20;

    settings.shortBreakSlider.dispatchEvent(new Event('input'));

    expect(settings.shortBreakNumber).toHaveProperty('value', '20');
  });

  test('long break text input changes slider long break value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.longBreakNumber.value = 50;

    settings.longBreakNumber.dispatchEvent(new Event('input'));

    expect(settings.longBreakSlider).toHaveProperty('value', '50');
  });

  test('long break slider input changes long break text value', () => {
    const settings = new TimerSettings(TIMER_SETTINGS_SELECTOR);
    settings.longBreakSlider.value = 50;

    settings.longBreakSlider.dispatchEvent(new Event('input'));

    expect(settings.longBreakNumber).toHaveProperty('value', '50');
  });
});

test('initializes timer page', () => {
  const timerApp = new TimerApp();

  expect(TimerText).toBeTruthy();
  expect(TimerSettings).toBeTruthy();
  expect(TimerSplash).toBeTruthy();
  expect(TimerInfoProgress).toBeTruthy();
  expect(TimerApp).toBeTruthy();

  expect(timerApp.timerButton.element).toHaveProperty('textContent', 'START');
  expect(timerApp.timerText.element).toHaveProperty('textContent', '00:05');
  expect(timerApp.timerInfo.sessionsInfo.element).toHaveProperty('textContent', '0');
  expect(timerApp.timerInfo.progressInfo.workProgressElement).toHaveProperty('value', 0);
  expect(timerApp.timerInfo.progressInfo.breakProgressElement).toHaveProperty('value', 0);
});

test('updates timer page', () => {
  const timerApp = new TimerApp();

  timerApp.toggleTimer();
  jest.advanceTimersByTime(SEC_01 * 1000);

  expect(timerApp.timerButton.element).toHaveProperty('textContent', 'END');
  expect(timerApp.timerText.element).toHaveProperty('textContent', '00:04');
  expect(timerApp.timerInfo.sessionsInfo.element).toHaveProperty('textContent', '0');
  expect(timerApp.timerInfo.progressInfo.workProgressElement).toHaveProperty('value', 0.2);
  expect(timerApp.timerInfo.progressInfo.breakProgressElement).toHaveProperty('value', 0);

  jest.advanceTimersByTime(SEC_05 * 1000);

  expect(timerApp.timerButton.element).toHaveProperty('textContent', 'END');
  expect(timerApp.timerText.element).toHaveProperty('textContent', '00:02');
  expect(timerApp.timerInfo.sessionsInfo.element).toHaveProperty('textContent', '0');
  expect(timerApp.timerInfo.progressInfo.workProgressElement).toHaveProperty('value', 1);
  expect(timerApp.timerInfo.progressInfo.breakProgressElement).toHaveProperty('value', (1/3));

  jest.advanceTimersByTime(2 * 1000);

  expect(timerApp.timerButton.element).toHaveProperty('textContent', 'START');
  expect(timerApp.timerText.element).toHaveProperty('textContent', '00:05');
  expect(timerApp.timerInfo.sessionsInfo.element).toHaveProperty('textContent', '1');
  expect(timerApp.timerInfo.progressInfo.workProgressElement).toHaveProperty('value', 1);
  expect(timerApp.timerInfo.progressInfo.breakProgressElement).toHaveProperty('value', 1);
});