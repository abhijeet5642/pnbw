import Property from "../models/Property.js";
import mongoose from 'mongoose'; // Ensure mongoose is imported if not already

// @desc    Fetch all properties
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).populate("agent", "fullName email");
    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Fetch single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "agent",
      "fullName email"
    );

    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Helper function to safely parse numbers, preventing NaN issues
const safeParseNumber = (value, defaultValue = null) => {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Admin
const createProperty = async (req, res) => {
  const {
    title,
    description,
    propertyType,
    price, // This will now be a string
    units, // Corresponds to 'area'
    bedrooms,
    bathrooms,
    furnishing,
    possession,
    builtYear,
    locality,
    city,
    videoUrls,
    lat,
    lng,
    amenities,
    submittedBy,
  } = req.body;

  try {
    // --- Step 1: Explicitly check for required fields ---
    if (!title || !description || !propertyType || !price || !units || !locality || !city) {
      return res.status(400).json({ message: 'Please fill all required fields: Title, Description, Type, Price, Area, Locality, and City.' });
    }

    // Basic validation for the price string format (optional but recommended)
    const priceRegex = /^\d+-\d+\sper\s\w+$/; // Example: "9000-60000 per yard"
    if (typeof price !== 'string' || !priceRegex.test(price)) {
      return res.status(400).json({ message: 'Price must be in "MIN-MAX per UNIT" format (e.g., 9000-60000 per yard).' });
    }

    // Get the filenames from multer if they exist
    const imagePaths = (Array.isArray(req.files) ? req.files : [])
      .map(file => `${file.filename}`);

    // --- Step 3: Create the property with clean, validated data ---
    const property = await Property.create({
      title,
      description,
      propertyType,
      price: price, // Store price directly as a string
      area: safeParseNumber(units),
      bedrooms: safeParseNumber(bedrooms, 0),
      bathrooms: safeParseNumber(bathrooms, 0),
      furnishing,
      possession,
      builtYear: safeParseNumber(builtYear),
      location: `${locality}, ${city}`,
      locality,
      city,
      images: imagePaths,
      videoUrls: JSON.parse(videoUrls || '[]'),
      amenities: JSON.parse(amenities || '[]'),
      locationCoords: {
        lat: safeParseNumber(lat),
        lng: safeParseNumber(lng),
      },
      agent: req.user._id,
      submittedBy,
    });
    console.log("data saved to database", property);

    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: 'Server Error while creating property' });
  }
};


// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Admin
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // New uploaded images
    const newImages = (Array.isArray(req.files) ? req.files : [])
      .map(file => `/uploads/${file.filename}`);

    // If frontend also passes old images to keep
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch {
        existingImages = [];
      }
    }

    // Update fields, using safeParseNumber for numerical fields
    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.propertyType = req.body.propertyType || property.propertyType;
    property.price = req.body.price || property.price; // Price remains a string
    property.area = safeParseNumber(req.body.area, property.area); // Use safeParseNumber
    property.bedrooms = safeParseNumber(req.body.bedrooms, property.bedrooms); // Use safeParseNumber
    property.bathrooms = safeParseNumber(req.body.bathrooms, property.bathrooms); // Use safeParseNumber
    property.furnishing = req.body.furnishing || property.furnishing;
    property.possession = req.body.possession || property.possession;
    property.builtYear = safeParseNumber(req.body.builtYear, property.builtYear); // Use safeParseNumber
    property.locality = req.body.locality || property.locality;
    property.city = req.body.city || property.city;
    property.location = `${property.locality}, ${property.city}`; // Reconstruct location

    // Handle images, video URLs, amenities, and location coordinates
    if (req.body.videoUrls) {
      try {
        property.videoUrls = JSON.parse(req.body.videoUrls);
      } catch {
        property.videoUrls = [];
      }
    }
    if (req.body.amenities) {
      try {
        property.amenities = JSON.parse(req.body.amenities);
      } catch {
        property.amenities = [];
      }
    }
    if (req.body.lat && req.body.lng) {
      property.locationCoords = {
        lat: safeParseNumber(req.body.lat, property.locationCoords?.lat),
        lng: safeParseNumber(req.body.lng, property.locationCoords?.lng),
      };
    } else if (req.body.lat === '' || req.body.lng === '') { // Allow clearing coords
        property.locationCoords = { lat: null, lng: null };
    }


    // Combine existing and new images
    property.images = [...existingImages, ...newImages];
    property.submittedBy = req.body.submittedBy || property.submittedBy;


    const updatedProperty = await property.save();
    res.json(updatedProperty);
  } catch (error) {
    console.error("Error updating property:", error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation Error', errors: error.errors });
    }
    res.status(500).json({ message: "Server Error" });
  }
};


// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (property) {
      await property.deleteOne();
      res.json({ message: "Property removed" });
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};