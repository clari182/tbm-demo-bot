//@ts-check
require('source-map-support').install();

const MongoClient = require('mongodb');
const path = require('path')
const botbuilder = require('botbuilder');
const _ = require("lodash");
const moment = require("moment");
const utils = require("./src/utils");
const speechService = require("./src/speechToText");
const cmusers = require("@connie/modules/dist/users");
const cmbotframework = require("@connie/modules/dist/botframework");
const cmconversation = require("@connie/modules/dist/conversation");
const cmi18n = require("@connie/modules/dist/i18n");
const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const restify = require('express-restify-mongoose');
const router = express.Router()
const querystring = require('querystring');

const connector = new botbuilder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});

const server = express();
const bot = new botbuilder.UniversalBot(connector);
require('./src/dialogsBase')(bot);


bot.set('localizerSettings', { botLocalePath: path.join(__dirname, '../locale') });

// dialogs

const recognizer = new botbuilder.LuisRecognizer(process.env.MICROSOFT_LUIS_MODEL_EN)
const intents = new botbuilder.IntentDialog({ recognizers: [recognizer] })

intents
    .matches(/\/getstarted/, '/getStarted') //for testing purposes
    .matches(/\/changelanguage/, '/changeLanguage') //for testing purposes
    .matches('None', '/None')
    .matches('About', '/about')
    .matches('Help', '/options')
    .matches('Greeting', '/greeting')
    .matches('Thankful', '/thankful')
    .matches('Laugh', '/laugh')
    .matches(/:like:/, '/like')
    .matches('Hate', '/hate')
    .matches('Love', '/love')
    .matches('Farewell', '/farewell')
    .matches('login', '/login')
    .matches('logout', '/logout')
    .onDefault('/None')

// root dialogs

bot.dialog('/', intents);

bot.dialog('/greeting', (session) => {

    session.replaceDialog('/getStarted')
})


bot.beginDialogAction('getstarted', '/getStarted');

bot.dialog('/getStarted', [
    (session, args) => {

        utils.say(session, `Greetings!`);

        session.replaceDialog("/options");
    }
])

bot.use(botbuilder.Middleware.dialogVersion({ version: 4, resetCommand: /^dialogversion/i }));

bot.dialog('/reset',
    (session) => {
        session.userData = {};
        session.conversationData = {};
        session.privateConversationData = {};

        session.send('Session reset!');
        session.replaceDialog('/getStarted');
    }
).triggerAction({ matches: /reset/ });

mongoose.connect(process.env.DB_URI, (err) => {
    if (err) {
        console.log(err.message);
        console.log(err);
    }
    else {
        console.log('Connected to MongoDb');
    }
});

// @ts-ignore
MongoClient.connect(process.env.DB_URI).then((db) => {

    server.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Pass to next layer of middleware
        next();
    });


    server.use(bodyParser.json())
    server.use(methodOverride())

    server.use(router)


    // this is for localtunnel
    server.get('/', (req, res) => res.send('hola'))

    // Handle Bot Framework messages
    server.post('/api/messages', connector.listen());


    cmusers.install(bot, db, server, { FACEBOOK_PAGE_TOKEN: process.env.FACEBOOK_PAGE_TOKEN })

    //cmanalytics.install(bot, process.env.DASHBOT_API_KEY);

    //
    cmconversation.installGeneric(bot, db);

    //
    //cmerrors.installRollbarReporter(bot, { token: process.env.ROLLBAR_TOKEN, environment: process.env.NODE_ENV });


    const listener = server.listen(process.env.PORT, function () {

        console.log('Bot started listening on', listener.address().address, listener.address().port);
    })
})
