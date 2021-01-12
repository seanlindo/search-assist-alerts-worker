/** libraries */
const elasticsearch = require('elasticsearch')

const es = new elasticsearch.Client({ host: process.env.ES_CONN_STRING })

module.exports = es