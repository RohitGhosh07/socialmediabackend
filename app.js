require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');  // Import the CORS middleware
const { sequelize } = require('./models');  // Import the sequelize instance
const path = require('path');  // Import path module for better path handling

// Import routes
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');  // Import authentication routes
const chatRoutes = require('./routes/chat');  // Import chat routes

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS
app.use(cors({ origin: 'http://localhost:3000' }));  // Allow requests from your frontend

app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chats', chatRoutes);

// Serve the home page with the image
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'assets', 'apirunning.gif'));
});

// Sync database and start server
sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(process.env.PORT || 5000, '0.0.0.0', () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('Database sync failed:', err));
