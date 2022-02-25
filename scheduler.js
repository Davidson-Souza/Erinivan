const cron = require('node-cron');
const fs    = require("fs");


let internalValues = 
{
    playlists:{},
    msgCount: {},
    grades: {binds:{}}
}
console.log("Stating...")
// Save each hour

cron.schedule('00 59 * * * *', () =>
{
    console.log("Saving playlists");
    fs.writeFileSync("playlists.json", JSON.stringify(internalValues.playlists));
});

// Save each minute
cron.schedule('00 59 * * * *', () =>
{
    console.log("Saving message count")
    fs.writeFileSync("count.json", JSON.stringify(internalValues.msgCount));
});

// Save each hour
cron.schedule('00 59 * * * *', () =>
{
    console.log("Saving grades")
    fs.writeFileSync("grades.json", JSON.stringify(internalValues.grades));
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
    internalValues.grades = require("./grades.json")
} catch (error) {
    console.log("No grades found");
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
    resetGrades: () => {
        let newGrades = {binds:{}};
        for (let grades in internalValues.grades.binds)
            newGrades["binds"][grades] = internalValues.grades.binds[grades];
        internalValues.grades = newGrades;
    },
    unschedule: async (job) =>
    {   
        
        if(job && job.destroy)
            job.destroy();
    },
    getGradeByEmoji: async (emoji) => {
        if (emoji)
            return internalValues.grades.binds[emoji];
    },
    listGrades: () => {
        return internalValues.grades.binds;
    },
    addGradeByUser: async (user, grade) => {
        
        if (!internalValues.grades[user]) internalValues.grades[user] = [];

        if (internalValues.grades[user].includes(grade)) return -1;
        internalValues.grades[user].push(grade);
        
        return 1;
    },
    schedule: async (job, timestring) =>
    {
        if(job)
            return await cron.schedule(timestring, job);
        return false;
    },
    newGrade: async (grade, emoji) => {

        if (!grade || internalValues.grades.binds[emoji]) return -1;
        for (let g in internalValues.grades.binds) {
            if (internalValues.grades.binds[g] == grade)
                return false;
        }
        internalValues.grades.binds[emoji] = grade;
        fs.writeFileSync("grades.json", JSON.stringify(internalValues.grades));
        return true;

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
