/** Libraries */
const pg        = require('pg')
const pgp       = require('pg-promise')()

const MasterDBInstance              = pgp(process.env.MDB_CONN_STRING)
const StreamingDBInstance = new pg.Client(process.env.MDB_CONN_STRING)

module.exports = {
    MasterDBInstance,
    StreamingDBInstance
}