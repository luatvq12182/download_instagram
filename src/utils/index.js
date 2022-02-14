const downloadImgBySrc = require('./downloadImgBySrc');
const getAndSaveCookie = require('./getCookie');
const makeDirSyncIfNotExist = require('./makeDir');
const scrollPage = require('./scrollPage');
const {
    goToPage,
    createPagePuppeteer
} = require('./puppeteerUtils');



module.exports = {
    downloadImgBySrc,
    getAndSaveCookie,
    makeDirSyncIfNotExist,
    scrollPage,
    goToPage,
    createPagePuppeteer,
}