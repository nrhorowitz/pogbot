//const puppeteer = require('puppeteer');
//const password = require('./config.js').password;

console.log("START");

'use strict';

// Imports dependencies and set up http server
const express = require('express');
const bodyParser = require('body-parser');
const app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === 'page') {
  
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function(entry) {
  
        // Gets the message. entry.messaging is an array, but 
        // will only ever contain one message, so we get index 0
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send('EVENT_RECEIVED');
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  
});


// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "EAAFbxlZCS7QIBALwn7YZAaZBwpMDqsa8vW6TNcHBu2z6kpZA1z5vd8XXkT4dD9rHWxsLopOGgVaQwfdRugxrWIqNSrxOQeq94pql0DcLwTEbE7rMRoeMFfdZAdPYpkrVYXKsMNpWcud9iWv9HBfCnHvnJi8NRy7rK5HQCTsMwUon4sGRH9iMm0ZCQMjPhYXTwZD"
      
    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
        console.log(token);
        console.log(VERIFY_TOKEN);
    
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);      
      }
    }
  });






/*

(async ()=>{
    try {
        const browser = await puppeteer.launch({
            headless: false
        });
        const page = await browser.newPage();
        await page.setViewport({width: 1000, height: 600});
        await page.goto("https://www.facebook.com");
        await page.waitForSelector("#email");
        await page.type("#email", "pogbotfb@gmail.com");
        await page.type("#pass", "poggers123$");
        await page.click(`[type="submit"]`);
        await page.waitForNavigation();
        console.log('we in facebook');
        await page.click(`div`); //lag overlay in chrome

        await page.waitForSelector(`[aria-label="What's on your mind, Pog?"]`);
        await page.click(`[aria-label="What's on your mind, Pog?"]`);

        var d = new Date();

        //post text
        let sentence = "pogtest:" + d.toUTCString();
        for (let i = 0; i < sentence.length; i += 1) {
            await page.keyboard.press(sentence[i]);
            if (i === sentence.length - 1) {
                await page.waitFor(2000);
                await page.click(`[class="_1mf7 _4r1q _4jy0 _4jy3 _4jy1 _51sy selected _42ft"]`); //post button
                //await page.keyboard.down('Control');
                //await page.keyboard.press(String.fromCharCode(13)); //enter ~ 13
                //await page.keyboard.up('Control');
                console.log('posted');
            }
        }

    } catch (error) {
        console.log(error);
    }
})()//TODO: () to activate*/
