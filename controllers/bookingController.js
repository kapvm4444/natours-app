const catchAsync = require('./../utils/catchAsync');
const Tour = require('./../models/tourModel');

exports.getBookingSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);
});
