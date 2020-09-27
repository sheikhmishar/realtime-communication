/** @typedef {SocketIO.Socket & {username:String}} Socket */
/** @type {Socket[]} */
let clientSockets = []

const getClientSockets = () => clientSockets

const getClientSocketCount = () => clientSockets.length

const getClientSocketsSummary = () =>
  clientSockets.forEach(socket => console.log(socket.id, socket.username))

/** @param {String} clientUsername */
const findClientSocketByUsername = clientUsername =>
  clientSockets.find(({ username }) => username === clientUsername)

/** @param {SocketIO.Socket & { username: string; }} clientSocket */
const addClientSocket = clientSocket => clientSockets.push(clientSocket)

/** @param {String} clientSocketId */
const removeClientSocket = clientSocketId =>
  (clientSockets = clientSockets.filter(({ id }) => id !== clientSocketId))

module.exports = {
  getClientSockets,
  getClientSocketsSummary,
  getClientSocketCount,
  findClientSocketByUsername,
  addClientSocket,
  removeClientSocket
}
