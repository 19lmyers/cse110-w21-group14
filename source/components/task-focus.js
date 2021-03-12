class TaskFocus extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});

    let focus = document.createElement('div');

    let prompt = document.createElement('label');
    prompt.setAttribute('for', 'focus-input');
    prompt.textContent = 'What is your focus?';
    focus.appendChild(prompt);

    let input = document.createElement('input');
    input.setAttribute('id', 'focus-input');
    input.setAttribute('name', 'focus-input');
    input.setAttribute('maxLength', '24');
    focus.appendChild(input);

    let style = document.createElement('style');
    style.innerHTML = `
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    label {
      margin-bottom: 1rem;
      font-size: 1.5rem;
      color: #FFFCF4;
    }
    input {
      background-color: transparent;
      font-family: inherit;
      font-size: 1.5rem;
      text-align: center;
      border: none;
      border-bottom: 2px solid white;
      outline: 0;
      color: #FFFCF4;
    }`;

    this.shadowRoot.append(focus, style);
  }
}

customElements.define('task-focus', TaskFocus);
