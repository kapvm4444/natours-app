const catchAsync = require('./../utils/catchAsync');
const ApiFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');
const Review = require('./../models/reviewModel');
const Tour = require('./../models/tourModel');
const factory = require('./handlerFactory');

//Get all reviews
exports.getAllReviews = factory.getAll(Review);

//get a review
exports.getReview = factory.getOne(Review);

//set the tour and user IDs for the nested routes
exports.setTourUserIds = catchAsync(async (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  //check if that and tour exist or not
  const tour = await Tour.findById(req.body.tour);

  if (!tour)
    next(new AppError("Tour belong to this review doesn't exist", 404));

  next();
});

//Create Review
exports.createReview = factory.createOne(Review);

//Update Review
exports.updateReview = factory.updateOne(Review);

//Delete Review
exports.deleteReview = factory.deleteOne(Review);
