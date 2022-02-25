'use strict'

// Import the discord.js module
const Discord   = require('discord.js');
const parser    = require("./parser.js");
const commands  = require("./commands");
const fs        = require("fs");

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });
let msg;

client.on('ready', async () => {
  console.log("ready!")
  try {
    msg = fs.readFileSync("msg").toString();
    const channel = await client.channels.cache.find((channel, key) => {
      if (channel.name === "matérias") return channel;
    });
    msg = await channel.messages.fetch(msg)

  } catch {
    const channel_old = await client.channels.cache.find((channel, key) => {
      if (channel.name === "matérias") return channel;
    });
    if(channel_old) channel_old.delete();
    const IF = await client.guilds.cache.get("644248934834896946").roles.cache.find((v, k) => {if (v.name == "IF") return v; });
  
    const channel = await client.guilds.cache.get("644248934834896946").channels.create("Matérias", {
      permissionOverwrites: [
        {
          id: client.guilds.cache.get("644248934834896946").roles.everyone,
          deny:[Discord.Permissions.FLAGS.VIEW_CHANNEL, Discord.Permissions.FLAGS.SEND_MESSAGES]
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
      txt += `${i} - ${grades[i]}\n`;
    if (channel) msg = await channel.send(`
${IF} pra ficar mais fácil marcar os outros, e egerenciar as threads e canais, esse bot vai colocar uma tag para cada matéria. 
Use as reações para escolher a sua matéria:\n
Se tiver faltando matéria, só mandar uma dm para o bot com um \`+\` e o nome da matéria. Ele vai colocar exatamente o que você digitar. Exemplo: \`+Análise e Projeto de Algorítmos\`

${txt}
    `);
    fs.writeFileSync("msg", msg.id);
  }
  client.user.setActivity(`Cala boca Pedro`);
});
let lastBaianoMessage = 0;

// Create an event listener for messages
client.on('message', async message => {
  if(!message.guild && message.author?.id != client.user.id) {
    message.react("👍")
    if (message.content.startsWith("https://")) {
      return commands.updatePlaylist(message);
    }
    if (message.content.startsWith("+")) {
      message.content = message.content.replace("+", "");
      console.log("+");
      try {
        const emoji = await commands.newGrade(client, message.content, Discord.Permissions.DEFAULT);
        if(!emoji) return message.reply("Essa matéria já existe!");
        msg.edit(msg.content + `\n${emoji} - ${message.content}`);
      } catch {
        console.log("Error");
      }

      return ;
    }
    if (message.author.id == "329678794086678529") {
      if (message.content === "reset") {
        console.log("Reseting roles");
        const gradesJSON = commands.listGrades();
        let grades = []
        for (let i in gradesJSON)
          grades.push(gradesJSON[i]);
        const chinfra = await client.guilds.cache.get("644248934834896946");
        let roleid = []

        chinfra.roles.cache.find((v, k) => {
          if (grades.includes(v.name))
            roleid.push(k);
        })

        chinfra.members.cache.each((user, v) => {
          try {
            roleid.forEach((v, k) => {
              user.roles.remove(v);
            })
          } catch(e) {
            console.log(e)
          }
        })
        return commands.resetGrades();
      }
    }
  }

  if (message.author.id == "483811121778786307") {
	  if((lastBaianoMessage + 60000) >= Date.now()) {
		  console.log("Flood")
		  return message.delete();
	  }
	  lastBaianoMessage = Date.now();
	  return;
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
  if (msg?.id == reaction?.message?.id)
    commands.addGrade(reaction.emoji, user, client)
})

client.login(`${process.env.API_KEY}`);
