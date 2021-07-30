'use strict';

// Import the discord.js module
const Discord = require('discord.js');
const mine    = require("./mine");
const music   = require("./music");
const fs      = require('fs');

// Create an instance of a Discord client
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION', 'USER'] });

let playlists = {}, msgCount = {};
client.on('ready', () => {
  client.user.setActivity(`Cala boca Pedro`);
});

try {
  const file = fs.readFileSync("playlists.json"); 
  JSON.parse(file, (k, v) =>
  {
    if(k)
      playlists[k] = v;
  })
} catch (error) {
  console.log("No playlist found");
}

try {
  const file = fs.readFileSync("count.json"); 
  JSON.parse(file, (k, v) =>
  {
    if(k)
      msgCount[k] = v;
  })
} catch (error) {
  console.log("No count found");
}

// Create an event listener for messages
client.on('message', async message => {
  if(!message.guild && message.author.id != client.user.id)
  {
    message.react("👍")
    if(message.content.startsWith("https://"));
    {
      playlists[message.author.id] = message.content;
      fs.writeFileSync("playlists.json", JSON.stringify(playlists));
    }
    return ;
  }
  if(msgCount[message.author.username])
    msgCount[message.author.username]+= 1;
  else
    msgCount[message.author.username] = 1;
    /**@todo: fazer isso periodicamente, e não a cada mensagem */
  fs.writeFileSync("count.json", JSON.stringify(msgCount));
  if(message.channel.name != '『🤖』comandos-bot') 
  {
    if(message.content.startsWith("-"))
    {
      message.author.send("Manda em『🤖』comandos-bot")
      if(message.deletable) message.delete();
    }
    return ;
  }

  if(message.content === "-minePara")
  {
    message.react("👍")	
    
    mine.stop();
  }
  
  else if (message.content === "-rank")
  {
    let msg = "", i = 1, part = [];
    for(let key in msgCount)
    {
      part.push({key:key, count:msgCount[key]});
    }
    part.sort((a, b) =>
    {
      if(a.count < b.count) return 1;
      if(a.count == b.count) return 0;
      if(a.count > b.count) return -1;
    });
    for (let elem in part)
    {
      msg +=`> ${i} - *${part[elem].key}*:    ${part[elem].count}\n`
      i++;
    }
    message.channel.send(msg);
  }
  else if (message.content.startsWith("-ip"))
  {
    message.reply(mine.getAddress());
  }
  else if (message.content.startsWith("-me"))
  {
    let shuffle = false;
    message.react("👍")	
    if(message.content.indexOf("a"))
      shuffle = true;
    if(playlists[message.author.id])
      await music.add(playlists[message.author.id], shuffle);
    if(!music.isConnected())
      music.init(await message.member.voice.channel.join());
  }
  else if (message.content === "-proxima")
  {
    message.react("👍")	
    music.next(await message.member.voice.channel.join());
  }
  else if (message.content === "-fila")
  {
    message.react("👍");
    message.reply(`Existem ${music.getCount()} musicas na lista`)
  }
  else if (message.content === "-limpa")
  {
    message.react("👍");
    if(music.isConnected())
      music.clear();
  }
  else if (message.content === "-mine")
  {
    message.react("👍")	

    mine.start(() =>  //onSuccess
    {
      message.channel.send("Funcionando!!\n");
    }, () => //onExit
    {
      message.channel.send("Fechado!\n");
    }, () =>  //onError
    {
      message.channel.send("Deu erro aqui, quando der eu arrumo");
    }, client);
  }
  else if(message.content == '-fritacao')
  {
    message.react("👍")	

    if (!message.member.voice.channel) {
      message.reply('Você precisa se conectar a um canal de voz antes');
      return ;
    }
    await music.fritacao();

    if(!music.isConnected())
      music.init(await message.member.voice.channel.join());
  }
  else if (message.content === '-lofi') {
    message.react("👍")	

    if (!message.member.voice.channel) {
      message.reply('Você precisa se conectar a um canal de voz antes');
      return ;
    }
    await music.lofi();
    
    if(!music.isConnected())
      music.init(await message.member.voice.channel.join());
  }
  else if (message.content === '-loli')
  {
    message.reply("@190")
  }
  else if(message.content === '-chega')
  {
    music.clear();
    message.member.voice.channel.leave();
    message.react("👍")	
  }
  else if(message.content.startsWith ('-toca'))
  { 
    if (!message.member.voice.channel)
      return message.reply('Você precisa se conectar a um canal de voz antes');

    if( !(await music.add(message.content.replace("-toca ", ""))) )
      message.reply('Você digitou isso errado');

    if(!music.isConnected())
      return music.next(await message.member.voice.channel.join());
    message.react("👍")	
    
  }
  else if(message.content === '-ajuda')
  {                       
    message.channel.send(
                "```\n\
-ajuda: Mostra essa mensagem de ajuda\n\
-mine: Abre o server\n\
-minePara: Para o server\n\
-fritacao: Toca um monte de música do NCS\n\
-me: Toca a sua playlist pessoal\n\
-ip: Retona o endereço pro server de mine\n\
-lofi: Toca 10 horas de lofi\n\
-chega: Para de tocar musica e sai do canal\n\
-limpa: Limpa todas as músicas na lista e para de tocar\n\
-toca url: Toca a música da url```"
);
  }
  
});
client.login(`${process.env.API_KEY}`);
