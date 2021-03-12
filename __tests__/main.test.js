const ConfirmDialog = require('../source/components/confirm-dialog.js');
const TimerButton = require('../source/components/timer-button.js');
const TimerProgress = require('../source/components/timer-progress.js');
const TimerSettings = require('../source/components/timer-settings.js');
const TimerSplash = require('../source/components/timer-splash.js');
const TimerText = require('../source/components/timer-text.js');
const {
  MIN_05,
  MIN_15,
  MIN_25,
  SETTINGS_BUTTON_SELECTOR,
  PHASE_POMODORO,
  PHASE_SHORT_BREAK,
  PHASE_LONG_BREAK,
  TIMER_COMPLETE_SOUND,
  BUTTON_SOUND,
  STATUS_RUNNING,
  TimerApp,
  TaskList,
  FocusTask,
  Task
} = require('../source/scripts/main.js');

beforeEach(() => {
  window.HTMLMediaElement.prototype.play = () => {};

  document.body.innerHTML =
    '<timer-splash></timer-splash>' +
    '<section id="timer-app">' +
      '<timer-text></timer-text>' +
      '<timer-button class="tactile-button"></timer-button>' +
    '</section>' +
    '<section id="timer-info">' +
      '<div id="focus-task-container"></div>' +
      '<timer-progress></timer-progress>' +
    '</section>' +
    '<audio id="pomo-complete-sound" src="assets/singing-bowl-sound.wav"></audio>' +
    '<audio id="button-sound" src="assets/button-sound.wav"></audio>' +
    '<button id="task-button"><img src="assets/task-button.svg" alt="Task List Button"></button>' +
    '<div id="task-list"></div>' +
    '<button id="settings-button" type="button" class="tactile-button">' +
      '<img src="assets/settings-icon.svg" alt="Settings Button">' +
    '</button>' +
    '<timer-settings></timer-settings>' +
    '<template id="confirm-dialog-template">' +
      '<div class="dialog">' +
        '<div class="dialog-content">' +
            '<button class="cancel-button">Cancel</button>' +
            '<button class="confirm-button">' + 
              '<slot name="confirm-button-text">Confirm</slot>' +
            '</button>' +
        '</div>' +
      '</div>' +
    '</template>';

  jest.useFakeTimers();
});

describe('splash screen', () => {
  test('loads timer splash screen and app', () => {
    window.dispatchEvent(new Event('DOMContentLoaded'));

    expect(TimerSplash).toBeTruthy();
    expect(TimerApp).toBeTruthy();
  });

  test('enter button closes splash screen', () => {
    const timerSplash = new TimerSplash();

    timerSplash.shadowRoot.querySelector('#timer-splash-button').click();

    expect(getComputedStyle(timerSplash)).toHaveProperty('visibility', 'hidden');
  });
});

describe('timer app', () => {
  test('wait 25 minutes before ending pomo', () => {
    const timerApp = new TimerApp();
    
    timerApp.handleStart();

    expect(setTimeout).toHaveBeenCalled();
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), MIN_25 * 1000, false);
  });

  test('warns before leaving app', () => {
    const event = new Event('beforeunload');
    Object.assign(event, {preventDefault: jest.fn()});

    window.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});

describe('pomo cycle', () => {
  test('schedules short break after pomo', () => {
    const timerApp = new TimerApp();  

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_25 * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_SHORT_BREAK);
  });

  test('schedules pomo after short break', () => {
    const timerApp = new TimerApp();
    
    timerApp.handleStart();
    jest.advanceTimersByTime((MIN_25 + MIN_05) * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_POMODORO);
  });

  test('schedules long break after 4 cycles', () => {
    const timerApp = new TimerApp(); 
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_25 * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_LONG_BREAK);
  });

  test('schedules pomo after long break', () => {
    const timerApp = new TimerApp(); 
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime((MIN_25 + MIN_15) * 1000);
    
    expect(timerApp).toHaveProperty('currentPhase', PHASE_POMODORO);
  });
});

