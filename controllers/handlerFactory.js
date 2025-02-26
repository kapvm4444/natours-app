const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('../utils/apiFeatures');
const Review = require('./../models/reviewModel');

//=>
// Getter [All] Factory Function - Gets a data of "Model"s Data
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    //for getting the tourId for nested routes in reviews [hack]
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .paginate()
      .limitField();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: doc.length,
      data: {
        doc,
      },
    });
  });

//=>
// Getter [ONE] Factory Function - Gets a data of "Model"s Data
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    //NOTE shorthand method (provided by mongoose) for this -> db.tours.findOne({ id: req.params.id }) <from mongosh queries>
    if (!doc) {
      return next(new AppError('Can not find any document with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

//=>
// Creating Factory Function - Creates data of "Model"s Data
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

//=>
// Updating Factory Function - Updates data of "Model"s Data
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('Can not find any document with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc,
      },
    });
  });

//=>
// Deleting Factory Function - Delete data of "Model"'s Data
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    //deleting all the reviews when deleting a specific tour
    if (req.tourId) {
      await Review.deleteMany({ tour: req.tourId });
    }

    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError('No document found with that ID', 404));

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
