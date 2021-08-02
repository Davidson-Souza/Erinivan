const cron = require('node-cron');
const fs    = require("fs");


let internalValues = 
{
    playlists:{},
    msgCount: {}
}
console.log("Stating...")
// Save each hour
cron.schedule('59 * * * * *', () =>
{
    console.log("Saving playlists");
    fs.writeFileSync("playlists.json", JSON.stringify(internalValues.playlists));
});

// Save each minute
cron.schedule('59 * * * * *', () =>
{
    console.log("Saving message count")
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
    unschedule: async (job) =>
    {   
        if(job && job.destroy)
            job.destroy();
    },
    schedule: async (job, timestring) =>
    {
        if(job)
            return await cron.schedule(timestring, job);
        return false;
    },
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
        return internalValues.playlists[user];
    }
}