describe('timer text', () => {
  test('timer text displays pomo time', () => {
    const timerApp = new TimerApp();

    expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '25');
    expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  });

  test('timer text displays short break time', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_25 * 1000);

    expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '05');
    expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  });

  test('timer text displays long break time', () => {
    const timerApp = new TimerApp();
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_25 * 1000);

    expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '15');
    expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  });

  test('timer text handles negative time', () => {
    const timerText = new TimerText();
    timerText.setTime(-MIN_25);

    expect(timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '25');
    expect(timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  });

  test('timer text starts time', () => {
    const timerText = new TimerText();
    timerText.setTime(MIN_25);

    timerText.start();

    expect(setInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });

  test('timer text updates time', () => {
    const timerText = new TimerText();
    timerText.setTime(MIN_25);

    timerText._update();

    expect(timerText).toHaveProperty('time', MIN_25 - 1);
  });

  test('timer text ends timer', () => {
    const timerText = new TimerText();
    timerText.setTime(MIN_25);

    timerText.stop();

    expect(timerText).toHaveProperty('intervalId', null);
  });

  test('ignores start timer if already running', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp.timerText, 'start');
    timerApp.currentStatus = STATUS_RUNNING;

    timerApp.handleStart();

    expect(spy).not.toHaveBeenCalled();
  });

  test('ignores start timer text if already running', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(window, 'setInterval');
    timerApp.timerText.intervalId = true;

    timerApp.timerText.start();

    expect(spy).not.toHaveBeenCalled();
  });

  test('ignores set timer text if already running', () => {
    const timerApp = new TimerApp();
    timerApp.timerText.intervalId = true;

    timerApp.timerText.setTime(MIN_15);

    expect(timerApp.timerText).toHaveProperty('time', MIN_25);
  });
});

describe('pomo counting', () => {
  test('increments pomo count after short break', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime((MIN_25 + MIN_05) * 1000);
    
    expect(timerApp).toHaveProperty('numPomodoros', 1);
  });

  test('increments pomo count after long break', () => {
    const timerApp = new TimerApp();
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime((MIN_25 + MIN_15) * 1000);
    
    expect(timerApp).toHaveProperty('numPomodoros', 4);
  });

  test('increments pomo count when end during short break', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime((MIN_25 + 1) * 1000);
    timerApp.handleEnd(true);
    
    expect(timerApp).toHaveProperty('numPomodoros', 1);
  });

  test('increments pomo count when end during long break', () => {
    const timerApp = new TimerApp();
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime((MIN_25 + MIN_15 + 1) * 1000);
    timerApp.handleEnd(true);
    
    expect(timerApp).toHaveProperty('numPomodoros', 4);
  });

  test('does not increment pomo count when end during pomo', () => {
    const timerApp = new TimerApp();

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_05 * 1000);
    timerApp.handleEnd(true);
    
    expect(timerApp).toHaveProperty('numPomodoros', 0);
  });
});

describe('timer buttons', () => {
  test('start button starts timer', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp, 'handleStart');

    timerApp.timerButton.shadowRoot.firstChild.click();

    expect(spy).toHaveBeenCalled();
  });

  test('end button pauses timer and triggers confirmation', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp, 'confirmEnd');
    
    timerApp.handleStart();
    timerApp.timerButton.shadowRoot.firstChild.click();

    expect(clearTimeout).toHaveBeenCalled();
    expect(spy).toHaveBeenCalled();
  });

  test('removes previous button action before setting new one', () => {
    const timerButton = new TimerButton();
    const spy = jest.spyOn(timerButton.shadowRoot.firstChild, 'removeEventListener');
    timerButton.clickHandler = jest.fn();

    timerButton.buttonAction = jest.fn();

    expect(spy).toHaveBeenCalled();
  });
});

