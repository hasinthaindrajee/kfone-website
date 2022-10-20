import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { useAuthContext } from '@asgardeo/auth-react';
import HomePage from './pages/HomePage';
import NotFoundErrorPage from './pages/404';
import Discover from './pages/customer-portal/explore/Explore';
import { SecureRouteWithRedirect } from './components';

const Router = (props) => {
  if (!useAuthContext()) {
    return <RouterWithOutAuth {...props} />;
  }

  return <RouterWithAuth {...props} />;
};

const RouterWithAuth = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={(routeProps) => <HomePage {...props} {...routeProps} />} />
        <SecureRouteWithRedirect
          exact
          path="/my-kfone"
          render={(routeProps) => <Discover {...props} {...routeProps} />}
        />
        <Route path="*" component={NotFoundErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};

const RouterWithOutAuth = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" render={(routeProps) => <HomePage {...props} {...routeProps} />} />
        <Route
          exact
          path="/my-kfone"
          render={(routeProps) => <Discover {...props} {...routeProps} />}
        />
        <Route path="*" component={NotFoundErrorPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
