const utils = require('./utils');

module.exports = (bot) => {

    bot.dialog('/hate', (session) => {

        utils.say(session, ['😐', '🤔', '☹️', '😳'], ['Hmmmm', 'How rude!']);
        session.endConversation()
    })

    bot.dialog('/thankful', (session) => {

        utils.say(session, `You are welcome!`);
        session.endConversation()
    })

    bot.dialog('/laugh', (session) => {

        utils.say(session, `Hahaha!`);
        session.endConversation();
    })

    bot.dialog('/love', (session) => {

        utils.say(['💟', '😍', '🤗'], ['Awwwwww', 'Love you too!']);
        session.endConversation();
    })

    bot.dialog('/farewell',
        [
            (session) => {

                utils.say(session, `At your service 😙`);
                session.endConversation();
            }
        ])

    bot.dialog('/like',
        [
            (session) => {

                utils.say(':like:', 'I like you too');
                session.endConversation();
            }
        ])


    bot.dialog('/None', (session, args) => {

        utils.say(session, `Sorry, I didn't get that`);
        session.replaceDialog('/getStarted');
    })

    bot.dialog('/about', (session) => {

        utils.say(session, `TravelMate 2017. At your service!`);
        session.endConversation();
    })

    return {

    }

}