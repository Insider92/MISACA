const Discord = require('discord.js');
const client = new Discord.Client();
const moment = require('moment');
const messageHandler = require('./controller/reactToMessages');
const helper = require('./helper');
require('dotenv').config();

const channelListner = [
    '587745885019045958', //Yuumiste Server der Welt - Für die Bots
    '744585787932147794' ///Yuumiste Server der Welt - TestSpace
];

const roadmap = require('./roadmap.json');

moment.locale('de');
global.discordClient = client;

client.on('ready', () => {
    console.log('Connected as ' + client.user.tag);
    client.user.setActivity('!MISACA help | Bot von Johannes');

    // PLAYING, STREAMING, LISTENING, WATCHING
    // For example:
    // client.user.setActivity('TV', {type: 'WATCHING'})
});

client.on('message', (receivedMessage) => {
    if (receivedMessage.author == client.user) { // Prevent bot from responding to its own messages
        return;
    }

    if (channelListner.includes(receivedMessage.channel.id) && receivedMessage.content.startsWith('!MISACA')) {
        let message = receivedMessage.content.split(' ') // Split the message up in to pieces for each space
        message.shift(); //Delete !MISACA
        let primaryMessage = message[0].toLowerCase() //not case sensitive
        message.shift(); //Delete Primary Command
        let argumentsMessage = message;

        console.log("Command received: " + primaryMessage)
        console.log("Arguments: " + argumentsMessage) // There may not be any arguments but maybe in the future

        switch (primaryMessage) {
            case 'version':
                getVersion(receivedMessage);
                break;
            case 'dailyart':
                getRandomArt(receivedMessage);
                break;
            case 'dailymaimai':
                getRandomMaiMai(receivedMessage);
                break;
            case 'roadmap':
                getRoadmap(receivedMessage);
                break;
            case 'suggestion':
                sendSuggestion(receivedMessage, argumentsMessage);
                break;
            case 'droppanties':
                forSebiSenpai(receivedMessage);
                break;
            case 'members':
                getMembers(receivedMessage);
                break;
            default:
                getResponse(receivedMessage, primaryMessage, argumentsMessage);
        }
    }
})

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> 'Click to Reveal Token'
bot_secret_token = process.env.DISCORD_BOT_TOKEN;
client.login(bot_secret_token);

function sendResponse(messageObject, response) {
    let message = messageObject.channel.send(response).then(sent => {
        return sent //possible post processing
    })
    .catch(err => {
        response = helper.errorOccurred(err)
        messageObject.channel.send(response);
    });

    return message;
}

function deleteMessages(channelId, meassageId) {
    client.channels.cache.get(channelId).messages.fetch(meassageId).then(message => message.delete());
}

/*-------------------------------- Function which get trigger by keywords ----------------------------------------------- */

//default
function getResponse(messageObject, primaryMessage, argumentsMessage) {
    let response = messageHandler.getResponse(primaryMessage, argumentsMessage);
    sendResponse(messageObject, response);
}

//version
function getVersion(messageObject) {
    let version = process.env.npm_package_version;
    let env = process.env.NODE_ENV;
    let response = 'Beep Boop Beep! Hello fellow Human - This are my definitely Human Specs: Version ' + version + ' / Environment ' + env
    sendResponse(messageObject, response);
}

//maimai
function getRandomMaiMai(messageObject) {
    let maiMaiChannel = client.channels.cache.get('290254724031184899');
    let responses = [];

    let pleaseWaitText = 'Your maimai is so big, senpai ☆⌒(>。<) This could take some time - please wait';
    let waitMessage = sendResponse(messageObject, pleaseWaitText);
    helper.fetchAllMessages(maiMaiChannel)
        .then(msgs => {
            let randomMessage = msgs.random();
            responses.push('>>> ' + randomMessage.content)
            if (randomMessage.attachments.size > 0) {
                responses.push(randomMessage.attachments.random().url);
            }
            responses.push('Created by **' + randomMessage.author.username + '**');
            responses.push('Created at **' + moment(randomMessage.createdTimestamp).format('LL') + '**');
            responses.push('https://discordapp.com/channels/' + randomMessage.guild.id + '/' + randomMessage.channel.id + '/' + randomMessage.id);
            return responses;
        })
        .then(responses => {
            waitMessage.then(message => {
                deleteMessages(message.channel.id, message.id);
            });
            responses.forEach(response => {
                sendResponse(messageObject, response);
            });
        })
        .catch(err => {
            response = helper.errorOccurred(err)
            sendResponse(messageObject, response);
        });
}

