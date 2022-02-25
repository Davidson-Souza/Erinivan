const ytdl = require("ytdl-core")
const ytpl = require('ytpl');
const fs   = require('fs');
/**@todo: Mover isso para um arquivo externo */

const lofiList = 
{
  1:"https://www.youtube.com/watch?v=_DYAnU3H7RI",
  2:"https://www.youtube.com/watch?v=ZhstyJSNKME",
  3:"https://www.youtube.com/watch?v=lTRiuFIWV54",
  4:"https://www.youtube.com/watch?v=EIm4HvDgQCM",
  5:"https://www.youtube.com/watch?v=IV8N-gy5QZg",
  6:"https://www.youtube.com/watch?v=NxSDNogkKX0",
  7:"https://www.youtube.com/watch?v=wAPCSnAhhC8"
},

ydlsettings = 
{
  filter:'audioonly',
  format: 'bestaudio/best',
  outtmpl: 'downloads/%(extractor)s-%(id)s-%(title)s.%(ext)s',
  dlChunkSize: 0,
  liveBuffer: 0,
  restrictfilenames: true,
  noplaylist: true,
  nocheckcertificate: true,
  ignoreerrors: true,
  logtostderr: false,
  quiet: true,
  no_warnings: true,
  default_search: 'auto'
},
fritacaoList = 
{
  1:"https://open.spotify.com/track/7eXrGBrl1mBKhxlWX0IoOQ?si=6248f17bf440455f",
  2:"https://open.spotify.com/track/7IG7laqVpcvIIULrwWP5SA?si=1e128170c9fb4340",
  3:"https://open.spotify.com/track/6m187iACTSAZDYMaV0klqj?si=40145375595847e2",
  4:"https://open.spotify.com/track/2uAcF0b6gpfbwHAXVfNEsp?si=e09fd59fb518439d",
  5:"https://open.spotify.com/track/3sGcETRMuAgcPgjDpIkgMn?si=5cf9a9535eb14935",
  6:"https://open.spotify.com/track/2NmCWuOfyIZBGdBHezHboQ?si=8980bf185cde4413",
  7:"https://open.spotify.com/track/3MkdA6vwF0ifRl86yzTlJW?si=6c2bd576c00e4ea0",
  8:"https://open.spotify.com/track/3iH7cbeDjFBBvQpKejFlJz?si=77accc2a4d7346a4",
  9:"https://open.spotify.com/track/0Cjw7xWWGa2KKe8SVNy3FA?si=2fefc4a56aa74bab"
}
var queue = [];
let stream, dispatcher = false, connection;
module.exports =
{
    next: async (connection) =>
    {
        if(queue.length == 0){ if (dispatcher && dispatcher.destruct) dispatcher.destruct(); return ; }
        
	    const file = queue.pop();
    
        if (file.includes("youtube"))
        {
            stream = await ytdl(file, ydlsettings);

            if(!stream)
                return; 
            dispatcher = connection.play(stream, {seek:0, volume:1});
        }
        else
            dispatcher = connection.play(file, {seek:0, volume:0.5});

        dispatcher.on("finish", () => module.exports.next(connection));
    },
    playFromFile: async (file) =>
    {
        if(fs.existsSync(file))
            queue.push(file);
    },

    pause: () =>
    {
        dispatcher.pause();
    },
    restart: () =>
    {
        dispatcher.resume();
    },
    fritacao: async () => 
    {
        await module.exports.add("https://www.youtube.com/watch?v=bM7SZ5SBzyY&list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq", true)
    },
    getCount: () =>
    {
        return queue.length;
    },
    clear: () =>
    {
        queue = [];
        if(dispatcher && dispatcher.destroy)
            dispatcher.destroy();
        dispatcher = false; 
    },
    isClear: () =>
    {
        return queue.length == 0;
    },
    isConnected: ( ) =>
    {
        return (dispatcher);
    },
    init: async (connection) =>
    {
        connection.on('finish', async () => module.exports.next(connection))
                  .on('speaking', speaking => 
                    {
                        if (!speaking) connection.leave();
                    });
        return module.exports.next(connection).catch((e) =>
        {
            console.log(e)
        })
    },
    add: async (url, shuffle=false) =>
    {
        try {
	if(url.length == 0 || url.indexOf("https://www.youtube.com/") < 0) return false;
        if(url.indexOf("list") < 0)
            return queue.push(url);
        const playlist = await ytpl(url).catch((e) =>{ return false; });
        if(!playlist)
            return false;
        playlist.items.forEach((a,i) => queue.push (a.url.split("&list")[0]))
        
        if(shuffle)
        {
            for (let i = queue.length - 1; i > 0; i--) 
            {
                const j = Math.floor(Math.random() * (i + 1));
                [queue[i], queue[j]] = [queue[j], queue[i]];
            }
        }
	}	catch(e){
			console.log(e)
		}
        return true;
    },
    lofi: () =>
    {
        for(let i in lofiList)
            queue.push(lofiList[i]);
        for (let i = queue.length - 1; i > 0; i--) 
        {
            const j = Math.floor(Math.random() * (i + 1));
            [queue[i], queue[j]] = [queue[j], queue[i]];
        }
    }
}
