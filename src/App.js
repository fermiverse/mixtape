import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import Pane from './components/Pane';
import Player from './components/Player';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path="/" component={Pane} />
        <Route exact path="/play" component={Player} />
      </div>
    </BrowserRouter>
  );
}

export default App;
