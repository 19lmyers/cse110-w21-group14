const {
  SEC_01,
  SEC_03,
  SEC_05,
  TIMER_BUTTON_SELECTOR,
  TimerApp
} = require('../source/js/main.js');

beforeEach(() => {
  document.body.innerHTML =
    '<div id="timer-splash">' +
      '<button id="timer-splash-button">ENTER</button>' + 
    '</div>' + 
    '<main>' +
      '<section id="timer-app">' +
          '<span id="timer-text">25:00</span>' +
          '<button id="timer-button">Start</button>' +
      '</section>' +
      '<section id="timer-info">' +
        '<p><span id="timer-info-session">0</span> Pomodoros completed</p>' +
        '<progress id="timer-info-progress"></progress>' +
      '</section>' +
    '</main>' +
    '<button id="timer-settings-button">Settings</button>' + 
    '<div id="timer-settings" class="dialog"></div>' + 
    '<button id="timer-settings-close" type="button">Close</button>';

    jest.useFakeTimers();
});

test('creates a new timer', () => {
  const timerApp = new TimerApp();

  expect(TimerApp).toBeTruthy();
  expect(timerApp.currentPhase).toBe('pomodoro');
});

test('timer button starts timer when stopped', () => {
  const timerApp = new TimerApp();
  const timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
  const spy = jest.spyOn(timerApp, 'handleStart');

  timerButton.click();

  expect(spy).toHaveBeenCalledTimes(1);
});

test('timer button ends timer when running', () => {
  const timerApp = new TimerApp();
  const timerButton = document.querySelector(TIMER_BUTTON_SELECTOR);
  const spy = jest.spyOn(timerApp, 'handleEnd');

  timerApp.currentStatus = 'running';
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
  
  expect(timerApp.currentPhase).toBe('shortBreak');
});

test('schedules pomo after short break', () => {
  const timerApp = new TimerApp();
  timerApp.handleStart();

  jest.advanceTimersByTime((SEC_05 + SEC_01) * 1000);
  
  expect(timerApp.currentPhase).toBe('pomodoro');
});

test('schedules long break after 4 cycles', () => {
  const timerApp = new TimerApp(); 
  timerApp.numPomodoros = 3;
  timerApp.handleStart();

  jest.advanceTimersByTime((SEC_05 + SEC_01) * 1000);
  
  expect(timerApp.currentPhase).toBe('longBreak');
});

test('schedules pomo after long break', () => {
  const timerApp = new TimerApp(); 
  timerApp.currentStatus = 'longbreak';
  timerApp.handleStart();

  jest.advanceTimersByTime(SEC_03 * 1000);
  
  expect(timerApp.currentPhase).toBe('pomodoro');
});

// test('restarts timer after premature ending', () => {
//   const timerApp = new TimerApp();
//   const spy = jest.spyOn(timerApp, 'handleEnd');
//   timerApp.numPomodoros = 2;
//   timerApp.handleStart();

//   jest.advanceTimersByTime(SEC_01 * 1000);

//   timerApp.toggleTimer();
  
//   expect(spy).toHaveBeenCalledTimes(1);
//   expect(spy).toHaveBeenLastCalledWith(true);

//   expect(timerApp.numPomodoros).toBe(0);
//   expect(timerApp.currentPhase).toBe('pomodoro');
// });
