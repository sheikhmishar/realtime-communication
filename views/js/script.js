// HTML elements
const usernameInput = document.getElementById('username-input'),
  connectButton = document.getElementById('connect-button'),
  messageContainer = document.getElementById('message-container'),
  messageForm = document.getElementById('message-form'),
  messageInput = document.getElementById('message-input'),
  sendButton = document.getElementById('send-button')

// State variables

// Server variables and constants
const serverURL = location.host
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

const appendMessage = message => {
  const isSelf = message.username && message.username === usernameInput.value

  const flexDiv = document.createElement('div'),
    usernameSpan = document.createElement('span'),
    messageSpan = document.createElement('span'),
    timeSpan = document.createElement('span'),
    timeMarginClass = isSelf ? 'ml-2' : 'ml-auto',
    messageMarginClass = isSelf ? 'ml-auto' : '',
    usernameClass = /(joined)|(left)|(error.*)/i.test(message.text)
      ? 'text-dark'
      : 'badge badge-primary'

  flexDiv.setAttribute('class', 'd-flex my-2')
  usernameSpan.setAttribute('class', usernameClass)
  timeSpan.setAttribute('class', `text-dark text-time ${timeMarginClass}`)
  messageSpan.setAttribute('class', `text-dark mx-2 ${messageMarginClass}`)

  usernameSpan.innerText = isSelf ? 'Me' : message.username
  messageSpan.innerText = message.text
  timeSpan.innerText = message.time

  flexDiv.appendChild(usernameSpan)
  if (isSelf) flexDiv.prepend(messageSpan)
  else flexDiv.appendChild(messageSpan)
  flexDiv.appendChild(timeSpan)

  messageContainer.appendChild(flexDiv)
  messageContainer.scrollTop = messageContainer.scrollHeight
}

const intitiateConnection = () => {
  socket = io.connect('ws://' + serverURL + '/tunnel', { path: '/sock' })
  socket.on('connect', () => socket.emit('username', usernameInput.value))
  socket.on('message', appendMessage)
  socket.on('join', username =>
    appendMessage({
      time: new Date().toLocaleTimeString(),
      text: 'joined',
      username
    })
  )
  socket.on('leave', username =>
    appendMessage({
      time: new Date().toLocaleTimeString(),
      text: 'left',
      username
    })
  )
}

const destroyConnection = () => {
  socket.removeAllListeners()
  socket.disconnect(true)
  socket = null

  uiOnDisconnect()
}

const inputHasErrors = () => {
  const username = usernameInput.value
  if (username.length <= 0) return 'Username length must be at least 1'
  else if (username.includes('/')) return 'Username cannot have /'
  else if (username.includes('.')) return 'Username cannot have .'
  else if (username.includes('"')) return 'Username cannot have "'
  else if (username.includes("'")) return "Username cannot have '"

  return false
}

const handleConnectButtonClick = event => {
  event.preventDefault()

  if (socket) return destroyConnection()

  const inputError = inputHasErrors()
  if (inputError)
    appendMessage({
      time: new Date().toLocaleTimeString(),
      text: `Error: ${inputError}`,
      username: ''
    })
  if (!inputError) {
    intitiateConnection()
    socket.on('validate', isValidUsername => {
      if (!isValidUsername) {
        appendMessage({
          time: new Date().toLocaleTimeString(),
          text: 'Error: Duplicate Username',
          username: ''
        })
        return destroyConnection()
      }
      uiOnConnect()
    })
  }
}

const onMessageFormSubmit = event => {
  event.preventDefault()

  const message = {
    time: new Date().toLocaleTimeString(),
    username: usernameInput.value,
    text: messageInput.value || 'blank message'
  }
  socket.emit('message', message)
  appendMessage(message)
  messageInput.value = ''
}

// main
window.addEventListener('load', () => {
  uiOnDisconnect()
  messageForm.addEventListener('submit', onMessageFormSubmit)
  connectButton.addEventListener('click', handleConnectButtonClick)

  if (location.hostname === 'localhost')
    io.connect('ws://' + serverURL + '/watch', { path: '/sock' }).on(
      'refresh',
      () =>
        setTimeout(() => {
          location.reload()
        }, 500)
    )
})
