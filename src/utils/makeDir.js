const fs = require('fs');



const makeDirSyncIfNotExist = (path) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    } 
};

module.exports = makeDirSyncIfNotExist;