const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkID);

//label
// nested reviews routes for specif tour
router.use('/:tourId/reviews', reviewRouter);

//label
// getting top 5 tours
router
  .route('/top-5-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

//label
// getting the tour STATS and MONTHLY plan [only for admins and lead-guids]
router
  .route('/tour-stats')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guid'),
    tourController.getTourStates,
  );

router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guid'),
    tourController.getMonthlyPlan,
  );

//label
// GET ALL tours and CREATE tours
router
  .route('/')
  .get(tourController.getAllTours)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guid'),
    tourController.createTour,
  );

//label
// GET ONE, UPDATE, and DELETE a tour
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guid'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.setTourId,
    tourController.deleteTour,
  );

//label
// GeoSpatial data routes - Get startLocations in spoecified range
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);

//label
// GeoSpatial data routes - Get startLocations of all tours [nearby first]
router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

module.exports = router;
