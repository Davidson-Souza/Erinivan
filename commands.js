const mine      = require("./mine");
const music     = require("./music");
const scheduler = require("./scheduler");

module.exports =
{
    schedule: scheduler.schedule,
    exec: (message, command, args) =>
    {
        if(this[command])
            this[command](message, args);
    },
    updatePlaylist: (message) =>
    {
        scheduler.updatePlaylist(message.content, message.author.id);
    },
    messageInc: (username) =>
    {
        scheduler.updateCount(username)
    },

    dropa: async (message, args) =>
    {
        message.react("👍")

        if (!message.member.voice.channel) {
            message.reply('Você precisa se conectar a um canal de voz antes');
            return ;
        }

        music.playFromFile("./seeeextoooou_1.1.mp3")

        if(!music.isConnected())
            music.init(await message.member.voice.channel.join());

    },
    minePara: (message, args) =>
    {
        message.react("👍")	
    
        mine.stop();
    },
    rank: (message, args) =>
    {
        message.react("👍")	

        let msg = "", i = 1, part = [];
        const msgCount = scheduler.getCount();
    
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
    },
    ip: async (message, args) =>
    {
        message.react("👍")	

        message.reply(await mine.getAddress());
    },
    me: async (message, args) =>
    {        
        message.react("👍")	
        
        const shuffle = args[0] == 'a'? true: false;
        const playlist = await scheduler.getPlaylist(message.author.id);
        
        if(playlist)
          await music.add(playlist, shuffle);
        if(!music.isConnected())
          music.init(await message.member.voice.channel.join());    
    },
    proxima: async (message, args) =>
    {
        message.react("👍")	
        music.next(await message.member.voice.channel.join());
    },
    fila: async (message, args) =>
    {
        message.react("👍");
        message.reply(`Existem ${music.getCount()} musicas na lista`)
    },
    limpa: async (message, args) =>
    {
        message.react("👍");
        if(music.isConnected())
          music.clear();
    },
    mine: async (message, args) =>
    {
        message.react("👍")	
        const mineTask = await scheduler.schedule(mine.periodic, "* * * * * *");
        if(!(await mine.start(message.channel, mineTask))) return message.channel.send("O servidor está off");
        
        if(!mineTask) return message.channel.send("Erro interno!");
        message.channel.send("Vou ver e te aviso");
    },
    pausa: (message, args) =>
    {
        message.react("👍")

        if(!message.member.voice.channel)
        {
            message.reply("Você precisa se conectar a um canal de voz antes")
            return ;
        }

        music.pause();
    },
    continua: (message, args) =>
    {
        message.react("👍")

        if(!message.member.voice.channel)
        {
            message.reply("Você precisa se conectar a um canal de voz antes")
            return ;
        }
        music.restart();
    },
    fritacao: async (message, args) =>
    {
        message.react("👍")

        if (!message.member.voice.channel) {
            message.reply('Você precisa se conectar a um canal de voz antes');
            return ;
        }
        await music.fritacao();

        if(!music.isConnected())
            music.init(await message.member.voice.channel.join());
    },
    lofi: async (message, args) =>
    {
        message.react("👍")	

        if (!message.member.voice.channel) {
          message.reply('Você precisa se conectar a um canal de voz antes');
          return ;
        }
        await music.lofi();
        
        if(!music.isConnected())
          music.init(await message.member.voice.channel.join());
    },
    loli: async (message, args) =>
    {
        message.reply("@190")
    },
    chega: async (message, args) =>
    {
        music.clear();
        message.member.voice.channel.leave();
        message.react("👍")	
    },
    toca: async (message, args) =>
    {
        if (!message.member.voice.channel)
            return message.reply('Você precisa se conectar a um canal de voz antes');

        if( !(await music.add(args[0])) )
            message.reply('Você digitou isso errado');

        if(!music.isConnected())
            return music.next(await message.member.voice.channel.join());
        
        message.react("👍")	
    },
    ajuda: async (message, args) =>
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
};