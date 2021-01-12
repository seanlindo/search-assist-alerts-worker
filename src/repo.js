
/** Libraries */
const pg    = require('pg-promise')()

/** Internal */
const DB    = require('./utils/db')

const GetSavedSearches = (userID) => (
    DB.MasterDBInstance.any(
        `
            SELECT sp.*
            FROM application_data.saved_project sp, application_data.saved_project_alert spa
            WHERE spa.user_id = $1
                AND sp.id = spa.saved_project_id
                AND spa.is_active = TRUE
        `, [ userID ]
    )
)

const GetUser = (userID) => (
    DB.MasterDBInstance.oneOrNone('SELECT * FROM user_data.user WHERE user_id = $1', [ userID ])
)

const SaveAlert = (ownerID, emailAddress, alert) => {
    const cs = new pg.helpers.ColumnSet(['owner_id', 'email_address', 'alert_type', 'content', 'created_date'], { table: { schema: 'application_data', table: 'alerts_log' }})

    const values = {
        owner_id: ownerID,
        email_address: emailAddress,
        alert_type: 'search_assist',
        content: alert,
        created_date: new Date()
    }

    const query = pg.helpers.insert(values, cs)

    return DB.MasterDBInstance.none(query)
}

module.exports = {
    GetSavedSearches,
    GetUser,
    SaveAlert,
}