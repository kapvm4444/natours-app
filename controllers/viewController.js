const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

//=>
// Home Page
exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

//=>
// Tour Detail Page
exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug: slug });

  if (!tour) return next(new AppError('There is no tour with that name', 404));

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

//=>
// Log in Page
exports.login = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: `Natours | Login`,
  });
});

exports.getAccountInfo = (req, res, next) => {
  res.status(200).render('account', {
    title: `Manage Account`,
  });
};

exports.changeUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      runValidators: true,
      new: true,
    },
  );

  res.status(200).render('account', {
    title: `Manage Account`,
    user: updatedUser,
  });
});
