// middleware/upload.js
const multer = require('multer');
const path = require('path');

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files in the 'uploads/' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, fileName);
  }
});
const fileFilter = (req, file, cb) => {
  console.log("File MIME type: ", file.mimetype);
  console.log("File extension: ", path.extname(file.originalname));

  // Allow all file types by not filtering
  cb(null, true);
};



// Initialize multer with storage and file filter
const upload = multer({ storage, fileFilter });

module.exports = upload;
