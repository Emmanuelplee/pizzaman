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
            // console.log('event', event);
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
        // defaultMessage(senderId);//mensaje del bot
        // messageImage(senderId);//imagen graciosa
        // contactSuppport(senderId);//Contactanos
        // showLocations(senderId);//Contactanos
        receipt(senderId);
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
            console.log(payload);
        break;
        case "PIZZAS_PAYLOAD":
            showPizzas(senderId);
        break;
        case "BBQ_PAYLOAD":
            sizePizza(senderId);
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

function callSendApi(response) {
    request({
        // "uri": "https://graph.facebook.com/me/messages",
        "uri": "https://graph.facebook.com/v2.6/me/messages",
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
    })
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
                            "subtitle": "Con todo del sabor del peperoni!!",
                            "image_url": "https://scontent.fmex5-1.fna.fbcdn.net/v/t1.0-9/67467415_106024084077666_4025006632688680960_n.jpg?_nc_cat=103&_nc_oc=AQkYzhn_HgqoNWnC-Hk3SXO96Yx8Ce9k-u1EzWoR1Hg7kCGJc3M7mKPJdPHtQCrbSrg&_nc_ht=scontent.fmex5-1.fna&oh=0411e97996b868b2ca3d60ac08079553&oe=5DE31EAB",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Peperoni",
                                    "payload": "PEPPERONI_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Pollo BBQ",
                            "subtitle": "Con todo el sabor del BBQ!!",
                            "image_url": "https://scontent.fmex5-1.fna.fbcdn.net/v/t1.0-9/67554644_106030167410391_1428987438159626240_o.jpg?_nc_cat=105&_nc_oc=AQmOKstOQi_R4IXQBd-XMXVSsw3mL79yxucwQ93bvlVIDoGMyJPxbrC4qh1LaOcI4nU&_nc_ht=scontent.fmex5-1.fna&oh=2047db0233ef56ddb7dd1b5185c9a33c&oe=5DD71259",
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

function messageImage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "image",
                "payload": {
                    "url": "https://media.giphy.com/media/1dOIvm5ynwYolB2Xlh/giphy.gif"
                }
            }
        }
    }
    callSendApi(messageData);
}

function contactSuppport(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "button",
                    "text": "Hola este es el canal de soporte, ¿quieres llamarnos?",
                    "buttons": [
                        {
                            "type": "phone_number",
                            "title": "Llamar a un asesor",
                            "payload": "+571231231231"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function showLocations(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    // "top_element_style": "large",
                    "elements": [
                        {
                            "title": "Sucursal Mexico",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Direccion bonita #555",
                            "default_action": {
                                "type": "web_url",
                                "url": "https://petersfancybrownhats.com/view?item=103",
                                "webview_height_ratio": "tall",
                              },
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/GCCpWmZep1t",
                                    "webview_height_ratio": "full"
                                }
                            ]
                        },
                        {
                            "title": "Sucursal Colombia",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Direccion muy lejana #333",
                            "buttons": [
                                {
                                    "title": "Ver en el mapa",
                                    "type": "web_url",
                                    "url": "https://goo.gl/maps/GCCpWmZep1t",
                                    "webview_height_ratio": "tall"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function sizePizza(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            attachment: {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [
                        {
                            "title": "Individual",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Porcion individual de pizza",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Individual",
                                    "payload": "PERSONAL_SIZE_PAYLOAD",
                                }
                            ]
                        },
                        {
                            "title": "Mediana",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg",
                            "subtitle": "Porcion Mediana de pizza",
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Elegir Mediana",
                                    "payload": "MEDIUM_SIZE_PAYLOAD",
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}

function receipt(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "receipt",
                    "recipient_name": "Oscar Barajas",
                    "order_number": "123123",
                    "currency": "MXN",
                    "payment_method": "Efectivo",
                    "order_url": "https://platzi.com/order/123",
                    "timestamp": "123123123",
                    "address": {
                        "street_1": "Platzi HQ",
                        "street_2": "---",
                        "city": "Mexico",
                        "postal_code": "543135",
                        "state": "Mexico",
                        "country": "Mexico"
                    },
                    "summary": {
                        "subtotal": 12.00,
                        "shipping_cost": 2.00,
                        "total_tax": 1.00,
                        "total_cost": 15.00
                    },
                    "adjustments": [
                        {
                            "name": "Descuento frecuent",
                            "amount": 1.00
                        }
                    ],
                    "elements": [
                        {
                            "title": "Pizza Pepperoni",
                            "subtitle": "La mejor pizza de pepperoni",
                            "quantity": 1,
                            "price": 10,
                            "currency": "MXN",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                        },
                        {
                            "title": "Bebida",
                            "subtitle": "Jugo de Tamarindo",
                            "quantity": 1,
                            "price": 2,
                            "currency": "MXN",
                            "image_url": "https://s3.amazonaws.com/chewiekie/img/productos-pizza-peperoni-champinones.jpg"
                        }
                    ]
                }
            }
        }
    }
    callSendApi(messageData);
}
//Este metoodo ya no funciona fue parchado po facebook
// function getLocation(senderId){
//     const messageData = {
//         "recipient": {
//             "id": senderId
//         },
//         "message": {
//             "text": "Ahora ¿Puedes proporcionarnos tu ubicación?",
//             "quick_replies": [
//                 {
//                     "content_type": "location"
//                 }
//             ]
//         }
//     }
//     callSendApi(messageData);
// }

app.listen(app.get('port'), function(){
    console.log('Nuestro servidor esta funcionando en el puerto: ', app.get('port'));
});