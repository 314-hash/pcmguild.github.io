const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Web3 = require('web3');

const web3 = new Web3(process.env.BLOCKCHAIN_NETWORK || 'http://localhost:8545');

exports.register = async (req, res) => {
  try {
    const { username, email, password, walletAddress } = req.body;

    // Validate wallet address
    if (!web3.utils.isAddress(walletAddress)) {
      return res.status(400).json({ message: 'Invalid wallet address' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }, { walletAddress }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email, username, or wallet address already exists' 
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      walletAddress,
      role: 'user'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        stakedAmount: user.stakedAmount
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { bio, skills, socialLinks } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update profile fields
    user.profile.bio = bio || user.profile.bio;
    user.profile.skills = skills || user.profile.skills;
    user.profile.socialLinks = { ...user.profile.socialLinks, ...socialLinks };

    await user.save();

    res.json({ 
      message: 'Profile updated successfully',
      profile: user.profile 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};
