/** internal */
const ContextHelper = require('../context-helper')

beforeAll(async () => {
    const contextClassRef = ContextHelper

    contextClassRef.usefulContext = 'hello'
})

describe('[Unit Test]', () => {
    it('Should always pass', () => {
        expect('hello').toEqual('hello')
    })
})