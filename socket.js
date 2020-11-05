const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session')
const PORT = process.env.PORT || 3000
app.use(express.static("assets"))
app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'))
app.use(express.json());
app.use(session({ secret: "thatissosecret", saveUninitialized: true, resave: true }));

const io = require("socket.io")(5555)
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
const users = [];
io.on("connection", socket => {
    console.log(users);
    console.log("User connected");
    socket.on("disconnect", () => {
        console.log("User disconnect");
    })
    socket.on("message-sent", message => {
        console.log(message);
        console.log(socket.handshake.address);
        socket.broadcast.emit("message-received", { message, user: users.find(user => user.ip === socket.handshake.address).username });
    })
})

function userExists(ip) {
    return users.filter(user => user.ip === ip).length > 0
}
app.get("/", function(req, res) {

    res.render('index.ejs');
});
app.post("/", function(req, res) {
    if (req.body.username) {
        users.push({ ip: req.ip, username: req.body.username })
        return res.redirect("/chat");
    }
    console.log(users);
    return res.redirect("/")
})
app.get("/chat", function(req, res) {
    if (!userExists(req.ip))
        return res.redirect("/")
    return res.render('chat.ejs')
})
app.listen(PORT, function() {
    console.log("http://localhost:" + PORT);
});