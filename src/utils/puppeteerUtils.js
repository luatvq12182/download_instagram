const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('../config');



const createPagePuppeteer = async (headless = config.HEADLESS, requireLogin = true) => {
    const browser = await puppeteer.launch({ headless: headless });

    const page = await browser.newPage();

    const cookies = fs.readFileSync('cookies.json', 'utf8');
    
    const deserializedCookies = JSON.parse(cookies);

    await page.setCookie(...deserializedCookies);

    return { page, browser};
};

const goToPage = async (page, url) => {
    await page.goto(url, {waitUntil: 'load', timeout: 0});
};

module.exports = {
    goToPage,
    createPagePuppeteer
}