const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Company = require('../models/company');
const User =require('../models/user')
const auth =require('../middleware/companyauth')
const userauth = require('../middleware/userauth');
const mongoose = require('mongoose');


router.get('/', auth, async (req, res) => {
  try {
    const company = await Company.findById(req.company.id).select('-password');
    return res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error!' });
  }
});







//get by params
router.get('/:companyid', auth, async (req, res) => {
  try {
    const companyid= req.params.companyid
    const company = await Company.findById(companyid).select('-password');
    return res.json(company);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error!' });
  }
});





router.post('/', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a valid password').exists(),
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { email, password } = req.body;

  try {
    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(400).json({ msg: 'Company does not exist!' });
    }

    const isMatch = await bcrypt.compare(password, company.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const payload = {
      company: {
        id: company.id,
      },
    };

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1hr' }, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
      });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error!' });
  }
});

router.post('/register', [
  check('name', 'Please enter your full name').not().isEmpty(),
  check('email', 'Please enter a valid email address').isEmail(),
  check('address', 'Please enter a current address'),
  check('category', 'Please enter your company category'),
  check('phoneNumber', 'Please enter your company phone number'),
  check('password', 'Please enter a password with at least 5 characters').isLength({
    min: 5,
  }),
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { name, email, password, address, category, phoneNumber } = req.body;

  try {
    let company = await Company.findOne({ email });

    if (company) {
      return res.status(400).json({ msg: 'Company already exists' });
    }

    company = new Company({
      name,
      email,
      password,
      address,
      category,
      phoneNumber,
    });

    const salt = await bcrypt.genSalt(10);
    company.password = await bcrypt.hash(password, salt);

    await company.save();

    const payload = {
      company: {
        id: company.id,
      },
    };

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1800000' }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});









router.post('/userlogin', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a valid password').exists(),
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1hr' }, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
      });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error!' });
  }
});



//get by params user
router.get('/:userid', userauth, async (req, res) => {
  try {
    const userId = req.params.userid; // Corrected variable name
    const user = await User.findById(userId).select('-password'); // Corrected variable name
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error!' });
  }
});






router.get('/getuserdetails', userauth, async (req, res) => {
  try {
    const id =req.user.id
    console.log(id)
    const userdata =await User.findById(id)
    res.json(userdata)
} catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ msg: 'Server error' });
  }
});




module.exports = router;
