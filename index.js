const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3333;

app.post('/users', (req, res) => {
  console.log('req:', req.body);
  return res.json({ message: 'omnistack top' });
});

app.listen(PORT);
