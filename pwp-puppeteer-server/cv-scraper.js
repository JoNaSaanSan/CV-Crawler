// run this file via  node .\cv-scraper.js https://url.com
const puppeteer = require('puppeteer');

const url = process.argv[2];
if (!url) {
    throw "Please provide URL as a first argument";
}

function run () {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(url);
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('body');
                console.log(items)
                items.forEach((item) => {
                    results.push({
                        url:  item.getAttribute('href'),
                        text: item.innerText,
                    });
                });
                return results;
            })
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
run().then(console.log).catch(console.error);