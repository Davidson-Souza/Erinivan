const cron    = require("node-cron");
const fs      = require("fs");


let internalValues = 
{
    playlists = {},
    msgCount = {}
}

cron.schedule("* * * *", () =>
{
    fs.writeFileSync("playlists.json", JSON.stringify(internalValues.playlists));
});
cron.schedule("* * * *", () =>
{
    fs.writeFileSync("count.json", JSON.stringify(internalValues.msgCount));
});

try 
{
    const file = fs.readFileSync("playlists.json"); 
    JSON.parse(file, (k, v) =>
    {
      if(k)
        internalValues.playlists[k] = v;
    })
} catch (error) {
    console.log("No playlist found");
}
  
try 
{
    const file = fs.readFileSync("count.json"); 
    JSON.parse(file, (k, v) =>
    {
      if(k)
        internalValues.msgCount[k] = v;
    })
} catch (error) 
{
    console.log("No count found");
}

module.exports = 
{
    updateCount: (user) =>
    {
        if(internalValues.msgCount[user])
            internalValues.msgCount[user]+= 1;
      else
        internalValues.msgCount[user] = 1;
    },
    updatePlaylist: (playlist, id) =>
    {
        internalValues.playlists[id] = playlist;
    },
    getCount: () =>
    {
        return internalValues.msgCount;
    },
    getPlaylist: (user) =>
    {
        return internalValues.playlists;
    }
}
cron.schedule()