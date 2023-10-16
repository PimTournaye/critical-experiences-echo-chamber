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

const submitStageTimer = 30;
const cooldownStageTimer = 30;
const closingMessage =
  "While our views feel certain from within, they are limited without the insights others provide. Broadening our circles leads to growth.";

// Keeping track of things
let gameState = {
  started: false,
  currentString: '',
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
  socket.on("response-submit", (data) => {
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
  if (locations.length >= 5 && !inPostgameCooldown && !gameState.started) {
    startGame();
  }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));


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
  // Get the correct set and prompt
  const currentSet = getPromptSet();
  const currentPrompt =
  getCurrentPrompt(gameState.currentPrompt);
  // Publish the locations of all the users
  io.emit("locations", locations);
  // Start a setLoop to go through the set of prompts one by one, moving on to the next one after setLoop resolves
}

const setLoop = () => {
  // Start a prompt loop which resolves after we've gone through the three stringS in the current prompt
  promptStage(currentPrompt);

  // Start the submit stage

  // Start the cooldown loop

}

// Update the current string every 10 seconds
const promptStage = async (prompt) => {
  // For the three strings we have in the prompt, publish them to the users with a 10 second delay in between
  for (let i = 0; i < prompt.length; i++) {
    gameState.currentString = prompt[i];
    io.emit("update-prompt", gameState.currentString);
    await sleep(10000);
  }
}

// A window of 30 seconds where users can submit their responses
const submitStage = () => {
}

// A timer that lasts 30 seconds, which allows users to request a response from another user
const cooldownStage = () => {

}

const getSet = () => {
  // If we don't have a current set, set it to the first one
  if (gameState.currentSet === null) return gameState.currentSet = set1;
  // If we do have a current set, advance it to the next one
  else if (gameState.currentSet === set1) return gameState.currentSet = set2;
  else if (gameState.currentSet === set2) return gameState.currentSet = set3;
  // If we've reached the end of the game publish the closing message and end the game
  else return 'game over'
}

const getPrompt = (index) => {
  // If we don't have a current prompt, set it to the first one in the current set
  if (gameState.currentPrompt === null) return gameState.currentSet[0];
  // If we do have a current prompt, and we haven't reached the end of the set, set it to the next one in the set
  else if (index < gameState.currentSet.length) gameState.currentPrompt = gameState.currentSet[index];
  // If we have reached the end of the set, advance the set and set the current prompt to the first one in the new set
  else if (index >= gameState.currentSet.length) {
    getSet();
    gameState.currentPrompt = gameState.currentSet[0];
  }
}
// ------------------------------------------
// Start the server
httpServer.listen(3000);
