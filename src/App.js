import React from 'react';
import { AuthProvider } from '@asgardeo/auth-react';
import { TokenExchangePlugin } from '@asgardeo/token-exchange-plugin';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { default as authConfig } from './config.json';
import HomePage from './pages/HomePage';
import PhoneVerification from './pages/customer-portal/PhoneVerification';
import NotFoundErrorPage from './pages/404';
import MyPlan from './pages/customer-portal/MyPlan';
import Discover from './pages/customer-portal/explore/Explore';

const App = () => {
  return (
    <AuthProvider
      config={{ ...authConfig, storage: Storage.WebWorker }}
      plugin={TokenExchangePlugin.getInstance()}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/my-kfone" component={MyPlan} />
          <Route exact path="/my-kfone/explore" component={Discover} />
          <Route exact path="/my-kfone/verify" component={PhoneVerification} />
          <Route path="*" component={NotFoundErrorPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
