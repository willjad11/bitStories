import React, {useState} from 'react';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from './views/LoginPage';
import Feed from './views/Feed';
import Profile from './views/Profile';

function App() {
  const [user, setUser] = useState();

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <LoginPage user={user} setUser={setUser}/>
          </Route>
          <Route path="/feed">
            <Feed user={user} setUser={setUser} />
          </Route>
          <Route path="/profile/:id">
            <Profile user={user} setUser={setUser} />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;