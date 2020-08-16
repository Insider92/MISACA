const Discord = require('discord.js');
const client = new Discord.Client();
const messageHandler = require ('./controller/reactToMessages');
require('dotenv').config();

const channelListner = [
    '587745885019045958' //Yuumiste Server der Welt - Für die Bots
]

global.discordClient = client;

client.on('ready', () => {
    console.log("Connected as " + client.user.tag);
    client.user.setActivity("!MISACA help | Bot von Johannes");
    
    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity("TV", {type: "WATCHING"})
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return
    }

    if (channelListner.includes(receivedMessage.channel.id) && receivedMessage.content.startsWith("!MISACA")) {
        let message = receivedMessage.content.split(" ") // Split the message up in to pieces for each space
        message.shift(); //Delete !MISACA
        let primaryMessage = message[0]; 
        message.shift(); //Delete Primary Command
        let argumentsMessage = message;
        let repsonse = messageHandler.getResponse(primaryMessage,argumentsMessage);
        receivedMessage.channel.send(repsonse).then(sent => {
             //needs to be beautifed - but WIP
            if(primaryMessage === 'droppanties'){
                forSebiSenpai(sent);
            }
        });       
    }
})

 //needs to be beautifed - but WIP
 function forSebiSenpai(messageObject){
    let workingChannel = client.channels.cache.get('314747324637380609'); //working channel  
    let returnToSender =  client.channels.cache.get(messageObject.channel.id);
    console.log(process.env.ONLY_FOR_SEBI_SENPAI);
    workingChannel.send(process.env.ONLY_FOR_SEBI_SENPAI).then(sent => {
        let text = "https://discordapp.com/channels/" + sent.guild.id + "/" + sent.channel.id + "/" + sent.id;
        returnToSender.send(text);
    });
};

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> "Click to Reveal Token"
bot_secret_token = process.env.DISCORD_BOT_TOKEN;
client.login(bot_secret_token);