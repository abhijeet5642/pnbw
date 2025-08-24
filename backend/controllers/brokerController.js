// backend/controllers/brokerController.js
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Get a broker's dashboard data
// @route   GET /api/brokers/:id/dashboard
// @access  Private/Broker
const getBrokerDashboardData = asyncHandler(async (req, res) => {
  console.log('GET /api/brokers/:id/dashboard route was hit.');

  const brokerId = req.params.id?.toString();
  const authUserId = req.user?._id?.toString();

  if (!req.user) {
    console.log('❌ Error: No user object found on request. Authentication failed.');
    res.status(401);
    throw new Error('User not logged in or token is invalid.');
  }

  console.log(`✅ User object from token: ${JSON.stringify(req.user)}`);
  console.log(`📌 Requested broker ID from URL: ${brokerId}`);

  // Ensure the user is the same as the requested broker ID
  if (authUserId !== brokerId) {
    console.log(`❌ Error: User ID mismatch. Token ID = ${authUserId}, Requested ID = ${brokerId}`);
    res.status(403);
    throw new Error('Not authorized to access this dashboard');
  }

  // 1. Fetch broker details
  console.log('🔍 Attempting to find broker in database...');
  const broker = await User.findById(brokerId).select('fullName email referralCode');

  if (!broker) {
    console.log('❌ Error: Broker not found with the provided ID.');
    res.status(404);
    throw new Error('Broker not found in database');
  }

  // 2. Fetch listings and referrals
  console.log('📊 Fetching listings and referred brokers...');
  const listings = await Property.find({ agent: brokerId });
  const activeListings = listings.filter(l => l.status === 'published').length;

  const referredBrokers = await User.find({ referredBy: brokerId }).select('fullName email');

  // 3. Calculate profit (placeholder logic)
  let totalProfit = 0;

  console.log('✅ Data successfully compiled. Sending response...');
  res.json({
    stats: {
      referralCode: broker?.referralCode || 'N/A',
      totalListings: listings.length,
      activeListings: activeListings,
      profit: totalProfit,
    },
    listings: listings.map(l => ({
      id: l._id,
      title: l.title,
      price: l.price,
      status: l.status,
      views: l.views,
      createdAt: l.createdAt,
    })),
    referredBrokers: referredBrokers,
  });
});

export { getBrokerDashboardData };
