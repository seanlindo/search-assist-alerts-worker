/** libarires */
const _                             = require('lodash')

/** internal */
const { GetSavedSearches }          = require('./repo')
const { BuildSavedSearchAlerts }    = require('./search.service')

const BuildSearchAssistAlert = async (userID, teamID) => {
    const savedSearchCollection = await GetSavedSearches(userID)

    if(_.isEmpty(savedSearchCollection)) return

    const savedSearchAlerts = await BuildSavedSearchAlerts(userID, teamID, savedSearchCollection)

    return savedSearchAlerts
}

module.exports = {
    BuildSearchAssistAlert
}