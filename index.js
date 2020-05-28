const express = require("express");
const app = express();
const compression = require("compression");
const db = require("./utils/db");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./utils/db");
const csurf = require("csurf");
const s3 = require("./s3");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { s3Url } = require("./config");
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 4097152
    }
});

app.use(express.static("./public"));

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);
io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(
    express.urlencoded({
        extended: false
    })
);
app.use(csurf());

app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});
app.use(express.json());
app.use(compression());

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.post("/register", async (req, res) => {
    let first = req.body.first;
    let last = req.body.last;
    let email = req.body.email;
    let pass = req.body.password;

    try {
        let hashpass = await hash(pass);
        let { rows } = await db.addUser(first, last, email, hashpass);
        console.log(rows);
        // req.session.userId = rows[0].id;
        res.json({
            success: true
        });
    } catch (e) {
        console.log(e);
    }
});

app.get("/user.json", function(req, res) {
    db.getUserInfo(req.session.userId)
        .then(({ rows }) => {
            res.json({
                data: rows[0]
            });
        })
        .catch(err => console.log(err));
});

app.get("/get-users", function(req, res) {
    db.getUsers(req.session.userId)
        .then(({ rows }) => {
            res.json({
                data: rows
            });
        })
        .catch(err => console.log(err));
});

app.get("/api/user/:id", function(req, res) {
    db.getOtherUserInfo(req.params.id)
        .then(({ rows }) => {
            res.json({
                data: rows[0],
                userLoggedIn: req.session.userId
            });
        })
        .catch(err => console.log(err));
});

app.post("/edit-bio", function(req, res) {
    let bio = req.body.bio;
    db.editBio(bio, req.session.userId)
        .then(({ rows }) => {
            console.log("res in bio", rows);
            res.json({
                data: rows[0]
            });
        })
        .catch(err => console.log("error at editbio", err));
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const url = `${s3Url}${req.file.filename}`;
    db.addImage(url, req.session.userId)
        .then(({ rows }) => {
            res.json({
                image: rows[0].url
            });
        })
        .catch(err => console.log("error at getting a comment: ", err));
});

app.post("/login", function(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    db.getUser(email).then(result => {
        if (result.rows.length < 1) {
            res.json({
                success: false
            });
        } else {
            let checkPass = result.rows[0].password;
            compare(password, checkPass)
                .then(match => {
                    if (match) {
                        req.session.userId = result.rows[0].id;

                        res.json({
                            success: true
                        });
                    }
                })
                .catch(err => {
                    console.log("error at login", err);
                });
        }
    });
});

app.get("/search-user/:val", function(req, res) {
    console.log("req.body is", req.params);

    db.getUsersList(req.params.val)
        .then(results => {
            console.log("results DESC list: ", results);

            res.json({
                results: results
            });
        })
        .catch(err => console.log("error in getting a list of users", err));
});

app.get("/api/search-user/", function(req, res) {
    db.getLatestUsers()
        .then(results => {
            console.log("results at get latest users function: ", results);

            res.json({
                results: results
            });
        })
        .catch(err => console.log("error in getting a list of users", err));
});

app.get("/friendship-status/:id", function(req, res) {
    console.log("req.params.otherId", req.params.id);
    db.getFriendshipStatus(req.params.id, req.session.userId)
        .then(response => {
            console.log("results at get friendship status: ", response);
            if (response.rows.length == 0) {
                res.json({
                    buttonText: "Send friend request"
                });
            }
            if (response.rows.length > 0) {
                if (response.rows[0].accepted == true) {
                    res.json({
                        buttonText: "End friendship"
                    });
                } else if (
                    response.rows[0].accepted == false &&
                    response.rows[0].sender_id == req.session.userId
                ) {
                    res.json({
                        buttonText: "Cancel friend request"
                    });
                } else {
                    res.json({
                        buttonText: "Accept friendship"
                    });
                }
            }
        })
        .catch(err => console.log("error in getting a list of users", err));
});

app.post("/send-friend-request/:id", function(req, res) {
    db.updateFriendshipStatus(req.params.id, req.session.userId)
        .then(response => {
            console.log("results of update friendship status: ", response);

            res.json({
                buttonText: "Cancel friend request"
            });
        })
        .catch(err => console.log("error in getting a list of users", err));
});

app.post("/accept-friend-request/:id", function(req, res) {
    db.changeFriendshipStatus(req.params.id, req.session.userId)
        .then(response => {
            console.log("results of update friendship status: ", response);
            res.json({
                buttonText: "End friendship"
            });
        })
        .catch(err => console.log("error in accepting friendship", err));
});

app.post("/end-friendship/:id", function(req, res) {
    db.cancleFriendRequest(req.params.id, req.session.userId)
        .then(response => {
            console.log("results of update friendship status: ", response);
            res.json({
                buttonText: "Send friend request"
            });
        })
        .catch(err => console.log("error in ending friendship", err));
});

app.get("/welcome", function(req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("/logout", function(req, res) {
    req.session.userId = null;

    res.redirect("/");
});

app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

server.listen(8080, function() {
    console.log("hello.");
});
let onlineUsers = {};

io.on("connection", function(socket) {
    console.log(`socket with the id ${socket.id} just connected`);
    const userId = socket.request.session.userId;

    onlineUsers[socket.id] = userId;

    let arrOfIds = Object.values(onlineUsers);

    db.getUsersByIds(arrOfIds).then(res => {
        console.log("results arrOfId", res.rows);

        io.sockets.emit("onlineUsers", res.rows);
    });

    if (arrOfIds.indexOf(userId) == arrOfIds.length - 1) {
        let newOnlineUser = arrOfIds.slice(-1)[0];
        console.log("newOnlineUser", newOnlineUser);
        db.getUserInfo(newOnlineUser)
            .then(res => {
                io.sockets.emit("newUserOnline", res.rows);
            })
            .catch(err => console.log(err));
    }

    socket.on("disconnect", function() {
        delete onlineUsers[socket.id];
        if (!Object.values(onlineUsers).includes(userId)) {
            io.sockets.emit("userLeft", userId);
        }
    });

    db.getLastTenMessages().then(data => {
        io.sockets.emit("chatMessages", data.rows.reverse());
    });

    socket.on("newMessage", msg => {
        db.addMessage(userId, msg)
            .then(data => {
                socket.request.message = data.rows[0].message;
                db.getUserInfo(userId)
                    .then(res => {
                        console.log("res in get user info", res);
                        io.sockets.emit("newMessage", {
                            id: res.rows[0].id,
                            sender_id: userId,
                            message: socket.request.message,
                            first: res.rows[0].first,
                            last: res.rows[0].last,
                            url: res.rows[0].url
                        });
                    })
                    .catch(err => {
                        console.log(err);
                    });
            })
            .catch(err => {
                console.log(err);
            });
    });
});
