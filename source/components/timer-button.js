class TimerButton extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    let button = document.createElement('button');
    button.textContent = this.getAttribute('data-text');

    let style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = './styles/timer-button.css';

    button.addEventListener('click', () => {
      this.dispatchEvent(new Event('buttonPressed'));
    });

    this.shadowRoot.append(button, style);
  }

  static get observedAttributes() {
    return ['data-text'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.shadowRoot.firstChild.textContent = this.getAttribute(name);
    }
  }
}
customElements.define('timer-button', TimerButton);
