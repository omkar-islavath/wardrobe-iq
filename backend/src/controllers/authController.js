import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'wardrobeiq_secret_key_12345!@#', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ success: false, error: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user.id),
        user: {
          _id: user.id, // preserve _id for frontend compatibility
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
          styleProfile: user.styleProfile,
        },
      });
    } else {
      res.status(400).json({ success: false, error: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user.id),
        user: {
          _id: user.id, // preserve _id for frontend compatibility
          name: user.name,
          email: user.email,
          profilePhoto: user.profilePhoto,
          styleProfile: user.styleProfile,
        },
      });
    } else {
      res.status(401).json({ success: false, error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        success: true,
        user: {
          ...user.toJSON(),
          _id: user.id // preserve _id for frontend compatibility
        },
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update user style profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateStyleProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      const { preferredColors, preferredStyle, favoriteOccasionWear, skinTone, faceShape, bodyType, styleInsights } = req.body;
      
      // Update name if present
      if (req.body.name !== undefined) {
        user.name = req.body.name;
      }

      // Update style profile JSONB structure
      const currentProfile = user.styleProfile || {};
      
      const newProfile = {
        preferredColors: preferredColors !== undefined ? preferredColors : (currentProfile.preferredColors || []),
        preferredStyle: preferredStyle !== undefined ? preferredStyle : (currentProfile.preferredStyle || 'casual'),
        favoriteOccasionWear: favoriteOccasionWear !== undefined ? favoriteOccasionWear : (currentProfile.favoriteOccasionWear || 'casual outing'),
        skinTone: skinTone !== undefined ? skinTone : (currentProfile.skinTone || ''),
        faceShape: faceShape !== undefined ? faceShape : (currentProfile.faceShape || ''),
        bodyType: bodyType !== undefined ? bodyType : (currentProfile.bodyType || ''),
        styleInsights: styleInsights !== undefined ? styleInsights : (currentProfile.styleInsights || ''),
      };

      user.styleProfile = newProfile;

      if (req.body.profilePhoto !== undefined) {
        user.profilePhoto = req.body.profilePhoto;
      }

      await user.save();
      
      res.json({
        success: true,
        user: {
          ...user.toJSON(),
          _id: user.id // preserve _id for frontend compatibility
        },
      });
    } else {
      res.status(404).json({ success: false, error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Upload profile photo
 * @route   POST /api/auth/profile-photo
 * @access  Private
 */
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const relativePath = `/uploads/${req.file.filename}`;
    user.profilePhoto = relativePath;
    await user.save();

    res.json({
      success: true,
      profilePhoto: relativePath,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Reset password (Forgot Password flow)
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  const { email, name, newPassword } = req.body;

  if (!email || !name || !newPassword) {
    return res.status(400).json({ success: false, error: 'Please provide email, name, and new password' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Account with this email does not exist' });
    }

    if (user.name.trim().toLowerCase() !== name.trim().toLowerCase()) {
      return res.status(400).json({ success: false, error: 'Verification failed: Name does not match this account' });
    }

    user.password = newPassword;
    await user.save(); // triggers beforeUpdate hook to hash the new password

    res.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
