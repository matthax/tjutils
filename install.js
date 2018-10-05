const fs = require('fs');

fs.mkdir('settings', (error) => {
    if (error) {
        console.error(error);
        process.exit(1);
    } else {
        process.exit(0);
    }
});