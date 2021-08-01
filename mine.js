var isRunning = false, players = 0, channel, task;
const axios = require('axios').default;
const client = axios.create(
{
  baseURL:`http://192.168.42.13:8080`
});

module.exports = 
{
  start: async (ch, tsk) =>
  {
    const res = await client.get(`/start`).catch(e => {return false});
    if (!res) return false
    channel = ch;
    task = tsk;
    return res.data.ok;
  },
  periodic: async () =>
  {
    const res = await client.get("/status");
    if(!res || !res.data || !res.data.ok) return;
    if(res.data.res.isRunning == -1 && isRunning == true)
    {
      isRunning = false;
      channel.send("O servidor esta off");
      if(task)
        task.destroy();
      return false;
    }
    if(res.data.res.isRunning == 1)
    {
      if(!isRunning)
      {
        channel.send("Rodando")
        isRunning = true;
      } 
    }
  },
  getAddress: async () =>
  {
    if(!isRunning) return ("O servidor esta off");
    const res = await client.get(`/getAddress`);
    return res.data.res.host;
  },
  stop: async () =>
  {
    if(!isRunning) return false;
    const res = await client.get(`/stop`);
    return res.data.ok;
  }
}
