class TimerSettings extends HTMLElement {

    constructor() {
        super();

        this.attachShadow({ mode: 'open' });
        
    } /* constructor */
} 

const pomoNumber = document.getElementById("pomo-number");
const pomoSlider = document.getElementById("pomo-slider");

const pomoLengthNumber = document.getElementById("pomo-length-number");
const pomoLengthSlider = document.getElementById("pomo-length-slider");

const shortBreakNumber = document.getElementById("short-break-number");
const shortBreakSlider = document.getElementById("short-break-slider");

const longBreakNumber = document.getElementById("long-break-number");
const longBreakSlider = document.getElementById("long-break-slider");

pomoNumber.addEventListener("change", function(){ updateSlider(pomoNumber,pomoSlider); });
pomoSlider.addEventListener("change", function(){ updateSlider(pomoSlider, pomoNumber); });

pomoLengthNumber.addEventListener("change", function(){ updateSlider(pomoLengthNumber, pomoLengthSlider); });
pomoLengthSlider.addEventListener("change", function(){ updateSlider(pomoLengthSlider, pomoLengthNumber); });

shortBreakNumber.addEventListener("change", function(){ updateSlider(shortBreakNumber, shortBreakSlider); });
shortBreakSlider.addEventListener("change", function(){ updateSlider(shortBreakSlider, shortBreakNumber); });

longBreakNumber.addEventListener("change", function(){ updateSlider(longBreakNumber, longBreakSlider); });
longBreakSlider.addEventListener("change", function(){ updateSlider(longBreakSlider, longBreakNumber); });

/**
 * Will update a number to match the value on a slider or vice versa depending on the order of parameters
 * @param {*} updated is the number or slider that the user manually updated
 * @param {*} toUpdate the number or slider that should be updated to match
 */
function updateSlider(updated, toUpdate){
    const newValue = updated.value;
    toUpdate.value = newValue;
}