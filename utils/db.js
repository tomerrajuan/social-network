const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:8080/social");
const bcrypt = require("bcryptjs");
const { promisify } = require("util");
const hash = promisify(bcrypt.hash);
const genSalt = promisify(bcrypt.genSalt);

exports.hash = password => genSalt().then(salt => hash(password, salt));
exports.compare = promisify(bcrypt.compare);

exports.addUser = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getUser = function(email) {
    return db.query(
        `SELECT * FROM users
    WHERE email =$1`,
        [email]
    );
};

exports.getUserInfo = function(userId) {
    return db.query(
        `SELECT * FROM users
         WHERE id =$1`,
        [userId]
    );
};
exports.getOtherUserInfo = function(userId) {
    return db.query(
        `SELECT * FROM users
         WHERE id =$1`,
        [userId]
    );
};

exports.addImage = function(url, id) {
    return db.query("UPDATE users SET url=$1 WHERE id=$2 RETURNING url", [
        url,
        id
    ]);
};

exports.editBio = function(bio, id) {
    return db.query("UPDATE users SET bio=$1 WHERE id=$2 RETURNING bio", [
        bio,
        id
    ]);
};

exports.getUsersList = function(id) {
    return db.query(
        `SELECT * FROM users
         WHERE first ILIKE $1 ORDER BY created_at DESC LIMIT 4`,
        [id + "%"]
    );
};

exports.getLatestUsers = function() {
    return db.query(
        `SELECT * FROM users
         ORDER BY created_at DESC LIMIT 3`
    );
};
exports.getFriendshipStatus = function(userId, otherId) {
    return db.query(
        `SELECT * FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [userId, otherId]
    );
};

exports.updateFriendshipStatus = function(receiver_id, sender_id) {
    return db.query(
        `INSERT INTO friendships (receiver_id, sender_id) VALUES ($1, $2)
        `,
        [receiver_id, sender_id]
    );
};

exports.changeFriendshipStatus = function(sender_id, receiver_id) {
    console.log("we are at accept request");

    return db.query(
        `UPDATE friendships SET accepted = true WHERE sender_id=$1 AND receiver_id=$2 RETURNING *
        `,
        [sender_id, receiver_id]
    );
};

exports.cancleFriendRequest = function(receiver_id, sender_id) {
    return db.query(
        `DELETE FROM friendships
         WHERE (receiver_id = $1 AND sender_id = $2)
         OR (receiver_id = $2 AND sender_id = $1)
        `,
        [receiver_id, sender_id]
    );
};

exports.getUsers = function(user_id) {
    console.log("We are at get users db");
    return db.query(
        `
          SELECT users.id, first, last, url, accepted
          FROM friendships
          JOIN users
          ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
          OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
          OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
        `, [user_id]
    );
};


exports.getLastTenMessages = function() {
    console.log("we are at get messages from db");
    return db.query(
        `SELECT messages.id, users.first,users.last,users.url,messages.message, messages.created_at FROM messages
        LEFT JOIN users
        ON messages.sender_id = users.id
        LIMIT 10`
    );
};

exports.addMessage = function(sender_id, message) {
    console.log("we are at add image");
    return db.query(
        `INSERT INTO messages (sender_id, message) VALUES ($1, $2) RETURNING id, message, created_at
        `,
        [sender_id, message]
    );
};

exports.getUsersByIds = function(arrOfIds) {
    return db.query(
        `SELECT *
        FROM users
        WHERE id = ANY($1)`,
        [arrOfIds]
    );
};

// exports.getSingleMessage = function(userId) {
//     console.log("we are at get getSingleMessage from db");
//     return db.query(
//         `SELECT * FROM messages
//         LEFT JOIN users
//         ON messages.sender_id = users.id
//         WHERE id =$1`, [userId]
//     );
// };
