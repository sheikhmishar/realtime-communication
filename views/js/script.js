// HTML elements
var usernameInput = document.getElementById('username-input')

// State variables

// Server variables
var serverURL = location.host,
  socket

// Helper functions
function intitiateSocket() {
  socket = io.connect('ws://' + serverURL + '/tunnel', { path: '/sock' })
  socket.on('connect', function() {
    socket.emit('username', usernameInput.value)
  })
  socket.on('message', function() {})
}

function usernameExists(username) {
  return false
}

function inputHasErrors() {
  var username = usernameInput.value
  if (username.length <= 0) return 'Username length must be at least 1'
  else if (username.includes('/')) return 'Username cannot have /'
  else if (username.includes('.')) return 'Username cannot have .'
  else if (username.includes('"')) return 'Username cannot have "'
  else if (username.includes("'")) return "Username cannot have '"
  else if (usernameExists(username))
    return 'Username exists or connection error'

  return false
}

// main
window.addEventListener('load', function() {
  var isLocalhostRoot =
    location.hostname === 'localhost' && location.origin + '/' === location.href
  // if currently in localhost root, refresh page on file change
  if (isLocalhostRoot)
    io.connect('ws://' + serverURL + '/watch', { path: '/sock' }).on(
      'refresh',
      function() {
        location.reload()
      }
    )
})
