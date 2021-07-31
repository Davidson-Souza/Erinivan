var isRunning = false, players = 0, channel, discordClient, task;
const axios = require('axios').default;
const client = axios.create(
{
  baseURL:`${process.env.MINE}`
});

module.exports = 
{
  start: async (ch, dc, tsk) =>
  {
    const res = await client.get(`/start`).catch(e => {return false});
    if (!res) return false
    channel = ch;
    discordClient = dc
    task = tsk;
    return res.data.ok;
  },
  periodic: async () =>
  {
    if(!isRunning) return await this.isOpen(discordClient);

    const res = await client.get("/status");
    
    if(!res.data || !res.data.ok) return;
    if(!res.data.res.isRunning)
    {
      isRunning = false;
      channel.send("O servidor esta off");
      discordClient.user.setActivity('Cala boca pedro');
      if(task && task.destroy)
        task.destroy();
      return false;
    }
    discordClint.user.setActivity(`${res.data.res.host}:${res.data.res.players}`)
  },
  getAddress: async () =>
  {
    console.log(isRunning)
    if(!isRunning) return ("O servidor esta off");
    const res = await client.get(`/getAddress`);
    return res.data.res.host;
  },
  isOpen: async () =>
  {
    const res = await client.get("/isOpen");
    if(!isRunning)
    {
      channel.send("Rodando");
    }
    return res.data.res;
  },
  stop: async () =>
  {
    if(!isRunning) return false;
    const res = await client.get(`/stop`);
    return res.data.ok;
  }
}