describe('progress bar', () => {
  test('starts progress bar at pomo', () => {
    const timerProgress = new TimerProgress();
    const pomodoroDot = timerProgress.shadowRoot.querySelector('#progress-pomodoro .progress-dot');

    timerProgress.start(PHASE_POMODORO);

    expect(timerProgress).toHaveProperty('currentProgressBarElement', timerProgress.pomodoroProgress);
    expect(pomodoroDot.classList).toContain('complete');
  });

  test('starts progress bar at short break', () => {
    const timerProgress = new TimerProgress();
    const breakDot = timerProgress.shadowRoot.querySelector('#progress-break .progress-dot');

    timerProgress.start(PHASE_SHORT_BREAK);

    expect(timerProgress).toHaveProperty('currentProgressBarElement', timerProgress.breakProgress);
    expect(breakDot.classList).toContain('complete');
  });

  test('starts progress bar at long break', () => {
    const timerProgress = new TimerProgress();
    const breakDot = timerProgress.shadowRoot.querySelector('#progress-break .progress-dot');

    timerProgress.start(PHASE_LONG_BREAK);

    expect(timerProgress).toHaveProperty('currentProgressBarElement', timerProgress.breakProgress);
    expect(breakDot.classList).toContain('complete');
  });

  test('ignores start progress bar if already running', () => {
    const timerProgress = new TimerProgress();
    timerProgress.intervalId = true;

    timerProgress.start(PHASE_SHORT_BREAK);

    expect(timerProgress).toHaveProperty('currentProgressBarElement', timerProgress.pomodoroProgress);
  });

  test('updates progress bar', () => {
    const timerProgress = new TimerProgress();

    timerProgress._update();

    expect(timerProgress.currentProgressBarElement).toHaveProperty('value', 1);
  });

  test('stops progress bar', () => {
    const timerProgress = new TimerProgress();
    const doneDot = timerProgress.shadowRoot.querySelector('#progress-done .progress-dot');
    timerProgress.currentProgressBarElement = timerProgress.breakProgress;

    timerProgress.stop();

    expect(timerProgress).toHaveProperty('intervalId', null);
    expect(doneDot.classList).toContain('complete');
  });

  test('clears progress bar', () => {
    const timerProgress = new TimerProgress();
    
    timerProgress.clear();

    expect(timerProgress.pomodoroProgress).toHaveProperty('value', 0);
    expect(timerProgress.breakProgress).toHaveProperty('value', 0);
    expect(timerProgress._pomodoroDot).not.toBeTruthy();
    expect(timerProgress._breakDot).not.toBeTruthy();
    expect(timerProgress._doneDot).not.toBeTruthy();
  });

  test('progress bar text changes from short break to long break', () => {
    const timerApp = new TimerApp();
    const timerProgressText = timerApp.timerProgress.shadowRoot.querySelector('#progress-break p');
    timerApp.numPomodoros = 3;

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_25 * 1000);

    expect(timerProgressText).toHaveProperty('textContent', 'Long Break');
  });
 });

 describe('confirmation cards', () => {
  test('confirmation ends pomo session', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp, 'handleEnd');
    timerApp.confirmEnd(true);
    const confirmDialog = document.querySelector('confirm-dialog');
    const confirmButton = confirmDialog.shadowRoot.querySelector('.confirm-button');
  
    confirmButton.click();

    expect(spy).toHaveBeenCalled;
  });

  test('cancellation continue pomo session', () => {
    const timerApp = new TimerApp();
    const spy = jest.spyOn(timerApp, 'handleContinue');
    timerApp.confirmEnd(true);

    const confirmDialog = document.querySelector('confirm-dialog');
    const cancelButton = confirmDialog.shadowRoot.querySelector('.cancel-button');
    
    cancelButton.click();

    expect(spy).toHaveBeenCalled();
  });

  test('ignores continue timer if timer already running', () => {
    const timerApp = new TimerApp();
    timerApp.currentStatus = STATUS_RUNNING;
  
    timerApp.handleContinue();
    
    expect(setTimeout).not.toHaveBeenCalled;
  });

  test('removes previous confirm action before setting new one', () => {
    const confirmDialog = new ConfirmDialog();
    const spy = jest.spyOn(confirmDialog.shadowRoot.querySelector('.confirm-button'), 'removeEventListener');
    confirmDialog.confirmHandler = jest.fn();

    confirmDialog.confirmAction = jest.fn()
    
    expect(spy).toHaveBeenCalled();
  });

  test('removes previous cancel action before setting new one', () => {
    const confirmDialog = new ConfirmDialog();
    const spy = jest.spyOn(confirmDialog.shadowRoot.querySelector('.cancel-button'), 'removeEventListener');
    confirmDialog.cancelHandler = jest.fn();

    confirmDialog.cancelAction = jest.fn()
    
    expect(spy).toHaveBeenCalled();
  });
 })

