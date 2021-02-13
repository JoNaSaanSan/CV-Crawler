const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
const pdf = require('html-pdf');

// Port - change if needed
const port = 10003
const cors = require('cors');

var userRouter = require('./routes/userIO');
var cvRouter = require('./routes/cvIO');


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Routes for interacting with userdb and cvdb.
app.use("/", userRouter);
app.use("/cvAPI", cvRouter);

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

//test database, should have access from any ip 
//mongoose.connect("mongodb+srv://iris:iris123@mycluster1.7zdgt.mongodb.net/UserSettings?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })


app.get('/', (req, res) => {
    console.log("Hier der Pfad: " + path.join(__dirname, 'build/index.html'))
    res.sendFile(path.join(__dirname, 'build/index.html'));
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

/**
 * makes a PDF from the user's CV page and returns it 
 */
app.post('/downloadCV', (req, res) => {
    const cvURL = req.body.url;
    printPDF(cvURL).then(result => {
        res.set({ 'Content-Type': 'application/pdf', 'Content-Length': result.length }) //sets the header
        res.send(result) //sends response
    }).catch(console.error);
})

/**
 * returns the the PDF with the CV 
 */
app.get('/fetch-pdf', (req, res) => {
    res.sendFile(`${__dirname}/myCV.pdf`)
})


/**
 * prints PDF from URL to myCV.pdf (is overwritten everytime) and returns the pdf 
 */
async function printPDF(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const browser = await puppeteer.launch({ headless: true }); //launch Puppeteer
            const page = await browser.newPage(); //open URL
            await page.goto(url, { waitUntil: 'networkidle0' }); //wait until the page is completely loaded
            const pdf = await page.pdf({ path: 'myCV.pdf', format: 'A4' }); //generate pdf from page
            console.log('PDF created!')
            await browser.close(); //close browser
            return resolve(pdf);

        } catch (e) {
            console.log('Error', e)
            return reject(e)
        }
    })
}

