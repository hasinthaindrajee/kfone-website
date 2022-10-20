import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundErrorPage from './pages/404';
import Discover from './pages/customer-portal/explore/Explore';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/my-kfone" component={Discover} />
        <Route path="*" component={NotFoundErrorPage} />
      </Switch>
    </Router>
  );
};

export default App;
