const http = require('http')
const fs = require('fs')
const port = 8080
const requestHandler = (req, res) => {
    let filename = ""
    switch (req.url) {
        case '/':
            filename = './index.html';
            break;
        case '/home':
            filename = './home.html';
            break;
        default:
            filename = './404.html';
            break;
    }
    fs.readFile(filename, (err, result) => {
        if (!err) {
            res.end(result)
        }
    })
}

const server = http.createServer(requestHandler)
server.listen(port, (err) => {
    if (err) {
        console.log("Error Listening on port ");
        return false
    }
    console.log("Server Listening On Port" + port);
})