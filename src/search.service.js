/** libraries */
const _                     = require('lodash')
const Lambda                = require('aws-sdk/clients/lambda')
const ScoringThreshold      = require('@engage_admin/scoring-threshold')
const se                    = require('serialize-error')

/** internal */
const es                    = require('./es')
const logger                = require('./utils/logger')

const lambda = new Lambda({ region: 'us-east-1' })

const BuildSavedSearchAlerts = async (userID, teamID, savedSearchCollection) => {
    let results = []
    const chunks = _.chunk(savedSearchCollection, 3)
    
    for (let chunk of chunks) {
        const promiseCollection = await Promise.all(chunk.map(x =>
            ExecuteSearch(userID, teamID, x)
        ))

        results = [ ...results, ...promiseCollection ]
    }

    return _.compact(results)
}

const ExecuteSearch = async (userID, teamID, savedSearch) => {
    savedSearch.filters.hideViewedCandidates = true

    const lambdaObject = generateLambdaRequest(userID, teamID, savedSearch)
    const searchQuery = await getESQuery(lambdaObject)

    try {
        const searchResults = await es.search({
            index: 'candidate_active',
            size: 25,
            body: searchQuery,
            preference: userID
        })
        
        const cleanedCandidates = _(CleanSearchResults(searchResults.hits.hits)).shuffle().take(3).value()
        
        return {
            cleanedCandidates,
            searchTitle: savedSearch.project_name
        }
    } catch (e) {
        logger.error({
            error: se(e),
            userID,
            searchID: savedSearch.id
        })
        
        return null
    }
}

const generateLambdaRequest = (userID, teamID, savedSearch) => (
    {
        userID,
        companyID: teamID,
        searchObject: savedSearch.filters,
        queryOptions: {
            useAggregations: false,
            trackTotalHits: false
        }
    }
)

const CleanSearchResults = (searchResults) => (
    searchResults.map(dataObj => {
        const candidate = dataObj._source
        const scoreDetail = ScoringThreshold.GetCandidateScoreDescription(candidate.rawEngageScore)
        const locationText = BuildLocationText(candidate.location)

        return {
            candidate_id: candidate.sourceID,
            candidate_url: `https://app.engagetalent.com/talent/${candidate.id}`,
            current_employer: _.get(candidate, 'currentEmployment[0].companyName', null) == null ? 'N/A' : candidate.currentEmployment[0].companyName,
            first_name: candidate.firstName,
            job_title: _.get(candidate, 'currentEmployment[0].jobTitle', null) == null ? 'N/A' : candidate.currentEmployment[0].jobTitle,
            last_name: candidate.lastName,
            location: locationText,
            score: candidate.rawEngageScore * 2,
            score_delta: 200 - (candidate.rawEngageScore * 2),
            score_color: scoreDetail.color,
            score_detail: scoreDetail.shortTitle
        }
    })
)

const BuildLocationText = (location) => {
    if (location && location.city && location.state) {
        return `${location.city}, ${location.state}`
    } else if (location && location.state) {
        return location.state
    } else {
        return 'N/A'
    }
}

const getESQuery = (savedSearch) => (
    new Promise((resolve, reject) => {
        lambda.invoke({
            FunctionName: process.env.SEARCH_BUILDER_LAMBDA_NAME,
            Payload: JSON.stringify(savedSearch)
        }, (e, data) => {
            if(e) {
                reject(e)
            }
            
            if(_.isEmpty(_.get(data, 'Payload'))){
                resolve(null)
        
                return
            }
            
            const esQuery = JSON.parse(data.Payload)
                
            resolve(esQuery)
        })
    })
)

module.exports = {
    BuildSavedSearchAlerts
}