describe('settings', () => {
  test('settings button opens settings', () => {
    const settings = new TimerSettings();
    const settingsButton = document.querySelector(SETTINGS_BUTTON_SELECTOR);

    settingsButton.click();

    expect(getComputedStyle(settings.shadowRoot.querySelector('.dialog'))).toHaveProperty('visibility', 'visible');
  });

  test('close button closes settings', () => {
    const settings = new TimerSettings();
    const closeButton = settings.shadowRoot.querySelector('.close-button');

    closeButton.click();

    expect(getComputedStyle(settings.shadowRoot.querySelector('.dialog'))).toHaveProperty('visibility', 'hidden');
  });

  test('save button updates settings', () => {
    const timerApp = new TimerApp();
    const saveButton = timerApp.timerSettings.shadowRoot.querySelector('.save-button');
    timerApp.timerSettings.pomoLengthNumber.value = 20;
    timerApp.timerSettings.shortBreakNumber.value = 10;
    timerApp.timerSettings.longBreakNumber.value = 30;

    saveButton.click();

    expect(timerApp.pomodoroTimes).toMatchObject({
      pomodoro: 60 * 20,
      shortBreak: 60 * 10,
      longBreak: 60 * 30
    })
  });

  test('error thrown when pomo length text input outside of range', () => {
    const settings = new TimerSettings();
    const settingsForm = settings.shadowRoot.querySelector('#timer-settings-form');

    settings.shadowRoot.querySelector(POMO_LENGTH_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(settings.shadowRoot.querySelector('input:invalid'))).toBeTruthy();

    settings.shadowRoot.querySelector(POMO_LENGTH_NUMBER_SELECTOR).value = 150;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(settings.shadowRoot.querySelector('input:invalid'))).toBeTruthy();
  });

  test('error thrown when short break text input outside of range', () => {
    const settings = new TimerSettings();
    const settingsForm = settings.shadowRoot.querySelector('#timer-settings-form');

    settings.shadowRoot.querySelector(SHORT_BREAK_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(settings.shadowRoot.querySelector('input:invalid'))).toBeTruthy();

    settings.shadowRoot.querySelector(SHORT_BREAK_NUMBER_SELECTOR).value = 100;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(settings.shadowRoot.querySelector('input:invalid'))).toBeTruthy();
  });

  test('error thrown when long break text input outside of range', () => {
    const settings = new TimerSettings();
    const settingsForm = settings.shadowRoot.querySelector('#timer-settings-form');

    settings.shadowRoot.querySelector(LONG_BREAK_NUMBER_SELECTOR).value = -5;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(settings.shadowRoot.querySelector('input:invalid'))).toBeTruthy();

    settings.shadowRoot.querySelector(LONG_BREAK_NUMBER_SELECTOR).value = 100;
    settingsForm.dispatchEvent(new Event('submit'));
    expect(getComputedStyle(settings.shadowRoot.querySelector('input:invalid'))).toBeTruthy();
  });

  test('pomo length text input changes slider pomo length value', () => {
    const settings = new TimerSettings();
    settings.pomoLengthNumber.value = 15;

    settings.pomoLengthNumber.dispatchEvent(new Event('input'));

    expect(settings.pomoLengthSlider).toHaveProperty('value', '15');
  });

  test('pomo slider input changes pomo text value', () => {
    const settings = new TimerSettings();
    settings.pomoLengthSlider.value = 15;

    settings.pomoLengthSlider.dispatchEvent(new Event('input'));

    expect(settings.pomoLengthNumber).toHaveProperty('value', '15');
  });

  test('short break text input changes slider short break value', () => {
    const settings = new TimerSettings();
    settings.shortBreakNumber.value = 20;

    settings.shortBreakNumber.dispatchEvent(new Event('input'));

    expect(settings.shortBreakSlider).toHaveProperty('value', '20');
  });

  test('short break slider input changes short break text value', () => {
    const settings = new TimerSettings();
    settings.shortBreakSlider.value = 20;

    settings.shortBreakSlider.dispatchEvent(new Event('input'));

    expect(settings.shortBreakNumber).toHaveProperty('value', '20');
  });

  test('long break text input changes slider long break value', () => {
    const settings = new TimerSettings();
    settings.longBreakNumber.value = 50;

    settings.longBreakNumber.dispatchEvent(new Event('input'));

    expect(settings.longBreakSlider).toHaveProperty('value', '50');
  });

  test('long break slider input changes long break text value', () => {
    const settings = new TimerSettings();
    settings.longBreakSlider.value = 50;

    settings.longBreakSlider.dispatchEvent(new Event('input'));

    expect(settings.longBreakNumber).toHaveProperty('value', '50');
  });
});

