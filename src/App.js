import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Player from './components/Player';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Home} />
        <Route exact path="/play" component={Player} />
      </div>
    </BrowserRouter>
  );
}

export default App;
