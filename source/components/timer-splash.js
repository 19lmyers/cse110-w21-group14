class TimerSplash extends HTMLElement {

    constructor(splashSelector, splashButtonSelector) {
        super();

        this.attachShadow({mode: 'open'});

        let div = document.createElement('div');
        div.setAttribute('id', 'timer-splash');

        const pomoTitle = document.createElement('h1');
        pomoTitle.textContent = 'POMODORO';
        div.appendChild(pomoTitle);

        let button = document.createElement('button');
        button.setAttribute('id', 'timer-splash-button');
        button.textContent = 'ENTER';
        div.appendChild(button);

        let style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('href', 'styles/timer-splash.css');

        button.addEventListener('click', this.close());

        this.shadowRoot.append(div, style);

        this.show();
        
    }

    /**
     * function to set timer-splash to visible
     */
    show() {
        console.log("show");
        this.shadowRoot.querySelector('div').style.visibility = 'visible';
    }


    /**
     * functin to hide timer-splash
     */
    close() {
        console.log("close");
        this.shadowRoot.querySelector('div').style.visibility = 'hidden';
    }
}

customElements.define('timer-splash', TimerSplash);