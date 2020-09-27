const socketIO = require('socket.io')
const express = require('express')
const http = require('http')
const path = require('path')
const socketsController = require('./controllers/sockets')

const app = express()
const server = http.createServer(app)
const io = socketIO(server, { path: '/sock' })

const viewsDir = path.join(__dirname, 'views')
const { static } = express

if (process.env.NODE_ENV === 'production')
  app.use(({ path }, _, next) =>
    path.includes('.test.') ? next(Error) : next()
  )
else
  app
    .use('/mocha', static(path.join(__dirname, 'node_modules', 'mocha')))
    .get('/test', (_, res) => res.redirect('/index.test.html'))

app.use(static(viewsDir))

app.get('/ping', (_, res) => res.status(200).json({ message: 'Server alive' }))

app.use((_, res) => res.status(404).json({ message: '404 Invalid Route' }))

app.use(
  /** @type {Express.ErrorRequestHandler} */
  (_, __, res, ___) =>
    res.status(500).json({ message: '500 Internal Server Error' })
)

const { PORT = 5000 } = process.env
server.listen(PORT, () => console.log(`Server port ${PORT}`))

socketsController.setupSocket(io, viewsDir)
