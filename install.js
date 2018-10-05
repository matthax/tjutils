const fs = require('fs');
// const path = require('path');
// const os = require('os');

// const tj = path.join(__dirname, 'tj');
// const settings = path.join(tj, 'settings');
const dir = 'settings';

fs.mkdir(dir, (error) => {
  if (error) {
    console.error('Could not create settings directory', error);
  } else {
    process.exit(0);
  }
});
