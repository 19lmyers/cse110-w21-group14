class TimerButton extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    // Create button
    const button = document.createElement('button');
    // CSS styling
    const style = document.createElement('style');
    style.textContent = ''; // TODO

    this.shadowRoot.append(style, button);
  }

  connectedCallback() {
    const button = this.shadowRoot.querySelector('button');

    button.addEventListener('click', this.toggleTimer);
  }

  toggleTimer() {
    // TODO: Trigger custom event that propogates into light DOM,
    //       Fetch state of timer either from app or as internal state
  }

}

customElements.define('timer-button', TimerButton);