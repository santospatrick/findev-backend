const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

module.exports = {
  async index(req, res) {
    const devs = await Dev.find();

    return res.json(devs);
  },

  async store(req, res) {
    const { github_username, techs, latitude, longitude } = req.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const response = await axios.get(
        `https://api.github.com/users/${github_username}`,
      );

      const { name, login, avatar_url, bio } = response.data;

      const techsArray = parseStringAsArray(techs);

      const location = {
        type: 'Point',
        coordinates: [longitude, latitude],
      };

      const values = {
        name: name || login,
        github_username,
        avatar_url,
        bio,
        techs: techsArray,
        location,
      };

      dev = await Dev.create(values);

      // Filtrar as conexões que estão há no máximo 10k de distância
      // e que o novo dev tenha pelo menos umas das tecnologias filtradas

      const sendSocketMessageTo = findConnections(
        {
          latitude,
          longitude,
        },
        techsArray,
      );

      sendMessage(sendSocketMessageTo, 'newDev', dev);
    }

    return res.json(dev);
  },

  async update() {
    // TODO: apenas "name, avatar_url, bio, techs, location"
  },
  async destroy() {
    // TODO
  },
};
