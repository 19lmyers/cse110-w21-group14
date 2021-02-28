class TimerButton extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    let button = document.createElement('button');
    button.textContent = this.getAttribute('data-text');

    let style = document.createElement('style');
    // TODO: Import button styles
    style.innerHTML = `
      button {
        border: 0;
        outline: 0;
        -webkit-appearance: none;
        -moz-appearance: none;
        width: 177.35px;
        height: 63.34px;
        font-family: Montserrat;
        font-style: normal;
        font-weight: 500;
        font-size: 24px; 

        background: #FFFCF4;
        box-shadow: 0px 4px 4px #000000;
        border-radius: 30px;

        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        /*  font-family: "Montserrat";
        font-style: normal; */

        transition: background 250ms ease-in-out,
          transform 150ms ease;
        transition: box-shadow 250ms ease-in-out, transform 150ms ease;
      }

      button:hover {
        box-shadow: inset 0px 4px 4px rgba(0,0,0,0.5);
      }`;

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
