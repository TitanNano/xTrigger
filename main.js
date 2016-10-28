const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
const telegramBotKey = '130912325:AAFe4ScQmexY1PIem-Oy2r3coaKdHEn3Mk4';

app.listen('8080');

app.use(bodyParser.json());

app.post('/notify/:id', (request, response) => {
    notify({
        chatId : request.params.id,
        message: request.body.message
    });
});


app.post('/update', (request, response) => {
    if (request.body.message) {
        let { message } = request.body;

        if (message.text.indexOf('/start') === 0) {
            notify({ 
                chatId : message.chat.id,
                message : `Welcome in the IFTTT Notificator (xTrigger Bot).
                To receive Notifications use "https://xtrigger.herokuapp.com/notify/${message.chat.id}".`
            });
        }
    }
});

const notify = function({ chatId, message }) {
    let requ = https.request({
        protocol: 'https:',
        hostname: 'api.telegram.org',
        path: `/bot${telegramBotKey}/sendMessage`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }, (res) => {
        console.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            console.log('No more data in response.');
        });
    });

    let body = JSON.stringify({
        chat_id: chatId
        text: message,
    });

    requ.end(body);

    response.status(200);
    response.end();
}
