const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const materials = require('../client/src/components/common/materials');

// Load Input Validation
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');


exports.registerUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      let emptyArray = [];
      materials.forEach(item => {
        emptyArray.push({
          material: item.material,
          amount: 0,
          unit: 'гр'
        });
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        occupation: req.body.occupation,
        color: req.body.color,
        password: req.body.password,
        materials: emptyArray
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log('registerUser ERROR', err));
        });
      });
    }
  });
};


exports.loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
      errors.email = 'User not found';
      return res.status(404).json(errors);
    }

    // Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User Matched

        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          occupation: user.occupation,
          materials: user.materials,
          color: user.color
        };

        // Sign Token
        jwt.sign(
          payload,
          keys.secretOrKey,
          // { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
              user: payload
            });
          }
        );
      } else {
        errors.password = 'Password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
};


// @desc    Return current user
exports.currentUser = (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    occupation: req.user.occupation,
    materials: req.user.materials,
    color: req.user.color
  });
};


exports.getDisinfectorMaterials = (req, res) => {
  User.findById(req.body.id)
    .then(disinfector => res.json(disinfector.materials))
    .catch(err => {
      console.log('getCurrentDisinfector ERROR', err);
      return res.status(404).json(err);
    });
};