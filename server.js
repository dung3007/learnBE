const app = require("./app")

const PORT = 3000


const server = app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})

process.on('SIGINT', () => {
    server.close(() => console.log('Server closed'))
})