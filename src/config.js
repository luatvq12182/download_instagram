const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT;
const USERNAME = process.env.USER_NAME;
const PASSWORD = process.env.PASSWORD;
const HEADLESS = process.env.HEADLESS;
const COR_URL = process.env.COR_URL;
const ROOT_PATH = path.join(__dirname, '..');

module.exports = {
    PORT,
    USERNAME,
    PASSWORD,
    HEADLESS,
    ROOT_PATH,
    COR_URL
}