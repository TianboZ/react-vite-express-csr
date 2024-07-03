import React, { useEffect, useState } from 'react';
import { socket } from './App';
import { Msg } from '../server';

const Chat = ({ roomId, username }) => {
  const [chats, setChats] = useState<Msg[]>([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    socket.on('msg_receive', (data) => {
      console.log('data:', data);
      setChats((prev) => [...prev, data]);
    });
  }, []);

  const handleSendMsg = () => {
    socket.emit('msg_send', {
      roomId,
      data: msg,
      user: username,
      time: Date.now(),
    });
    setMsg('');
  };

  return (
    <div>
      <div>room id: {roomId}</div>
      <div>current user: {username}</div>
      <div
        style={{
          width: 400,
          height: 400,
          border: '1px solid red',
          position: 'relative',
          overflow: 'scroll',
        }}
      >
        {chats.map((data, i) => (
          <pre key={i}>{JSON.stringify(data, null, 2)}</pre>
        ))}
      </div>
      <div>
        <input
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button onClick={handleSendMsg}>send</button>
      </div>
    </div>
  );
};

export default Chat;
