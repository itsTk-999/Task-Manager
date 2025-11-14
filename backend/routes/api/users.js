const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('crypto'); // Built-in Node module

// @route   POST api/users/register
// @desc    Register user
// @access  Public
//
// MAKE SURE THIS LINE IS router.post('/register', ...)
//
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // req.user.id is available from the 'auth' middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/forgot-password
// @desc    Send a password reset link
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ msg: 'If an account with this email exists, a reset link has been sent.' });
    }

    const resetToken = jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '15m' } 
    );

    const resetUrl = `${process.env.APP_BASE_URL}/reset-password/${resetToken}`;

    const emailHtml = `
      <h2>Task Manager Password Reset</h2>
      <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
      <p>Please click the link below to reset your password. This link is valid for 15 minutes.</p>
      <a href="${resetUrl}" style="background-color: #0077cc; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `;

    await sendEmail(user.email, 'Your Task Manager Password Reset Link', emailHtml);

    res.json({ msg: 'If an account with this email exists, a reset link has been sent.' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/users/reset-password
// @desc    Reset the user's password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token) {
    return res.status(400).json({ msg: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 2. Hash the new password FIRST
    const salt = await bcrypt.genSalt(10);
    const newPasswordHashed = await bcrypt.hash(password, salt);

    // 3. Find and update the user in one atomic operation.
    // This command finds the user by ID and sets their password
    // directly, skipping the 'pre-save' hook and avoiding
    // the double-hashing bug.
    const user = await User.findByIdAndUpdate(
      decoded.user.id,
      { $set: { password: newPasswordHashed } }
    );
    
    // 4. Check if the user was actually found
    if (!user) {
      return res.status(400).json({ msg: 'Invalid token, user not found.' });
    }

    res.json({ msg: 'Password reset successful! You can now log in.' });

  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid or has expired.' });
  }
});

//
// MAKE SURE THIS LINE IS AT THE VERY END
//
module.exports = router;