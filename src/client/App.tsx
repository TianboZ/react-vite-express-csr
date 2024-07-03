import React, { useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { helper } from '../server/utils';

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <Router>
      <div className={styles.App}>
        <header className={styles['App-header']}>
          <p className="w-[100px] h-[100px] bg-yellow-200">
            <button
              className=" bg-yellow-200"
              onClick={() => setCount((count) => count + 1)}
            >
              count is: {count}
            </button>
          </p>
          <h1 className="text-3xl  font-bold underline text-yellow-400">
            Hello world!
          </h1>
          <Switch>
            <Route path="/about">
              <main>About</main>
            </Route>
            <Route path="/">
              <main>Home</main>
            </Route>
          </Switch>
        </header>
      </div>
    </Router>
  );
}

export default App;
