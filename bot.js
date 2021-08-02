'use strict'

// Import the discord.js module
const Discord   = require('discord.js');
const parser    = require("./parser.js");
const commands  = require("./commands");

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });

client.on('ready', () => {
  client.user.setActivity(`Cala boca Pedro`);
});


// Create an event listener for messages
client.on('message', async message => {
  if(!message.guild && message.author.id != client.user.id)
  {
    message.react("👍")
    if(message.content.startsWith("https://"));
    {
      commands.updatePlaylist(message);
    }
    return ;
  }
  
  commands.messageInc(message.author.username);

  if(message.channel.name != '『🤖』comandos-bot') 
  {
    if(message.content.startsWith("-"))
    {
      message.author.send("Manda em『🤖』comandos-bot")
      if(message.deletable) message.delete();
    }
    return ;
  }
  const { command, args } = parser.parseMessage(message.content);
  
  if(command && commands[command])
    commands[command](message, args);
});
client.login(`${process.env.API_KEY}`);
