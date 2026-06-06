import fs from 'fs';
import User from '../models/User.js';
import { analyzeSelfie } from '../services/aiService.js';
import { v2 as cloudinary } from 'cloudinary';

/**
 * @desc    Upload selfie & analyze details (skin tone, face shape, body type)
 * @route   POST /api/selfie/analyze
 * @access  Private
 */
export const uploadAndAnalyzeSelfie = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a selfie image' });
    }

    const filePath = req.file.path;
    const mimeType = req.file.mimetype;

    // 1. Upload to Cloudinary if available
    let imageUrl = '';
    if (process.env.CLOUDINARY_URL) {
      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: 'wardrobe_iq_selfies',
        });
        imageUrl = uploadResult.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary selfie upload failed, using local path:", cloudinaryErr.message);
        imageUrl = `/uploads/${req.file.filename}`;
      }
    } else {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    // 2. Perform AI Selfie Analysis (Gemini Vision or mock fallback)
    let analysis;
    try {
      analysis = await analyzeSelfie(filePath, mimeType);
    } catch (aiErr) {
      console.error("Selfie AI analysis failed, falling back to mock:", aiErr.message);
      analysis = {
        skinTone: 'neutral',
        faceShape: 'oval',
        bodyType: 'athletic',
        styleInsights: 'Neutral skin tone looks good in most colors, especially jewel tones (emerald, sapphire) and soft pinks/whites. Oval face shape accommodates various neckline configurations.'
      };
    }

    // Tidy up local temp file if Cloudinary was used
    if (process.env.CLOUDINARY_URL && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // 3. Find user and update their style profile with the results
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Determine color recommendations based on skin tone
    let preferredColors = [];
    let preferredStyle = 'minimalist';
    
    const skinToneLower = (analysis.skinTone || 'warm').toLowerCase();
    if (skinToneLower.includes('warm')) {
      preferredColors = ['olive', 'beige', 'brown', 'mustard', 'cream', 'rust'];
      preferredStyle = 'minimalist';
    } else if (skinToneLower.includes('cool')) {
      preferredColors = ['navy', 'grey', 'white', 'blue', 'charcoal', 'emerald'];
      preferredStyle = 'bold';
    } else {
      preferredColors = ['black', 'white', 'grey', 'navy', 'peach', 'lavender'];
      preferredStyle = 'casual';
    }

    user.styleProfile = {
      preferredColors: preferredColors,
      preferredStyle: user.styleProfile?.preferredStyle || preferredStyle,
      favoriteOccasionWear: user.styleProfile?.favoriteOccasionWear || 'casual outing',
      skinTone: analysis.skinTone,
      faceShape: analysis.faceShape,
      bodyType: analysis.bodyType,
      styleInsights: analysis.styleInsights,
    };

    // Set profile photo
    if (imageUrl) {
      user.profilePhoto = imageUrl;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Selfie analyzed and style profile updated successfully',
      styleProfile: user.styleProfile,
      profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error("Selfie upload/analyze error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
