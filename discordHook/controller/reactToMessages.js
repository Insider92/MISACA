const Discord = require('discord.js');
const imgurLink = 'https://i.imgur.com/Z5nXjVO.jpg'

const tags = require('../tags.json');
const responses = require('../respones.json');

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
        tags.forEach(tag => {
            if(tag.visible){
                response.addField(tag.name, tag.description);
                responses.forEach(command => {
                    if (command.visible && command.tag=== tag.name){
                        responseText = command.tag === 'feature' ? '!MISACA ' + command.trigger + '\u000A*suggested by ' + command.suggestedBy + '*' : '!MISACA ' + command.trigger;
                        response.addField( responseText , command.description)
                    } 
                });
                response.addField('\u200B', '\u200B');
            }  
        })
    }
    response
        .setThumbnail(options.pictureURL)
        .setTimestamp();
    return response;
}