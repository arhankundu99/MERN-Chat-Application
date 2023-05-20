
import { Route } from 'react-router-dom';
import HomeRoute from './routes/HomeRoute'
import ChatRoute from './routes/ChatRoute'
import React from 'react'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles["App"]} >
      <Route path="/" component={HomeRoute} exact />
      <Route path="/chats" component={ChatRoute} exact />
    </div>
  );
}

export default App;
