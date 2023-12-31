import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
// import { v4 as uuid } from "uuid";
import { set1, set2, set3 } from "./prompts.js";
import { log } from "console";

// type Location = { lat?: number; lng?: number; socketId?: string; string?: string }

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  /* options */
});

let locations = [];
let responses = [];

app.get("/", (req, res) => {
  console.log("GET /");
  log(res);
  log(gameState)
  res.send(gameState);
});

io.on("connection", (socket) => {
  // Pass the gamestate on to the newly connected user in case they join the middle of a game loop
  socket.emit("state", gameState);

  // When a new location gets published
  socket.on("new-location", (data) => {
    console.log('new location received', data);

    let loc; //: { lat?: number; lng?: number; socketId?: string; string?: string };
    // Add the socketID to the location data
    if (data.lat && data.lng) loc = { lat: data.lat, lng: data.lng, socketId: socket.id };
    else loc = { string: data.string, socketId: socket.id };

    // Add the new data our array and publish the new data
    if (locations.length <= 0) locations.push(loc);
    else locations = [...locations, loc];
    // Publish the updated list to all users, sans socketIDs for security and privacy
    const locationsSansSocketIds = locations.map((loc) => {
      if (loc.lat && loc.lng) return { lat: loc.lat, lng: loc.lng };
      else return { string: loc.string };
    });
    io.emit("locations", locationsSansSocketIds);
  });

  // Check if we can start the game loop
  checkAndStartLoop();

  // When we receive a new response to a prompt
  socket.on("submit-response", (data) => {
    if (responses.length <= 0) responses.push(data);
    else responses = [...responses, data];
  });

  socket.on("response-request", () => {
    // Send that user a random response
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    socket.emit("response-request", randomResponse);
  });

  // When a user disconnects, remove their location
  socket.on("disconnect", () => {
    locations = locations.filter((loc) => loc.socketId !== socket.id);
    io.emit("locations", locations);
  });
});


// ------------------------------------------

// Function to check conditions and start the loop
function checkAndStartLoop() {
  if (locations.length >= minimumPlayers && !inPostgameCooldown && !gameState.started) {
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

const minimumPlayers = 1;
const stringTimer = 10; // 10 seconds 
const submitTimer = 30; // 30 seconds
const cooldownTimer = 20; // 20 seconds
const closingMessage = "While our views feel certain from within, they are limited without the insights others provide. Broadening our circles leads to growth.";
const sets = [set1, set2, set3];

// Keeping track of things
let gameState = {
  started: false,
  currentSet: sets[0],
  currentPrompt: sets[0][0],
  currentString: sets[0][0][0],
  currentTimer: 0,
  currentPromptIndex: 0,
  stage: ''
};
const initialGameState = gameState;
let inPostgameCooldown = false;

const startGame = async () => {
  log("Starting game");
  // The game has started, so let's set the gamestate to true
  gameState.started = true;
  // Publish the locations of all the users
  io.emit("locations", locations);
  // Start the game loop with the first set, I SHOULD PROBABLY MAKE THIS A FUNCTION
  await setLoop(sets[0]);
  // After the first set, start the second setLoop
  await setLoop(sets[1]);
  // After the second set, start the third setLoop
  await setLoop(sets[2]);
  // After the third set, end the game by publishing the closing message
  endGame();
}

// Loop through the prompts in our set
const setLoop = async (set) => {
  log("Starting set loop");
  for (const prompt of set) {
    // console.log(prompt);
    // Reset the responses
    responses = [];
    // Start a prompt loop which resolves after we've gone through the three strings in the current prompt
    await promptStage(prompt);
    // Start the submit stage
    await submitStage();
    // Start the cooldown loop
    await cooldownStage();
  }
}

const promptStage = async (prompt) => {
  log("Starting prompt stage");
  // Emit start of stage
  gameState.stage = 'prompt';
  gameState.currentPrompt = prompt;
  io.emit('stage', gameState);
  for (let i = 0; i < prompt.length; i++) {
    gameState.currentString = prompt[i];
    io.emit('state', gameState);
    await sleep(stringTimer * 1000);
  }
}

async function submitStage() {
  log("Starting submit stage");
  // Emit start of stage
  gameState.stage = 'submit';
  io.emit('stage', gameState);
  // Countdown timer  
  for (let i = 0; i < submitTimer; i++) {
    io.emit('submitTimer', submitTimer - i);
    await sleep(1000);
  }
}

const cooldownStage = async () => {
  log("Starting cooldown stage");
  // Emit start of stage
  gameState.stage = 'cooldown';
  io.emit('stage', gameState);
  await sleep(cooldownTimer * 1000);
}

const endGame = () => {
  log("Ending game");
  gameState.stage = 'postgame';
  io.emit("game-over", closingMessage);
  gameState.currentString = closingMessage;
  io.emit('stage', gameState)
  // Active the postgame cooldown, which resolves after 5 minutes
  inPostgameCooldown = true;
  // Update the gamestate
  // Start the postgame cooldown
  postGameCooldown();
}

const postGameCooldown = () => {
  // After 5 minutes, set the gamestate started back to false and set up a new game
  setTimeout(() => {
    inPostgameCooldown = false;
    // Reset the gamestate
    gameState = initialGameState;
    // Reset the responses
    responses = [];
  }, 300000);
}

// ------------------------------------------
// Start the server
httpServer.listen(3000, () => {
  console.log("listening on *:3000");
});
