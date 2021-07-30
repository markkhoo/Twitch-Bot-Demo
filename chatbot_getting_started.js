require('dotenv').config();
const tmi = require('tmi.js'); // See https://tmijs.com/ for tmi docs

// Create a client and Define COnfiguration options
const client = new tmi.client({
  identity: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS
  },
  channels: [
    process.env.DB_CHANNEL_ONE
  ],
  connection: {
		// The secure config is required if you're using tmi on the server.
		// Node doesn't handle automatically upgrading .dev domains to use TLS.
		secure: true,
		server: 'irc.fdgt.dev',
	}
});

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
function onMessageHandler(target, context, msg, self) {
  if (self) { return; } // Ignore messages from the bot

  // Remove whitespace from chat message
  const commandName = msg.trim();

  // console.log(target);
  // console.log(context);
  // console.log(msg);

  // If the command is known, let's execute it
  if (commandName === '!dice') {
    const num = rollDice();
    client.say(target, `You rolled a ${num}`);
    console.log(`* Executed ${commandName} command`);
  } else if (commandName === `!console`) {
    client.say(target, `Check your server console`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
};

// Function called when the "dice" command is issued
function rollDice() {
  const sides = 6;
  return Math.floor(Math.random() * sides) + 1;
};

// Called every time the bot connects to Twitch chat
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
};