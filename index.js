/**
 * Simon Game - Index.js
 */

// Use globals, since dependent on clicking event
var count = 0; // count keeping track of pattern sequence
var patternArray = []; // use array to store pattern
var level = 0; // keeps track of level number
var started = false; // used to check if game has been started

// Create listener for any keypress, which starts game
$(document).on("keydown",  startGame);

// Add listening event for button clicks
var buttons = $(".btn"); // selects list of buttons
buttons.on("click", checkButton);

// Turns off keydown event listener, then starts Level 1
function startGame() {
   // ONLY RUN nextLevel() IF GAME HASN't STARTED YET
   if (!started) {
      started = true;
      nextLevel();
   }
}

// Progresses game to next level
function nextLevel () {
   // Keep track of level number and heading element
   var heading = $("h1");
   var newButton = null; // keeps track on new button added to sequence
   const newLevelDelay = 700; // delay at the start of the next level

   // Update level number
   level++;

   // Change heading to level number
   heading.text("Level " + level);

   // Reset count keeping track of sequence
   count = 0;

   // Pick new button, append to array
   newButton = buttons[Math.floor(Math.random() * buttons.length)]; 
   patternArray.push(newButton.id); // Side note: we use "push" in js

   // Play sound/animation
   // Add a little delay so new button is obvious
   setTimeout(function() {
      $("#" + newButton.id).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
      playSound(newButton.id);
   }, newLevelDelay); 

}

// Checks if correct button is pressed
function checkButton () {
   const buttonID = this.id;
   playAnimation(buttonID);

   // If pattern non-existent, or clicked too much - game over
   if (count >= patternArray.length) {
      gameOver();

   } else {

      // If button is correct, continue sequence
      if (buttonID === patternArray[count]) {
         count++;

         // Once whole sequence entered go to the next level
         if (count === patternArray.length) {
            nextLevel();
         }

      } else {
         gameOver();

      }
   }
}

// Plays given sound
function playSound (soundName) {
   var path = "sounds/";
   var a = new Audio (path + soundName + ".mp3");
   a.play();
}

// plays animation and sound for given button
function playAnimation (buttonName) {
   // button delay in milliseconds
   const buttonDelay = 150;
   const buttonID = "#" + buttonName; // saves us some typing

   // Play sound first
   playSound(buttonName);

   // Buttons use IDs, so we'll abuse that
   $(buttonID).addClass("pressed");

   // Remove press animation after given delay 
   setTimeout(function () {
      $(buttonID).removeClass("pressed");
   }, buttonDelay);
}

// Makes changes for game over screen - i.e. changes heading, flashes red
// and plays game over sound
function gameOver () {
   // Change heading and body colour
   $("h1").text("Game Over, Press Any Key to Restart");
   $("body").addClass("game-over");
   resetValues();

   // Play game over sound
   playSound("wrong");

   // Delay in milliseconds for flashing effect
   const delay = 200;

   // Add small delay for flashing effect
   setTimeout(function () {
      $("body").removeClass("game-over");
   }, delay);
}

// Reset all global values - turn on keydown event again
// so game can be restarted
function resetValues() {
   level = 0;
   count = 0;
   patternArray = [];
   started = false;

   // Turn keydown event back on
   //$(document).on("keydown",  startGame);
   /*
    * This was the cause of the bug
    * What happened was "on" method was used multiple times, since
    * I was causing gameover to occur over and over.
    *
    * What I didn't know was that the .on() method "stacks", so instead of
    * running 'startGame' once, it was running it X times, because I had 
    * run ".on("keydown", startGame)" X times when I kept spamming the button.
    *
    * They keypress then had X events attached to it instead of just the one
    *
    * Solution: Use a boolean instad of toggling event on/off
    *
    */
   
}
