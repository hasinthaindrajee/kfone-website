import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PhoneVerification from './pages/customer-portal/PhoneVerification';
import NotFoundErrorPage from './pages/404';
import Discover from './pages/customer-portal/explore/Explore';
import MyPlan from './pages/customer-portal/MyPlan';

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/my-kfone" component={MyPlan} />
        <Route exact path="/my-kfone/explore" component={Discover} />
        <Route exact path="/my-kfone/verify" component={PhoneVerification} />
        <Route path="*" component={NotFoundErrorPage} />
      </Switch>
    </Router>
  );
};

export default App;
