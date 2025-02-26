const express = require('express');
const viewController = require('./../controllers/viewController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/me', authController.protect, viewController.getAccountInfo);
router.post(
  '/submit-user-data',
  authController.protect,
  viewController.changeUserData,
);

router.use(authController.isLoggedIn);

//=>
// Default Route
router.route('/').get(viewController.getOverview);

//=>
// get the specific tour info
router.route('/tour/:slug').get(viewController.getTour);

//=>
// Log in route
router.route('/login').get(viewController.login);

module.exports = router;
