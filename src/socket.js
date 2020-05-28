import * as io from 'socket.io-client';
import { chatMessages, newMessage,onlineUsers,userLeft } from './actions';

export let socket;

export const init = store => {
    console.log("socket is",socket);
    if (!socket) {
        socket = io.connect();

        socket.on(
            'chatMessages',
            messages => store.dispatch(
                chatMessages(messages)
            )
        );

        socket.on(
            'newMessage',
            msg => store.dispatch(
                newMessage(msg)
            )
        );
        socket.on(
            'onlineUsers',
            data => store.dispatch(
                onlineUsers(data)
            )
        );
        socket.on(
            'userLeft',
            data => store.dispatch(
                userLeft(data)
            )
        );
    }


};
