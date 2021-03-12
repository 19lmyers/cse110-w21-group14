class TimerSplash extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    let div = document.createElement('div');
    div.setAttribute('id', 'timer-splash');

    const pomoTitle = document.createElement('h1');
    pomoTitle.textContent = 'POMODORO';
    div.appendChild(pomoTitle);

    const button = document.createElement('button');
    button.setAttribute('id', 'timer-splash-button');
    button.textContent = 'ENTER';
    div.appendChild(button);

    const style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'styles/timer-splash.css');

    button.addEventListener('click', this.close.bind(this));

    this.shadowRoot.append(div, style);

    this.show();

  }

  /**
   * function to set timer-splash to visible
   */
  show() {
    this.style.visibility = 'visible';
  }


  /**
   * function to hide timer-splash
   */
  close() {
    this.style.visibility = 'hidden';
  }
}

customElements.define('timer-splash', TimerSplash);

module.exports = TimerSplash;
