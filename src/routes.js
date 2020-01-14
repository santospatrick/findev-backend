const { Router } = require('express');
const axios = require('axios');
const Dev = require('./models/Dev');

const routes = Router();

routes.post('/devs', async (req, res) => {
  const { github_username, techs } = req.body;

  const response = await axios.get(
    `https://api.github.com/users/${github_username}`,
  );

  const { name = login, avatar_url, bio } = response.data;

  const techsArray = techs.split(',').map(tech => tech.trim());

  const values = {
    name,
    github_username,
    avatar_url,
    bio,
    techs: techsArray,
  };

  const dev = await Dev.create(values);

  return res.json(dev);
});

module.exports = routes;
