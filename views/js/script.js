// HTML elements
const usernameInput = document.getElementById('username-input'),
  connectButton = document.getElementById('connect-button'),
  messageContainer = document.getElementById('message-container'),
  messageForm = document.getElementById('message-form'),
  messageInput = document.getElementById('message-input'),
  sendButton = document.getElementById('send-button')

// State variables
let usernameInputValue = ''

// Server variables and constants
const serverURL = location.host
/** @type {SocketIOClient.Socket} */
let socket

// Helper functions
const uiOnConnect = () => {
  sendButton.disabled = false
  messageInput.disabled = false
  usernameInput.disabled = true
  connectButton.innerText = 'Disconnect'
}

const uiOnDisconnect = () => {
  sendButton.disabled = true
  messageInput.disabled = true
  usernameInput.disabled = false
  connectButton.innerText = 'Connect'
}

/** @param {{ text: String; username: String; }} message */
const appendMessage = message => {
  const { text, username } = message

  const isSelf = username && username === usernameInputValue

  const flexDiv = document.createElement('div'),
    usernameSpan = document.createElement('span'),
    messageSpan = document.createElement('span'),
    timeSpan = document.createElement('span'),
    timeMarginClass = isSelf ? 'ml-2' : 'ml-auto',
    messageMarginClass = isSelf ? 'ml-auto' : '',
    usernameClass = /(joined)|(left)|(error.*)/i.test(text)
      ? 'text-dark'
      : 'badge badge-primary'

  flexDiv.setAttribute('class', 'd-flex my-2')
  usernameSpan.setAttribute('class', usernameClass)
  timeSpan.setAttribute('class', `text-dark text-time ${timeMarginClass}`)
  messageSpan.setAttribute('class', `text-dark mx-2 ${messageMarginClass}`)

  usernameSpan.innerText = isSelf ? 'Me' : username
  messageSpan.innerText = text
  timeSpan.innerText = new Date().toLocaleTimeString()

  flexDiv.appendChild(usernameSpan)
  if (isSelf) flexDiv.prepend(messageSpan)
  else flexDiv.appendChild(messageSpan)
  flexDiv.appendChild(timeSpan)

  messageContainer.appendChild(flexDiv)
  messageContainer.scrollTop = messageContainer.scrollHeight
}

const destroyConnection = () => {
  socket.removeAllListeners()
  socket.disconnect()
  socket = null

  return socket
}

/** @param {String} username */
const socketOnJoin = username =>
  appendMessage({
    text: 'joined',
    username
  })

/** @param {String} username */
const socketOnLeave = username =>
  appendMessage({
    text: 'left',
    username
  })

/** @param {Boolean} isValidUsername */
const socketOnValidate = isValidUsername => {
  if (!isValidUsername) {
    appendMessage({
      text: 'Error: Duplicate Username',
      username: ''
    })
    uiOnDisconnect()
    return destroyConnection()
  }
  uiOnConnect()
}

/** @typedef {() => SocketIOClient.Socket} intitiateConnection */
/** @type {intitiateConnection} */
const intitiateConnection = () => {
  socket = io.connect('ws://' + serverURL + '/chat', { path: '/sock' })
  socket.on('connect', () => socket.emit('username', usernameInputValue))
  socket.on('message', appendMessage)
  socket.on('join', socketOnJoin)
  socket.on('leave', socketOnLeave)
  socket.on('validate', socketOnValidate)
  return socket
}

/** @typedef {(username: string) => false | String} inputHasErrors */
/** @type {inputHasErrors} */
const inputHasErrors = username => {
  if (username.length <= 0) return 'Username length must be at least 1'
  else if (username.includes('/')) return 'Username cannot have /'
  else if (username.includes('.')) return 'Username cannot have .'
  else if (username.includes('"')) return 'Username cannot have "'
  else if (username.includes("'")) return "Username cannot have '"

  return false
}

/** @param {Event} event */
const handleConnectButtonClick = event => {
  event.preventDefault()

  if (socket) {
    uiOnDisconnect()
    return destroyConnection()
  }

  const inputError = inputHasErrors(usernameInputValue)
  if (inputError)
    appendMessage({
      text: `Error: ${inputError}`,
      username: ''
    })
  else intitiateConnection()
}

/** @param {Event} event */
const handleMessageFormSubmit = event => {
  event.preventDefault()

  const message = {
    username: usernameInputValue,
    text: messageInput.value || 'blank message'
  }
  socket.emit('message', message)
  appendMessage(message)
  messageInput.value = ''
}

// main
window.addEventListener('load', () => {
  uiOnDisconnect()
  messageForm.addEventListener('submit', handleMessageFormSubmit)
  connectButton.addEventListener('click', handleConnectButtonClick)
  usernameInput.addEventListener(
    'change',
    () => (usernameInputValue = usernameInput.value)
  )

  if (location.hostname === 'localhost')
    io.connect('ws://' + serverURL + '/watch', { path: '/sock' }).on(
      'refresh',
      () =>
        setTimeout(() => {
          location.reload()
        }, 500)
    )
})

if (typeof module !== 'undefined') module.exports = { inputHasErrors }
