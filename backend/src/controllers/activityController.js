import Activity from '../models/Activity.js';

// @desc    Get recent activities
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req, res, next) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 })
      .limit(10);
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};
