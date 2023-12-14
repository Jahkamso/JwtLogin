// server.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const secretKey = 'secretKey'; // Replace with a secure secret key

// JSONPlaceholder users endpoint
const usersEndpoint = 'https://jsonplaceholder.typicode.com/users';

app.post('/api/login', async (req, res) => {
  const { username, email } = req.body;

  try {
    // Fetch users from JSONPlaceholder
    const response = await axios.get(usersEndpoint);
    const users = response.data;

    // Check if the provided username and password match any user
    const user = users.find((u) => u.username === username && u.email === email);

    if (user) {
      const token = jwt.sign({ userId: user.id, username: user.username }, secretKey, { expiresIn: '40s' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error fetching users', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/data', verifyToken, async (req, res) => {
  try {
    const tokenData = jwt.verify(req.token, secretKey);
    const userId = tokenData.userId;

    // Fetch the user's data based on userId
    const response = await axios.get(`${usersEndpoint}/${userId}`);
    const userData = response.data;

    res.json({ data: userData });
  } catch (error) {
    console.error('Error fetching user data', error);

    if (error.name === 'TokenExpiredError') {
        // Token expired, redirect to login
        res.redirect('/login');
      } else {
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];
    req.token = bearerToken;

    // Check token expiration
    const decoded = jwt.decode(req.token);
    if (decoded && decoded.exp * 1000 < Date.now()) {
      // Token expired, redirect to login
      res.redirect('/login');
    } else {
      next();
    }
  } else {
    res.sendStatus(403);
  }
}

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
