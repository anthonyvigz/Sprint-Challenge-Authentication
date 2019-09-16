const router = require('express').Router();

const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');



router.post('/register', (req, res) => {
  // implement registration
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
});

router.post('/login', (req, res) => {
  // implement login
});

module.exports = router;
