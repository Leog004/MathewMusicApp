const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const musicRouter = require('./routes/musicRoutes');
const userRouter = require('./routes/usersRoutes');


app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

// serving static files
app.use(express.static(path.join(__dirname, 'public')));

// MIDDLEWARE
if(process.env.NODE_ENV === 'development'){ app.use(morgan('dev')); }

// limits request from a certain ip address
const limiter = rateLimit({
    max:100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request coming from this ip address, please try again in a hour'
});

// set secure https 
app.use(helmet());
app.use('/api', limiter);

// body parsar, reading data from body
app.use(express.json({limit: '10kb'}));


// Data sanatization agains Nosql attacks
app.use(mongoSanitize());

// Data santization against xss
app.use(xss());



// Gets Time of request
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.get('/', (req, res) => {
    // res.status(200).json({
    //     status: 'success',
    //     message: 'Hello from the server side!',
    //     app: 'Mathew Maciel Website'
    // });
    res.status(200).render('base');
});

// ROUTES
app.use('/api/v1/music', musicRouter); // gets music routes
app.use('/api/v1/users', userRouter); // get user routes

// global route
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler); // displays global error




module.exports = app;