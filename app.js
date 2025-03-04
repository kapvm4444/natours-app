const path = require('path');
const express = require('express');
const pug = require('pug');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const userRouter = require('./routes/userRoutes');
const tourRouter = require('./routes/tourRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();

console.log(process.env.NODE_ENV, 'from app.js');

app.use(
  cors({
    credentials: true,
    origin: '*'
  })
);

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//Using the "express.static()" middleware for accessing the static file in the file system (server)
//serving static files
app.use(express.static(`${__dirname}/public`));

//NOTE 1) Global Middlewares ----------------------------------------------------------
//helmet - for some security http headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://maps.googleapis.com',
//           'https://cdn.jsdelivr.net',
//           "'unsafe-inline'",
//         ],
//         styleSrc: [
//           "'self'",
//           'https://fonts.googleapis.com',
//           'https://api.mapbox.com',
//           'https://cdn.jsdelivr.net',
//           "'unsafe-inline'",
//         ],
//         fontSrc: ["'self'", 'https://fonts.gstatic.com'],
//         connectSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://maps.googleapis.com',
//           'https://events.mapbox.com',
//           'ws://127.0.0.1:53498/',
//         ],
//         imgSrc: [
//           "'self'",
//           'https://api.mapbox.com',
//           'https://maps.gstatic.com',
//           'https://maps.googleapis.com',
//           'https://mapsresources-pa.googleapis.com',
//           'data:',
//         ],
//         workerSrc: ["'self'", 'blob:'],
//       },
//     },
//   }),
// );

//check cookies
app.use(cookieParser());

app.use(compression());

//Development logging (logs)
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

//limit the number of requests of APIs in a specific period of time
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message:
    'Too many requests from this IP, please wait for a few hour before you log in again'
});
app.use('/api', limiter);

//body parser - reading data from req.body
app.use(express.json({ limit: '10kb' }));

//get the data from forms
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//sanitize the data (when someone try to get access without entering proper email and password)
app.use(mongoSanitize());

//block XSS (cross-site scripting attacks)
app.use(xss());

// block http parameters pollutions (hpp) [when someone try to give multiple same parameters in URL]
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'ratingsQuantity',
      'difficulty',
      'price'
    ]
  })
);

//=>
// display all cookies in console
app.use((req, res, next) => {
  req.requestTime = new Date().toString();
  // console.log(req.cookies);
  next();
});

//NOTE 3) Route Handlers and methods -------------------------------------------

//NOTE Routes ---------------------------------------------------------------
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`Cannot find ${req.originalUrl} in the server!`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`Cannot find ${req.originalUrl} in the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
