const express = require('express');
const app = express();

// Port - change if needed
const port = 3001
const puppeteer = require('puppeteer');
const cors = require('cors');

var cvRouter = require('./routes/cvIO');

app.use(cors());

const mongoose = require('mongoose');
// 127.0.0.1:27017
// Change to hostname after following schema: username:pw@host:port/dbname
mongoose.connect('mongodb://account-management:pwp21@127.0.0.1:27017/account-management-pwp21', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("DB connected!")
    // we're connected!
});


app.get('/', (req, res) => {
    res.send('connected')
})


// Use this request to retrieve Text from a website
// e.g. curl http://localhost:3001/retrieveHTMLRAW?url=https://www.google.de
app.get('/retrieveHTMLRaw', (req, res) => {
    crawl(req.query.url).then(result => res.send(result)).catch(console.error);
    console.log("Received Request")
})

// Start express server  
app.listen(port, () => {
    console.log(`CV App listening at http://localhost:${port}`)
})

app.use('/cvIO', cvRouter);


// This function will use puppeteer to extract the data of a website
function crawl(url) {

    // Check if a parameter is passed
    if (!url) {
        throw "Please provide a valid URL";
    }

    // Check if URL has https if not prefix it ---- Note this can be done better maybe with a library
    if (url.indexOf('://') === -1) {
        url = 'https://' + url
    }

    // Make new promise
    return new Promise(async (resolve, reject) => {
        try {

            // Launch puppeteer and open URL
            const browser = await puppeteer.launch({
                headless: true,
                args: ["--disable-setuid-sandbox"],
                'ignoreHTTPSErrors': true
            });
            const page = await browser.newPage();
            await page.goto(url);
            console.log(url);

            // Return data of website
            let urls = await page.evaluate(() => {
                let results = [];

                // Define which part of the HTML document should be accessed  
                let items = document.querySelectorAll('body');

                // Store in Array
                items.forEach((item) => {
                    results.push({
                        html: item.innerHTML,
                        text: item.innerText,
                    });
                });

                return results;
            });

            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
