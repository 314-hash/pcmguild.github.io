const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'community_manager', 'social_media', 'content_creator', 'business_dev', 'educator', 'maintainer', 'admin'],
    default: 'user',
  },
  stakedAmount: {
    type: Number,
    default: 0,
  },
  rewards: {
    type: Number,
    default: 0,
  },
  contributions: [{
    type: {
      type: String,
      enum: ['post', 'comment', 'event', 'training', 'partnership'],
    },
    content: String,
    timestamp: Date,
    impact: Number,
  }],
  profile: {
    avatar: String,
    bio: String,
    skills: [String],
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
    },
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to check staking eligibility
userSchema.methods.isStakingEligible = function() {
  return this.stakedAmount >= 1000;
};

module.exports = mongoose.model('User', userSchema);
