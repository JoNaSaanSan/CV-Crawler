const express = require('express');
const app = express();

// Port - change if needed
const port = 3001
const puppeteer = require('puppeteer');
const cors = require('cors');

app.use(cors());


app.get('/', (req, res) => {
  res.send('connected')
})


// Use this request to retrieve Text from a website
// e.g. curl http://localhost:3001/retrieveHTMLRAW?url=https://www.google.de
app.get('/retrieveHTMLRaw', (req, res) => {
    crawl(req.query.url).then(result => res.send(result)).catch(console.error);
    console.log("Received Request")
  })

// Use this request to get PDF from a website, must still be fetched at client side with axios
// e.g. curl http://localhost:3001/getHTMLasPDF?url=https://www.youtube.com
app.get('/getHTMLasPDF', (req,res) =>{
    printPDF(req.query.url).then(result => {res.set({'Content-Type': 'application/pdf', 'Content-Length': result.length})
    res.send(result)}).catch(console.error);
    console.log("Received HTML as PDF request")
})


// Start express server  
app.listen(port, () => {
  console.log(`CV App listening at http://localhost:${port}`)
})

//prints PDF to mypdf.pdf (is still overwritten everytime)
async function printPDF(url){

    try{
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.goto(url,{waitUntil: 'networkidle0'});
    //await page.addStyleTag({content: '.nav {display:none} .navbar {border:0px} '})
    const pdf = await page.pdf({path:'mypdf.pdf',format: 'A4'});
    await browser.close();
    return pdf;
    
    } catch(e){
        console.log('Error', e)
    }
}


// This function will use puppeteer to extract the data of a website
function crawl (url) {

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
            const browser = await puppeteer.launch();
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
                        text: item.innerText,
                    });
                });

                console.log(results)
                return results;
            });
            
            browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}
