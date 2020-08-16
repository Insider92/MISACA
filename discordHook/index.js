const Discord = require('discord.js');
require('dotenv').config();
const client = new Discord.Client();

const channelListner = [
    '587745885019045958' //Yuumiste Server der Welt - Für die Bots
]

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    client.user.setActivity("!MISACA Help | Bot von Johannes");
    
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (channelListner.includes(receivedMessage.channel.id) && receivedMessage.content.startsWith("!")) {
        console.log(receivedMessage.content);
    }
})

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = process.env.DISCORD_BOT_TOKEN;
client.login(bot_secret_token);