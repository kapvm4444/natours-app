const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour must have length less or equal to 40 characters'],
      minLength: [10, 'A tour must have length more or equal to 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a Duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a Group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have Difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The difficulties must be either: easy, medium, or difficult',
      },
    },
    price: {
      type: Number,
      required: [true, 'A tour must have price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'Rating must be above 1.0'],
      max: [5.0, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to 'create' methods not on 'update'
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
      select: true,
    },
    description: {
      type: String,
      trim: true,
      select: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: true,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON [JSON document format for the geospatial data - simply for locations in map]
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      //array of GeoJSON, GeoLocations
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

//creating indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

//virtual fields
tourSchema.virtual('durationInWeeks').get(function () {
  return this.duration / 7;
});

//virtual population
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//NOTE DOCUMENT MIDDLEWARE [HOOK]:runs *before* .save() and .create() as term 'save' and 'pre', aka pre-save
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//pre hook for the embedding the guids to the tour
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function (next) {
//   console.log('...will save your doc 💥');
//   next();
// });

// // note runs after (as called 'post') the defined method, which is 'save in our case, aka post-save
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took ${Date.now() - this.start} Milliseconds ⏲️`);
  // console.log(docs);
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  }).populate({
    path: 'reviews',
    select: '-__v',
  });
  next();
});

//AGGREGATION MIDDLEWARE
//--code--
//tourSchema.pre('aggregate', function (next) {
//  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//  next();
//});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
