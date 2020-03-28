const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { chk, vR } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../auth');

router.get('/user', auth, async function(request, response){
  try {
    const user = await User.findById(request.user.id);
    response.send(user.select('-password'));
  } catch (err) {
    console.error(err.msg);
    response.status(500).send('Server Error');
  }
});

router.post('/user/login',[ chk('email', 'Please enter a valid email').isEmail(),
    chk('password', 'The minimum length of password should be 8').isLength({ min: 8 })],
  async function(request, response){
    try {
      const errs = vR(request);
      if (!errs.isEmpty()) {
        return response.status(400).send({ errors: errs.array() });
      }
      const { email, password } = request.body;
      var doc = await User.findOne({ email: email });

      if (!doc) {
        user = new User({
          email,
          password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        user.save(function(err){
	  if(!err){
            const token = jwt.sign({user: { id: user.id }}, 'SecretKey9999');
            return response.send({
              success: true,
              token: token
            });
	  }
	});
      }
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
    catch (err) {
      console.error(err.message);
      response.send(400).send({ msg: 'server error' });
    }
  }
);

module.exports = router;
