require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');  // Import the sequelize instance
const path = require('path');  // Import path module for better path handling

// Import routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');  // Import authentication routes

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
// Serve the home page with the image
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assets', 'apirunning.gif'));
});


// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
    
  })
  .catch(err => console.error('Database sync failed:', err));
