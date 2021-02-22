class TimerSettings extends HTMLElement {

    constructor() {
        console.log("settings");
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

pomoNumber.addEventListener("input", function(){ updateSlider(pomoNumber,pomoSlider); });
pomoSlider.addEventListener("input", function(){ updateSlider(pomoSlider, pomoNumber); });

pomoLengthNumber.addEventListener("input", function(){ updateSlider(pomoLengthNumber, pomoLengthSlider); });
pomoLengthSlider.addEventListener("input", function(){ updateSlider(pomoLengthSlider, pomoLengthNumber); });

shortBreakNumber.addEventListener("input", function(){ updateSlider(shortBreakNumber, shortBreakSlider); });
shortBreakSlider.addEventListener("input", function(){ updateSlider(shortBreakSlider, shortBreakNumber); });

longBreakNumber.addEventListener("input", function(){ updateSlider(longBreakNumber, longBreakSlider); });
longBreakSlider.addEventListener("input", function(){ updateSlider(longBreakSlider, longBreakNumber); });

/**
 * Will update a number to match the value on a slider or vice versa depending on the order of parameters
 * @param {*} updated is the number or slider that the user manually updated
 * @param {*} toUpdate the number or slider that should be updated to match
 */
function updateSlider(updated, toUpdate){
    const newValue = updated.value;
    toUpdate.value = newValue;
}