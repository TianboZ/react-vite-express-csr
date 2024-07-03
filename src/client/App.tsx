import React, { useEffect, useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { ServerToClientEvents, ClientToServerEvents } from '../server';
import Chat from './Chat';

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  'http://localhost:3001'
);

function App(): JSX.Element {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('client: connect event, socket id: ', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });
  }, []);

  const handleJoinRoom = () => {
    if (!roomId || !username) {
      return;
    }
    socket.emit('room_join', roomId, () => {
      setIsLoggedIn(true);
    });
  };

  return (
    <Router>
      <div className={styles.App}>
        <header className={styles['App-header']}>
          {!isLoggedIn ? (
            <div>
              <input
                placeholder="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
              <input
                placeholder="room id"
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
              />
              <button onClick={handleJoinRoom}>join room</button>
            </div>
          ) : (
            <Chat roomId={roomId} username={username} />
          )}

          {/* <Switch>
            <Route path="/about">
              <main>About</main>
            </Route>
            <Route path="/">
              <main>Home</main>
            </Route>
          </Switch> */}
        </header>
      </div>
    </Router>
  );
}

export default App;
