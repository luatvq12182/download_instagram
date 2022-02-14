const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const config = require('./config');
const router = require('./routes');
const compression = require('compression');
const Utils = require('./utils');

const corsOptions = {
    origin: config.COR_URL
}

fs.stat('cookies.json', (err) => {
    if (err === null) {
        console.log('OK fine');
    } else if(err.code === 'ENOENT') {
        Utils.getAndSaveCookie();
    } else {
        console.log(err)
    }
});

if (!config.PORT) {
    throw new Error('PORT not found');
};

const app = express();

app.use(cors(corsOptions));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// app.use(helmet());
app.use(express.static('public'));
app.use(express.static('download'));
app.use(express.json());
app.use(compression());
app.use(router);

app.listen(config.PORT, () => {
    console.log('Server is running')
});
