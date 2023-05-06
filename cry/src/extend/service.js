module.exports = {
  async getUserInfo(token) {
    console.log(token);
    const url = `${think.config('API_CONFIG').PANDORA}/user`;
    const data = await think
      .fetch(url, {
        headers: {
          Authorization: token,
        },
      })
      .then(res => {
        return res.json();
      });
    return data;
  },
};
