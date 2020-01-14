const { Router } = require('express');
const axios = require('axios');
const Dev = require('./models/Dev');

const routes = Router();

routes.post('/devs', async (req, res) => {
  const { github_username, techs, latitude, longitude } = req.body;

  const response = await axios.get(
    `https://api.github.com/users/${github_username}`,
  );

  const { name, login, avatar_url, bio } = response.data;

  const techsArray = techs.split(',').map(tech => tech.trim());

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

  const dev = await Dev.create(values);

  return res.json(dev);
});

module.exports = routes;
