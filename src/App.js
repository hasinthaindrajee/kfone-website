import React from 'react';
import { AuthProvider } from '@asgardeo/auth-react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { default as authConfig } from './config.json';
import HomePage from './pages/HomePage';
import CustomerPortal from './pages/CustomerPortal';
import NotFoundErrorPage from './pages/404';

const App = () => {
  return (
    <AuthProvider config={{ ...authConfig, storage: Storage.WebWorker }}>
      <Router>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/my-kfone" component={CustomerPortal} />
          <Route path="*" component={NotFoundErrorPage} />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default App;
