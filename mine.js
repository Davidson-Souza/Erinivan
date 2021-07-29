const { exec } = require('child_process');
var isRunning = false, players = 0;

module.exports = 
{
  start: (onSuccess, onClose, onError, client) =>
  {
    if(isRunning == true) return ;
    isRunning = true;
    const ls = exec(`${process.env.SERVER}`);
    ls.stdout.on('data', (data) => {
      if(data.includes("joined"))
      {
        players += 1;
        client.user.setActivity(`${process.env.HOST}: ${players} online`);

      } else if (data.includes("Disconnected"))
      {
        players -= 1;
        if(players == 0)
        {
          setTimeout(() =>
          {
            stop();
          }, 20000)}
        client.user.setActivity(`${process.env.HOST}: ${players} online`);

      } else if(data.includes("Done"))
      {
        client.user.setActivity(`${process.env.HOST}: ${players} online`);
        onSuccess();
      }
    });
    
    ls.stderr.on('data', (data) => {
      isRunning = false;
      client.user.setActivity(`Cala boca Pedro`);
      if(onError) onError();
    });
    
    ls.on('close', (code) => {
      client.user.setActivity(`Cala boca Pedro`);
      onClose();
    });
  },
  getAddress: () =>
  {
    return process.env.HOST
  },
  stop: async () =>
  {
    isRunning = false;
    /**@todo: ls.send("stop") */
    await exec("kill -15 $(pidof java)");
  }
}
