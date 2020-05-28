import axios from "./axios";

export async function receiveUsers() {
    try {
        const { data } = await axios.get("/get-users");
        return {
            type: "RECEIVE_USERS",
            users: data.data
        };
    } catch (err) {
        console.log(err);
    }
}

export async function makeFriend(id) {
    try {
        await axios.post("/accept-friend-request/" + id);
        return {
            type: "MAKE_FRIEND",
            id
        };
    } catch (err) {
        console.log(err);
    }
}

export async function unfriend(id) {
    try {
        await axios.post("/end-friendship/" + id);
        return {
            type: "UNFRIEND",
            id
        };
    } catch (err) {
        console.log(err);
    }
}

export function chatMessages(data) {
    return {
        type: "GET_MESSAGES",
        data
    };
}

export function newMessage(data) {
    return {
        type: "ADD_MESSAGE",
        newMessage: data
    };
}

export function onlineUsers(data) {
    return {
        type: "USERS_ONLINE",
        newUserOnline: data
    };
}

export function newUserOnline(data) {
    return {
        type: "NEW_USER_ONLINE",
        newUserOnline: data
    };
}

export function userLeft(data) {
    console.log("we are at userleft");
    console.log("data userLeft",data);
    return {
        type: "USER_LEFT",
        newUserOnline: data
    };
}
