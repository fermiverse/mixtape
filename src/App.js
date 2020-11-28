import React, { useState } from 'react';
import { Route, BrowserRouter, Switch, Redirect } from 'react-router-dom';
import About from './components/About';
import Home from './components/Home';
import Menu from './components/Menu';
import MixForm from './components/MixForm';
import Mixtape from './components/Mixtape';
import Player from './components/Player';
import Profile from './components/Profile';
import Search from './components/Search';
import Story from './components/Story';

function App() {
  let currentMix = localStorage.getItem("currentMix") ? JSON.parse(localStorage.getItem("currentMix")) : {name: "", description: "", cover: "", tracks: []};
  const [mixProps, setMixProps] = useState(currentMix);

  return (
    <BrowserRouter>
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/menu" render={(props) => (
            <Menu {...props} mixProps={mixProps} setMixProps={setMixProps} />
          )} />
          <Route exact path="/play" render={(props) => (
            <Player {...props} mixProps={mixProps} setMixProps={setMixProps} />
          )} />
          <Route exact path="/search" render={(props) => (
            <Search {...props} mixProps={mixProps} setMixProps={setMixProps} />
          )} />
          <Route exact path="/build" render={(props) => (
            <MixForm {...props} mixProps={mixProps} setMixProps={setMixProps} />
          )} />
          <Route exact path="/ship" render={(props) => (
            <Mixtape {...props} mixProps={mixProps} setMixProps={setMixProps} />
          )} />
          <Route exact path="/profile" render={(props) => (
            <Profile {...props} mixProps={mixProps} setMixProps={setMixProps} />
          )} />
          <Route exact path="/story" render={(props) => (
            <Story {...props} />
          )} />
          <Route exact path="/about" render={(props) => (
            <About {...props} />
          )} />
          <Redirect from="*" to="/"></Redirect>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
