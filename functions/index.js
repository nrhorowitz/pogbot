//Reference from https://medium.com/@Astider/how-to-สร้าง-messenger-chatbot-แบบ-serverless-ด้วย-google-firebase-908c3eaba67e
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const VERIFIED_TOKEN = "EAAFbxlZCS7QIBAE05BXV1SL9viQHdn1ZCHO5S4lfwly5EMq93NqWOMypmP0VwrIyTpNRwTUSVGmAVZBzYB9AgrmAHMdRKYblIG4lCl20gMkszTthgvqmCSg96HcS8lpOqZAt1XBNjK187GvIghQLpquRNZBI8zMUBD7Kz8ZBtlNtjgqyZBwRrpF6yz3GThA79EZD"

exports.commentRandom = functions.https.onRequest((request, response) => {
    console.log(request);
    console.log(request.method);
    if(request.method == "GET") {
        if (request.query['hub.mode'] === 'subscribe' &&
        request.query['hub.verify_token'] === "EAAFbxlZCS7QIBAE05BXV1SL9viQHdn1ZCHO5S4lfwly5EMq93NqWOMypmP0VwrIyTpNRwTUSVGmAVZBzYB9AgrmAHMdRKYblIG4lCl20gMkszTthgvqmCSg96HcS8lpOqZAt1XBNjK187GvIghQLpquRNZBI8zMUBD7Kz8ZBtlNtjgqyZBwRrpF6yz3GThA79EZD") {
            console.log("Validating webhook");
            response.status(200).send(request.query['hub.challenge']);
        }
        else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.sendStatus(403);
        }
    } else if(request.method == "POST") {
        var data = request.body;
        if (data.object === 'page') {
            const changes = data.entry[0].changes[0];
            if (changes.field === 'feed') {
                var postData = changes.value;
                console.log('verb', postData.verb);
                tagPost(postData.post_id, postData.message, postData.from);
            }
            response.sendStatus(200)
        }
    }
});

function tagPost(post_id, message, from) {
    console.log(post_id, ' with message ', message, ' from ', from);
}



exports.bearService = functions.https.onRequest((request, response) => {
    console.log(request);
    console.log(request.method);
    if(request.method == "GET") {
        if (request.query['hub.mode'] === 'subscribe' &&
        request.query['hub.verify_token'] === "EAAFbxlZCS7QIBAE05BXV1SL9viQHdn1ZCHO5S4lfwly5EMq93NqWOMypmP0VwrIyTpNRwTUSVGmAVZBzYB9AgrmAHMdRKYblIG4lCl20gMkszTthgvqmCSg96HcS8lpOqZAt1XBNjK187GvIghQLpquRNZBI8zMUBD7Kz8ZBtlNtjgqyZBwRrpF6yz3GThA79EZD") {
            console.log("Validating webhook");
            response.status(200).send(request.query['hub.challenge']);
        }
        else {
            console.error("Failed validation. Make sure the validation tokens match.");
            response.sendStatus(403);
        }
    } else if(request.method == "POST") {
        var data = request.body;
        console.log(data);
        if (data.object === 'page') {
            data.entry.forEach(entry => {
                var pageID = entry.id;
                var timeOfEvent = entry.time;
                console.log('entry : ${JSON.stringify(entry)}')
                entry.messaging.forEach(event => {
                    if (event.message) {
                        receivedMessage(event)
                    } else {
                        console.log("Webhook received unknown event: ", event)
                    }
                })       
            })
            response.sendStatus(200)
        }
    }
});

function receivedMessage(event) {
    let senderID = event.sender.id
    let recipientID = event.recipient.id
    let timeOfMessage = event.timestamp
    let message = event.message

    //ถ้าข้อความมาแล้ว log ตรงนี้จะเห็นข้อความเลยครับ
    console.log("Received message for user %d and page %d at %d with message:",
        senderID, recipientID, timeOfMessage)
    console.log(JSON.stringify(message))
    let messageId = message.mid
    let messageText = message.text
    let messageAttachments = message.attachments

    if (messageText) {
        //ส่วนนี้ใช้ Switch case มาทำ rule-base คือดักคำมาทำงานแตกต่างกันไป
        //เรียกได้ว่าเป็นวิธีที่ basic และง่ายสุดในการทำบอทก็ว่าได้ 555
        if (messageText.toLowerCase()) {
            if (messageText.search('hello') >= 0) {
                greeting(senderID)
            } else {
                sendTextMessage(senderID, messageText)
            }
        }
    } else if (messageAttachments) {
        sendTextMessage(senderID, "Message with attachment received");
    }
}

function greeting(recipientId) {
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: "Hello"
        }
    }
    callSendAPI(messageData)
}

function sendTextMessage(recipientId, messageText) {
    //จัดข้อความที่จะส่งกลับในรูปแบบ object ตามที่ Messenger กำหนด
    let messageData = {
        recipient: {
            id: recipientId
        },
        message: {
            text: messageText//,
            //metadata: "DEVELOPER_DEFINED_METADATA"
        }
    }
    callSendAPI(messageData)
}

const axios = require('axios')
function callSendAPI(messageData) {
    console.log('message data : ${JSON.stringify(messageData)}');
    axios({
        method: 'POST',
        url: 'https://graph.facebook.com/v2.6/me/messages',
        params: {
            'access_token': 'EAAFbxlZCS7QIBAE05BXV1SL9viQHdn1ZCHO5S4lfwly5EMq93NqWOMypmP0VwrIyTpNRwTUSVGmAVZBzYB9AgrmAHMdRKYblIG4lCl20gMkszTthgvqmCSg96HcS8lpOqZAt1XBNjK187GvIghQLpquRNZBI8zMUBD7Kz8ZBtlNtjgqyZBwRrpF6yz3GThA79EZD'
        },
        data: messageData
    })
    .then(response => {
        if (response.status == 200) {
            let body = response.data
            let recipientId = body.recipient_id;
            let messageId = body.message_id;
            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s", 
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s", 
                    recipientId);
            }
        }
        else {
            console.error("Failed calling Send API", response.status,
                response.statusText, response.data.error);
         }
    })
    .catch(error => {
        console.log('error : ${error}')
        console.log('axios send message failed');
    })
}