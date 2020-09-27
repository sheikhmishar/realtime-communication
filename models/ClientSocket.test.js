const { deepStrictEqual, notDeepStrictEqual, ok } = require('assert')
const {
  getClientSockets,
  addClientSocket,
  findClientSocketByUsername,
  getClientSocketCount,
  removeClientSocket
} = require('./ClientSocket')

describe('Model: ClientSocket', () => {
  beforeEach(() => (getClientSockets().length = 0))

  describe('Method: getClientSockets', () =>
    it('should have an array', () =>
      deepStrictEqual(typeof getClientSockets().length, 'number')))

  describe('Method: addClientSocket', () => {
    // @ts-ignore
    const newSocket = addClientSocket({ id: 'anyId', username: 'anyName' })
    it('should add and return index of a socket', () => ok(newSocket > 0))
  })

  describe('Method: findClientSocketByUsername', () => {
    it('should find the socket by correct username', () => {
      // @ts-ignore
      addClientSocket({ id: 'anyId', username: 'anyName' })
      ok(findClientSocketByUsername('anyName'))
    })
    it('should not find the socket by bogus username', () =>
      ok(!findClientSocketByUsername('noName')))
  })

  describe('Method: getClientSocketCount', () => {
    it('should be 0', () => deepStrictEqual(getClientSocketCount(), 0))
    it('should be greater than 0', () => {
      // @ts-ignore
      addClientSocket({ id: 'anyId', username: 'anyName' })
      notDeepStrictEqual(getClientSocketCount(), 0)
    })
  })

  describe('Method: removeClientSocket', () => {
    it('should remove a socket by id and return array of length 1', () => {
      // @ts-ignore
      addClientSocket({ id: 'anyId', username: 'anyName' })
      // @ts-ignore
      addClientSocket({ id: 'otherId', username: 'otherName' })
      removeClientSocket('anyId')
      
      deepStrictEqual(getClientSocketCount(), 1)
    })
    it('should remove two duplicate sockets by id and return an empty array', () => {
      // @ts-ignore
      addClientSocket({ id: 'anyId', username: 'anyName' })
      // @ts-ignore
      addClientSocket({ id: 'anyId', username: 'anyName' })
      removeClientSocket('anyId')
      
      deepStrictEqual(getClientSocketCount(), 0)
    })
    it('should remove a socket by id and return empty array', () => {
      // @ts-ignore
      addClientSocket({ id: 'anyId', username: 'anyName' })
      removeClientSocket('anyId')

      deepStrictEqual(getClientSocketCount(), 0)
    })
    it('should not find or remove and return empty array', () =>
      ok(!removeClientSocket('noId').length))
  })
})
