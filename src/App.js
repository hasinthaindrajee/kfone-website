import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NotFoundErrorPage from './pages/404';
import Discover from './pages/customer-portal/explore/Explore';
import { useAuthContext } from '@asgardeo/auth-react';
import { SecureRouteWithRedirect } from './components';

const App = () => {
  if (!useAuthContext()) {
    return <AppWithAuth />
  }

  return <AppWithOutAuth />;
};

const AppWithAuth = () => {
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

const AppWithOutAuth = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <SecureRouteWithRedirect exact path="/my-kfone" component={Discover} />
        <Route path="*" component={NotFoundErrorPage} />
      </Switch>
    </Router>
  );
};

export default App;
