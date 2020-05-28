export default function(state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = {
            ...state,
            users: action.users
        };
    }

    if (action.type == "MAKE_FRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.map(user => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: null
                    };
                } else {
                    return user;
                }
            })
        };
    }

    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            tenMessages: action.data
        };
    }

    if (action.type == "ADD_MESSAGE") {
        state = {
            ...state,
            tenMessages: [...state.tenMessages, action.newMessage]
        };
    }

    if (action.type == "USERS_ONLINE") {
        state = {
            ...state,
            newUserOnline: action.newUserOnline
        };
    }
    if (action.type == "NEW_USER_ONLINE") {
        state = {
            ...state,
            newUserOnline: action.newUserOnline
        };
    }
    if (action.type == "USER_LEFT") {
        console.log("we are at userleft");

        console.log("action", action);
        state = {
            ...state,
            newUserOnline: [...state.newUserOnline].filter(
                user => user.id !== action.newUserOnline
            )
        };
    }

    return state;
}
