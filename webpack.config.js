const path = require('path');

module.exports = {
  mode: 'production', // Use 'development' during development if desired
  entry: './popup.js', // Your main JavaScript file
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  // For Chrome Extensions you typically target web (which is the default)
  target: 'web',
};
