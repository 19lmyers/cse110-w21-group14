class ConfirmDialog extends HTMLElement {
  constructor() {
    super();

    const template = document.querySelector('#confirm-dialog-template').content;

    this.attachShadow({mode: 'open'}).appendChild(template.cloneNode(true));

    let shadow = this.shadowRoot;

    // Initialize event handlers
    this.cancelHandler = null;
    this.confirmHandler = null;
  }

  /**
   * Sets the action to trigger if the cancel button is pressed.
   * @param {function} action is the cancel action.
   */
  set cancelAction(action) {
    let cancelButton = this.shadowRoot.querySelector('.cancel-button');
    if (this.cancelHandler !== null) {
      cancelButton.removeEventListener('click', this.cancelHandler);
    }

    this.cancelHandler = () => {
      action();
      cancelButton.removeEventListener('click', this.cancelHandler);
      this.remove();
    }

    cancelButton.addEventListener('click', this.cancelHandler);
  }

  /**
   * Sets the action to trigger if the confirm button is pressed.
   * @param {function} action is the confirm action.
   */
  set confirmAction(action) {
    let confirmButton = this.shadowRoot.querySelector('.confirm-button');
    if (this.confirmHandler !== null) {
      confirmButton.removeEventListener('click', this.confirmHandler);
    }

    this.confirmHandler = () => {
      action();
      confirmButton.removeEventListener('click', this.confirmHandler);
      this.remove();
    }

    confirmButton.addEventListener('click', this.confirmHandler);
  }
}

customElements.define('confirm-dialog', ConfirmDialog);

module.exports = ConfirmDialog;