/** libraries */
const fs            = require('fs-sync')
const handlebars    = require('handlebars')
const sendgrid      = require('@sendgrid/mail')

sendgrid.setApiKey(process.env.SENDGRID_KEY)

const SUBJECT_LINE = 'Your Weekly Search Assist Updates'

const CompileEmail = (alertCollection) => {
    const sourceHTML = fs.read(__dirname + '/email-template.html')
    const template = handlebars.compile(sourceHTML)

    return template( {alerts: alertCollection })
}

const SendEmail = (emailAddress, htmlMessage) => {
    return sendgrid.send({
        to: emailAddress,
        from: 'ENGAGE AI Assistant <ai.assistant@engagetalent.com>',
        subject: SUBJECT_LINE,
        text: 'Your Weekly Search Assist Updates',
        html: htmlMessage,
        categories: [
            'search_assist'
        ],
    })
}

module.exports = {
    CompileEmail,
    SendEmail
}