describe('sounds', () => {
  test('plays button sound when settings button clicked', () => {
    const timerApp = new TimerApp();
    const settingsButton = document.querySelector(SETTINGS_BUTTON_SELECTOR);
    const spy = jest.spyOn(timerApp, 'playSound');

    settingsButton.click();

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(BUTTON_SOUND);
  });

  test('plays timer complete sound when pomo ends', () => {
    const timerApp = new TimerApp();  
    const spy = jest.spyOn(timerApp, 'playSound');

    timerApp.handleStart();
    jest.advanceTimersByTime(MIN_25 * 1000);

    expect(spy).toHaveBeenCalled();
    expect(spy).toHaveBeenLastCalledWith(TIMER_COMPLETE_SOUND);
  });

  test('sets sound to beginning if already playing', () => {
    const timerApp = new TimerApp();
    const soundElement = document.getElementById(BUTTON_SOUND);
    Object.defineProperty(HTMLMediaElement.prototype, "paused", {
      value: false,
    });
    
    soundElement.currentTime += 30;
    timerApp.playSound(BUTTON_SOUND);

    expect(soundElement).toHaveProperty('currentTime', 0);
  });
});

describe('task list', () => {
  test('task list button toggles task list', () => {
    const taskList = new TaskList('#task-button', '#task-list');

    taskList.taskButtonElement.click();
    expect(getComputedStyle(taskList.taskListContainerElement)).toHaveProperty('visibility', 'visible');

    taskList.taskButtonElement.click();
    expect(getComputedStyle(taskList.taskListContainerElement)).toHaveProperty('visibility', 'hidden');
  });

  test('creates new task', () => {
    const taskList = new TaskList('#task-button', '#task-list');

    taskList.createTask('CSE', 1);

    expect(Task).toBeTruthy();
  });

  test('add button adds new task', () => {
    const taskList = new TaskList('#task-button', '#task-list');
    const spy = jest.spyOn(taskList.notDoneTasksSection, 'appendChild');
    taskList.taskNameInput.value = 'CSE';
    taskList.taskPomoEstimateInput.value = 1;

    taskList.taskAddButton.click();

    expect(spy).toHaveBeenCalled();
  });

  test('checks task as done', () => {
    const task = new Task('CSE110', 1, 0, true);

    task.taskIsDone.dispatchEvent(new Event('input'));
    
    expect(task.taskContainerElement).toHaveProperty('className', 'task task-done');
  });

  test('checks focus task as done', () => {
    const focusTask = new FocusTask('#focus-task-container');
    const task = new Task('CSE110', 1, 0, true);
    task.taskContainerElement.setAttribute('focus', 'true');

    task.taskIsDone.dispatchEvent(new Event('input'));
    
    expect(focusTask.focusTaskIsDone.checked).toBeTruthy();
  });

  test('unchecks task as not done', () => {
    const task = new Task('CSE110', 1, 0, false);

    task.taskIsDone.dispatchEvent(new Event('input'));
    
    expect(task.taskContainerElement).toHaveProperty('className', 'task task-not-done');
  });

  test('edit button edits task', () => {
    const task = new Task('CSE110', 1, 0, false);
    const spy = jest.spyOn(task, 'editTask');

    task.taskEditButton.click();
    
    expect(spy).toHaveBeenCalled();
    expect(task.taskNameField.getAttribute('disabled')).not.toBeTruthy();
  });

  test('save button saves task', () => {
    const task = new Task('CSE110', 1, 0, false);
    const spy = jest.spyOn(task, 'editTask');
    task.taskEditButton.click();

    task.taskEditButton.click();
    
    expect(spy).toHaveBeenCalled();
    expect(task.taskNameField.getAttribute('disabled')).toBeTruthy();
  });

  test('delete button deletes task', () => {
    const task = new Task('CSE110', 1, 0, false);
    const focusTask = new Task('CSE112', 1, 0, false);
    const spy = jest.spyOn(task.taskContainerElement, 'remove');
    const spyFocus = jest.spyOn(focusTask.taskContainerElement, 'remove'); 
    focusTask.taskContainerElement.setAttribute('focus', 'true');

    task.taskRemoveButton.click();
    focusTask.taskRemoveButton.click();

    expect(spy).toHaveBeenCalled();
    expect(spyFocus).toHaveBeenCalled();
  });

  test('loads task list during initialization', () => {
    const spy = jest.spyOn(TaskList.prototype, 'loadTaskList');
    Storage.prototype.getItem = jest.fn(() => 
      '[{"name":"CSE110","pomoEstimate":1,"pomoActual":1,"isDone":true},\
      {"name":"CSE112","pomoEstimate":1,"pomoActual":1,"isDone":false}]');

    new TaskList('#task-button', '#task-list');

    expect(spy).toHaveBeenCalled();
  });

  test('stores task list before leaving app', () => {
    const event = new Event('beforeunload');
    const taskList = new TaskList('#task-button', '#task-list');
    const spy = jest.spyOn(taskList, 'storeTaskList');
    
    window.dispatchEvent(event);

    expect(spy).toHaveBeenCalled();
  });
});

