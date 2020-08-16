const Discord = require('discord.js');
const client = new Discord.Client();
const messageHandler = require('./controller/reactToMessages');
require('dotenv').config();

const channelListner = [
    '587745885019045958', //Yuumiste Server der Welt - Für die Bots
    '744585787932147794' ///Yuumiste Server der Welt - TestSpace
];

const errorMsg = 'Sorry Senpai, something went wrong - I\'m so sorry >.< If this happens again contact my developer Kid';

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
        return
    }

    if (channelListner.includes(receivedMessage.channel.id) && receivedMessage.content.startsWith('!MISACA')) {
        let message = receivedMessage.content.split(' ') // Split the message up in to pieces for each space
        message.shift(); //Delete !MISACA
        let primaryMessage = message[0].toLowerCase(); //not case sensitive
        message.shift(); //Delete Primary Command
        let argumentsMessage = message;
        let repsonse;

        console.log("Command received: " + primaryMessage)
        console.log("Arguments: " + argumentsMessage) // There may not be any arguments but maybe in the future

        if (primaryMessage === 'droppanties') {
            forSebiSenpai(receivedMessage);
        }

        if (primaryMessage === 'version') {
            getVersion();
        }

        if (primaryMessage === 'art_dev') {
            repsonse = getRandomArt();
        } else {
            repsonse = messageHandler.getResponse(primaryMessage, argumentsMessage);
        }

        receivedMessage.channel.send(repsonse).then(sent => {
            //possible post processing
        });
    }
})

// Get your bot's secret token from:
// https://discordapp.com/developers/applications/
// Click on your application -> Bot -> Token -> 'Click to Reveal Token'
bot_secret_token = process.env.DISCORD_BOT_TOKEN;
client.login(bot_secret_token);

function getRandomMaiMai(messageObject) {
    let maiMaihannel = client.channels.cache.get('290254724031184899');
}

function getRandomArt() {
    let artChannel = client.channels.cache.get('670614182961610752');
    let response = '';
    fetchAllPictureMessages(artChannel)
        .then(msgs => {
            let randomMessage = msgs.random();
            console.log(randomMessage.attachments.size);
            if (randomMessage.attachments.size > 1) {
                response = randomMessage.attachments.random().url;
            }
            response = randomMessage.attachments.first().url;
            console.log(response);
            resolve(response);
        })
        .then(response => {
            console.log(response);
            return response;
        })
        .catch(err => {
            response = errorOccurred(err)
            return response;
        });

}

function setArt() {

}

function getFood() {

}

function getMembers(messageObject) {
    const list = client.guilds.get("335507048017952771");
    list.members.forEach(member => console.log(member.user.username));
}

function getVersion(messageObject) {
    let version = process.env.npm_package_version;
    let env = process.env.NODE_ENV;
    let response = 'Beep Boop Beep! Hello fellow Human - This are my definitely Human Specs: Version ' + version + ' / Environment ' + env
    messageObject.channel.send(response)
}

//needs to be beautifed - but WIP
function forSebiSenpai(messageObject) {

    let workingChannel = client.channels.cache.get('314747324637380609'); //working channel  
    let response = messageHandler.getResponse('droppanties', null);

    messageObject.channel.send(response).then(sent => {
        let returnToSender = client.channels.cache.get(sent.channel.id);
        workingChannel.send(process.env.ONLY_FOR_SEBI_SENPAI).then(sent => {
            let text = 'https://discordapp.com/channels/' + sent.guild.id + '/' + sent.channel.id + '/' + sent.id;
            returnToSender.send(text);
        });
    })
};


//------------------------------ Helper ---------------------------


function errorOccurred(err) {
    return errorMsg;
};

function fetchAllMessages(channel) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({
                limit: 100
            })
            .then(collection => {
                const nextBatch = () => {
                    channel.messages.fetch({
                            limit: 100,
                            before: collection.lastKey()
                        })
                        .then(next => {
                            let concatenated = collection.concat(next);
                            // resolve when limit is met or when no new msgs were added (reached beginning of channel)
                            if (collection.size == concatenated.size) return resolve(concatenated);
                            collection = concatenated;
                            nextBatch();
                        })
                        .catch(error => reject(error));
                }
                nextBatch();
            })
            .catch(error => reject(error));
    });
}


function fetchManyMessages(channel, limit) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({
                limit: limit < 100 ? limit : 100
            })
            .then(collection => {
                const nextBatch = () => {
                    let remaining = limit - collection.size;
                    channel.messages.fetch({
                            limit: remaining < 100 ? remaining : 100,
                            before: collection.lastKey()
                        })
                        .then(next => {
                            let concatenated = collection.concat(next);
                            // resolve when limit is met or when no new msgs were added (reached beginning of channel)
                            if (collection.size >= limit || collection.size == concatenated.size || limit === concatenated.size) return resolve(concatenated);

                            collection = concatenated;
                            nextBatch();
                        })
                        .catch(error => reject(error));
                }
                nextBatch();
            })
            .catch(error => reject(error));
    });
}

//bei erstem fetch muss auch noch ein filter rein
function fetchAllPictureMessages(channel) {
    return new Promise((resolve, reject) => {
        channel.messages.fetch({
                limit: 100
            })
            .then(collection => {
                collection = collection.filter(message => {
                    message.attachments.size > 0
                });
                const nextBatch = () => {
                    channel.messages.fetch({
                            limit: 100,
                            before: collection.lastKey()
                        })
                        .then(next => {
                            next = next.filter(message => {
                                message.attachments.size > 0
                            });
                            let concatenated = collection.concat(next);
                            // resolve when limit is met or when no new msgs were added (reached beginning of channel)
                            if (collection.size == concatenated.size) return resolve(concatenated);
                            collection = concatenated;
                            nextBatch();
                        })
                        .catch(error => reject(error));
                }
                nextBatch();
            })
            .catch(error => reject(error));
    });
}