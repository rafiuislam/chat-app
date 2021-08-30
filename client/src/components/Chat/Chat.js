import React, { useEffect, useState } from 'react';
import './Chat.css';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';

let socket;

const Chat = ({ location }) => {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const Endpoint = 'https://app-reactchat.herokuapp.com/';

    useEffect(() => {
        const { name, room } = queryString.parse(location.search);

        socket = io(Endpoint);

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, () =>{
            
        });

        // return () => {
        //     socket.emit('disconnect');
        //     socket.off();
        // }

    }, [Endpoint, location.search]);

    useEffect(() => {
        socket.on('message', (message) => {
            setMessages([...messages, message]);
        });

        socket.on("roomData", ({ users }) => {
            setUsers(users);
        });
    }, [messages]);

    const sendMessage =(e) => {
        e.preventDefault(); // so that page doesn't' refresh when pressed

        if(message){
            socket.emit('sendMessage', message, () => setMessage('')); //cleanout input filled after msg sent
        }
    }

    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <Input message={message} sendMessage={sendMessage} setMessage={setMessage} />
            </div> 
            <TextContainer users={users}/>         
        </div>
    )
}

export default Chat;