describe('focus task', () => {
  test('clicking on focus task container without focus task toggles task list', () => {
    const focusTask = new FocusTask('#focus-task-container');
    const taskList = new TaskList('#task-button', '#task-list');
    const spy = jest.spyOn(taskList, 'toggleTaskList');
  
    focusTask.focusTaskContainer.click();

    expect(spy).toBeCalled();
  });

  test('clicking on focus task container with focus task does not toggle task list', () => {
    const focusTask = new FocusTask('#focus-task-container');
    const taskList = new TaskList('#task-button', '#task-list');
    const spy = jest.spyOn(taskList, 'toggleTaskList');
    const event = new Event('click');
    Object.defineProperty(event, 'target', {value: {className: 'focus-task'}});
  
    focusTask.focusTaskContainer.dispatchEvent(event);

    expect(spy).not.toBeCalled();
  });

  test('checks focus task as done and ends timer', () => {
    const focusTask = new FocusTask('#focus-task-container');
    const spyTask = jest.spyOn(focusTask, 'clearFocusTask');
    const timerApp = new TimerApp();
    const spyTimer = jest.spyOn(timerApp, 'handleEnd');
    const event = new Event('change');
    Object.defineProperty(event, 'target', {value: {checked: true, parentElement: {className: 'focus-task'}}});
  
    focusTask.focusTaskIsDone.dispatchEvent(event);

    expect(spyTask).toBeCalled();
    expect(spyTimer).toBeCalled();
  });

  test('ignores check without focus task', () => {
    const focusTask = new FocusTask('#focus-task-container');
    const spy = jest.spyOn(focusTask, 'clearFocusTask');
    const event = new Event('change');
    Object.defineProperty(event, 'target', {value: {checked: false, parentElement: {className: 'no-focus-task'}}});
  
    focusTask.focusTaskIsDone.dispatchEvent(event);

    expect(spy).not.toBeCalled();
  });
})

