/** Bootstrap */
require('dotenv').config()

/** Libraries*/
const se                = require('serialize-error')

/** Internal */
const logger            = require('./src/utils/logger')
const ExecuteService    = require('./src/service')

exports.handler = async (event) => {
    const message = process.env.NODE_ENV == 'production' ? JSON.parse(event.Records[0].body) : event

    try {
        await ExecuteService(message)
    } catch (err) {
        logger.error({
            error: se(err)
        })

        return err
    }
}