const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('../config');



if (!config.USERNAME) {
    throw new Error('Username not found!');
} else if (!config.PASSWORD) {
    throw new Error('Password not found');
};

const getAndSaveCookie = async (username, pw) => {
    const browser = await puppeteer.launch({ headless: config.HEADLESS });
    const page = await browser.newPage();
  
    await page.goto('https://www.instagram.com/accounts/login/');
  
    return new Promise((resolve) => {
        setTimeout(async () => {
            await page.type('input[name="username"]', username || config.USERNAME);
            await page.type('input[name="password"]', pw || config.PASSWORD);
            
            await page.click('button[type="submit"]');
            // await page.waitForNavigation()
      
            setTimeout(async () => {
                const cookies = await page.cookies();
                const cookieJson = JSON.stringify(cookies);
          
                fs.writeFileSync('cookies.json', cookieJson);

                resolve();
            }, 8000);
        }, 6000);
    });
}

module.exports = getAndSaveCookie;