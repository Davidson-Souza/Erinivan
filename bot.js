'use strict';

// Import the discord.js module
const Discord = require('discord.js');
const mine = require("./mine");
const music = require("./music");

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });

client.on('ready', () => {
  console.log('I am ready!');
  client.user.setActivity(`Cala boca Pedro`);

});

// Create an event listener for messages
client.on('message', async message => {
  if(!message.guild && message.author.id != client.user.id)
  {
    message.react("👍")
    return ;
  } 
  if(message.channel.name != '『🤖』comandos-bot') return ;
  
  if(message.content === "-minePara")
  {
    message.react("👍")	
    
    mine.stop();
  }
  else if (message.content === "-mine")
  {
    message.react("👍")	

    mine.start(() =>  //onSuccess
    {
      message.reply("Funcionando!!\n");
    }, () => //onExit
    {
      message.reply("Fechado!\n");
    }, () =>  //onError
    {
      message.reply("Deu erro aqui, quando der eu arrumo");
    }, client);
  }
  else if(message.content == '-fritacao')
  {
    message.react("👍")	

    if (!message.member.voice.channel) {
      message.reply('You need to join a voice channel first!');
      return ;
    }
    await music.fritacao();
    music.init(await message.member.voice.channel.join());
  }
  else if (message.content === '-lofi') {
    message.react("👍")	

    if (!message.member.voice.channel) {
      message.reply('You need to join a voice channel first!');
      return ;
    }
    music.lofi();
    music.init(await message.member.voice.channel.join());
  }
  else if(message.content === '-chega')
  {
    music.clear();
    message.member.voice.channel.leave();
    message.react("👍")	
  }
  else if(message.content.startsWith ('-toca'))
  {
    message.react("👍")	

    if (!message.member.voice.channel) {
      message.reply('You need to join a voice channel first!');
      return ;
    }
    music.add(message.content.replace("-toca ", ""));
    music.next(await message.member.voice.channel.join());
  }
  else if(message.content === '-ajuda')
  {                       
    message.reply(
                "```\n\
-ajuda: Mostra essa mensagem de ajuda\n\
-mine: Abre o server\n\
-minePara: Para o server\n\
-lofi: Toca 10 horas de lofi\n\
-chega: Para de tocar musica e sai do canal\n\
-toca url: Toca a música da url```"
);
  }

});
client.login(`${process.env.API_KEY}`);