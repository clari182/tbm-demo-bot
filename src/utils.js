//=========================================================
// Utilities
//=========================================================
let needle = require('needle');

exports.hasAudioAttachment = function (session) {

    const hasAttachments = session.message.attachments && session.message.attachments.length > 0;

    return hasAttachments && (session.message.attachments[0].contentType === 'audio/wav' || session.message.attachments[0].contentType === 'application/octet-stream');
}

exports.getAudioStreamFromMessage = function (connector, message) {
    var headers = {};
    var attachment = message.attachments[0];
    if (checkRequiresToken(message)) {
        // The Skype attachment URLs are secured by JwtToken,
        // you should set the JwtToken of your bot as the authorization header for the GET request your bot initiates to fetch the image.
        // https://github.com/Microsoft/BotBuilder/issues/662
        connector.getAccessToken(function (error, token) {
            var tok = token;
            headers['Authorization'] = 'Bearer ' + token;
            headers['Content-Type'] = 'application/octet-stream';

            return needle.get(attachment.contentUrl, { headers: headers });
        });
    }

    headers['Content-Type'] = attachment.contentType;
    return needle.get(attachment.contentUrl, { headers: headers });
}

exports.checkRequiresToken = function (message) {
    return message.source === 'skype' || message.source === 'msteams';
}

exports.processText = function (text) {
    var result = 'You said: ' + text + '.';

    if (text && text.length > 0) {
        var wordCount = text.split(' ').filter(function (x) { return x; }).length;
        result += '\n\nWord Count: ' + wordCount;

        var characterCount = text.replace(/ /g, '').length;
        result += '\n\nCharacter Count: ' + characterCount;

        var spaceCount = text.split(' ').length - 1;
        result += '\n\nSpace Count: ' + spaceCount;

        var m = text.match(/[aeiou]/gi);
        var vowelCount = m === null ? 0 : m.length;
        result += '\n\nVowel Count: ' + vowelCount;
    }

    return result;
}

exports.addTimeToDate = function (date, time) {
    let dateStarted = new Date(date);
    let timeStarted = new Date(time);
    return new Date(dateStarted.getFullYear(), dateStarted.getMonth(), dateStarted.getUTCDate(), timeStarted.getHours(), timeStarted.getMinutes());
}

// utility function until botbuilder das an updateå

exports.say = (session, text, options) => {

    session.say(text, text, options);
}