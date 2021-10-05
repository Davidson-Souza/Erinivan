'use strict'

// Import the discord.js module
const Discord   = require('discord.js');
const parser    = require("./parser.js");
const commands  = require("./commands");

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
let msg;

client.on('ready', async () => {
  const channel_old = await client.channels.cache.find((channel, key) => {
    if (channel.name === "matérias") return channel;
  });
  if(channel_old) channel_old.delete();
  const IF = await client.guilds.cache.get("644248934834896946").roles.cache.find((v, k) => {if (v.name == "IF") return v; });
  
  const channel = await client.guilds.cache.get("644248934834896946").channels.create("Matérias", {
    permissionOverwrites: [
      {
        id: client.guilds.cache.get("644248934834896946").roles.everyone,
        deny:[Discord.Permissions.FLAGS.VIEW_CHANNEL]
      },
      {
        id: IF.id,
        allow: [Discord.Permissions.FLAGS.VIEW_CHANNEL]
      }
    ]
  })
  let txt = "";
  const grades = commands.listGrades()
  for (let i in grades)
    txt += `${i}: ${grades[i]}\n`;
  if (channel) msg = await channel.send(`
Use as reações para escolher a sua matéria:\n
${txt}
`);

  client.user.setActivity(`Cala boca Pedro`);
});

// Create an event listener for messages
client.on('message', async message => {
  if(!message.guild && message.author.id != client.user.id)
  {
    message.react("👍")
    if (message.content.startsWith("https://"))
    {
      return commands.updatePlaylist(message);
    }

    const emoji = await commands.newGrade(client, message.content, Discord.Permissions.DEFAULT);
    if(!emoji) return message.reply("Essa matéria já existe!");

    msg.edit(msg.content + `\n${emoji} - ${message.content}`);

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
client.on("messageReactionAdd", (reaction, user) => {
  if (reaction.message.author.id == client.user.id /*&& reaction.message.channel.name === "materias"*/)
    commands.addGrade(reaction.emoji, user, client)
})

client.login(`${process.env.API_KEY}`);
