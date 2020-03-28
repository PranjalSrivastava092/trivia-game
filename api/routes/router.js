const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const requestModule = require('request');
const auth = require('../../auth');

router.get('/user', auth, async function(request, response){
  User.findById(request.user.id, function(err,user){
    if(err){
      console.error(err.msg);
      response.status(500).send('Server Error');
    }
    else{
      response.send(user);
    }
  });
});

router.post('/user/login',[ check('email', 'Please enter a valid email').isEmail(),
    check('password', 'The minimum length of password should be 8').isLength({ min: 8 })],
    async function(request, response){
      const { email, password } = request.body;
      User.findOne({ email: email },async function(err,user){
        if(err){
          console.error(err.message);
          response.send(400).send({ msg: 'server error' });
        }
	else{
	  if (!user) {
            user = new User({
              email: email,
              password: password
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            user.save(function(err){
	      if(!err){
                const token = jwt.sign({user: { id: user.id }}, 'SecretKey9999');
                response.send({
                  success: true,
                  token: token
                });
	      }
	    });
          }
	  else{
	    const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
              return response.status(400).send({ errors: [{ msg: 'Password is incorrect' }] });
            }

            const token = jwt.sign({user: { id: user.id }}, 'SecretKey9999');
            response.send({
              success: true,
              token: token
            });
	  }
	}
      });
    });

router.get('/game/new', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    console.log(user);

    const options = {
      uri: `https://opentdb.com/api.php?amount=5`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    requestModule(options, (error, response, body) => {
      console.log(body);
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        console.log(response.body);
        return res.status(400).json({ msg: 'No Questions found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.msg);
    res.status(500).send('Server Error');
  }
});

router.post('/game/score', auth, async (request, response) => {
  const user = await User.findById(request.user.id);
  const { score } = request.body;
  const game = {
    date: Date.now(),
    score: score
  };
  user.games.unshift(game);
  await user.save();
  response.status(200).send({ msg: 'game saved' });
});

router.post('/game/list', auth, async (request, response) => {
  const user = await User.findById(request.user.id).select('-password');
  response.status(200).send({ success: true, games: user.games });
});

router.post('/game/delete', auth, async (request, response) => {
  const user = await User.findById(request.user.id).select('-password');
  const game = {
    date: Date.now(),
    score: score
  };
  user.games.unshift(game);
  await user.save();
  response.status(200).send({ msg: 'game saved' });
});

module.exports = router;
