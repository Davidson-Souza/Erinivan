var isRunning = false, players = 0;
const axios = require('axios').default;
const client = axios.create(
  {
    baseURL:"http://localhost:8080"
  });
module.exports = 
{
  start: async () =>
  {
    const res = await client.get(`/`);
    return res.data;
  },
  getAddress: async () =>
  {
    const res = await client.get(`/`);
    return res.data.res;
  },
  stop: async () =>
  {
    const res = await client.get(`/`);
    return res.data.res;
  }
}
