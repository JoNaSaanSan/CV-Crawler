const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const nodemailer = require("nodemailer");


// Create a router and an express server
const router = express.Router();
const app = express();

// “CORS” stands for Cross-Origin Resource Sharing. It allows you to make 
// requests from one website to another website in the browser.
app.use(cors());

// Parses json 
app.use(express.json());

// Middlewarefunction with the router 
app.use("/", router);

// Including a parser for JSON contents
app.use(bodyParser.json());


// Email authentification in gmail
const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "cvcrawler@gmail.com",
        pass: "pwpusermanagement",
    },
});


// Possible errors about the authentification 
contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } else {
        console.log("Ready to Send");
    }
});


// Taking the sent data from the mailform and send it via nodemailer transportation
// to the receiver
router.post("/contact", (req, res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const message = req.body.message;

    const mail = {
        // from: lastName,
        to: "cvcrawler@gmail.com",
        subject: "CV Contact",
        html: `<p>Name: ${firstName} ${lastName}</p><p>Email: 
        ${email}</p><p>Message: ${message}</p>`,
    };

    // Status about the sent mail 
    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json({ status: "failed" });
        } else {
            res.json({ status: "sent" });
        }
    });

    // Sent the status back to the mailform to fire the alert 
    res.status(200).send('Mail has been sent!');

});


app.listen(3001, () => console.log("Server Running"));