//dailyart
function getRandomArt(messageObject) {
    let artChannel = client.channels.cache.get('670614182961610752');
    let responses = [];
    helper.fetchAllPictureMessages(artChannel)
        .then(msgs => {
            let randomMessage = msgs.random();
            responses.push(randomMessage.attachments.random().url);
            responses.push('Created by **' + randomMessage.author.username + '**');
            responses.push('Created at **' + moment(randomMessage.createdTimestamp).format('LL') + '**');
            responses.push('https://discordapp.com/channels/' + randomMessage.guild.id + '/' + randomMessage.channel.id + '/' + randomMessage.id);
            return responses;
        })
        .then(responses => {
            responses.forEach(response => {
                sendResponse(messageObject, response);
            });
        })
        .catch(err => {
            response = helper.errorOccurred(err)
            sendResponse(messageObject, response);
        });
}

//droppanties needs to be beautifed - but WIP
function forSebiSenpai(messageObject) {

    let workingChannel = client.channels.cache.get('314747324637380609'); //working channel  
    let response = messageHandler.getResponse('droppanties', null);

    messageObject.channel.send(response).then(sent => {
        let returnToSender = client.channels.cache.get(sent.channel.id);
        workingChannel.send(process.env.ONLY_FOR_SEBI_SENPAI).then(sent => {
            let text = 'https://discordapp.com/channels/' + sent.guild.id + '/' + sent.channel.id + '/' + sent.id;
            returnToSender.send(text);
        })
        .catch(err => {
            response = helper.errorOccurred(err)
            sendResponse(messageObject, response);
        });
    })
};

//roadmap
function getRoadmap(messageObject) {
    let response = new Discord.MessageEmbed()
        .setColor(roadmap.options.color)
        .setTitle(roadmap.options.title)
        .setAuthor(roadmap.options.author, roadmap.options.pictureURL)
        .setDescription(roadmap.options.description)
        .addField('\u200B', '\u200B');
    roadmap.features.forEach(feature => {
        if (feature.visible) {
            responseText = feature.description +
                '\u000A*priority: ' + feature.priority + '*' +
                '\u000A*difficulty: ' + feature.difficulty + '*' +
                '\u000A*suggested by ' + feature.suggestedBy + '*'
            response.addField(feature.name, responseText);
        }
    });
    response
        .addField('\u200B', '\u200B')
        .addField('You have an idea ?', 'Submit your suggestion with:\u000A**!MISACA suggestion [suggestiontext]**\u000ASee **!MISACA commands** for help\u000A\u000AWe looking forward to it!')
        .setThumbnail(roadmap.options.pictureURL)
        .setTimestamp()
        .setFooter('Last updated: ' + roadmap.upatedAt + ' by ' + roadmap.updateBy, roadmap.options.pictureURL);
    sendResponse(messageObject, response);
}

//suggestion
function sendSuggestion(messageObject, argumentsMessage) {
    let emptyMessage = 'You need to provivde some idea, senpai >.< suggestion message should not be empty! If you need help try !MISACA commands';
    if(argumentsMessage.length === 0){
        sendResponse(messageObject, emptyMessage);
        return;
    }  
    suggestion = argumentsMessage.join(' ');
    let devID = process.env.DEVELOPER_DISCORD_ID;
    client.users.fetch(devID).then(sent => {
        let response = new Discord.MessageEmbed()
            .setTitle('Suggestion Message')
            .setDescription('I have a suggestion for you Chief')
            .addField('Sugggested by ' + messageObject.author.username + ' from ' + messageObject.guild.name, suggestion)
            .addField('Direct Link', 'https://discordapp.com/channels/' + messageObject.guild.id + '/' + messageObject.channel.id + '/' + messageObject.id)
            .setFooter('Created by MISACA')
            .setTimestamp();
        sent.send(response).then(sent => {
            sendResponse(messageObject, 'This suggestion was safely delivered - We will try contact you, if we have questions');
        })
        .catch(err => {
            response = helper.errorOccurred(err)
            sendResponse(messageObject, response);
        });
    })

}
/*
function getMembers(messageObject) {
    messageObject.guild.prese
    messageObject.guild.members.fetch().then(members => {
        members
        .filter(member => member.presence.status)
        .each(user => console.log(user.nickname))
    })

    //console.log(list.members.size);
    //list.members.forEach(member => console.log(member.user.username));
}
*/
/*
function setArt() {
}

function getFood() {
}
*/
