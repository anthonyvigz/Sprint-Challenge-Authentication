const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { authenticate, jwtKey } = require('../auth/authenticate-middleware.js');
const Users = require('../users/users-model.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10)
  user.password = hash;

  Users.add(user)
    .then(newUser => {
      res
        .status(201)
        .json(newUser);
    })
    .catch(error => {
      res
        .status(500)
        .json(error);
    });
};

function login(req, res) {
  const { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      console.log(user)
      if(user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        console.log('in if statement');
        res
          .status(200)
          .json({
            message: 'login successful',
            token
          });
      }
      else {
        res
          .status(401)
          .json({ 
            message: 'Invalid Credential' 
          });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({
          errorMessage: 'login error' 
        });
    }); 
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  
  const options = {
    expiresIn: '1h'
  };
  
  return jwt.sign(payload, jwtKey, options);
}
