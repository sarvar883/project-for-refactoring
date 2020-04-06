const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

// Import security packages
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/order');
const chatRoutes = require('./routes/chat');
const operatorRoutes = require('./routes/operator');
const adminRoutes = require('./routes/admin');
const subadminRoutes = require('./routes/subadmin');
const accountantRoutes = require('./routes/accountant');
const statsRoutes = require('./routes/stats');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require('./config/keys').mongoURI;

// import and launch telegram bot
const bot = require('./bot');
bot.launch();

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('server.js ERROR', err));


// Use security packages
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());
app.use(cors());

// Rate Limiting: 120 requests per 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 120
});
app.use(limiter);


// Passport middleware
app.use(passport.initialize());

// Passport Config
require('./config/passport')(passport);

// Use Routes
app.use(authRoutes);
app.use('/order', orderRoutes);
app.use('/chat', chatRoutes);
app.use('/operator', operatorRoutes);
app.use('/stats', statsRoutes);
app.use('/admin', adminRoutes);
app.use('/subadmin', subadminRoutes);
app.use('/accountant', accountantRoutes);

// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Server running on port ${port}`));
const io = require('./socket').init(server);