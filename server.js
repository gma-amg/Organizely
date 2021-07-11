const express = require('express');
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidv4 } = require('uuid');
const { ExpressPeerServer } = require('peer');
const { name } = require('ejs');
var bodyParser=require('body-parser');
var admin=require('firebase-admin');
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://organizer-4160c-default-rtdb.firebaseio.com/"
})

const csrfMiddleware = csrf({ cookie: true });

const peerServer = ExpressPeerServer(server, {
    debug: process.env.NODE_ENV === "development"
});

app.set('view engine', 'ejs');
app.use(express.static('public'));

//Give the server access to user input
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.all("*", (req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});

app.get('/', (req,res) => {
    res.render('sign-in.ejs')
})

app.get('/sign-up', (req,res) => {
    res.render('sign-up.ejs')
})

app.get('/dashboard', (req,res) => {
    const sessionCookie = req.cookies.__session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
        res.render("dashboard");
        })
        .catch((error) => {
        res.redirect("/");
        });
});

app.get("/meeting", (req, res) => {
    const sessionCookie = req.cookies.__session || "";
    admin
        .auth()
        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
        .then(() => {
        res.render("meeting");
        })
        .catch((error) => {
        res.redirect("/");
        });
});

app.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();
    const expiresIn = 60 * 60 * 24 * 5 * 1000; //5 days
    admin
      .auth()
      .createSessionCookie(idToken, { expiresIn })
      .then(
        (sessionCookie) => {
          const options = { maxAge: expiresIn, httpOnly: true };
          res.cookie("__session", sessionCookie, options);
          res.end(JSON.stringify({ status: "success" }));
        },
        (error) => {
          res.status(401).send("UNAUTHORIZED REQUEST!");
        }
      );
  });
  
app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});

app.get("/disconnect", (req, res) => {
    res.render("disconnect");
});

app.use('/peerjs', peerServer);
//creates uuid and redirects you to that link
app.get('/create-room/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
})

//the uuid brings us to the room and renders the room
app.get('/:room', (req, res) => {
    res.render('room', 
    { 
        roomId : req.params.room,
        port: process.env.NODE_ENV === "production" ? 443 : 3030,
    })
})

io.on('connection', socket => {
        console.log('new user joined')
        socket.on('join-room', (roomId, userId) => {
            socket.join(roomId);

            socket.on('new-user', name => {
                socket.username = name
                console.log('new user name is', name)
            })
            //when a user joins the room, a message saying that a new user
            //has joined room is broadcasted so that we can add the user to our stream
            socket.to(roomId).emit('user-connected', userId);

            socket.on("disconnect", () => {
                socket.to(roomId).emit("user-disconnected", name);
            })

            //listen on new_message
            socket.on('new_message', (data) => {
                //broadcast the new message
                io.sockets.emit('new_message', {message : data.message, username : socket.username});
            })
        })
})

const PORT = process.env.PORT || 3030;

server.listen(PORT, () => console.log(`Server Started on ${PORT}`));