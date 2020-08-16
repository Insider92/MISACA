const Discord = require('discord.js');
const imgurLink = 'https://i.imgur.com/Z5nXjVO.jpg'

responses = [{
        "trigger": "notrecognized",
        "description": "Dummy command, if MISACA doesn't have this command",
        "text": "Sorry I could not understand you (⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄ Please use '!MISACA commands' to see all commands - Thank you Senpai >.<",
        "embed": false,
        "visible": false
    },
    {
        "trigger": "whoareyou",
        "description": "Small introduction of MISACA",
        "text": "I'm MISACA - Multiple Information Service and Core Application. I was created by Kid (Johannes) - please don't delete me UwU",
        "embed": false,
        "visible": true
    },
    {
        "trigger": "help",
        "description": "Help Command (Tsundere)",
        "text": "It's not like I wanna to help you ... BAKA >.< But you can use me with '!MISACA [command here]'. Please use '!MISACA commands' to see all commands - Please be gentle",
        "embed": false,
        "visible": true
    },
    {
        "trigger": "commands",
        "description": "Returns a list of commands",
        "text": "",
        "embed": true,
        "visible": true,
        "options": {
            "commandTrigger": true,
            "color": "#ff1e00",
            "title": "List of commands",
            "author": "MISACA",
            "description": "",
            "URL": "",
            "pictureURL": imgurLink
        }
    },
    {
        "trigger": "code",
        "description": "Returns the link to the GitHub Repo",
        "text": "",
        "embed": true,
        "visible": true,
        "options": {
            "color": "#ff1e00",
            "title": "Source Code for MISACA",
            "author": "MISACA",
            "description": "Link to GitHub",
            "URL": "https://github.com/Insider92/MISACA/",
            "pictureURL": imgurLink
        }

    },
    {
        "trigger": "ping",
        "description": "Basic ping trigger - for fun times",
        "text": "Here I made it over the ~waves~! Here is your ping UwU",
        "embed": false,
        "visible": true
    },
    {
        "trigger": "version",
        "description": "Return the current version and environment of MISACA",
        "text": "Version and Env",
        "embed": false,
        "visible": true
    },
    {
        "trigger": "droppanties",
        "description": "For Sebi-Senpai... (⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄",
        "text": "BAKA ! How could you demand something like this. B-But I guess, if it is you Sebi-Senpai... it is ok (⁄ ⁄•⁄ω⁄•⁄ ⁄)⁄",
        "embed": false,
        "visible": true
    },
]

module.exports = {
    getResponse: getResponse
}

/**
 * Returns the response for a given command
 * 
 * @param {string} command the string with the command
 * @param {string} arguments the string with optional arguments
 * @returns {string} the repsonse string
 */
function getResponse(command, arguments) {
    console.log("Command received: " + command)
    console.log("Arguments: " + arguments) // There may not be any arguments but maybe in the future

    command = command.toLowerCase(); //not case sensitive

    let response = responses.find(response => response.trigger === command);

    //if nothing matches
    if (response === undefined) {
        response = responses.find(response => response.trigger === 'notrecognized');
        response = response.text;
        return response;
    }

    if (response.embed) {
        response = generateEmbed(response.options);
    } else {
        response = response.text
    }
    return response;
}

/**
 * Generates a MessageEmbed Objects with the given options
 * @param {array} options array with options
 * @returns {MessageEmbed} 
 */
function generateEmbed(options) {
    let response = new Discord.MessageEmbed()
        .setColor(options.color)
        .setTitle(options.title)
        .setURL(options.URL)
        .setAuthor(options.author, options.pictureURL)
        .setDescription(options.description)

    //needs to be beautifed - but WIP
    if (options.commandTrigger) {
        responses.forEach(command => {
            if (command.visible) response.addField('!MISACA ' + command.trigger, command.description)
        });
    }

    response
        .setThumbnail(options.pictureURL)
        .setTimestamp();
    return response;
}