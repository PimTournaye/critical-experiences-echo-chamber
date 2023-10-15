import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuid } from "uuid";
import { set1, set2, set3 } from "./prompts.js";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

// check later if we end up making a database
// so that we can de-associate data by saving responses in a rephrased way
// https://dictionaryapi.com/products/api-collegiate-thesaurus


const countdownMaxTimer = 40;
const closingMessage =
  "While our views feel certain from within, they are limited without the insights others provide. Broadening our circles leads to growth.";

// Keeping track of things
let gameState = {
  started: false,
  currentPrompt: null,
  currentSet: null,
  amountOfPromptsDone: 0,
  currentTimer: 0,
};
const initialGameState = gameState;
let inPostgameCooldown = false;

// Track connected users
let locations = [];
let responses = [];

//
io.on("connection", (socket) => {
  // When a new location gets published
  socket.on("new-location", (data) => {
    // Add the new data our array and publish the new data
    if (locations.length <= 0) locations.push(data);
    else locations = [...locations, data];
    // Publish the updated list to all users.
    io.emit("locations", locations);
  });
  // Pass the gamestate on to the newly connected user.
  socket.emit("state", gameState);

  // Check if we can start the game loop
  checkAndStartLoop();

  // When we receive a new response to a prompt
  socket.on("prompt-response", (data) => {
    if (responses.length <= 0) responses.push(data);
    else responses = [...responses, data];
  });

  socket.on("response-request", (data) => {
    // Send that user a random
  });

  // When a user disconnects, remove their location
  socket.on("disconnect", () => {
    locations = locations.filter((loc) => loc.socketId !== socket.id);
    io.emit("locations", locations);
  });
});

// Function to check conditions and start the loop
function checkAndStartLoop() {
  if (locations.length >= 5 && !inPostgameCooldown) {
    startGame();
  }
}


// Countdown/game logic
// Once the game starts. publish the locations of all the users, and publish the first prompt, get getting the correct set and prompt. This is the start of the game loop.
// 30 seconds after starting the game loop, start the countdown timer
// Once the timer has run out, restart the countdown as a cooldown timer, allowing users a chance to use the reponse-request socket
// Once the cooldown timer has finished, start the countdown again and grabbing the next prompt in the set
// Repeat the game loop, moving through the prompts until we run out, publishing the ending message and end the game loop.
// Once the ending message has been published. Leave everything as is for 5 minutes, then setting the gamestate started back to false and setting up a new game.

const startGame = () => {
  // The game has started, so let's set the gamestate to true
  gameState.started = true;
  // Set the correct set and prompt
  getPromptSet();
  getCurrentPrompt(gameState.currentPrompt);
  // Publish the locations of all the users
  io.emit("locations", locations);
  // Publish the first prompt
  io.emit("prompt", gameState.currentPrompt);
  // After 30 seconds, start the countdown timer
  setTimeout(() => {
    // Publish the countdown timer
    io.emit("countdown", countdownMaxTimer);
    // Start the countdown timer
    startCountdown();
  }, 30000);
}

const startCountdown = () => {
  // If the timer has reached 0, start the cooldown timer
  if (gameState.currentTimer <= 0) startCooldown();
  // If the timer hasn't reached 0, publish the timer and reduce it by 1
  else {
    io.emit("countdown", gameState.currentTimer);
    gameState.currentTimer--;
    // Wait 1 second and run the function again
    setTimeout(() => {
      startCountdown();
    }, 1000);
  }
}

const startCooldown = () => {
  // If the timer has reached 0, start the cooldown timer
  if (gameState.currentTimer <= 0) startNextPrompt();
  // If the timer hasn't reached 0, publish the timer and reduce it by 1
  else {
    io.emit("cooldown", gameState.currentTimer);
    gameState.currentTimer--;
    // Wait 1 second and run the function again
    setTimeout(() => {
      startCooldown();
    }, 1000);
  }
}

const getPromptSet = () => {
  // If we don't have a current set, set it to the first one
  if (gameState.currentSet === null) gameState.currentSet = set1;
  // If we do have a current set, advance it to the next one
  else if (gameState.currentSet === set1) gameState.currentSet = set2;
  else if (gameState.currentSet === set2) gameState.currentSet = set3;
  // If we've reached the end of the game publish the closing message and end the game
  else {
    // Publish the closing message
    io.emit("end-message", closingMessage);
    // Reset the gamestate
    gameState = initialGameState;
    // Set the Postgame to true
    inPostgameCooldown = true;
  }
}

const getCurrentPrompt = (index) => {
  // If we don't have a current prompt, set it to the first one in the current set
  if (gameState.currentPrompt === null) gameState.currentPrompt = gameState.currentSet[index];
  // If we do have a current prompt, and we haven't reached the end of the set, set it to the next one in the set
  else if (index < gameState.currentSet.length) gameState.currentPrompt = gameState.currentSet[index];
  // If we have reached the end of the set, advance the set and set the current prompt to the first one in the new set
  else if (index >= gameState.currentSet.length) {
    getPromptSet();
    gameState.currentPrompt = gameState.currentSet[0];
  }
}



// Once the game starts. publish the locations of all the users, and publish the first prompt, grabbing the first array of the selected set, starting with the first. This is the start of the game loop.
// After 30 seconds, start the countdown timer
// Once the timer has run out, restart the countdown as a cooldown timer, allowing users a chance to use the reponse-request socket
// Once the cooldown timer has finished, start the countdown again and grab the next array of the selected set
// Repeat the game loop, moving on to new array until the set runs out, then switching to the next set, until that one runs out. Once we've finished the third set, publish the ending message.
// Once the ending message has been published. Leave everything as is for 5 minutes, then setting the gamestate started back to false, marking the end of the game and setting up to begin a new one.

// ------------------------------------------
// Start the server
httpServer.listen(3000);
