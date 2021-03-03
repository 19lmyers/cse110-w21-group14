class ConfirmDialog extends HTMLElement {
  constructor() {
    super();

    const template = document.querySelector('#confirm-dialog-template').content;

    const shadowRoot = this.attachShadow({mode: 'open'})
      .appendChild(template.cloneNode(true));

    let shadow = this.shadowRoot;

    shadow.querySelector('.confirm-button').addEventListener('click', () => {
      this.dispatchEvent(new Event('confirmPressed'));
      this.remove();
    });

    shadow.querySelector('.cancel-button').addEventListener('click', () => {
      this.dispatchEvent(new Event('cancelPressed'));
      this.remove();
    });
  }
}

customElements.define('confirm-dialog', ConfirmDialog);
