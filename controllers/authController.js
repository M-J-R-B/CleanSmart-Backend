const User = require('../models/User');

// Signup Controller
exports.signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log('Signup attempt:', { fullName, email });

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', { email });
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password
    });

    console.log('User created successfully:', { id: user._id, fullName: user.fullName, email: user.email });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);

    const user = await User.findOne({ email });

    if (!user) {
      console.log('No user found with email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate a session ID
    const sessionId = require('crypto').randomBytes(64).toString('hex');
    
    // Store session ID in user document
    user.sessionId = sessionId;
    user.lastActive = new Date();
    await user.save();
    
    // Set sessionId cookie that will be sent with future requests
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout Controller
exports.logout = async (req, res) => {
  try {
    // Clear session ID from cookie
    res.clearCookie('sessionId');
    
    // If we have the user's sessionId, clear it from the database too
    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      const user = await User.findOne({ sessionId });
      if (user) {
        user.sessionId = null;
        await user.save();
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}; 