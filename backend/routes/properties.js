import express from 'express';
import multer from 'multer';
import path from 'path';
import Property from '../models/Property.js';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js'; // Assuming this is the correct path

const router = express.Router();

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- EXISTING PROPERTY ROUTES ---

// GET all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error while fetching properties.' });
  }
});

// POST a new property
router.post('/', upload.array('images', 10), async (req, res) => {
    try {
        const { title, description, propertyType, price, units, bedrooms, bathrooms, furnishing, possession, builtYear, locality, city, lat, lng, amenities, videoUrls, submittedBy } = req.body;
        const rawImagePaths = req.files.map(file => file.path);
        const images = rawImagePaths.map(p => p.replace(/\\/g, '/'));
        const parsedAmenities = amenities ? JSON.parse(amenities) : [];
        const parsedVideoUrls = videoUrls ? JSON.parse(videoUrls) : [];
        const newPropertyData = {
            title, description, propertyType, price,
            area: parseInt(units, 10),
            bedrooms: bedrooms ? parseInt(bedrooms, 10) : 0,
            bathrooms: bathrooms ? parseInt(bathrooms, 10) : 0,
            furnishing, possession,
            builtYear: builtYear ? parseInt(builtYear, 10) : null,
            locality, city,
            location: `${locality}, ${city}`,
            locationCoords: { lat: lat ? parseFloat(lat) : null, lng: lng ? parseFloat(lng) : null },
            amenities: parsedAmenities,
            videoUrls: parsedVideoUrls,
            images: images,
            submittedBy,
            agent: "60d0fe4f5311236168a109ca" // Remember to replace this placeholder
        };
        const property = new Property(newPropertyData);
        await property.save();
        res.status(201).json({ message: "Property created successfully!", property });
    } catch (error) {
        console.error('Error creating property:', error);
        res.status(500).json({ message: 'Server error while creating property.' });
    }
});

// GET a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching single property:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// --- ROUTES FOR REVIEWS ---

// @desc    Get reviews for a property
// @route   GET /api/properties/:id/reviews
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.id }).populate('user', 'name');
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new review
// @route   POST /api/properties/:id/reviews
// @access  Private (requires login)
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const alreadyReviewed = await Review.findOne({ 
      property: req.params.id, 
      user: req.user._id 
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Property already reviewed' });
    }

    const review = new Review({
      rating: Number(rating),
      comment,
      user: req.user._id,
      property: req.params.id,
    });

    await review.save();

    const reviews = await Review.find({ property: req.params.id });
    property.numReviews = reviews.length;
    property.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    
    await property.save();

    res.status(201).json({ message: 'Review added' });

  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;