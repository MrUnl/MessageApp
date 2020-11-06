const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session')
const http = require('http')
const cors = require("cors")


const PORT = process.env.PORT || 80

app.use(express.static("assets"))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(express.json());
app.use(session({ secret: "thatissosecret", saveUninitialized: true, resave: true }));
app.use(cors())
const io = require("socket.io")(5555)

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
io.on("connection", socket => {
    console.log("User connected");
    socket.on("connected", username => {
        socket.broadcast.emit("user-joined", username);
    })
    socket.on("disconnected", username => {
        socket.broadcast.emit("user-disconnected", username);
    })
    socket.on("disconnect", () => {
        console.log("User disconnect");
    })
    socket.on("message-sent", ({ message, username }) => {
        console.log(`${username}: ${message}`);
        socket.broadcast.emit("message-received", { message, user: username });
    })
})

app.get("/", function(req, res) {
    res.render('index.ejs');
});
app.post("/", function(req, res) {
    if (req.body.username) {
        req.session.username = req.body.username;
        return res.redirect("/chat");
    }
    return res.redirect("/")
})
app.get("/chat", function(req, res) {
    if (!req.session.username)
        return res.redirect("/")
    return res.render('chat.ejs', { username: req.session.username })
})
app.listen(PORT, function() {
    console.log("http://localhost:" + PORT);
});