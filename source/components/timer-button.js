class TimerButton extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    let button = document.createElement('button');
    button.textContent = 'START';

    let style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', 'styles/timer-button.css');

    // button.addEventListener('click', () => {
    //   this.dispatchEvent(new Event('buttonPressed'));
    // });

    this.shadowRoot.append(button, style);

    // Initialize event handler
    this.clickHandler = null;
  }

  /**
   * Sets the button's text.
   * @param {string} text is the text to set.
   */
  set buttonText(text) {
    this.shadowRoot.firstChild.textContent = text;
  }

  /**
   * Sets the button's action.
   * @param {function} action is the action to trigger on click.
   */
  set buttonAction(action) {
    let button = this.shadowRoot.firstChild;

    if (this.clickHandler !== null) {
      button.removeEventListener('click', this.clickHandler);
    }

    this.clickHandler = action;
    button.addEventListener('click', this.clickHandler);
  }
}

customElements.define('timer-button', TimerButton);

module.exports = TimerButton;
