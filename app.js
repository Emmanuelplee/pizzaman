'use strict'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAAI9zhm29X4BAOfNxPfucLMVTrpRJg17WMG4Til0FsCHhQEsQZC3BBRB4baEFFRAm5MccC6cbqngQM7MYYP1l5gp2xHyjqG4hmMrSQrMOrHbuPy14v6f3GWMt9xSyEbrWZC1Xsj0ESERgXCWJ36ykEH9ko3vjwyWs6IjqxCzcKXSK8hAvF";

const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function(req, response){
    response.send('Hola mundo!!');
})

app.get('/webhook/', function(req, response){
    if(req.query['hub.verify_token'] === 'pizzaman_token'){
        console.log('Tienes permisos');
        response.send(req.query['hub.challenge'])
    } else{
        response.send('Pizzaman no tienes permisos.')
    }
})

app.post('/webhook/',function(req,res){
    const webhook_event = req.body.entry[0];
    if(webhook_event.messaging){
        webhook_event.messaging.forEach(event => {
            handleEvent(event.sender.id, event);
            console.log('event', event);
            // handleMessage(event);
        })
    }
    res.sendStatus(200);
})

function handleEvent(senderId, event){
    if(event.message){
        handleMessage(senderId, event.message);
    } else if(event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
}
function handleMessage(senderId, event){
    if(event.text){
        defaultMessage(senderId);
    } else if (event.attachments) {
        handleAttachments(senderId, event)
    }
}
function defaultMessage(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy un bot de messenger y te invito a utilizar nuestro menu",
            "quick_replies": [
                {
                    "content_type": "text",
                    "title": "¿Quieres una Pizza?",
                    "payload": "PIZZAS_PAYLOAD"
                },
                {
                    "content_type": "text",
                    "title": "Acerca de",
                    "payload": "ABOUT_PAYLOAD"
                }
            ]
        }
    }
    senderActions(senderId)
    callSendApi(messageData);
}

function handlePostback(senderId, payload){
    console.log(payload)
    switch (payload) {
        case "GET_STARTED_PIZZAMAN":
            console.log(payload)
        break;
        case "PIZZAS_PAYLOAD":
            showPizzas(senderId);
        break;
    }
}

function senderActions(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "sender_action": "typing_on"
    }
    callSendApi(messageData);
}

function handleAttachments(senderId, event){
    let attachment_type = event.attachments[0].type;
    switch (attachment_type) {
        case "image":
            console.log(attachment_type);
        break;
        case "video": 
            console.log(attachment_type);
        break;
        case "audio":
            console.log(attachment_type);
        break;
      case "file":
            console.log(attachment_type);
        break;
      default:
            console.log(attachment_type);
        break;
    }
}

// function handleMessage(event){
//     const senderId = event.sender.id;
//     console.log('event.message.text',event.message.text);
//     const messageText = event.message.text;
//     const messageData = {
//         recipient: {
//             id: senderId
//         },
//         message: {
//             text: messageText
//         }
//     }
//     callSendApi(messageData);
// }

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function(err) {
        if(err) {
            console.log('Ha ocurrido un error')
        } else {
            console.log('Mensaje enviado')
        }
    }
)
}

function showPizzas(senderId){
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Peperoni",
                            "subtitle": "Con todo del sabor del peperoni",
                            "image_url": "https://www.facebook.com/colegiomariadelaesperanza/photos/a.232940890241905/1110950415774277/?type=3&theater",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Peperoni",
                                    "payload": "PEPERONI_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Pollo BBQ",
                            "subtitle": "Con todo el sabor del BBQ",
                            "image_url": "https://www.facebook.com/colegiomariadelaesperanza/photos/a.232940890241905/1098016553734330/?type=3&theater",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Pollo BBQ",
                                    "payload": "BBQ_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData)
}

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando en el puerto: ', app.get('port'));
});