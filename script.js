// Variables
const MIN25 = 25;
const MIN5 = 5;
const MIN15 = 15;
const SECONDS = 60;
let time = 0;

// Assigning button clicks
var button25 = document.getElementById("work");
var button5 = document.getElementById("short");
var button15 = document.getElementById("long");

// Assign sound
var endSound = document.getElementById("endSound");

// Button functions when clicked
button25.onclick = function() {
    clearInterval(time);
    time = SECONDS * MIN25;
}

button5.onclick = function() {
    clearInterval(time);
    time = SECONDS * MIN5;
}

button15.onclick = function() {
    clearInterval(time);
    time = SECONDS * MIN15;
}

// Sets timer
const countdown = document.getElementById('timer');
setInterval(updateCountdown, 1000);

/* 
    Function: updateCountdown
    Parameters: None
    Returns: Nothing
    Description: Converts time to minutes and seconds and begins countdown.
                 Displays numbers to screen.
*/
function updateCountdown() {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;

    // Adds zero in front of single digit seconds
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    countdown.innerHTML = `${minutes}:${seconds}`;

    // Timer counting down
    time--;
    
    /* If time reaches 0, clock stops at 0:00 */
    if (time <= 0) {
        clearInterval(time = 0);
    }
    
    if (time == 0) {
        endSound.play();
        endSound.pause();
    }
}
