/** Libraries */
const winston       = require('winston')
require('winston-papertrail').Papertrail

const logger = new (winston.Logger)()

logger.add(winston.transports.Console, {
    prettyPrint: true,
    colorize: true,
    silent: false,
    timestamp: false,
})

if (process.env.NODE_ENV == 'production') {
    logger.add(winston.transports.Papertrail, {
        host: process.env.PAPERTRAIL_HOST,
        port: process.env.PAPERTRAIL_PORT,
        program: process.env.PROGRAM_NAME,
        colorize: true,
        inlineMeta: true
    })
}

module.exports = logger