test('initializes timer page', () => {
  const timerApp = new TimerApp();

  expect(TimerButton).toBeTruthy();
  expect(TimerText).toBeTruthy();
  expect(TimerProgress).toBeTruthy();
  expect(TimerSettings).toBeTruthy();
  expect(TimerSplash).toBeTruthy();
  expect(TimerApp).toBeTruthy();
  expect(TaskList).toBeTruthy();
  expect(FocusTask).toBeTruthy();

  expect(timerApp.timerButton.shadowRoot.firstChild).toHaveProperty('textContent', 'START');
  expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '25');
  expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  expect(timerApp.timerProgress.pomodoroProgress).toHaveProperty('value', 0);
  expect(timerApp.timerProgress.breakProgress).toHaveProperty('value', 0);
});

test('updates timer page', () => {
  const timerApp = new TimerApp();
  const spy = jest.spyOn(timerApp, 'playSound');

  timerApp.timerButton.shadowRoot.firstChild.click();

  jest.advanceTimersByTime(MIN_05 * 1000);

  expect(timerApp.timerButton.shadowRoot.firstChild).toHaveProperty('textContent', 'END');
  expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '20');
  expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  expect(timerApp.timerProgress.pomodoroProgress).toHaveProperty('value', 60 * 5);
  expect(timerApp.timerProgress.breakProgress).toHaveProperty('value', 0);

  jest.advanceTimersByTime(60 * 22 * 1000);

  expect(spy).toHaveBeenCalled();
  expect(timerApp.timerButton.shadowRoot.firstChild).toHaveProperty('textContent', 'END');
  expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '03');
  expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  expect(timerApp.timerProgress.pomodoroProgress).toHaveProperty('value', 60 * 25);
  expect(timerApp.timerProgress.breakProgress).toHaveProperty('value', 60 * 2);

  jest.advanceTimersByTime(60 * 3 * 1000);

  expect(timerApp.timerButton.shadowRoot.firstChild).toHaveProperty('textContent', 'START');
  expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '25');
  expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
  expect(timerApp.timerProgress.pomodoroProgress).toHaveProperty('value', 60 * 25);
  expect(timerApp.timerProgress.breakProgress).toHaveProperty('value', 60 * 5);
});

test('changes timer page settings', () => { 
  const timerApp = new TimerApp();
  const saveButton = timerApp.timerSettings.shadowRoot.querySelector('.save-button');
    timerApp.timerSettings.pomoLengthNumber.value = 20;
    timerApp.timerSettings.shortBreakNumber.value = 10;
    timerApp.timerSettings.longBreakNumber.value = 30;

  saveButton.click();

  expect(timerApp.timerText.shadowRoot.querySelector('.minute')).toHaveProperty('textContent', '20');
  expect(timerApp.timerText.shadowRoot.querySelector('.second')).toHaveProperty('textContent', '00');
})