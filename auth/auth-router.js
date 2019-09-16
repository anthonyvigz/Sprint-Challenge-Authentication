const router = require('express').Router();

const bcrypt = require('bcryptjs');
const Users = require('../users/users-model.js');
const { authenticate, jwtKey } = require('../auth/authenticate-middleware.js');



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

});

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

module.exports = router;
