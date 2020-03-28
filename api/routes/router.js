const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const request = require('request');
const auth = require('../../auth');

router.get('/user', auth, async function(request, response){
  User.findById(request.user.id, function(err,user){
    if(err){
      console.error(err.msg);
      response.status(500).send('Server Error');
    }
    else{
      response.send(user.select('-password'));
    }
  });
});

router.post('/user/login',[ check('email', 'Please enter a valid email').isEmail(),
    check('password', 'The minimum length of password should be 8').isLength({ min: 8 })],
    async function(request, response){
      const { email, password } = request.body;
      User.findOne({ email: email }, function(err,doc){
        if(err){
          console.error(err.message);
          response.send(400).send({ msg: 'server error' });
        }
	else{
	  if (!doc) {
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



module.exports = router;
