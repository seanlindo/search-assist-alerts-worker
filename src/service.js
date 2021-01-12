/** libraries */
const _                             = require('lodash')

/** internal */
const { BuildSearchAssistAlert }    = require('./alerts.service')
const { CompileEmail,
    SendEmail }                     = require('./email.service')
const { SaveAlert }                 = require('./repo')

const ExecuteService = async({ user_id, team_id, user_email }) => {
    const assistAlerts = await BuildSearchAssistAlert(user_id, team_id)

    if(_.isEmpty(assistAlerts)) return

    const emailHTML = CompileEmail(assistAlerts)

    await SendEmail(user_email, emailHTML)

    await SaveAlert(user_id, user_email, { assistAlerts })

    return true
}

module.exports = ExecuteService